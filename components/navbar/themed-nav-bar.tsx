import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function NavBar() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.tabIconSelected,
                tabBarInactiveTintColor: theme.tabIconDefault,

                headerShown: false,

                tabBarButton: HapticTab,

                tabBarStyle: {
                    backgroundColor: theme.surface,
                    borderTopColor: theme.border,
                    height: 70,
                    paddingBottom: 8,
                    paddingTop: 8,
                },

                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                },

                tabBarItemStyle: {
                    borderRadius: 14,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Accueil",
                    tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    title: "Recherche",
                    tabBarIcon: ({ color }) => <IconSymbol size={26} name="magnifyingglass" color={color} />,
                }}
            />

            <Tabs.Screen
                name="meeting"
                options={{
                    title: "Réunions",
                    tabBarIcon: ({ color }) => <IconSymbol size={26} name="calendar" color={color} />,
                }}
            />

            <Tabs.Screen
                name="account"
                options={{
                    title: "Compte",
                    tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.crop.circle.fill" color={color} />,
                }}
            />
        </Tabs>
    );
}
