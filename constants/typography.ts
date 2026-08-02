import { Fonts } from "./theme";

export const Typography = {
    family: {
        sans: Fonts.sans,
        serif: Fonts.serif,
        mono: Fonts.mono,
    },

    body: {
        fontFamily: Fonts.sans,
        fontSize: 14,
        lineHeight: 22,
    },

    bodyLight: {
        fontFamily: Fonts.sansLight,
        fontSize: 14,
        lineHeight: 22,
    },

    bodyMedium: {
        fontFamily: Fonts.sansMedium,
        fontSize: 14,
        lineHeight: 22,
    },

    heroEyebrow: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 11.5,
        lineHeight: 14,
        letterSpacing: 0.6,
        textTransform: "uppercase" as const,
    },

    heroTitle: {
        fontFamily: Fonts.sansBold,
        fontSize: 62,
        lineHeight: 66,
        letterSpacing: -2.2,
    },

    heroTitleSerif: {
        fontFamily: Fonts.serifBold,
        fontSize: 62,
        lineHeight: 66,
        fontStyle: "italic" as const,
        letterSpacing: -2.2,
    },

    heroSub: {
        fontFamily: Fonts.sansLight,
        fontSize: 17.5,
        lineHeight: 31,
    },

    heroNote: {
        fontFamily: Fonts.sans,
        fontSize: 12,
        lineHeight: 16,
    },

    trustItem: {
        fontFamily: Fonts.sansMedium,
        fontSize: 13,
        lineHeight: 18,
    },

    marqueeLabel: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 10.5,
        lineHeight: 14,
        letterSpacing: 1.4,
        textTransform: "uppercase" as const,
    },

    marqueeItem: {
        fontFamily: Fonts.sansMedium,
        fontSize: 13.5,
        lineHeight: 20,
    },

    marqueeIcon: {
        fontFamily: Fonts.sans,
        fontSize: 8,
        lineHeight: 10,
    },

    sectionEyebrow: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 11.5,
        lineHeight: 14,
        letterSpacing: 1.15,
        textTransform: "uppercase" as const,
    },

    h2: {
        fontFamily: Fonts.sansBold,
        fontSize: 44,
        lineHeight: 49,
        letterSpacing: -1.3,
    },

    h2Serif: {
        fontFamily: Fonts.serifBold,
        fontSize: 44,
        lineHeight: 49,
        fontStyle: "italic" as const,
        letterSpacing: -1.3,
    },

    sectionSub: {
        fontFamily: Fonts.sansLight,
        fontSize: 16.5,
        lineHeight: 29,
    },

    cardTitleSm: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.15,
    },

    cardTitleMd: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 17,
        lineHeight: 22,
        letterSpacing: -0.25,
    },

    cardBodySm: {
        fontFamily: Fonts.sansLight,
        fontSize: 13,
        lineHeight: 21,
    },

    cardBodyMd: {
        fontFamily: Fonts.sansLight,
        fontSize: 13.5,
        lineHeight: 24,
    },

    solutionTitle: {
        fontFamily: Fonts.serifBold,
        fontSize: 26,
        lineHeight: 32,
        letterSpacing: -0.52,
    },

    solutionDesc: {
        fontFamily: Fonts.sansLight,
        fontSize: 14,
        lineHeight: 25,
    },

    solutionList: {
        fontFamily: Fonts.sans,
        fontSize: 13.5,
        lineHeight: 24,
    },

    badge: {
        fontFamily: Fonts.sansBold,
        fontSize: 10,
        lineHeight: 12,
        letterSpacing: 0.7,
        textTransform: "uppercase" as const,
    },

    quoteMark: {
        fontFamily: Fonts.serifExtraBold,
        fontSize: 64,
        lineHeight: 40,
    },

    quoteText: {
        fontFamily: Fonts.serif,
        fontSize: 21,
        lineHeight: 36,
        fontStyle: "italic" as const,
    },

    quoteAuthor: {
        fontFamily: Fonts.sans,
        fontSize: 13,
        lineHeight: 18,
    },

    button: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 14,
        lineHeight: 18,
    },

    buttonLg: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.15,
    },

    legal: {
        fontFamily: Fonts.sans,
        fontSize: 11.5,
        lineHeight: 18,
    },
} as const;
