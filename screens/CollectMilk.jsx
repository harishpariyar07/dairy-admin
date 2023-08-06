import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Button, Searchbar } from 'react-native-paper'
import { Table, Row } from 'react-native-table-component'
import DateTimePicker from '@react-native-community/datetimepicker'
import HideWithKeyboard from 'react-native-hide-with-keyboard'
import { SafeAreaView } from 'react-native'
import { URL } from '@env'
import axios from 'axios'

const windowWidth = Dimensions.get('window').width

const tableHead = [
  { label: 'Name', width: 0.4 * windowWidth },
  { label: 'Id', width: 0.12 * windowWidth },
  { label: 'Qty', width: 0.12 * windowWidth },
  { label: 'Fat', width: 0.12 * windowWidth },
  { label: 'Snf', width: 0.12 * windowWidth },
  { label: 'Amt', width: 0.12 * windowWidth },
]

const tableHeadWidthArr = tableHead.map((header) => header.width)

const CollectMilk = ({ route }) => {
  const [isPickerShow, setIsPickerShow] = useState(false)
  const [date, setDate] = useState(new Date(Date.now()))
  const [dateString, setDateString] = useState('Select Date')
  const [tableData, setTableDate] = useState([])
  const [search, setSearch] = useState('')
  const [filteredTableData, setFilteredTableData] = useState([])
  const navigator = useNavigation()
  const { username } = route.params

  useLayoutEffect(() => {
    navigator.setOptions({ headerShown: false })
  }, [navigator])

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        if (username) {
          const collections = await axios.get(`${URL}admin/${username}/collection?date=${date}`)
          const collectionsArray = collections.data.map((collection) => {
            return [
              collection.farmerName,
              collection.farmerId,
              collection.qty,
              collection.fat,
              collection.snf,
              collection.amount,
            ]
          })

          setTableDate(collectionsArray)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchCollections()
  }, [date])

  const showPicker = () => {
    setIsPickerShow(true)
  }

  const onChange = (event, value) => {
    setDate(value)
    const dateInStr = date.toUTCString().split(' ').slice(1, 4).join(' ')
    setDateString(dateInStr)
    if (Platform.OS === 'android') {
      setIsPickerShow(false)
    }
  }

  // just to avoid error caused by unserialized date object
  const navigateToAddCollection = () => {
    const dateStringToPass = date.toISOString()
    navigator.navigate('AddCollection', { dateString: dateStringToPass, username: username })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container1}>
        <Searchbar
          placeholder='Search by name'
          onChangeText={(e) => {
            setSearch(e)
            setFilteredTableData(
              tableData.filter((row) => row[1].toLowerCase().includes(e.toLowerCase()))
            )
          }}
          value={search}
          style={styles.searchBar}
        />
      </View>

      <HideWithKeyboard style={styles.calender}>
        {/* The button that used to trigger the date picker */}
        {!isPickerShow && (
          <View style={styles.btnContainer}>
            <Button mode='text' icon='calendar-today' style={styles.button} onPress={showPicker}>
              <Text>{dateString}</Text>
            </Button>
          </View>
        )}

        {/* The date picker */}
        {isPickerShow && (
          <DateTimePicker
            value={date}
            mode={'date'}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={false}
            onChange={onChange}
            style={styles.datePicker}
          />
        )}
      </HideWithKeyboard>

      <View style={styles.container2}>
        <ScrollView>
          <Table style={styles.table}>
            <Row
              data={tableHead.map((header) => header.label)}
              widthArr={tableHeadWidthArr}
              style={styles.head}
              textStyle={{ ...styles.headText }}
              text
            />

            {tableData.map((rowData, index) => (
              <Row
                key={index}
                data={rowData}
                style={[
                  styles.row,
                  index % 2 === 0 && styles.evenRow,
                  index === 0 && styles.firstRow,
                ]}
                textStyle={{ ...styles.text }}
                widthArr={tableHeadWidthArr}
              />
            ))}
          </Table>
        </ScrollView>
      </View>

      <HideWithKeyboard style={styles.container3}>
        <Button
          icon='plus'
          mode='contained'
          style={styles.button}
          buttonColor='#77b300'
          onPress={() => navigateToAddCollection()}
        >
          Add Collection
        </Button>
      </HideWithKeyboard>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 12,
    fontFamily: 'InterB',
  },
  row: {
    height: 60,
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
  button: {
    width: '90%',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: '90%',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    margin: 10,
    backgroundColor: '#fff',
    borderColor: '#edebeb',
    borderWidth: 2,
  },
  container1: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container3: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
    gap: 10,
  },
  container2: {
    flex: 3.8,
    width: windowWidth,
    top: 10,
  },
  calender: {
    flex: 0.3,
    alignItems: 'center',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 40,
  },
  // This only works on iOS
  datePicker: {
    width: 320,
    height: 260,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
})

export default CollectMilk
