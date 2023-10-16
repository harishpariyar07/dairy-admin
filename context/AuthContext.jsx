import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import URL from '../constants/ServerUrl'

const TOKEN_KEY = 'dairy-token'
const EXPIRY_DATE = 'dairy-admin-expiry'
const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    authenticated: null,
    expiryDate: null,
  })

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY)
        const expiryDate = await SecureStore.getItemAsync(EXPIRY_DATE)
        if (token) {
          const currentDate = new Date()
          if (new Date(expiryDate) > currentDate) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setAuthState({
              token: token,
              authenticated: true,
              expiryDate: expiryDate,
            })
          } else {
            await logout()
          }
        }
      } catch (error) {
        console.log('error')
      }
    }

    loadToken()
  }, [])

  const register = async ({
    userId,
    username,
    password,
    confirmPassword,
    mobileNo,
    contactPerson,
    address,
    allowAddFarmer,
    allowLedger,
    allowPayment,
    allowRateChart,
    allowDues,
  }) => {
    try {
      if (userId && username && password && confirmPassword) {
        if (password === confirmPassword) {
          const res = await axios.post(`${URL}user/signup`, {
            userId,
            username,
            password,
            mobileNo,
            contactPerson,
            address,
            permissions: {
              allowAddFarmer,
              allowLedger,
              allowPayment,
              allowRateChart,
              allowDues,
            },
          })

          return res
        } else {
          return { error: true, message: 'Passwords do not match' }
        }
      } else {
        return { error: true, message: 'Fill all the fields' }
      }
    } catch (error) {
      return { error: true, message: error.message }
    }
  }

  const login = async ({ email, password }) => {
    try {
      if (email && email.length > 0 && password && password.length > 0) {
        const res = await axios.post(`${URL}admin/login`, {
          email,
          password,
        })

        setAuthState({
          token: res.data.token,
          authenticated: true,
          expiryDate: res.data.expiryDate,
        })

        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`

        await SecureStore.setItemAsync(TOKEN_KEY, res.data.token)
        await SecureStore.setItemAsync(EXPIRY_DATE, res.data.expiryDate)
        return res
      } else {
        return { error: true, message: 'Fill all the fields' }
      }
    } catch (error) {
      return { error: true, message: error.response.data.error }
    }
  }

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY)

      axios.defaults.headers.common['Authorization'] = ''

      setAuthState({
        token: null,
        authenticated: false,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
