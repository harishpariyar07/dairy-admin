import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native'
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
  const [startDate, setStartDate] = useState(new Date(Date.now()))
  const [endDate, setEndDate] = useState(new Date(Date.now()))
  const [isPickerShow1, setIsPickerShow1] = useState(false)
  const [isPickerShow2, setIsPickerShow2] = useState(false)
  const [startDateString, setStartDateString] = useState('Select date')
  const [endDateString, setEndDateString] = useState('Select date')
  const [tableData, setTableData] = useState([])

  // FOR SEARCH BOX
  const [search, setSearch] = useState('')

  // FOR TABLE
  const tableHead = [
    { label: 'Id', flex: 1 },
    { label: 'Date', flex: 1 },
    { label: 'Credit', flex: 1 },
    { label: 'Debit', flex: 1 },
    { label: 'Remarks', flex: 1 },
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
    <SafeAreaView style={styles.container}>
      <View style={styles.dateContainer}>
        <View style={styles.dateWrapper}>
          <Text style={styles.dateText}>From</Text>

          <HideWithKeyboard style={styles.calender}>
            {!isPickerShow1 && (
              <View style={styles.btnContainer}>
                <Button
                  mode='text'
                  icon='calendar-today'
                  style={styles.button}
                  onPress={showPicker1}
                >
                  <Text>{startDateString}</Text>
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
          </HideWithKeyboard>

          <Text style={styles.dateText}>To</Text>

          <HideWithKeyboard style={styles.calender}>
            {!isPickerShow2 && (
              <View style={styles.btnContainer}>
                <Button
                  mode='text'
                  icon='calendar-today'
                  style={styles.button}
                  onPress={showPicker2}
                >
                  <Text>{endDateString}</Text>
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
          </HideWithKeyboard>
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
      />

      <View style={styles.tableContainer}>
        <ScrollView>
          <Table style={styles.table}>
            <Row
              data={tableHead.map((header) => header.label)}
              flexArr={tableHead.map((header) => header.flex)}
              style={styles.head}
              textStyle={styles.headText}
            />
            {filteredTableData &&
              filteredTableData.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  style={[
                    styles.row,
                    index % 2 === 0 && styles.evenRow,
                    index === 0 && styles.firstRow,
                  ]}
                  textStyle={styles.text}
                  widthArr={tableHead.map((header) => header.width)}
                />
              ))}
          </Table>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
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
    height: 30,
    backgroundColor: '#6987d0',
  },
  headText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'InterB',
  },
  row: {
    height: 45,
    borderBottomWidth: 1,
    borderColor: '#ccc',
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
