//  Below are the colors that are used in the app. The colors are defined in the light and dark mode.
//  There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.

export const Colors = {
    light: {
        // Base
        text: "#12211B",
        background: "#FBFAF8",
        surface: "#FFFFFF",

        // Brand
        primary: "#0A3D2C", // Forest
        primaryLight: "#0D4A36", // Forest 2
        accent: "#0E9F6E", // Emerald
        accentDark: "#0B8A5F",

        // Secondary
        gold: "#C89B3C",
        goldLight: "#F7EFDD",

        // Backgrounds
        mist: "#EAF3EE",
        ivory: "#FBFAF8",

        // Text hierarchy
        textSecondary: "#4E5D56",
        textMuted: "#93A09A",

        // Borders
        border: "rgba(10,61,44,0.10)",
        borderStrong: "rgba(14,159,110,0.25)",

        // Feedback
        success: "#0E9F6E",
        destructive: "#DC2626",
        warning: "#C89B3C",

        // Navigation
        tint: "#0E9F6E",
        icon: "#EAF3EE",

        tabIconDefault: "#93A09A",
        tabIconSelected: "#0E9F6E",

        // Shadows (useful for RN shadowColor)
        shadow: "#0A3D2C",
    },

    dark: {
        // Base
        text: "#F8FAF9",
        background: "#071A13",
        surface: "#0D241B",

        // Brand
        primary: "#0E9F6E",
        primaryLight: "#34D399",
        accent: "#4ADE9E",
        accentDark: "#0B8A5F",

        // Secondary
        gold: "#E5C76B",
        goldLight: "#3A2F16",

        // Backgrounds
        mist: "#102B21",
        ivory: "#071A13",

        // Text hierarchy
        textSecondary: "#B7C4BE",
        textMuted: "#75847D",

        // Borders
        border: "rgba(255,255,255,0.10)",
        borderStrong: "rgba(74,222,158,0.35)",

        // Feedback
        success: "#4ADE9E",
        destructive: "#F87171",
        warning: "#E5C76B",

        // Navigation
        tint: "#4ADE9E",
        icon: "#102B21",

        tabIconDefault: "#75847D",
        tabIconSelected: "#4ADE9E",

        shadow: "#000000",
    },
};

export const Fonts = {
    // Inter
    sansLight: "Inter-Light",
    sans: "Inter",
    sansMedium: "Inter-Medium",
    sansSemiBold: "Inter-SemiBold",
    sansBold: "Inter-Bold",

    // Playfair
    serif: "PlayfairDisplay",
    serifBold: "PlayfairDisplay-Bold",
    serifExtraBold: "PlayfairDisplay-ExtraBold",

    mono: "monospace",
};
