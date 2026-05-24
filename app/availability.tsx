import ThemedButton from "@/components/buttons/themed-button";
import { ThemedAvailabilityPickerWeb } from "@/components/picker/themed-availability-picker-web";
import { ThemedView } from "@/components/view/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const dayMap: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
};

const defaultAvailability = {
    monday: { start: "09:00", end: "17:00" },
    tuesday: { start: "09:00", end: "17:00" },
    wednesday: { start: "09:00", end: "17:00" },
    thursday: { start: "09:00", end: "17:00" },
    friday: { start: "09:00", end: "17:00" },
    saturday: { start: "09:00", end: "17:00" },
    sunday: { start: "09:00", end: "17:00" },
};

export default function Availability() {
    const { claims, isLoading } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [availability, setAvailability] = useState(defaultAvailability);

    useEffect(() => {
        const fetchAvailability = async () => {
            if (isLoading || !claims?.id) return;

            const { data, error } = await supabase.from("availability_rules").select("*").eq("user_id", claims.id);

            if (error) {
                return;
            }

            if (!data || data.length === 0) return;

            const formatted = { ...defaultAvailability };

            for (const row of data) {
                const day = Object.keys(dayMap).find((k) => dayMap[k] === row.day_of_week);
                if (!day) continue;

                formatted[day] = {
                    start: row.start_time.slice(0, 5),
                    end: row.end_time.slice(0, 5),
                };
            }

            setAvailability(formatted);
        };

        fetchAvailability();
    }, [claims?.id, isLoading]);

    const handleAvailabilityChange = (day: string, type: string, value: string) => {
        setAvailability((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [type]: value,
            },
        }));
    };

    const saveAvailability = async () => {
        if (isLoading || !claims?.id) return;

        setLoading(true);

        const rules = Object.entries(availability).map(([day, value]) => ({
            day_of_week: dayMap[day],
            start_time: value.start,
            end_time: value.end,
        }));

        const { error } = await supabase.rpc("create_availability_rules", {
            rules,
        });

        setLoading(false);

        if (error) {
            return;
        }
    };

    return (
        <ThemedView style={{ flex: 1, padding: 20 }}>
            <ThemedAvailabilityPickerWeb availability={availability} onAvailabilityChange={handleAvailabilityChange} />

            <ThemedButton title={loading ? "Saving..." : "Save availability"} onPress={saveAvailability} />
        </ThemedView>
    );
}
