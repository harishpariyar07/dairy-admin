import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { TextInput, Button } from 'react-native-paper'
import { useAuth } from '../context/AuthContext'

import { KeyboardAvoidingView } from 'react-native'

const RegisterScreen = () => {
  // all the states
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [mobileNo, setMobileNo] = useState()
  const [contactPerson, setContactPerson] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { onRegister } = useAuth()

  const navigator = useNavigation()

  const navigateToPermissions = () => {
    navigator.navigate('PermissionsScreen', {
      userId,
      username,
      mobileNo,
      contactPerson,
      address,
      password,
      confirmPassword,
    })
  }

  useLayoutEffect(() => {
    navigator.setOptions({
      headerShown: false,
    })
  }, [])

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <Text style={styles.heading}>Register New User</Text>
        <View style={styles.form}>

          <TextInput
            placeholderTextColor='black'
            style={styles.input}
            label='User ID'
            type='outlined'
            underlineColor='#3c66cf'
            activeUnderlineColor='#3c66cf'
            outlineColor='#3c66cf'
            activeOutlineColor='#3c66cf'
            value={userId}
            keyboardType='numeric'
            onChangeText={(e) => {
              setUserId(e)
            }}
          />
          <TextInput
            placeholderTextColor='black'
            style={styles.input}
            label='Username'
            type='outlined'
            underlineColor='#3c66cf'
            activeUnderlineColor='#3c66cf'
            outlineColor='#3c66cf'
            activeOutlineColor='#3c66cf'
            autoCapitalize='none'
            value={username}
            onChangeText={(e) => {
              if (/^[0-9]/.test(e)) {
                alert('Username cannot start with a number');
              } else if (e.length > 20) {
                alert('Username should be less than 20 characters');
              } else if (/\s/.test(e)) {
                alert('Username should not contain spaces');
              } else if (/[A-Z]/.test(e)) {
                alert('Username should not contain capital letters');
              } else {
                setUsername(e);
              }
            }}
          />

          <TextInput
            placeholderTextColor='black'
            style={styles.input}
            label='Mobile No.'
            type='outlined'
            underlineColor='#3c66cf'
            activeUnderlineColor='#3c66cf'
            outlineColor='#3c66cf'
            activeOutlineColor='#3c66cf'
            value={mobileNo}
            keyboardType='numeric'
            onChangeText={(e) => {
              setMobileNo(e)
            }}
          />

          <TextInput
            placeholderTextColor='black'
            style={styles.input}
            label='Contact Person'
            type='outlined'
            underlineColor='#3c66cf'
            activeUnderlineColor='#3c66cf'
            outlineColor='#3c66cf'
            activeOutlineColor='#3c66cf'
            value={contactPerson}
            onChangeText={(e) => {
              setContactPerson(e)
            }}
          />

          <TextInput
            placeholderTextColor='black'
            style={styles.input}
            label='Address'
            type='outlined'
            underlineColor='#3c66cf'
            activeUnderlineColor='#3c66cf'
            outlineColor='#3c66cf'
            activeOutlineColor='#3c66cf'
            value={address}
            onChangeText={(e) => {
              setAddress(e)
            }}
          />

          <TextInput
            placeholderTextColor='black'
            style={styles.input}
            label='Password'
            secureTextEntry
            type='outlined'
            underlineColor='#3c66cf'
            activeUnderlineColor='#3c66cf'
            outlineColor='#3c66cf'
            activeOutlineColor='#3c66cf'
            autoCapitalize='none'
            value={password}
            onChangeText={(e) => {
              setPassword(e)
            }}
          />

          <TextInput
            placeholderTextColor='black'
            style={styles.input}
            label='Confirm Password'
            secureTextEntry
            type='outlined'
            underlineColor='#3c66cf'
            activeUnderlineColor='#3c66cf'
            autoCapitalize='none'
            outlineColor='#3c66cf'
            activeOutlineColor='#3c66cf'
            value={confirmPassword}
            onChangeText={(e) => {
              setConfirmPassword(e)
            }}
          />
        </View>

        <View style={styles.buttons}>
          <Button
            mode='contained'
            style={styles.button}
            onPress={navigateToPermissions}
            buttonColor='#6987d0'
          >
            Next
          </Button>

          <TouchableOpacity
            onPress={() => {
              navigator.navigate('HomeScreen')
            }}
          >
            <Text style={styles.back}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#e9edf7',
  },
  form: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  heading: {
    fontSize: 30,
    fontFamily: 'LeagueSB',
    alignItems: 'center',
    paddingBottom: 20,
    textAlign: 'center',
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
  back: {
    marginTop: 20,
    color: '#3c66cf',
    fontSize: 13,
    fontFamily: 'Inter',
  },
})

export default RegisterScreen
