/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

// 006D77
// 83C5BE
// EDF6F9
// FFDDD2
// E29578

export const Colors = {
    light: {
        text: "#11181C",
        background: "#EDF6F9",
        border: "#83C5BE",

        tint: "#006D77",
        primary: "#006D77",
        accent: "#E29578",

        destructive: "#C33C54",

        icon: "#FFDDD2",

        tabIconDefault: "#006D77",
        tabIconSelected: "#E29578",
    },
    dark: {
        text: "#ECEDEE",
        background: "#151718",
        border: "#2A2F33",

        primary: "#4FA3A5",
        tint: "#83C5BE",
        accent: "#E29578",

        destructive: "#C33C54",

        icon: "#FFDDD2",

        tabIconDefault: "#006D77",
        tabIconSelected: "#E29578",
    },
};

export const Fonts = Platform.select({
    ios: {
        /** iOS `UIFontDescriptorSystemDesignDefault` */
        sans: "system-ui",
        /** iOS `UIFontDescriptorSystemDesignSerif` */
        serif: "ui-serif",
        /** iOS `UIFontDescriptorSystemDesignRounded` */
        rounded: "ui-rounded",
        /** iOS `UIFontDescriptorSystemDesignMonospaced` */
        mono: "ui-monospace",
    },
    default: {
        sans: "normal",
        serif: "serif",
        rounded: "normal",
        mono: "monospace",
    },
    web: {
        sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        serif: "Georgia, 'Times New Roman', serif",
        rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
        mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
});
