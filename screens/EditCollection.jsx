import React, { useState, useEffect } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import axios from 'axios'
import { URL } from '@env'
import { Button, IconButton, TextInput } from 'react-native-paper'
import HideWithKeyboard from 'react-native-hide-with-keyboard'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'

const EditCollection = ({ route }) => {
  const { username, id } = route.params
  const [date, setDate] = useState(new Date(route.params.dateInStr))
  const [totalAmt, setTotalAmt] = useState(route.params.amount)
  const [rate, setRate] = useState(route.params.rate)
  const [qty, setQty] = useState(route.params.qty)
  const [fat, setFat] = useState(route.params.fat)
  const [snf, setSnf] = useState(route.params.snf)
  const [farmerName, setFarmerData] = useState(route.params.farmerName)
  const [farmerId, setFarmerId] = useState(route.params.farmerId)
  const [selectedOption, setSelectedOption] = useState(route.params.shift)
  const [isPickerShow, setIsPickerShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigator = useNavigation()

  const showPicker = () => {
    setIsPickerShow(true)
  }

  const onChange = (event, value) => {
    setDate(value)
    if (Platform.OS === 'android') {
      setIsPickerShow(false)
    }
  }

  const updateCollection = async () => {
    try {
      if (username) {
        setIsLoading(true)
        const rateResponse = await axios.get(
          `${URL}admin/${username}/ratelist/${farmerId}/rate?fat=${fat}&snf=${snf}`
        )

        const rateData = rateResponse.data

        if (rateData.rate) {
          setRate(rateData.rate)
          setTotalAmt(qty * rateData.rate)
        }

        const collectionResponse = await axios.put(`${URL}admin/${username}/collection/${id}`, {
          shift: selectedOption,
          qty: qty,
          fat: Number(fat),
          snf: Number(snf),
          farmerId: farmerId,
          farmerName: farmerName,
          collectionDate: date,
          amount: Number(qty * rateData.rate).toFixed(2),
          rate: Number(rateData.rate),
        })

        if (collectionResponse) {
          setIsLoading(false)
          alert('Collection Updated Successfully')
          navigator.goBack()
        }
      }
    } catch (err) {
      setIsLoading(false)
      alert('Error updating collection')
      console.log(err)
    }
  }

  const Item = ({ farmerId, farmerName, farmerLevel }) => (
    <View style={styles.item}>
      <Text>{farmerId}</Text>
      <Text style={{ marginRight: 5 }}>{farmerName}</Text>
      <Text style={{ marginRight: 10 }}>{farmerLevel}</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconButtonContainer}>
        <TouchableOpacity
          style={[styles.iconButton, selectedOption === 'Morning' && styles.selectedOption]}
          onPress={() => {
            setSelectedOption('Morning')
          }}
        >
          <IconButton
            icon='weather-sunny' // Choose an appropriate icon name
            iconColor={'white'}
            onPress={() => setSelectedOption('Morning')}
          />
          <Text style={{ color: '#fff' }}>Morning</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, selectedOption === 'Evening' && styles.selectedOption]}
          onPress={() => setSelectedOption('Evening')}
        >
          <IconButton
            icon='weather-night' // Choose an appropriate icon name
            iconColor={'white'}
            onPress={() => setSelectedOption('Evening')}
          />
          <Text style={{ color: '#fff' }}>Evening</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.farmerDetails}>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Text style={{ color: 'red', fontFamily: 'InterB' }}>FARMER NAME: </Text>
          <Text>{farmerName}</Text>
        </View>

        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Text style={{ color: 'red', fontFamily: 'InterB' }}>FARMER ID: </Text>
          <Text>{farmerId}</Text>
        </View>

        <Text style={styles.amountRateText}>
          Total Amount: <Text style={styles.amountText}>{totalAmt}</Text> Rate:{' '}
          <Text style={styles.rateText}>{rate}</Text>
        </Text>

        <View>
          <HideWithKeyboard>
            {!isPickerShow && (
              <View style={styles.dateContainer}>
                <TouchableOpacity style={styles.button} onPress={showPicker}>
                  <Text style={{ fontFamily: 'Inter' }}>{moment(date).format('DD-MM-YYYY')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* The date picker */}
            {isPickerShow && (
              <DateTimePicker
                value={date}
                mode={'date'}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                is24Hour={true}
                onChange={onChange}
                style={styles.datePicker}
              />
            )}
          </HideWithKeyboard>
          <TextInput
            placeholderTextColor='black'
            style={styles.textInput}
            label='Quantity'
            mode='outlined'
            outlineColor='#e6e6e6'
            underlineColor='#e6e6e6'
            activeUnderlineColor='#e6e6e6'
            activeOutlineColor='#737373'
            value={qty > 0 ? qty.toString() : ''}
            onChangeText={(text) => {
              setQty(text)
              setTotalAmt((text * rate).toFixed(2))
            }}
            keyboardType='numeric'
          />

          <TextInput
            placeholderTextColor='black'
            style={styles.textInput}
            label='Fat'
            mode='outlined'
            outlineColor='#e6e6e6'
            underlineColor='#e6e6e6'
            activeUnderlineColor='#e6e6e6'
            activeOutlineColor='#737373'
            value={fat > 0 ? fat.toString() : ''}
            onChangeText={(text) => setFat(text)}
            keyboardType='numeric'
          />

          <TextInput
            placeholderTextColor='black'
            style={styles.textInput}
            label='SNF'
            mode='outlined'
            outlineColor='#e6e6e6'
            underlineColor='#e6e6e6'
            activeUnderlineColor='#e6e6e6'
            activeOutlineColor='#737373'
            value={snf > 0 ? snf.toString() : ''}
            onChangeText={(text) => setSnf(text)}
            keyboardType='numeric'
          />
        </View>

        <Button
          style={styles.button}
          icon='file'
          mode='contained'
          buttonColor='#77b300'
          onPress={() => {
            if (!isLoading) {
              updateCollection()
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Collection'}
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    top: 40,
    gap: 20,
  },
  iconButtonContainer: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  selectedOption: {
    backgroundColor: '#77b300',
  },
  farmerDetails: {
    width: '90%',
    backgroundColor: '#fff',
    borderColor: '#edebeb',
    borderWidth: 2,
    padding: 10,
  },
  button: {
    marginVertical: 5,
  },
  textInput: {
    marginVertical: 10,
    fontSize: 13,
    fontFamily: 'Inter',
  },
  amountRateText: {
    fontFamily: 'Inter',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
    backgroundColor: '#e6e6e6',
    padding: 20,
  },
  amountText: {
    color: 'blue',
  },
  rateText: {
    color: 'green',
  },
  dateContainer: {
    backgroundColor: '#fffbff',
    borderColor: '#f0eff0',
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 10,
    height: 50,
    justifyContent: 'center',
    marginTop: 10,
  },
})

export default EditCollection
