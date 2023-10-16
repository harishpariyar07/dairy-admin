import { View, Text, StyleSheet, Platform, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Button, Searchbar } from 'react-native-paper'
import { Row, Table } from 'react-native-table-component'
import URL from '../constants/ServerUrl'
import axios from 'axios'
import formatDate from '../utils/convertDate'

const Ledger = ({ route }) => {
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
  const [farmersMap, setFarmersMap] = useState({})
  const [farmerName, setFarmerName] = useState('No Farmer')
  const [remainingBalance, setRemainingBalance] = useState(0)
  const [previousBalanceRow, setPreviousBalanceRow] = useState(['Prev Balance', 0, 0, 'Purano Baki'])
  const [loading, setLoading] = useState(false)

  // FOR SEARCH BOX
  const [search, setSearch] = useState('')

  const [filteredTableData, setFilteredTableData] = useState([])

  // FOR TABLE
  const tableHead = React.useMemo(() => [
    { label: 'Date', flex: 0.25 },
    { label: 'Credit', flex: 0.25 },
    { label: 'Debit', flex: 0.25 },
    { label: 'Remarks', flex: 0.25 },
  ], [])

  const { username } = route.params

  const fetchAllFarmers = async () => {
    try {
      if (username) {
        const farmers = await axios.get(`${URL}admin/${username}/farmer`)
        const farmersArray = farmers.data.map((farmer) => ({
          farmerName: farmer.farmerName,
          farmerId: farmer.farmerId,
        }))

        const farmersMap = farmersArray.reduce((acc, farmer) => {
          acc[farmer.farmerId] = farmer.farmerName
          return acc
        }, {})
        setFarmersMap(farmersMap)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    try {
      if (username) {
        fetchAllFarmers()
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    if (filteredTableData.length > 0)
    {
      const newPreviousBalanceRow = previousBalanceRow
      const currentBalance = filteredTableData.slice(0).reduce((acc, item) => acc + item[3], 0);
      const totalBalance = currentBalance + filteredTableData[0][1]

      if (filteredTableData[0][1] >= 0) newPreviousBalanceRow[1] = filteredTableData[0][1]
      else newPreviousBalanceRow[1] = 0
      if (filteredTableData[0][1] < 0) newPreviousBalanceRow[2] = filteredTableData[0][1]
      else newPreviousBalanceRow[2] = 0

      setPreviousBalanceRow(newPreviousBalanceRow)
      setRemainingBalance(totalBalance)
    }
    else
    {
      makePreviousBalanceZero()
    }
  }, [filteredTableData])

  useEffect(() => {
    if (search !== '') {
      fetchLedger()

      if (farmersMap[search - '0']) {
        setFarmerName(farmersMap[search - '0'])
        // fetchBalances(search - '0')
      }
      else
      {
        makePreviousBalanceZero()
      }
    }
    else
    {
      makePreviousBalanceZero()
    }

  }, [search, startDate, endDate])

  useEffect(() => {
    setFilteredTableData(tableData.filter((row) => row[0] == search));
  }, [tableData])

  const fetchLedger = async () => {
    try {
      if (username) {
        setLoading(true)
        const ledger = await axios.get(
          `${URL}admin/${username}/ledger?startDate=${startDate}&endDate=${endDate}`
        )
        const ledgerArray = ledger.data.map((ledger) => [
          ledger.farmerId,
          ledger.previousBalance,
          formatDate(ledger.date),
          ledger.credit,
          ledger.debit,
          ledger.remarks,
        ])
        setLoading(false)
        setTableData(ledgerArray)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const makePreviousBalanceZero = () => {
      setFarmerName('No Farmer')
      setRemainingBalance(0)
      const newPreviousBalanceRow = previousBalanceRow
      newPreviousBalanceRow[1] = 0
      newPreviousBalanceRow[2] = 0
      setPreviousBalanceRow(newPreviousBalanceRow)
      setRemainingBalance(0)
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

  return (
    <KeyboardAvoidingView style={styles.container}>
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

      <Searchbar
        placeholder='Search by id'
        onChangeText={(e) => {
          setSearch(e)
          setFilteredTableData(tableData.filter((row) => row[0] == e))
        }}
        value={search}
        style={styles.searchBar}
        keyboardType='numeric'
      />

      <View>
        <Text style={{ fontSize: 20, paddingLeft: 10, color: 'black', fontWeight: 'bold' }}>
          {farmerName}
        </Text>
      </View>

      <Row
        data={tableHead.map((header) => header.label)}
        flexArr={tableHead.map((header) => header.flex)}
        style={styles.head}
        textStyle={styles.headText}
      />

      <Row
        data={previousBalanceRow}
        style={[
          styles.row,
          styles.evenRow,
          { marginHorizontal: 10 },
        ]}
        textStyle={styles.text}
        flexArr={tableHead.map((header) => header.flex)}
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
                data={rowData.slice(2)}
                style={[styles.row, index % 2 === 1 && styles.evenRow]}
                textStyle={styles.text}
                flexArr={tableHead.map((header) => header.flex)}
              />
            ))}
          </Table>
        </ScrollView>
      )}

      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>Remaining Balance</Text>
        <Text style={styles.bottomBalanceText}>रु॰ {remainingBalance}</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#A7BEAE',
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
    marginLeft: 10,
    marginRight: 10,
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
      backgroundColor: '#059c11',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
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

  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },

  bottomText: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  bottomBalanceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
})

export default Ledger
