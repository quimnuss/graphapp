import React, { useState, useEffect } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList
} from 'react-native';

import { addDays, subDays } from 'date-fns'; 

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import { BarChart, LineChart, lineDataItem } from 'react-native-gifted-charts';

import { LinearGradient, Stop } from 'react-native-svg';
import * as SecureStore from 'expo-secure-store';


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
  const [refreshing, setRefreshing] = useState(true);
  const [chartData, setChartData] = useState([]);

  const constChartData = [
    {label: new Date("Fri_Jan_03_2025".replace(/_/g, ' ')).getDate(), value: 35.28},
    {label: new Date("Sat_Jan_04_2025".replace(/_/g, ' ')).getDate(), value: 36.95},
    {label: new Date("Sun_Jan_05_2025".replace(/_/g, ' ')).getDate(), value: 37.36},
    {label: new Date("Mon_Jan_06_2025".replace(/_/g, ' ')).getDate(), value: 36.38},
    {label: new Date("Tue_Jan_07_2025".replace(/_/g, ' ')).getDate(), value: 36.89}
  ];
  
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

  const ItemView = ({ item }) => {
    return (
      <Text
        style={{
          fontSize: 20,
          padding: 10,
        }}>
        {item.label} : {item.value}
      </Text>
    );
  };
  
  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stats Tab</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {refreshing ? <ActivityIndicator /> : null}
      <LineChart
        data={chartData}
        spacing={20}
        yAxisOffset={25}
        // isAnimated
        // animateOnDataChange
        // renderDataPointsAfterAnimationEnds
        animationDuration={1000}
        onDataChangeAnimationDuration={300}
        lineGradient
        lineGradientId="ggrd" // same as the id passed in <LinearGradient> below
        lineGradientComponent={() => {
          return (
            <LinearGradient id="ggrd" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={'blue'} />
              <Stop offset="0.5" stopColor={'orange'} />
              <Stop offset="1" stopColor={'green'} />
            </LinearGradient>
          );
        }}
      />
      <FlatList
        data={chartData}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        enableEmptySections={true}
        renderItem={ItemView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getLastWeek} />
        }
      />
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
