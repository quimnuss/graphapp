import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import { BarChart, LineChart, lineDataItem } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabStatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stats Tab</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <LineChart
        data={barData}
        spacing={20}
        lineGradient
      />
      <EditScreenInfo path="app/(tabs)/stats_tab.tsx" />
    </View>
  );
}

const barData = [{value: 35, label: '21'}, {value: 30, label: '22'}, {value: 36, label: '23'}, {value: 38, label: '24'}];

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
