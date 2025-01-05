import React, { useState } from 'react';
import { StyleSheet, Button, SafeAreaView } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import {DateTimePickerAndroid, DateTimePicker} from '@react-native-community/datetimepicker';

import Slider from '@react-native-community/slider';
import SliderText from 'react-native-slider-text';

import * as SecureStore from 'expo-secure-store';

async function save(adate : Date, value) {
  let key : string = adate.toDateString().replace(/\s/g, "_");
  await SecureStore.setItemAsync(key, value.toString());
  console.log('saved ' + key + ' ' + value.toString());
}

async function getValueFor(adate) {
  let key : string = adate.toDateString().replace(/\s/g, "_");
  let result = await SecureStore.getItemAsync(key);
  let anumber = result?.toString()
  return result !== null ? anumber : "?";
}


export default function TabTwoScreen() {
  const [sliderValue, setSliderValue] = useState(0);

  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    let value = getValueFor(selectedDate);
    setSliderValue(value);
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

  const handleNumberChange = (text) => {
    setSliderValue(text);
    save(date, text);
    getValueFor(date);
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
        minimumValue={36.00}
        maximumValue={38.00}
        stepValue={0.01}
        minimumValueLabel="36"
        maximumValueLabel="38"
        onValueChange={(id) => handleNumberChange(id)}
        sliderValue={sliderValue}
      />
      <SafeAreaView>
        <Text>{sliderValue} ºC</Text>
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
