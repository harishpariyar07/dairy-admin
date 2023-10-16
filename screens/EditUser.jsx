import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native'
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { TextInput, Button, IconButton } from 'react-native-paper'
import { KeyboardAvoidingView } from 'react-native'
import axios from 'axios'
import { URL } from '@env'

const EditUser = ({ route }) => {
  // all the states
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [mobileNo, setMobileNo] = useState()
  const [contactPerson, setContactPerson] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const navigator = useNavigation()

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
  }

  const navigateToPermissions = () => {
    navigator.navigate('EditPermissionsScreen', {
      userId,
      username,
      mobileNo,
      contactPerson,
      address,
      password,
      confirmPassword,
    })
  }

  const fetchUserData = async () => {
    try {
      if (route.params.username) {
        const res = await axios.get(`${URL}user/${route.params.username}`)
        setUserId(res.data.userId)
        setUsername(res.data.username)
        setMobileNo(res.data.mobileNo)
        setContactPerson(res.data.contactPerson)
        setAddress(res.data.address)
        setPassword(res.data.password)
        setConfirmPassword(res.data.password)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

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
        <Text style={styles.heading}>Edit User</Text>
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
            value={userId && userId.toString()}
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
            value={username}
            onChangeText={(e) => {
              alert('Username cannot be changed')
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
            value={mobileNo && mobileNo.toString()}
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

          <View style={[styles.input, { justifyContent: 'space-between', flexDirection: 'row' }]}>
            <TextInput
              placeholderTextColor='black'
              style={{ flex: 1, backgroundColor: '#e9edf7' }}
              label='Password'
              secureTextEntry={!isPasswordVisible}
              type='outlined'
              underlineColor='#3c66cf'
              activeUnderlineColor='#3c66cf'
              outlineColor='#3c66cf'
              activeOutlineColor='#3c66cf'
              value={password}
              onChangeText={(e) => {
                setPassword(e)
              }}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <IconButton icon={isPasswordVisible ? 'eye-off' : 'eye'} color='#3c66cf' size={20} />
            </TouchableOpacity>
          </View>

          <View style={[styles.input, { justifyContent: 'space-between', flexDirection: 'row' }]}>
            <TextInput
              placeholderTextColor='black'
              style={{ flex: 1, backgroundColor: '#e9edf7' }}
              label='Confirm Password'
              secureTextEntry={!isConfirmPasswordVisible}
              type='outlined'
              underlineColor='#3c66cf'
              activeUnderlineColor='#3c66cf'
              outlineColor='#3c66cf'
              activeOutlineColor='#3c66cf'
              value={confirmPassword}
              onChangeText={(e) => {
                setConfirmPassword(e)
              }}
            />
            <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
              <IconButton
                icon={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                color='#3c66cf'
                size={20}
              />
            </TouchableOpacity>
          </View>
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
              navigator.goBack()
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

export default EditUser
