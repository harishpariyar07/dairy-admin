import axios from 'axios'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import URL from '../constants/ServerUrl'

const BillDetails = () => {
  const [organizationName, setOrganizationName] = useState('')
  const [contactNumber1, setContactNumber1] = useState(null)
  const [contactNumber2, setContactNumber2] = useState(null)
  const [address, setAddress] = useState('')
  const [panNumber, setPanNumber] = useState(null)
  const [billTitle, setBillTitle] = useState('')

  const fetchBillDetails = async () => {
    try {
      const bill = await axios.get(`${URL}admin/bill`)
      setOrganizationName(bill.data.organizationName)
      setContactNumber1(bill.data.contactNumber1)
      setContactNumber2(bill.data.contactNumber2)
      setAddress(bill.data.address)
      setPanNumber(bill.data.panNumber)
      setBillTitle(bill.data.billTitle)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchBillDetails()
  }, [])

  const updateBillDetails = async () => {
    try {
      const res = await axios.put(`${URL}admin/bill`, {
        organizationName,
        contactNumber1,
        contactNumber2,
        address,
        panNumber,
        billTitle,
      })

      alert('Bill details updated successfully')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='auto' />

      <ScrollView>
        <TextInput
          placeholderTextColor='black'
          label='Enter organization name'
          value={organizationName}
          onChangeText={(value) => setOrganizationName(value)}
          selectionColor='black'
          style={styles.textInput}
        />

        <TextInput
          placeholderTextColor='black'
          label='Enter Contact Number 1'
          value={contactNumber1 && contactNumber1.toString()}
          onChangeText={(value) => setContactNumber1(value)}
          selectionColor='black'
          style={styles.textInput}
          keyboardType='numeric'
        />

        <TextInput
          placeholderTextColor='black'
          label='Enter Contact Number 2'
          value={contactNumber2 && contactNumber2.toString()}
          onChangeText={(value) => setContactNumber2(value)}
          selectionColor='black'
          style={styles.textInput}
          keyboardType='numeric'
        />

        <TextInput
          placeholderTextColor='black'
          label='Enter Address'
          value={address}
          onChangeText={(value) => setAddress(value)}
          selectionColor='black'
          style={styles.textInput}
        />

        <TextInput
          placeholderTextColor='black'
          label='Enter PAN Number'
          value={panNumber && panNumber.toString()}
          onChangeText={(value) => setPanNumber(value)}
          selectionColor='black'
          style={styles.textInput}
        />

        <TextInput
          placeholderTextColor='black'
          label='Enter Bill Title'
          value={billTitle}
          onChangeText={(value) => setBillTitle(value)}
          selectionColor='black'
          style={styles.textInput}
        />
      </ScrollView>

      <View style={styles.button}>
        <Button
          icon='content-save'
          mode='contained'
          onPress={() => updateBillDetails()}
          style={styles.button}
        >
          Update
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 2,
    width: '100%',
    justifyContent: 'space-between',
  },
  textInput: {
    backgroundColor: 'white',
    padding: 5,
  },
  button: {
    padding: 4,
  },
  dropDownStyle: {
    backgroundColor: 'white',
    color: 'blue',
  },

  titleStyle: {
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'white',
    paddingLeft: 15,
    paddingTop: 5,
  },
})

export default BillDetails
