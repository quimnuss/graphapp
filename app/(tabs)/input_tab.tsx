import React, { useState } from 'react';
import { StyleSheet, Button, SafeAreaView } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import {DateTimePickerAndroid, DateTimePicker} from '@react-native-community/datetimepicker';

import Slider from '@react-native-community/slider';
import SliderText from 'react-native-slider-text';
import { LineChart } from "react-native-gifted-charts"


export default function TabTwoScreen() {
  const [currentData, setCurrentData] = useState(latestData);
  const lcomp = (v) => (
    <Text style={{ width: 50, color: "white", fontWeight: "bold" }}>{v}</Text>
  );
  const dPoint = () => {
    return (
      <View
        style={{
          width: 14,
          height: 14,
          backgroundColor: 'white',
          borderWidth: 3,
          borderRadius: 7,
          borderColor: '#07BAD1',
        }}
      />
    );
  };
  const latestData = [
    {
      value: 100,
      labelComponent: () => lcomp('22 Nov'),

    },
    {
      value: 120,
      hideDataPoint: true,
    },
    {
      value: 210,

    },
    {
      value: 250,
      hideDataPoint: true,
    },
    {
      value: 320,
      labelComponent: () => lcomp('24 Nov'),

    },
    {
      value: 310,
      hideDataPoint: true,
    },
    {
      value: 270,

    },
    {
      value: 240,
      hideDataPoint: true,
    },
    {
      value: 130,
      labelComponent: () => lcomp('26 Nov'),

    },
    {
      value: 120,
      hideDataPoint: true,
    },
    {
      value: 100,

    },
    {
      value: 210,
      hideDataPoint: true,
    },
    {
      value: 270,
      labelComponent: () => lcomp('28 Nov'),

    },
    {
      value: 240,
      hideDataPoint: true,
    },
    {
      value: 120,
      hideDataPoint: true,
    },
    {
      value: 100,

    },
    {
      value: 210,
      labelComponent: () => lcomp('28 Nov'),

    },
    {
      value: 20,
      hideDataPoint: true,
    },
    {
      value: 100,

    },
  ];

  return (
    <View
    style={{
      marginVertical: 100,
      paddingVertical: 50,
      backgroundColor: '#414141',
    }}>
      <Text style={styles.title}>Input tab</Text>
      <LineChart
        // isAnimated
        thickness={3}
        color="#07BAD1"
        maxValue={600}
        noOfSections={3}
        animateOnDataChange
        animationDuration={1000}
        onDataChangeAnimationDuration={300}
        areaChart
        yAxisTextStyle={{color: 'lightgray'}}
        data={currentData}
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
      <Button
        title='do something'
        onPress={() => {
          console.log('pressssssssssss');
          latestData[0].value = 25 + 200*Math.random();
          setCurrentData(latestData);
        }}
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
