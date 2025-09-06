import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from './notificationService';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: 'workout' | 'meal' | 'supplement' | 'coaching' | 'contest' | 'checkIn' | 'other';
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[]; // 0-6, Sunday-Saturday
    endDate?: Date;
  };
  reminder?: {
    enabled: boolean;
    minutesBefore: number;
    notificationId?: string;
  };
  metadata?: {
    workoutId?: string;
    coachId?: string;
    clientId?: string;
    sessionId?: string;
    supplementId?: string;
    mealPlanId?: string;
    weeksOut?: string;
    [key: string]: any;
  };
  color?: string;
  completed?: boolean;
}

interface CalendarData {
  events: CalendarEvent[];
  lastSync: string;
}

class CalendarService {
  private static instance: CalendarService;
  private events: CalendarEvent[] = [];
  private readonly STORAGE_KEY = 'calendar_events';

  private constructor() {}

  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  async initialize() {
    await this.loadEvents();
    await this.scheduleUpcomingReminders();
  }

  private async loadEvents() {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data: CalendarData = JSON.parse(stored);
        this.events = data.events.map(event => ({
          ...event,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
        }));
      }
    } catch (error) {
      console.error('Error loading calendar events:', error);
    }
  }

  private async saveEvents() {
    try {
      const data: CalendarData = {
        events: this.events,
        lastSync: new Date().toISOString(),
      };
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving calendar events:', error);
    }
  }

  async addEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    this.events.push(newEvent);
    await this.saveEvents();

    // Schedule reminder if enabled
    if (newEvent.reminder?.enabled) {
      await this.scheduleEventReminder(newEvent);
    }

    // Handle recurring events
    if (newEvent.recurring) {
      await this.generateRecurringEvents(newEvent);
    }

    return newEvent;
  }

  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index === -1) return null;

    const oldEvent = this.events[index];
    const updatedEvent = { ...oldEvent, ...updates };
    this.events[index] = updatedEvent;

    // Cancel old reminder and schedule new one if needed
    if (oldEvent.reminder?.notificationId) {
      await notificationService.cancelNotification(oldEvent.reminder.notificationId);
    }
    if (updatedEvent.reminder?.enabled) {
      await this.scheduleEventReminder(updatedEvent);
    }

    await this.saveEvents();
    return updatedEvent;
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index === -1) return false;

    const event = this.events[index];
    
    // Cancel reminder if exists
    if (event.reminder?.notificationId) {
      await notificationService.cancelNotification(event.reminder.notificationId);
    }

    this.events.splice(index, 1);
    await this.saveEvents();
    return true;
  }

  async getEvents(date?: Date): Promise<CalendarEvent[]> {
    if (!date) return this.events;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.events.filter(event => {
      const eventStart = new Date(event.startTime);
      return eventStart >= startOfDay && eventStart <= endOfDay;
    });
  }

  async getEventsInRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    return this.events.filter(event => {
      const eventStart = new Date(event.startTime);
      return eventStart >= startDate && eventStart <= endDate;
    });
  }

  async getUpcomingEvents(type?: CalendarEvent['type'], limit: number = 10): Promise<CalendarEvent[]> {
    const now = new Date();
    let upcoming = this.events
      .filter(event => new Date(event.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    if (type) {
      upcoming = upcoming.filter(event => event.type === type);
    }

    return upcoming.slice(0, limit);
  }

  private async scheduleEventReminder(event: CalendarEvent) {
    if (!event.reminder?.enabled) return;

    const reminderTime = new Date(event.startTime);
    reminderTime.setMinutes(reminderTime.getMinutes() - event.reminder.minutesBefore);

    let notificationId: string | undefined;

    switch (event.type) {
      case 'workout':
        notificationId = await notificationService.scheduleWorkoutReminder(
          event.metadata?.workoutId || '',
          event.title,
          reminderTime
        );
        break;
      case 'coaching':
        notificationId = await notificationService.scheduleCoachingSession(
          event.metadata?.sessionId || '',
          event.metadata?.clientId || event.metadata?.coachId || '',
          reminderTime,
          !!event.metadata?.coachId
        );
        break;
      case 'meal':
        notificationId = await notificationService.scheduleMealReminder(
          event.title,
          reminderTime
        );
        break;
      case 'supplement':
        notificationId = await notificationService.scheduleSupplementReminder(
          event.title,
          reminderTime,
          event.description || ''
        );
        break;
      default:
        notificationId = await notificationService.scheduleWorkoutReminder(
          event.id,
          event.title,
          reminderTime
        );
    }

    if (notificationId && event.reminder) {
      event.reminder.notificationId = notificationId;
      await this.saveEvents();
    }
  }

  private async scheduleUpcomingReminders() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingEvents = await this.getEventsInRange(now, tomorrow);
    
    for (const event of upcomingEvents) {
      if (event.reminder?.enabled && !event.reminder.notificationId) {
        await this.scheduleEventReminder(event);
      }
    }
  }

  private async generateRecurringEvents(baseEvent: CalendarEvent) {
    if (!baseEvent.recurring) return;

    const { frequency, daysOfWeek, endDate } = baseEvent.recurring;
    const startDate = new Date(baseEvent.startTime);
    const recurringEndDate = endDate || new Date(startDate.getFullYear(), startDate.getMonth() + 3, startDate.getDate());
    
    const events: Omit<CalendarEvent, 'id'>[] = [];
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 1); // Start from next occurrence

    while (currentDate <= recurringEndDate) {
      let shouldAdd = false;

      switch (frequency) {
        case 'daily':
          shouldAdd = true;
          break;
        case 'weekly':
          if (daysOfWeek && daysOfWeek.includes(currentDate.getDay())) {
            shouldAdd = true;
          }
          break;
        case 'monthly':
          if (currentDate.getDate() === startDate.getDate()) {
            shouldAdd = true;
          }
          break;
      }

      if (shouldAdd) {
        const newStartTime = new Date(currentDate);
        newStartTime.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);
        
        const duration = baseEvent.endTime.getTime() - baseEvent.startTime.getTime();
        const newEndTime = new Date(newStartTime.getTime() + duration);

        events.push({
          ...baseEvent,
          startTime: newStartTime,
          endTime: newEndTime,
          recurring: undefined, // Don't make the generated events recurring
        });
      }

      // Increment date based on frequency
      switch (frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }

    // Add all generated events
    for (const event of events) {
      await this.addEvent(event);
    }
  }

  async markEventCompleted(eventId: string): Promise<boolean> {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return false;

    event.completed = true;
    await this.saveEvents();
    return true;
  }

  async getCompletedEvents(type?: CalendarEvent['type']): Promise<CalendarEvent[]> {
    let completed = this.events.filter(e => e.completed);
    if (type) {
      completed = completed.filter(e => e.type === type);
    }
    return completed;
  }

  async clearOldEvents(daysToKeep: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    this.events = this.events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate > cutoffDate || !event.completed;
    });

    await this.saveEvents();
  }

  // Coach-specific methods
  async getCoachSchedule(coachId: string, date?: Date): Promise<CalendarEvent[]> {
    const events = date ? await this.getEvents(date) : this.events;
    return events.filter(e => 
      e.type === 'coaching' && e.metadata?.coachId === coachId
    );
  }

  async getClientSchedule(clientId: string, date?: Date): Promise<CalendarEvent[]> {
    const events = date ? await this.getEvents(date) : this.events;
    return events.filter(e => 
      e.type === 'coaching' && e.metadata?.clientId === clientId
    );
  }

  async addCoachingSession(
    coachId: string,
    clientId: string,
    sessionDetails: {
      title: string;
      description?: string;
      startTime: Date;
      duration: number; // in minutes
      recurring?: CalendarEvent['recurring'];
    }
  ): Promise<CalendarEvent> {
    const endTime = new Date(sessionDetails.startTime);
    endTime.setMinutes(endTime.getMinutes() + sessionDetails.duration);

    return await this.addEvent({
      title: sessionDetails.title,
      description: sessionDetails.description,
      startTime: sessionDetails.startTime,
      endTime,
      type: 'coaching',
      recurring: sessionDetails.recurring,
      reminder: {
        enabled: true,
        minutesBefore: 10,
      },
      metadata: {
        coachId,
        clientId,
        sessionId: `session_${Date.now()}`,
      },
      color: '#FF6B6B',
    });
  }

  // Workout-specific methods
  async scheduleWorkout(
    workoutId: string,
    workoutName: string,
    startTime: Date,
    duration: number,
    recurring?: CalendarEvent['recurring']
  ): Promise<CalendarEvent> {
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);

    return await this.addEvent({
      title: workoutName,
      startTime,
      endTime,
      type: 'workout',
      recurring,
      reminder: {
        enabled: true,
        minutesBefore: 15,
      },
      metadata: {
        workoutId,
      },
      color: '#4ECDC4',
    });
  }

  // Contest prep methods
  async addContestPrepEvent(
    title: string,
    description: string,
    date: Date,
    weeksOut: number
  ): Promise<CalendarEvent> {
    return await this.addEvent({
      title,
      description,
      startTime: date,
      endTime: new Date(date.getTime() + 60 * 60 * 1000), // 1 hour duration
      type: 'contest',
      reminder: {
        enabled: true,
        minutesBefore: 60,
      },
      metadata: {
        weeksOut: weeksOut.toString(),
      },
      color: '#FFD93D',
    });
  }
}

export default CalendarService.getInstance();