import { StatusBar } from 'expo-status-bar'
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useEffect, useState } from 'react'
import { printToFileAsync } from 'expo-print'
import { shareAsync } from 'expo-sharing'
import axios from 'axios'
import HideWithKeyboard from 'react-native-hide-with-keyboard'
import { Button } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'
import { TextInput } from 'react-native-paper'
import { URL } from '@env'
import htmlTemplate from '../utils/billTemplate'
const windowWidth = Dimensions.get('window').width


const GenerateBill = ({ route }) => {
  // details
  const [farmerId, setFarmerId] = useState(null)
  const [farmerName, setFarmerName] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [contactNumber1, setContactNumber1] = useState('')
  const [contactNumber2, setContactNumber2] = useState('')
  const [address, setAddress] = useState('')
  const [billTitle, setBillTitle] = useState('')
  const [panNumber, setPanNumber] = useState('')

  // overall calculations
  const [totalQty, setTotalQty] = useState(0)
  const [totalCredit, setTotalCredit] = useState(0)
  const [totalDebit, setTotalDebit] = useState(0)
  const [avgFat, setAvgFat] = useState(0)
  const [avgSnf, setAvgSnf] = useState(0)

  const { username } = route.params
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  const [endDate, setEndDate] = useState(new Date(Date.now()))
  const [isPickerShow1, setIsPickerShow1] = useState(false)
  const [isPickerShow2, setIsPickerShow2] = useState(false)
  const [startDateString, setStartDateString] = useState(
    `${startDate.toUTCString().split(' ').slice(1, 4).join(' ')}`
  )
  const [endDateString, setEndDateString] = useState(
    `${endDate.toUTCString().split(' ').slice(1, 4).join(' ')}`
  )
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [farmerNotFound, setFarmerNotFound] = useState(false);


  useEffect(() => {
    fetchBillDetails()
  }, [])

  const fetchBillDetails = async () => {
    try {
      const bill = await axios.get(`${URL}admin/bill`)
      setOrganizationName(bill.data.organizationName.toUpperCase())
      setContactNumber1(bill.data.contactNumber1)
      setContactNumber2(bill.data.contactNumber2)
      setAddress(bill.data.address)
      setPanNumber(bill.data.panNumber)
      setBillTitle(bill.data.billTitle)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchFarmerDetails = async () => {
    try {
      if (username) {
        const farmer = await axios.get(`${URL}admin/${username}/farmer/${farmerId}`)
        setFarmerName(farmer.data.farmerName)
      }
    } catch (error) {
      setFarmerNotFound(true); 
      console.log(error)
    }
  }
  

  const fetchLedger = async () => {
    try {
      if (username) {
        const ledger = await axios.get(
          `${URL}admin/${username}/ledger?startDate=${startDate}&endDate=${endDate}`
        )
        const ledgerArray = ledger.data.map((ledger) => [
          ledger.farmerId,
          formatDate(new Date(ledger.date)),
          ledger.shift,
          ledger.fat,
          ledger.snf,
          ledger.qty,
          ledger.credit,
          ledger.debit,
          ledger.remarks,
        ])
        setTableData(ledgerArray)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const showPicker1 = () => {
    setIsPickerShow1(true)
  }
  const showPicker2 = () => {
    setIsPickerShow2(true)
  }

  const onChangeStart = (event, date) => {
    setStartDate(date)
    const dateInStr = date.toUTCString().split(' ').slice(1, 4).join(' ')
    setStartDateString(dateInStr)
    if (Platform.OS === 'android') {
      setIsPickerShow1(false)
    }
  }

  const onChangeEnd = (event, date) => {
    setEndDate(date)
    const dateInStr = date.toUTCString().split(' ').slice(1, 4).join(' ')
    setEndDateString(dateInStr)
    if (Platform.OS === 'android') {
      setIsPickerShow2(false)
    }
  }

  const filteredTableData = tableData.filter((item) => item[0] == farmerId)

  const calculateOverall = () => {
    const qty = filteredTableData.reduce((acc, item) => {
      if (item[8] === 'Collection' && typeof item[5] === 'number') {
        return acc + item[5]
      }
      return acc
    }, 0)

    const credit = filteredTableData.reduce((acc, item) => {
      if (item[8] === 'Collection' && typeof item[6] === 'number') {
        return acc + item[6]
      }
      return acc
    }, 0)

    const debit = filteredTableData.reduce((acc, item) => {
      if (item[8] !== 'Collection' && typeof item[7] === 'number') {
        return acc + item[7]
      }
      return acc
    }, 0)

    const avgFat =
      filteredTableData.reduce((acc, item) => {
        if (item[8] === 'Collection' && typeof item[3] === 'number') {
          return acc + item[3] * item[5]
        }
        return acc
      }, 0) / qty

    const avgSnf =
      filteredTableData.reduce((acc, item) => {
        if (item[8] === 'Collection' && typeof item[4] === 'number') {
          return acc + item[4] * item[5]
        }
        return acc
      }, 0) / qty

    setTotalQty(qty.toFixed(2))
    setTotalCredit(credit.toFixed(2))
    setTotalDebit(debit.toFixed(2))
    setAvgFat(avgFat.toFixed(2))
    setAvgSnf(avgSnf.toFixed(2))
  }

  const html = htmlTemplate(
    organizationName,
    address,
    billTitle,
    panNumber,
    contactNumber1,
    contactNumber2,
    farmerId,
    farmerName,
    startDate,
    endDate,
    filteredTableData,
    avgFat,
    avgSnf,
    totalQty,
    totalCredit,
    totalDebit
  )

  const generatePdf = async () => {
    try {
      const file = await printToFileAsync({
        html: html,
        base64: false,
      })

      await shareAsync(file.uri)
    } catch (error) {
      console.log(error)
    }
  }

  const getRecord = async () => {
    try {
      setLoading(true)
      Promise.all([fetchFarmerDetails(), fetchBillDetails(), fetchLedger()]).then(() => {
        calculateOverall()
        if (!farmerNotFound) {
          generatePdf(); 
        } else {
          alert('Farmer not found');
        }
        setLoading(false)
      }).catch((err) => {
        console.log(err)
        alert('Something went wrong')
        setLoading(false)
      });
    } catch (error) {
      console.log(error)
      alert('Something went wrong')
      setLoading(false)
    }
  }
  


  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.dateContainer}>
        <View style={styles.dateWrapper}>
          <Text style={[styles.dateText, { fontSize: 16 }]}>From</Text>

          {/* <HideWithKeyboard style={styles.calender}> */}
          {!isPickerShow1 && (
            <View style={styles.btnContainer}>
              <Button mode='text' icon='calendar-today' onPress={showPicker1}>
                <Text style={{ fontSize: 16 }}>{startDateString}</Text>
              </Button>
            </View>
          )}

          {isPickerShow1 && (
            <DateTimePicker
              value={startDate}
              mode={'date'}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              is24Hour={true}
              onChange={onChangeStart}
              style={styles.datePicker}
            />
          )}
          {/* </HideWithKeyboard> */}

          <Text style={[styles.dateText, { fontSize: 16 }]}>To</Text>

          {/* <HideWithKeyboard style={styles.calender}> */}
          {!isPickerShow2 && (
            <View style={styles.btnContainer}>
              <Button mode='text' icon='calendar-today' onPress={showPicker2}>
                <Text style={{ fontSize: 16 }}>{endDateString}</Text>
              </Button>
            </View>
          )}

          {isPickerShow2 && (
            <DateTimePicker
              value={endDate}
              mode={'date'}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              is24Hour={true}
              onChange={onChangeEnd}
              style={styles.datePicker}
            />
          )}
          {/* </HideWithKeyboard> */}
        </View>
      </View>

      <ScrollView>
        <TextInput
          placeholderTextColor='black'
          value={farmerId}
          mode='outlined'
          label='Enter Farmer Id'
          style={styles.textInput}
          onChangeText={(value) => setFarmerId(value)}
        />
      </ScrollView>

      <Button style={styles.button}
        mode='contained'
        buttonColor='#6987d0'
        onPress={getRecord}
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Bill'}
      </Button>

      {/* <Button style={styles.button} mode='contained' buttonColor='#77b300' onPress={generatePdf}>
        Generate PDF
      </Button> */}

      <StatusBar style='auto' />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },

  dateText: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  datePicker: {
    width: 320,
    height: 260,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    margin: 8,
    fontFamily: 'Inter',
  },
  button: {
    padding: 5,
    margin: 10,
  },
})

export default GenerateBill
