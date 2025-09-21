import { Tabs } from "expo-router";
import React from "react";
import { Home, Dumbbell, UtensilsCrossed, Activity, User, Ellipsis } from "lucide-react-native";
import { Platform } from "react-native";

import { colors } from "@/constants/colors";

export default function TabLayout() {
  return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent.primary,
          tabBarInactiveTintColor: colors.text.tertiary,
          tabBarHideOnKeyboard: true,
          lazy: true,
          tabBarStyle: {
            backgroundColor: colors.background.secondary,
            borderTopColor: colors.border.light,
            borderTopWidth: 1,
            paddingBottom: Platform.OS === 'ios' ? 12 : 6,
            paddingTop: 6,
            elevation: 6,
            shadowColor: colors.text.primary,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
          },
          tabBarItemStyle: {
            paddingVertical: 2,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
          tabBarIconStyle: {
            marginBottom: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Home testID="tab-icon-home" size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="workouts"
          options={{
            title: "Workouts",
            tabBarIcon: ({ color, focused }) => (
              <Dumbbell testID="tab-icon-workouts" size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="meals"
          options={{
            title: "Nutrition",
            tabBarIcon: ({ color, focused }) => (
              <UtensilsCrossed testID="tab-icon-nutrition" size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="medical"
          options={{
            title: "Health",
            tabBarIcon: ({ color, focused }) => (
              <Activity testID="tab-icon-health" size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <User testID="tab-icon-profile" size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: "More",
            tabBarIcon: ({ color, focused }) => (
              <Ellipsis testID="tab-icon-more" size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
      </Tabs>
  );
}