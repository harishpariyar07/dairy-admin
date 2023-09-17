import { View, Text, StyleSheet, Platform, ScrollView, KeyboardAvoidingView, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Button, IconButton, Searchbar } from 'react-native-paper'
import { Row, Table } from 'react-native-table-component'
import HideWithKeyboard from 'react-native-hide-with-keyboard'
import { URL } from '@env'
import axios from 'axios'
import formatDate from '../utils/convertDate'
const windowWidth = Dimensions.get('window').width

const MilkReport = ({route}) => {
  // FOR DATE PICKER
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
  const [farmerData, setFarmerData] = useState([])
  const [farmerName, setFarmerName] = useState('No Farmer')
  const [farmerId, setFarmerId] = useState(null)
  const [shift, setShift] = useState("Both")
  const [loading, setLoading] = useState(false)
  const [focus, setFocus] = useState(false)
  const [totalMilk, setTotalMilk] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const {username} = route.params

  // FOR SEARCH BOX
  const [search, setSearch] = useState('')

  const [filteredTableData, setFilteredTableData] = useState([])

  // FOR TABLE
  const tableHead = [
    { label: 'Shift', flex: 0.10 },
    { label: 'Date', flex: 0.25 },
    { label: 'Qty', flex: 0.15 },
    { label: 'Fat', flex: 0.15 },
    { label: 'Snf', flex: 0.15 },
    { label: 'Amount', flex: 0.2 },
  ]

  const fetchAllFarmers = async () => {
    try {
      const res = await axios.get(`${URL}user/${username}/farmer`)
      setFarmerData(res.data)
    }
    catch(err)
    {
      console.log(err)
    }
  }

  const fetchFarmerCollections = async () => {
    try {
      setLoading(true)
      const  res = await axios.get(`${URL}user/${username}/collection/report?startDate=${startDate}&endDate=${endDate}&shift=${shift}`)

      const collectionArray = res.data.map((collection) => {
        return [
          collection.farmerId,
          collection.shift === "Morning" ? "M" : "E",
          formatDate(collection.collectionDate),
          collection.qty,
          collection.fat,
          collection.snf,
          collection.amount,
        ]
      })
      
      setTableData(collectionArray)
      setLoading(false)
    }
    catch(err)
    {
      setLoading(false)
      console.log(err)
    }
  }
  useEffect(() => {
    fetchFarmerCollections()
    fetchAllFarmers()
  }, [])

  useEffect(() => {
    fetchFarmerCollections()
  }, [startDate, endDate, shift])

  useEffect(() => {
    if (farmerId != null) {
      setFilteredTableData(tableData.filter((row) => row[0] == farmerId))
    }
  }, [farmerId, tableData])

  useEffect(() => {
    if (filteredTableData.length > 0) {
      let totalMilk = 0
      let totalAmount = 0
      filteredTableData.forEach((row) => {
        totalMilk += row[3]
        totalAmount += row[6]
      })
      setTotalMilk(totalMilk.toFixed(2))
      setTotalAmount(totalAmount.toFixed(2))
    }
  }, [filteredTableData])

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

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Searchbar
        placeholder='Search by name'
        onChangeText={(e) => {
          setSearch(e)
          if (e === '') 
          {
            setFarmerId(null)
            setFarmerName('No Farmer')
          }
        }}
        onFocus={() => setFocus(true)}
        value={search}
        style={styles.searchBar}
      />

      {focus && (
        <FlatList
        data={search !== '' && farmerData.filter(({ farmerName, farmerId}) =>
          {
            if (!isNaN(parseFloat(search))) return search == farmerId
            return farmerName.toLowerCase().startsWith(search.toLowerCase())
          }
        )}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            setFarmerId(item.farmerId)
            setFarmerName(item.farmerName)
            setSearch(item.farmerName)
            setFocus(false)
            }}
            style={styles.item}>
              <Text style={{ width: 0.2 * windowWidth, textAlign: 'center', fontWeight: 'bold' }}>
                {item.farmerId}
              </Text>
              <Text
                style={{
                  width: 0.6 * windowWidth,
                  textAlign: 'left',
                  padding: 5,
                  fontWeight: 'bold',
                }}
              >
                {item.farmerName}
              </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
      />
      )}

      {!focus && (
        <>
      <View style={styles.dateContainer}>
        <View style={styles.dateWrapper}>
          <Text style={[styles.dateText, { fontSize: 16 }]}>From</Text>

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

          <Text style={[styles.dateText, { fontSize: 16 }]}>To</Text>

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
        </View>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <Text style={{ fontSize: 20, paddingLeft: 10, color: 'black', fontWeight: 'bold' }}>
            {farmerName}
          </Text>
        </View>

        <View style={styles.iconButtonContainer}>
            <TouchableOpacity
              style={[styles.iconButton, shift === 'Morning' && styles.selectedOption]}
              onPress={() => {
                setShift('Morning')
              }}
            >
              <IconButton
                icon='weather-sunny' // Choose an appropriate icon name
                iconColor={'white'}
                onPress={() => setShift('Morning')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, shift === 'Evening' && styles.selectedOption]}
              onPress={() => setShift('Evening')}
            >
              <IconButton
                icon='weather-night' // Choose an appropriate icon name
                iconColor={'white'}
                onPress={() => setShift('Evening')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, shift === 'Both' && styles.selectedOption]}
              onPress={() => setShift('Both')}
            >
              <IconButton
                icon='cloud' // Choose an appropriate icon name
                iconColor={'white'}
                onPress={() => setShift('Both')}
              />
            </TouchableOpacity>
          </View>

      </View>


      <Row
        data={tableHead.map((header) => header.label)}
        flexArr={tableHead.map((header) => header.flex)}
        style={styles.head}
        textStyle={styles.headText}
      />

      {loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>Fetching Ledgers...</Text>
        </View>
      )}

      {!loading && search === '' && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>Please Search by Id</Text>
        </View>
      )}

      {!loading && search !== '' && filteredTableData.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>No Ledger Found</Text>
        </View>
      )}

      {!loading && search !== '' && filteredTableData.length > 0 && (
        <ScrollView
          style={[
            styles.tableContainer,
            styles.borderStyle,
            filteredTableData.length === 0 && { borderWidth: 0 },
          ]}
        >
          <Table style={styles.table}>
            {filteredTableData.map((rowData, index) => (
              <Row
                key={index}
                data={rowData.slice(1)}
                style={[styles.row, index % 2 === 1 && styles.evenRow]}
                textStyle={styles.text}
                flexArr={tableHead.map((header) => header.flex)}
              />
            ))}
          </Table>
        </ScrollView>

      )}

      <View style={{paddingHorizontal: 10}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{paddingVertical: 5, fontSize: 18, color: 'black', fontWeight: 'bold'}}>Total Milk: </Text>
          <Text style={{paddingVertical: 5, fontSize: 18, color: 'red', fontWeight: 'bold'}}>{totalMilk} ltr</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{paddingVertical: 5, fontSize: 18, color: 'black', fontWeight: 'bold'}}>Total Amount: </Text>
          <Text style={{paddingVertical: 5, fontSize: 18, color: 'red', fontWeight: 'bold'}}>Rs {totalAmount}</Text>
        </View>
      </View>
        </>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  searchBar: {
    backgroundColor: '#fff',
    borderColor: '#edebeb',
    borderWidth: 2,
    marginHorizontal: 10,
    marginTop: 5,
  },

  tableContainer: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
  },

  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#6987d0',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  iconButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  iconButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  selectedOption: {
    backgroundColor: '#77b300',
  },
  headText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'InterB',
  },
  row: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 5,
  },
  evenRow: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  firstRow: {
    borderTopWidth: 1,
  },
  text: {
    margin: 6,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter',
  },
})

export default MilkReport