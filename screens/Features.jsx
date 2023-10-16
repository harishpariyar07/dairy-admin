import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import AddFarmerImg from '../assets/icons/addFarmer.png'
import CollectMilkImg from '../assets/icons/collectMilk.png'
import DuesImg from '../assets/icons/dues.png'
import LedgerImg from '../assets/icons/ledger.png'
import PaymentsImg from '../assets/icons/payments.png'
import RateChartImg from '../assets/icons/rateChart.png'
import Bills from '../assets/icons/bill.png'
import milkreport from '../assets/icons/milkreport.png'

const screens = [
  { name: 'Add Farmer', component: 'AddFarmer', image: AddFarmerImg },
  { name: 'Collect Milk', component: 'CollectMilk', image: CollectMilkImg },
  { name: 'Payments', component: 'Payments', image: PaymentsImg },
  { name: 'Rate Chart', component: 'RateChart', image: RateChartImg },
  { name: 'Dues', component: 'Dues', image: DuesImg },
  { name: 'Ledger', component: 'Ledger', image: LedgerImg },
  { name: 'Milk Report', component: 'MilkReport', image: milkreport },
  { name: 'Generate Bill', component: 'GenerateBill', image: Bills },
]

const Features = ({ route }) => {
  const navigator = useNavigation()
  const { username } = route.params

  const handleNavigation = (component, username) => {
    navigator.navigate(component, { username })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='auto' />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.bottomContainer}>
          {screens.map(({ name, component, image }) => (
            <TouchableOpacity
              key={component}
              style={styles.button}
              onPress={() => handleNavigation(component, username)}
            >
              <Image source={image} style={styles.icon} />
              <Text style={styles.btnText}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor:'#A7BEAE'
  },
  button: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    width: '46%',
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#E7E8D1',
    // shadowColor: '#babbbf',
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.27,
    // shadowRadius: 4.65,
    // elevation: 6,
  },
  bottomContainer: {
    margin: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  scrollContainer: {
    width: '100%',
    flex: 1,
  },
  icon: {
    width: 60,
    height: undefined,
    aspectRatio: 1,
  },
  btnText: {
    padding: 10,
    fontFamily: 'Inter',
    color: '#059c11',
  },
})

export default Features
