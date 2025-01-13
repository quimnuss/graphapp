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


export default function TabStatsScreen() {
  const constChartData = [
    {value: 35.28},
    {value: 36.95},
    {value: 37.36},
    {value: 36.38},
    { value: 36.89}
  ];
  
  const [refreshing, setRefreshing] = useState(true);
  const [chartData, setChartData] = useState(constChartData);
  const [sliderValue, setSliderValue] = useState(0);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getLastWeek();
  }, []);

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

  const handleNumberChange = (text) => {
    setSliderValue(text);
    // let currentpoint = chartData.find((datapoint) => datapoint?.label === date.getDate());
    // currentpoint.value = text.toString();
    let currentpointidx = chartData.findIndex((datapoint) => datapoint?.label === date.getDate());
    if (currentpointidx >= 0) {
      chartData[currentpointidx].value = text.toString();
    } else {
      chartData.push({label: date.getDate(), value: text.toString()});
    }
    setChartData(chartData);
    save(date, text);
    getValueFor(date);
  };

  const debugChart = () => {
    console.log(JSON.stringify(chartData))
    chartData[0].value = 25 + 10*Math.random();
    constChartData[0].value = 25 + 10*Math.random();
  };

  return (
    <View style={styles.container}>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {refreshing ? <ActivityIndicator /> : null}
      <RefreshControl refreshing={refreshing} onRefresh={getLastWeek} />
      <LineChart
          thickness={3}
          color="#07BAD1"
          maxValue={40}
          noOfSections={3}
          animateOnDataChange
          animationDuration={1000}
          onDataChangeAnimationDuration={300}
          areaChart
          yAxisTextStyle={{color: 'lightgray'}}
          data={chartData}
          hideDataPoints
          startFillColor={'rgb(84,219,234)'}
          endFillColor={'rgb(84,219,234)'}
          startOpacity={0.4}
          endOpacity={0.1}
          spacing={22}
          backgroundColor="#414141"
          rulesColor="gray"
          rulesType="solid"
          initialSpacing={10}
          yAxisColor="lightgray"
          xAxisColor="lightgray"
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
          constChartData[0].value = 15 + 20*Math.random();
          setChartData(constChartData);
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
