import { ThemedPicker } from "@/components/picker/themed-picker";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "../text/themed-text";
import { ThemedView } from "../view/themed-view";

const times = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
];

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

type Props = {
    availability: Record<
        string,
        {
            start: string;
            end: string;
        }
    >;
    onAvailabilityChange: (day: string, type: "start" | "end", value: string) => void;
};

export function ThemedAvailabilityPickerWeb({ availability, onAvailabilityChange }: Props) {
    const textColor = useThemeColor({}, "text");
    const backgroundColor = useThemeColor({}, "background");
    const borderColor = useThemeColor({}, "border");

    return (
        <ThemedView style={styles.container}>
            {days.map((day) => {
                const value = availability?.[day];

                if (!value) return null;

                return (
                    <ThemedView key={day} style={styles.dayContainer}>
                        <ThemedText style={styles.dayLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}</ThemedText>

                        <ThemedView style={styles.timePickerContainer}>
                            <ThemedView style={styles.pickerWrapper}>
                                <ThemedPicker
                                    label="Start"
                                    selectedValue={value.start}
                                    onValueChange={(v) => onAvailabilityChange(day, "start", v)}
                                    style={{
                                        color: textColor,
                                        backgroundColor,
                                        borderColor,
                                        padding: 10,
                                        borderRadius: 5,
                                    }}
                                >
                                    {times.map((time, i) => (
                                        <Picker.Item key={i} label={time} value={time} />
                                    ))}
                                </ThemedPicker>
                            </ThemedView>
                            <ThemedView style={styles.pickerWrapper}>
                                <ThemedPicker
                                    label="End"
                                    selectedValue={value.end}
                                    onValueChange={(v) => onAvailabilityChange(day, "end", v)}
                                    style={{
                                        color: textColor,
                                        backgroundColor,
                                        borderColor,
                                        padding: 10,
                                        borderRadius: 5,
                                    }}
                                >
                                    {times.map((time, i) => (
                                        <Picker.Item key={i} label={time} value={time} />
                                    ))}
                                </ThemedPicker>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                );
            })}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexDirection: "column",
    },
    dayContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    dayLabel: {
        flex: 1,
        fontWeight: "bold",
    },
    timePickerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 2,
    },
    pickerWrapper: {
        width: "45%",
    },
});
