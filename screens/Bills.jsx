import React from 'react'
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

const screens = [
  { name: 'Bill Details', component: 'BillDetails' },
  { name: 'Generate Bill', component: 'GenerateBill' },
]

const Bills = ({ route }) => {
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
  },
  button: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    width: '46%',
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#edc6c6',
    shadowColor: '#babbbf',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
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
    color: 'black',
  },
})

export default Bills
