import { Tabs } from "expo-router";
import React from "react";
import { Home, Dumbbell, UtensilsCrossed, ShoppingBag, HeartPulse, User, Ellipsis } from "lucide-react-native";
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
            paddingBottom: Platform.OS === 'ios' ? 10 : 4,
            paddingTop: 4,
            elevation: 6,
            shadowColor: colors.text.primary,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
          },
          tabBarItemStyle: {
            paddingVertical: 0,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
            marginTop: 0,
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Home testID="tab-icon-home" size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="workouts"
          options={{
            title: "Train",
            tabBarIcon: ({ color, focused }) => (
              <Dumbbell testID="tab-icon-train" size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="meals"
          options={{
            title: "Meals",
            tabBarIcon: ({ color, focused }) => (
              <UtensilsCrossed testID="tab-icon-meals" size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            title: "Shop",
            tabBarIcon: ({ color, focused }) => (
              <ShoppingBag testID="tab-icon-shop" size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="medical"
          options={{
            title: "Health",
            tabBarIcon: ({ color, focused }) => (
              <HeartPulse testID="tab-icon-health" size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Me",
            tabBarIcon: ({ color, focused }) => (
              <User testID="tab-icon-me" size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: "More",
            tabBarIcon: ({ color, focused }) => (
              <Ellipsis testID="tab-icon-more" size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
      </Tabs>
  );
}