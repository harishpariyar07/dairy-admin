import { View, Text, StyleSheet, Platform, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Button, Searchbar } from 'react-native-paper'
import { Row, Table } from 'react-native-table-component'
import HideWithKeyboard from 'react-native-hide-with-keyboard'
import { URL } from '@env'
import axios from 'axios'

function formatDate(date) {
  const formattedDate = new Date(date)
  const year = formattedDate.getFullYear()
  const month = String(formattedDate.getMonth() + 1).padStart(2, '0')
  const day = String(formattedDate.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

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

  // FOR SEARCH BOX
  const [search, setSearch] = useState('')

  // FOR TABLE
  const tableHead = [
    { label: 'Id', flex: 0.1 },
    { label: 'Date', flex: 0.25 },
    { label: 'Credit', flex: 0.2 },
    { label: 'Debit', flex: 0.2 },
    { label: 'Remarks', flex: 0.25 },
  ]

  const { username } = route.params

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        if (username) {
          const ledger = await axios.get(
            `${URL}admin/${username}/ledger?startDate=${startDate}&endDate=${endDate}`
          )
          const ledgerArray = ledger.data.map((ledger) => [
            ledger.farmerId,
            formatDate(ledger.date),
            ledger.credit,
            ledger.debit,
            ledger.remarks,
          ])

          setTableData(ledgerArray)
          setFilteredTableData(ledgerArray)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchLedger()
  }, [startDate, endDate])

  const [filteredTableData, setFilteredTableData] = useState([])

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

      <View style={styles.tableContainer}>
        <Row
          data={tableHead.map((header) => header.label)}
          flexArr={tableHead.map((header) => header.flex)}
          style={styles.head}
          textStyle={styles.headText}
        />
        <ScrollView>
          <Table style={styles.table}>
            {(search === '' ? tableData : filteredTableData).map((rowData, index) => (
              <Row
                key={index}
                data={rowData}
                style={[
                  styles.row,
                  index % 2 === 0 && styles.evenRow,
                  index === 0 && styles.firstRow,
                ]}
                textStyle={styles.text}
                flexArr={tableHead.map((header) => header.flex)}
              />
            ))}
          </Table>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    margin: 10,
    backgroundColor: '#fff',
    borderColor: '#edebeb',
    borderWidth: 2,
  },

  tableContainer: {
    flex: 1,
  },

  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#6987d0',
    padding: 15,
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
    backgroundColor: '#f9f9f9',
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

export default Ledger
