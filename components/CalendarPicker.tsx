import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';

const CalendarPicker = () => {
  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Button mode="outlined" onPress={() => setOpen(true)}>
        {date ? date.toDateString() : 'Pick a date'}
      </Button>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={open}
        onDismiss={() => setOpen(false)}
        date={date}
        onConfirm={(params) => {
          setOpen(false);
          setDate(params.date);
        }}
      />

      {date && (
        <Text style={styles.selectedDate}>Selected: {date.toDateString()}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  selectedDate: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default CalendarPicker;
