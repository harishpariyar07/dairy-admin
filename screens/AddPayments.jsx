import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList, Dimensions } from 'react-native'
import { Searchbar, Button, TextInput } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native'
import moment from 'moment/moment'
import axios from 'axios'
import { URL } from '@env'
import HideWithKeyboard from 'react-native-hide-with-keyboard'
const windowWidth = Dimensions.get('window').width

const AddPayments = ({ route }) => {
  const navigator = useNavigation()
  const [isPickerShow, setIsPickerShow] = useState(false)
  const [date, setDate] = useState(new Date(Date.now()))
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [amountToPay, setAmountToPay] = useState(null)
  const [remarks, setRemarks] = useState('')
  const { username } = route.params
  const [isLoading, setIsLoading] = useState(false)
  const [focus, setFocus] = useState(false)

  const showPicker = () => {
    setIsPickerShow(true)
  }

  const onChange = (event, value) => {
    setDate(value)
    if (Platform.OS === 'android') {
      setIsPickerShow(false)
    }
  }

  useEffect(() => {
    const fetchAllFarmers = async () => {
      try {
        if (username) {
          const farmers = await axios.get(`${URL}admin/${username}/farmer`)
          const farmersArray = farmers.data.map((farmer) => ({
            farmerName: farmer.farmerName,
            farmerId: farmer.farmerId,
            balance: farmer.credit - farmer.debit,
          }))
          setData(farmersArray)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchAllFarmers()
  }, [])

  const addPayment = async (farmerId) => {
    try {
      if (username && amountToPay !== 0) {
        setIsLoading(true)
        await axios.post(`${URL}admin/${username}/payment`, {
          farmerId,
          date,
          amountToPay,
          remarks,
        })

        setAmountToPay(0)
        setRemarks('')
        setIsLoading(false)
        alert('Payment added successfully')
      }
    } catch (error) {
      navigator.goBack()
      console.log(error)
    }
  }

  const Farmer = ({ farmerName, farmerId }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setSearch(String(farmerName))
        setFilteredData(data.filter((item) => item.farmerId == farmerId))
        setFocus(false)
      }}
    >
      <Text style={{ width: 0.2 * windowWidth, textAlign: 'center', fontWeight: 'bold' }}>
        {farmerId}
      </Text>
      <Text
        style={{
          width: 0.6 * windowWidth,
          textAlign: 'left',
          padding: 5,
          fontWeight: 'bold',
        }}
      >
        {farmerName}
      </Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        style={styles.search}
        placeholder='Search by Farmer ID or Name'
        onChangeText={(text) => {
          setSearch(text)
          setAmountToPay(0)
          setRemarks('')
          if (text === '') {
            setFilteredData([])
          }
        }}
        onFocus={() => setFocus(true)}
        value={search}
      />

      {!focus && filteredData.length > 0 && search !== '' && (
        filteredData.map((item, index) => (
          <View style={styles.farmerDetails} key={index}>
            <View style={{ flexDirection: 'row', padding: 5 }}>
              <Text style={{ color: 'red', fontFamily: 'InterB' }}>FARMER NAME: </Text>
              <Text style={{ fontSize: 15 }}>{item.farmerName}</Text>
            </View>

            <View style={{ flexDirection: 'row', padding: 5 }}>
              <Text style={{ color: 'red', fontFamily: 'InterB' }}>FARMER ID: </Text>
              <Text style={{ fontSize: 15 }}>{item.farmerId}</Text>
            </View>

            <View style={{ flexDirection: 'row', padding: 5 }}>
              <Text style={{ color: 'red', fontFamily: 'InterB' }}>BALANCE: </Text>
              <Text style={{ fontSize: 15 }}> ₹ {item.balance}</Text>
            </View>

            <View>
              <HideWithKeyboard>
                {!isPickerShow && (
                  <View style={styles.dateContainer}>
                    <TouchableOpacity style={styles.button} onPress={showPicker}>
                      <Text style={{ fontFamily: 'Inter' }}>
                        {moment(date).format('DD-MM-YYYY')}
                      </Text>
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
                label='Amount to Pay'
                mode='outlined'
                outlineColor='#e6e6e6'
                underlineColor='#e6e6e6'
                activeUnderlineColor='#e6e6e6'
                activeOutlineColor='#737373'
                value={amountToPay > 0 ? amountToPay.toString() : ''}
                onChangeText={(text) => setAmountToPay(text)}
                keyboardType='numeric'
              />

              <TextInput
                placeholderTextColor='black'
                style={[styles.textInput]}
                label='Remarks'
                mode='outlined'
                outlineColor='#e6e6e6'
                underlineColor='#e6e6e6'
                activeUnderlineColor='#e6e6e6'
                activeOutlineColor='#737373'
                dense={true}
                multiline={true}
                value={remarks}
                onChangeText={(text) => setRemarks(text)}
              />
            </View>

            <View style={styles.btnCnt}>
              <Button
                style={styles.button}
                mode='contained'
                buttonColor='#77b300'
                disabled={isLoading}
                onPress={() => addPayment(item.farmerId)}
              >
                {isLoading ? 'Paying...' : 'Pay'}
              </Button>
            </View>
          </View>
        )))}

      {focus && filteredData.length === 0 && search !== '' && 
        (<View>
            <FlatList
              data={data.filter(({ farmerName, farmerId }) =>
              {
                if (!isNaN(parseFloat(search))) return search == farmerId
                return farmerName.toLowerCase().startsWith(search.toLowerCase())
              }
              )}
              renderItem={({ item }) => (
                <Farmer farmerId={item.farmerId} farmerName={item.farmerName} id={item._id} />
              )}
              keyExtractor={(item) => item._id}
              key={(item) => item._id}
            />
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    top: 10,
    gap: 20,
  },
  search: {
    width: '90%',
    backgroundColor: '#fff',
    borderColor: '#edebeb',
    borderWidth: 2,
  },
  farmerDetails: {
    width: '90%',
    backgroundColor: '#fff',
    borderColor: '#edebeb',
    borderWidth: 2,
    padding: 10,
  },
  calender: {
    flex: 0.3,
    alignItems: 'center',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 40,
  },
  btnCnt: {
    marginVertical: 10,
    gap: 10,
  },
  textInput: {
    marginVertical: 10,
    fontSize: 13,
    fontFamily: 'Inter',
  },
  rateText: {
    color: 'green',
  },
  longTextInput: {
    height: 50,
    alignItems: 'flex-start',
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
  item: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
})

export default AddPayments
