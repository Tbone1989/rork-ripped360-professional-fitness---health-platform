import AsyncStorage from '@react-native-async-storage/async-storage';

interface FilterSettings {
  enableProfanityFilter: boolean;
  enableSpamDetection: boolean;
  enableLinkBlocking: boolean;
  customBlockedWords: string[];
}

class MessageFilterService {
  private settings: FilterSettings = {
    enableProfanityFilter: true,
    enableSpamDetection: true,
    enableLinkBlocking: false,
    customBlockedWords: [],
  };

  private profanityList = [
    // Common profanity
    'fuck', 'shit', 'ass', 'damn', 'hell', 'bitch', 'bastard', 'dick', 'cock', 'pussy',
    'fag', 'nigger', 'cunt', 'whore', 'slut', 'retard', 'piss', 'douche', 'twat', 'wanker',
    // Variations and leetspeak
    'f*ck', 'sh*t', 'b*tch', 'a$$', 'd*mn', 'h*ll', 'f@ck', 'sh1t', 'b1tch',
    // Additional offensive terms
    'asshole', 'motherfucker', 'dickhead', 'prick', 'bollocks', 'bugger', 'tosser',
    'arsehole', 'shithead', 'fuckface', 'dumbass', 'jackass', 'dipshit', 'douchebag'
  ];

  private spamPatterns = [
    /\b(buy|sell|discount|offer|deal|free|win|winner|prize|cash|money|bitcoin|crypto)\b.*\b(now|today|limited|hurry|click|visit)\b/gi,
    /\b(viagra|cialis|pills|medication|drugs|pharmacy)\b/gi,
    /\b(click here|visit now|sign up|register now|buy now)\b/gi,
    /(http|https|www)\S+\.(tk|ml|ga|cf)/gi, // Suspicious domains
    /\b\d{10,}\b/g, // Long numbers (potential phone numbers)
    /(.)\1{5,}/g, // Repeated characters
  ];

  constructor() {
    this.loadSettings();
  }

  private async loadSettings() {
    try {
      const saved = await AsyncStorage.getItem('message_filter_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to load filter settings:', error);
    }
  }

  public async saveSettings(settings: Partial<FilterSettings>) {
    this.settings = { ...this.settings, ...settings };
    try {
      await AsyncStorage.setItem('message_filter_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save filter settings:', error);
    }
  }

  public filterMessage(message: string): { filtered: string; wasFiltered: boolean; reasons: string[] } {
    let filtered = message;
    const reasons: string[] = [];
    let wasFiltered = false;

    // Apply profanity filter
    if (this.settings.enableProfanityFilter) {
      const profanityResult = this.filterProfanity(filtered);
      if (profanityResult.wasFiltered) {
        filtered = profanityResult.text;
        reasons.push('profanity');
        wasFiltered = true;
      }
    }

    // Apply custom blocked words
    if (this.settings.customBlockedWords.length > 0) {
      const customResult = this.filterCustomWords(filtered);
      if (customResult.wasFiltered) {
        filtered = customResult.text;
        reasons.push('blocked words');
        wasFiltered = true;
      }
    }

    // Check for spam
    if (this.settings.enableSpamDetection && this.isSpam(message)) {
      reasons.push('spam detected');
      wasFiltered = true;
    }

    // Block links if enabled
    if (this.settings.enableLinkBlocking) {
      const linkResult = this.removeLinks(filtered);
      if (linkResult.wasFiltered) {
        filtered = linkResult.text;
        reasons.push('links removed');
        wasFiltered = true;
      }
    }

    return { filtered, wasFiltered, reasons };
  }

