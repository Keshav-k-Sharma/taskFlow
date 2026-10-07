import { useState } from "react";
import { Platform, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, styles } from "./ui";
import { calendarDate } from "../utils/validators";

/** Selects optional calendar dates using the native date picker. */
export default function DateField({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.muted}>Due date (optional)</Text>
      <Button
        secondary
        title={value || "Choose due date"}
        onPress={() => setOpen(true)}
      />
      {!!value && (
        <Button secondary title="Clear due date" onPress={() => onChange("")} />
      )}
      {!!error && <Text style={styles.error}>{error}</Text>}
      {open && (
        <>
          <DateTimePicker
            value={value ? new Date(`${value}T12:00:00`) : new Date()}
            mode="date"
            onChange={(event, date) => {
              if (Platform.OS === "android") setOpen(false);
              if (event.type === "set" && date) onChange(calendarDate(date));
            }}
          />
          {Platform.OS !== "android" && (
            <Button title="Done" onPress={() => setOpen(false)} />
          )}
        </>
      )}
    </View>
  );
}
