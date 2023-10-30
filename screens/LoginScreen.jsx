import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import { useLayoutEffect, useState } from 'react'
import { Button, IconButton, TextInput } from 'react-native-paper'
import Dairy from '../assets/icons/adminLogo.png'
import { useAuth } from '../context/AuthContext'

const LoginScreen = () => {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const { onLogin } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const login = async () => {
    setIsLoading(true)
    const res = await onLogin({ email, password })

    if (res && res.error) {
      setIsLoading(false)
      alert(res.message)
    } else if (res && !res.error) {
      setIsLoading(false)
      alert('Admin Logged In Successfully')
    }
    else {
      alert(res.message)
    }
  }

  return (
    <SafeAreaView style={styles.conatiner}>

      <Image source={Dairy} style={styles.image} />

     <Text style={styles.heading}>Login as manager</Text>
      <TextInput
        placeholderTextColor='black'
        style={styles.input}
        label='Admin Email'
        mode='flat'
        value={email}
        onChangeText={(e) => {
          setEmail(e)
        }}
        underlineColor='#3c66cf'
        activeUnderlineColor='#3c66cf'
        outlineColor='#3c66cf'
        activeOutlineColor='#3c66cf'
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

      <Button
        mode='contained'
        style={styles.button}
        onPress={login}
        buttonColor='#038a0e'
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>

      <Button
        mode='text'
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        Forgot Password?
      </Button>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor:'#A7BEAE',
  },
  button: {
    width: '76%',
    borderRadius: 15,
  },
  input: {
    width: '78%',
    height: 50,
    backgroundColor: '#e9edf7',
  },
  heading: {
    fontSize: 33,
    alignSelf: 'flex-start',
    alignItems:'center',
    fontFamily: 'LeagueSB',
    color: '#de0914',
    marginLeft: 45,
    },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
})

export default LoginScreen