  private filterProfanity(text: string): { text: string; wasFiltered: boolean } {
    let filtered = text;
    let wasFiltered = false;

    // Create a combined regex pattern for all profanity
    const allProfanity = [...this.profanityList, ...this.settings.customBlockedWords];
    
    allProfanity.forEach(word => {
      // Create regex that matches whole words and common variations
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const patterns = [
        new RegExp(`\\b${escapedWord}\\b`, 'gi'),
        new RegExp(`\\b${escapedWord}ing\\b`, 'gi'),
        new RegExp(`\\b${escapedWord}ed\\b`, 'gi'),
        new RegExp(`\\b${escapedWord}er\\b`, 'gi'),
        new RegExp(`\\b${escapedWord}s\\b`, 'gi'),
      ];

      patterns.forEach(pattern => {
        if (pattern.test(filtered)) {
          wasFiltered = true;
          filtered = filtered.replace(pattern, (match) => '*'.repeat(match.length));
        }
      });
    });

    return { text: filtered, wasFiltered };
  }

  private filterCustomWords(text: string): { text: string; wasFiltered: boolean } {
    let filtered = text;
    let wasFiltered = false;

    this.settings.customBlockedWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(filtered)) {
        wasFiltered = true;
        filtered = filtered.replace(regex, '*'.repeat(word.length));
      }
    });

    return { text: filtered, wasFiltered };
  }

  private isSpam(text: string): boolean {
    // Check against spam patterns
    for (const pattern of this.spamPatterns) {
      if (pattern.test(text)) {
        return true;
      }
    }

    // Check for excessive caps (more than 50% caps)
    const capsCount = (text.match(/[A-Z]/g) || []).length;
    const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
    if (letterCount > 10 && capsCount / letterCount > 0.5) {
      return true;
    }

    // Check for excessive exclamation marks
    if ((text.match(/!/g) || []).length > 5) {
      return true;
    }

    return false;
  }

  private removeLinks(text: string): { text: string; wasFiltered: boolean } {
    const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9]+\.(com|org|net|io|co|uk|edu|gov)[^\s]*)/gi;
    const hasLinks = urlPattern.test(text);
    const filtered = text.replace(urlPattern, '[link removed]');
    
    return { text: filtered, wasFiltered: hasLinks };
  }

  public validateMessage(message: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if message is empty or only whitespace
    if (!message || message.trim().length === 0) {
      errors.push('Message cannot be empty');
    }

    // Check message length
    if (message.length > 1000) {
      errors.push('Message is too long (max 1000 characters)');
    }

    // Check for spam
    if (this.settings.enableSpamDetection && this.isSpam(message)) {
      errors.push('Message appears to be spam');
    }

    // Check for excessive profanity
    const profanityResult = this.filterProfanity(message);
    const profanityPercentage = this.calculateProfanityPercentage(message, profanityResult.text);
    if (profanityPercentage > 30) {
      errors.push('Message contains excessive inappropriate content');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private calculateProfanityPercentage(original: string, filtered: string): number {
    const originalWords = original.split(/\s+/).length;
    const filteredChars = (filtered.match(/\*/g) || []).length;
    const originalChars = original.length;
    
    if (originalChars === 0) return 0;
    return (filteredChars / originalChars) * 100;
  }

  public addCustomBlockedWord(word: string) {
    if (!this.settings.customBlockedWords.includes(word.toLowerCase())) {
      this.settings.customBlockedWords.push(word.toLowerCase());
      this.saveSettings(this.settings);
    }
  }

  public removeCustomBlockedWord(word: string) {
    this.settings.customBlockedWords = this.settings.customBlockedWords.filter(
      w => w.toLowerCase() !== word.toLowerCase()
    );
    this.saveSettings(this.settings);
  }

  public getFilterReport(message: string): {
    originalLength: number;
    filteredLength: number;
    profanityCount: number;
    linkCount: number;
    isSpam: boolean;
  } {
    const linkPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
    const links = message.match(linkPattern) || [];
    
    let profanityCount = 0;
    this.profanityList.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = message.match(regex) || [];
      profanityCount += matches.length;
    });

    const filtered = this.filterMessage(message);

    return {
      originalLength: message.length,
      filteredLength: filtered.filtered.length,
      profanityCount,
      linkCount: links.length,
      isSpam: this.isSpam(message),
    };
  }
}

export default new MessageFilterService();