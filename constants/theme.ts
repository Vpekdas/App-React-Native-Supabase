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

const tintColorLight = "#006D77";
const tintColorDark = "#004D58";

export const Colors = {
    light: {
        text: "#11181C",
        background: "#EDF6F9",
        border: "#83C5BE",
        tint: tintColorLight,
        icon: "#FFDDD2",
        tabIconDefault: tintColorLight,
        tabIconSelected: "#E29578",
    },
    dark: {
        text: "#ECEDEE",
        background: "#151718",
        border: "#2A2F33",
        tint: tintColorDark,
        icon: "#FFDDD2",
        tabIconDefault: "#E29578",
        tabIconSelected: tintColorDark,
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
