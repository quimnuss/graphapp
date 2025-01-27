import React, { useState, useEffect } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Button,
} from 'react-native';

import SliderText from 'react-native-slider-text';

import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { addDays, subDays } from 'date-fns'; 

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import { BarChart, LineChart, lineDataItem } from 'react-native-gifted-charts';

import { LinearGradient, Stop } from 'react-native-svg';
import * as SecureStore from 'expo-secure-store';


async function save(adate : Date, value) {
  let key : string = adate.toDateString().replace(/\s/g, "_");
  await SecureStore.setItemAsync(key, value.toString());
  // console.log('saved ' + key + ' ' + value.toString());
}

async function getValueFor(adate) {
  let key : string = adate.toDateString().replace(/\s/g, "_");
  let result = await SecureStore.getItemAsync(key);
  let anumber = result?.toString()
  return result !== null ? anumber : "?";
}

const getDatesInRange = (startDate : Date, endDate : Date) => {
  const keys = []
  for (let current = startDate; current <= endDate; current.setDate(current.getDate() + 1)) {
    keys.push(new Date(current).toDateString().replace(/\s/g, "_"));
  }
  return keys;
}

async function getValuesForRange(startDate: Date, endDate : Date) {
  const data = [];
  console.log('retrieving: ' + startDate.toDateString() + " - " + endDate.toDateString());
  let keys = getDatesInRange(startDate, endDate);
  for (let key of keys) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      let value = result !== null ? result.toString() : "?";
      let day_number = new Date(key.replace(/_/g, ' ')).getDate();
      data.push({"label" : day_number, "value" : parseFloat(value)});
    } else {
      console.log('result for ' + key + ' is null')
    }
  }
  return data;
}

type LineChartData = { label: number; value: number };

export default function TabStatsScreen() {
  let localChartData = [{label: new Date().getDay(), value: 25}];

  const [refreshing, setRefreshing] = useState(true);
  const [chartData, setChartData] = useState<LineChartData[]>([]);
  const [sliderValue, setSliderValue] = useState(0);
  const [date, setDate] = useState(new Date());

  // [] means run once when the app renders for the first time
  useEffect(() => {
    getLastWeek();
  }, []);

  useEffect(() => {
    localChartData = [...chartData];
  }, [chartData]);

  const getLastWeek = async () => {
    let now : Date = new Date();
    let startdate : Date = subDays(now, 7);
    let enddate : Date = addDays(now, 7);
    let week_data = []
    week_data = await getValuesForRange(startdate, enddate);
    setRefreshing(false);
    setChartData(week_data);
    console.log('retrieved ' + JSON.stringify(week_data));
  };

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

  const handleNumberChange = (number) => {
    setSliderValue(number.toString());
    localChartData = [...chartData]
    const pindex = localChartData.findIndex(p => p.label === date.getDate());
    if (pindex !== -1) {
      localChartData[pindex].value = number;
    } else {
      localChartData = [...chartData, { label : date.getDate(), value : number }]  
    }
    setChartData(localChartData);
    save(date, number);
    getValueFor(date);
  };

  const debugChart = () => {
    console.log(JSON.stringify(chartData))
    localChartData[0].value = 25 + 10*Math.random();
    setChartData(localChartData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {refreshing ? <ActivityIndicator /> : null}
      <RefreshControl refreshing={refreshing} onRefresh={getLastWeek} />
      <LineChart
        spacing={20}
        yAxisOffset={25}
        noOfSections={3}
        areaChart
        // isAnimated
        animateOnDataChange
        animationDuration={1000}
        onDataChangeAnimationDuration={300}
        // renderDataPointsAfterAnimationEnds
        data={chartData}
        focusEnabled
        onFocus={() => {
          console.log('pressssssssssss');
          debugChart();
          setChartData(chartData);
        }}
      />
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
      <Button
        title='do something'
        onPress={() => {
          console.log('pressssssssssss');
          localChartData[0].value = 25 + 10*Math.random();
          setChartData(localChartData);
        }}
      />
      <SafeAreaView>
        <Text>{sliderValue} ºC</Text>
        <Button onPress={showDatepicker} title={date.toLocaleDateString()} />
      </SafeAreaView>
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
