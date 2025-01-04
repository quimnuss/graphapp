import React, { useState } from 'react';
import { StyleSheet, Button, SafeAreaView } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import {DateTimePickerAndroid, DateTimePicker} from '@react-native-community/datetimepicker';

import Slider from '@react-native-community/slider';
import SliderText from 'react-native-slider-text';

export default function TabTwoScreen() {
  const [sliderValue, setSliderValue] = useState(0);


  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Input tab</Text>
      {/* <Slider
        style={{width: 200, height: 40}}
        minimumValue={10}
        maximumValue={40}
        step={1}
        tapToSeek
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      /> */}

      <SliderText
        minimumTrackTintColor="#000"
        thumbTintColor="#000"
        maximumTrackTintColor="#099"
        minimumValue={35.00}
        maximumValue={40.00}
        stepValue={0.01}
        minimumValueLabel="35"
        maximumValueLabel="40"
        onValueChange={(id) => setSliderValue(id)}
        sliderValue={sliderValue}
      />
      <SafeAreaView>
        <Button onPress={showDatepicker} title={date.toLocaleDateString()} />
      </SafeAreaView>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/input_tab.tsx" />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
