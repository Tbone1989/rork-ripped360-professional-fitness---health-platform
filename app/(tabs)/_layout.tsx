import { Tabs } from "expo-router";
import React from "react";
import { Home, Dumbbell, UtensilsCrossed, Users, Activity, User, TestTube } from "lucide-react-native";
import { Platform } from "react-native";

import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/userStore";

export default function TabLayout() {
  const isAdmin = useUserStore((state) => state.isAdmin);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.border.light,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 68,
          elevation: 8,
          shadowColor: colors.text.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color, focused }) => (
            <Dumbbell size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: "Nutrition",
          tabBarIcon: ({ color, focused }) => (
            <UtensilsCrossed size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="medical"
        options={{
          title: "Health",
          tabBarIcon: ({ color, focused }) => (
            <Activity size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="coaching"
        options={{
          title: "Coaching",
          tabBarIcon: ({ color, focused }) => (
            <Users size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      {isAdmin && (
        <Tabs.Screen
          name="testing"
          options={{
            title: "Testing",
            tabBarIcon: ({ color, focused }) => (
              <TestTube size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <User size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}