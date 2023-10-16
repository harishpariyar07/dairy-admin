import { View, Text } from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { TextInput, Button } from 'react-native-paper'
import { ToastAndroid, StyleSheet } from 'react-native'
import axios from 'axios'
import URL from '../constants/ServerUrl'
import { useNavigation } from '@react-navigation/native'

const showToastSuccess = () => {
    ToastAndroid.showWithGravity(
        `Password reset link has been sent to your email`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
    )
}

const showToastError = () => {
    ToastAndroid.showWithGravity(
        `Something went wrong`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
    )
}

const ForgotPassword = () => {

    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {

        if(!email) return alert('Please enter your email')

        try {
            setLoading(true)
            const res = await axios.post(`${URL}admin/forgot-password`, { email })

            if (res.status === 200) {
                showToastSuccess()
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            showToastError()
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Forgot Password</Text>
            <TextInput
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                mode="outlined"
                style={{ margin: 10 }}
            />
            <Button
                mode="contained"
                onPress={handleSubmit}
                style={{ margin: 10 }}
                loading={loading}
            >
                Submit
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10
    }
})

export default ForgotPassword