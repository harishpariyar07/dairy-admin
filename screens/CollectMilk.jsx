import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Button, IconButton, MD3Colors, Searchbar } from 'react-native-paper'
import { Table, Row } from 'react-native-table-component'
import DateTimePicker from '@react-native-community/datetimepicker'
import HideWithKeyboard from 'react-native-hide-with-keyboard'
import { SafeAreaView } from 'react-native'
import { URL } from '@env'
import axios from 'axios'

const windowWidth = Dimensions.get('window').width

const tableHead = [
  { label: '#', width: 0.1 * windowWidth },
  { label: 'Id', width: 0.1 * windowWidth },
  { label: 'Name', width: 0.3 * windowWidth },
  { label: 'Qty', width: 0.1 * windowWidth },
  { label: 'Fat', width: 0.1 * windowWidth },
  { label: 'Snf', width: 0.1 * windowWidth },
  { label: 'Amt', width: 0.2 * windowWidth },
]

const tableHeadWidthArr = tableHead.map((header) => header.width)

const CollectMilk = ({ route }) => {
  const [isPickerShow, setIsPickerShow] = useState(false)
  const [date, setDate] = useState(new Date(Date.now()))
  const [dateString, setDateString] = useState(
    `${date.toUTCString().split(' ').slice(1, 4).join(' ')}`
  )
  const [tableData, setTableDate] = useState([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigator = useNavigation()
  const { username } = route.params
  const [selectedOption, setSelectedOption] = useState(date.getTime() < 12 ? 'Morning' : 'Evening')

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        if (username) {
          setIsLoading(true)
          const collections = await axios.get(
            `${URL}admin/${username}/collection?date=${date}&shift=${selectedOption}`
          )
          setTableDate(collections.data)
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
        console.log(error)
      }
    }

    fetchCollections()
  }, [date, selectedOption])

  const showPicker = () => {
    setIsPickerShow(true)
  }

  const onChange = (event, value) => {
    setDate(value)
    const dateInStr = date.toUTCString().split(' ').slice(1, 4).join(' ')
    setDateString(dateInStr)
    if (Platform.OS === 'android') {
      setTimeout(() => setIsPickerShow(false), 200)
    }
  }

  // just to avoid error caused by unserialized date object
  const navigateToAddCollection = () => {
    const dateStringToPass = date.toISOString()
    navigator.navigate('AddCollection', {
      dateString: dateStringToPass,
      username: username,
      shift: selectedOption,
    })
  }

  const Item = ({ farmerName, farmerId, qty, rate, fat, snf, amount, id }) => (
    <View style={styles.item}>
      <IconButton
        icon='pencil'
        iconColor={MD3Colors.error50}
        size={20}
        style={{ width: 0.08 * windowWidth }}
        onPress={() => {
          const dateStringToPass = date.toISOString()
          navigator.navigate('EditCollection', {
            id,
            username,
            farmerId,
            farmerName,
            qty,
            fat,
            snf,
            amount,
            rate,
            shift: selectedOption,
            dateInStr: dateStringToPass,
          })
        }}
      />
      <Text style={{ width: 0.1 * windowWidth, textAlign: 'center' }}>{farmerId}</Text>
      <Text style={{ width: 0.3 * windowWidth, textAlign: 'center', padding: 5 }}>
        {farmerName}
      </Text>
      <Text style={{ width: 0.1 * windowWidth, textAlign: 'center' }}>{qty}</Text>
      <Text style={{ width: 0.1 * windowWidth, textAlign: 'center' }}>{fat}</Text>
      <Text style={{ width: 0.1 * windowWidth, textAlign: 'center' }}>{snf}</Text>
      <Text style={{ width: 0.2 * windowWidth, textAlign: 'center' }}>{amount}</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container1}>
        <Searchbar
          placeholder='Search by name'
          onChangeText={(e) => {
            setSearch(e)
          }}
          value={search}
          style={styles.searchBar}
        />
      </View>

      <View style={styles.upperContainer}>
        <View style={styles.calender}>
          {/* The button that used to trigger the date picker */}
          {!isPickerShow && (
            <View style={styles.btnContainer}>
              <Button
                mode='text'
                icon='calendar-today'
                style={styles.buttonPicker}
                onPress={showPicker}
              >
                <Text style={{ fontSize: 16 }}>{dateString}</Text>
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
        </View>

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
      </View>

      <View style={styles.container2}>
        <Row
          data={tableHead.map((header) => header.label)}
          widthArr={tableHeadWidthArr}
          style={styles.head}
          textStyle={{ ...styles.headText }}
          text
        />

        {isLoading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>Loading Collections...</Text>
          </View>
        )}

        {isLoading === false && tableData.length === 0 && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>No Collections Found</Text>
          </View>
        )}

        {isLoading === false && tableData.length > 0 && (
          <FlatList
            data={tableData.filter(({ farmerName }) =>
              farmerName.toLowerCase().includes(search.toLowerCase())
            )}
            renderItem={({ item }) => (
              <Item
                farmerId={item.farmerId}
                farmerName={item.farmerName}
                qty={item.qty}
                fat={item.fat}
                snf={item.snf}
                amount={item.amount}
                id={item._id}
                rate={item.rate}
              />
            )}
            keyExtractor={(item) => item._id}
          />
        )}
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
    justifyContent: 'space-between',
  },
  upperContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  iconButtonContainer: {
    flex: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calender: {
    flex: 0.4,
    paddingLeft: 10,
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
  head: {
    backgroundColor: '#6987d0',
    padding: 15,
  },
  headText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'InterB',
  },
  item: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    margin: 6,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter',
  },
  buttonPicker: {
    width: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '90%',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    width: '90%',
    backgroundColor: '#fff',
    borderColor: '#edebeb',
    borderWidth: 2,
  },
  container1: {
    width: '100%',
    margin: 10,
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
    flex: 8,
    width: windowWidth,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 20,
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
