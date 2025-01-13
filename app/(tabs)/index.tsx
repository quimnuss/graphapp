import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import Stats from '@/tabs/TabStatsScreen';
import TabStatsScreen from './stats_tab';
import TabTwoScreen from './input_tab';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Graph Me!</Text>
      <TabStatsScreen />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
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
