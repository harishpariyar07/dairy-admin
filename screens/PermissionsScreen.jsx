import React, { useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-paper'
import DropDown from 'react-native-paper-dropdown'
import { useAuth } from '../context/AuthContext'

import { ScrollView } from 'react-native'

const permissionsOptions = [
  { value: 'Allow', label: 'Allow' },
  { value: 'Not Allow', label: 'Not Allow' },
]

const PermissionsScreen = ({ navigation, route }) => {
  const { onRegister } = useAuth()
  const { userId, username, mobileNo, contactPerson, address, password, confirmPassword } =
    route.params

  const [allowAddFarmer, setAllowAddFarmer] = useState('Not Allow')
  const [allowRateChart, setAllowRateChart] = useState('Not Allow')
  const [allowPayment, setAllowPayment] = useState('Not Allow')
  const [allowDues, setAllowDues] = useState('Not Allow')
  const [allowLedger, setAllowLedger] = useState('Not Allow')
  const [showDropDown1, setShowDropDown1] = useState(false)
  const [showDropDown2, setShowDropDown2] = useState(false)
  const [showDropDown3, setShowDropDown3] = useState(false)
  const [showDropDown4, setShowDropDown4] = useState(false)
  const [showDropDown5, setShowDropDown5] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  const handleSignUp = async () => {
    const res = await onRegister({
      userId,
      username,
      password,
      confirmPassword,
      mobileNo,
      contactPerson,
      address,
      allowAddFarmer,
      allowRateChart,
      allowPayment,
      allowDues,
      allowLedger,
    })
    if (res && res.error) {
      alert(res.message)
    } else {
      navigation.navigate('HomeScreen')
      alert('User Registered Successfully')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Permissions</Text>

      <View>
        <DropDown
          label={'Allow Add Farmer'}
          mode={'flat'}
          visible={showDropDown1}
          showDropDown={() => setShowDropDown1(true)}
          onDismiss={() => setShowDropDown1(false)}
          value={allowAddFarmer}
          setValue={setAllowAddFarmer}
          list={permissionsOptions}
          dropDownStyle={styles.dropStyle}
          dropDownItemStyle={styles.dropDownStyle}
          dropDownItemSelectedStyle={styles.dropDownStyle}
          inputProps={{
            style: {
              backgroundColor: 'white',
              padding: 4,
            },
          }}
        />

        <DropDown
          label={'Allow Rate Chart'}
          mode='flat'
          visible={showDropDown2}
          showDropDown={() => setShowDropDown2(true)}
          onDismiss={() => setShowDropDown2(false)}
          value={allowRateChart}
          setValue={setAllowRateChart}
          list={permissionsOptions}
          dropDownStyle={styles.dropStyle}
          dropDownItemStyle={styles.dropDownStyle}
          dropDownItemSelectedStyle={styles.dropDownStyle}
          inputProps={{
            style: {
              backgroundColor: 'white',
              padding: 4,
            },
          }}
        />

        <DropDown
          label={'Allow Payment'}
          mode='flat'
          visible={showDropDown3}
          showDropDown={() => setShowDropDown3(true)}
          onDismiss={() => setShowDropDown3(false)}
          value={allowPayment}
          setValue={setAllowPayment}
          list={permissionsOptions}
          dropDownStyle={styles.dropStyle}
          dropDownItemStyle={styles.dropDownStyle}
          dropDownItemSelectedStyle={styles.dropDownStyle}
          inputProps={{
            style: {
              backgroundColor: 'white',
              padding: 4,
              color: 'red',
            },
          }}
        />

        <DropDown
          label={'Allow Dues'}
          mode='flat'
          visible={showDropDown4}
          showDropDown={() => setShowDropDown4(true)}
          onDismiss={() => setShowDropDown4(false)}
          value={allowDues}
          setValue={setAllowDues}
          list={permissionsOptions}
          dropDownStyle={styles.dropStyle}
          dropDownItemStyle={styles.dropDownStyle}
          dropDownItemSelectedStyle={styles.dropDownStyle}
          inputProps={{
            style: {
              backgroundColor: 'white',
              padding: 4,
            },
          }}
        />

        <DropDown
          label={'Allow Ledger'}
          mode='flat'
          visible={showDropDown5}
          showDropDown={() => setShowDropDown5(true)}
          onDismiss={() => setShowDropDown5(false)}
          value={allowLedger}
          setValue={setAllowLedger}
          list={permissionsOptions}
          dropDownStyle={styles.dropStyle}
          dropDownItemStyle={styles.dropDownStyle}
          dropDownItemSelectedStyle={styles.dropDownStyle}
          inputProps={{
            style: {
              backgroundColor: 'white',
              padding: 4,
            },
          }}
        />
      </View>

      <View style={styles.buttons}>
        <Button mode='contained' style={styles.button} onPress={handleSignUp} buttonColor='#6987d0'>
          Sign Up
        </Button>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Text style={styles.back}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  heading: {
    fontSize: 30,
    fontFamily: 'LeagueSB',
    paddingBottom: 20,
    textAlign: 'center',
    paddingLeft: 15,
    paddingTop: 20,
  },
  buttons: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    borderRadius: 15,
    marginTop: 30,
  },
  dropDownStyle: {
    backgroundColor: 'white',
    color: 'blue',
  },
  back: {
    marginTop: 20,
    color: '#3c66cf',
    fontSize: 13,
    fontFamily: 'Inter',
  },
})

export default PermissionsScreen
