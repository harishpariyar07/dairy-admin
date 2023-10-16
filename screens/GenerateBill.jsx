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
import { htmlTemplate, htmlTemplateShort } from '../utils/billTemplate'
import RenderHtml from 'react-native-render-html';
import { TouchableOpacity } from 'react-native-web'


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
  const [htmlData, setHtmlData] = useState('')

  // overall calculations
  const [TOTALQty, setTotalQty] = useState(0)
  const [TOTALCredit, setTotalCredit] = useState(0)
  const [TOTALDebit, setTotalDebit] = useState(0)
  const [AVGFat, setAvgFat] = useState(0)
  const [AVGSnf, setAvgSnf] = useState(0)

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

  useEffect(() => {
    calculateOverall();
  }, [tableData]);


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
    const totalQty = filteredTableData.reduce((acc, item) => {
      if (item[8] === 'Collection' && typeof item[5] === 'number') {
        return acc + item[5]
      }
      return acc
    }, 0)

    const totalCredit = filteredTableData.reduce((acc, item) => {
      if (item[8] === 'Collection' && typeof item[6] === 'number') {
        return acc + item[6]
      }
      return acc
    }, 0)

    const totalDebit = filteredTableData.reduce((acc, item) => {
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
      }, 0) / totalQty

    const avgSnf =
      filteredTableData.reduce((acc, item) => {
        if (item[8] === 'Collection' && typeof item[4] === 'number') {
          return acc + item[4] * item[5]
        }
        return acc
      }, 0) / totalQty

    setTotalQty(totalQty)
    setTotalCredit(totalCredit)
    setTotalDebit(totalDebit)
    setAvgFat(avgFat)
    setAvgSnf(avgSnf)

    setHtmlData(htmlTemplateShort(
      farmerId,
      farmerName,
      startDate,
      endDate,
      filteredTableData,
      avgFat.toFixed(2),
      avgSnf.toFixed(2),
      totalQty.toFixed(2),
      totalCredit.toFixed(2),
      totalDebit.toFixed(2),
    ))

  }

  const generatePdf = async () => {

    calculateOverall();

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
      AVGFat.toFixed(2),
      AVGSnf.toFixed(2),
      TOTALQty.toFixed(2),
      TOTALCredit.toFixed(2),
      TOTALDebit.toFixed(2),
    )

    const file = await printToFileAsync({
      html: html,
      base64: false,
    })

    await shareAsync(file.uri)
  }

  const getRecord = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchFarmerDetails(),
        fetchBillDetails(),
        fetchLedger()
      ]);
      if (farmerNotFound) {
        alert('Farmer not found');
      }
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };




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

        <ScrollView>
          {filteredTableData.length > 0 ? (
            <View>
              <ScrollView
                style={{
                  borderWidth: 1,
                  borderColor: 'black',
                  margin: 10,
                  padding: 10,
                  marginBottom: 0,
                  backgroundColor: '#fff',
                }}
              >
                <RenderHtml
                  width={windowWidth}
                  source={{ html: htmlData }}
                />
              </ScrollView>

              {/* Add a "Print" button here */}
              <Button
                mode="text"
                icon={'printer'}
                onPress={generatePdf}
                disabled={loading}
                style={{ 
                  alignSelf: 'flex-end',
                }}
              >
                {loading ? 'Generating PDF...' : 'Print PDF'}
              </Button>
            </View>
          ) : (
            <View>
              <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>No Record</Text>
            </View>
          )}
        </ScrollView>


      </ScrollView>





      <Button style={styles.button}
        mode='contained'
        buttonColor='#059c11'
        onPress={getRecord}
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Fetching...' : 'Fetch Data'}
      </Button>

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
































