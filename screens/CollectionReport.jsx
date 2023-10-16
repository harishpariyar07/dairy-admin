import { View, Text, StyleSheet, Platform, ScrollView, KeyboardAvoidingView, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Button, Searchbar } from 'react-native-paper'
import { Row, Table } from 'react-native-table-component'
import URL from '../constants/ServerUrl'
import axios from 'axios'
import formatDate from '../utils/convertDate'
const windowWidth = Dimensions.get('window').width
import { FlashList } from "@shopify/flash-list";

const CollectionReport = ({route}) => {
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
  const [userData, setUserData] = useState([])
  const [username, setUsername] = useState('No User')
  const [shift, setShift] = useState("Both")
  const [loading, setLoading] = useState(false)
  const [focus, setFocus] = useState(false)

  // FOR SEARCH BOX
  const [search, setSearch] = useState('')

  const [filteredTableData, setFilteredTableData] = useState([])

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [prevStartDate, setPrevStartDate] = useState(startDate);
  const [prevEndDate, setPrevEndDate] = useState(endDate);
  const [prevShift, setPrevShift] = useState(shift);

  // Create a debounce function
  const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, delay);
    };
  };

  // Function to handle search changes after debouncing
  const handleSearchDebounced = useCallback(
    debounce((searchValue) => {
      setDebouncedSearch(searchValue);
      if (searchValue === '') {
        setUsername("No User");
      }
    }, 300), // Adjust the debounce delay as needed
    []
  );

  // Trigger API requests when debouncedSearch changes
  useEffect(() => {
    handleSearchDebounced(search); // Update the debounced value
  }, [search, handleSearchDebounced]);

  // FOR TABLE
  const tableHead = useMemo(() => [
    { label: 'Shift', flex: 0.10 },
    { label: 'Date', flex: 0.25 },
    { label: 'Qty', flex: 0.15 },
    { label: 'Fat', flex: 0.15 },
    { label: 'Snf', flex: 0.15 },
    { label: 'Amount', flex: 0.2 },
  ], [])

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${URL}user`)
      setUserData(res.data)
    }
    catch(err)
    {
      console.log(err)
    }
  }

  const fetchUserCollections = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${URL}admin/collection/report?startDate=${startDate}&endDate=${endDate}&shift=${shift}`)

      const collectionArray = res.data.map((collection) => {
        return [
          collection?.userId,
          collection?.username,
          collection?.shift === "Morning" ? "M" : "E",
          formatDate(collection.date),
          collection?.totalMilk.toFixed(2),
          collection?.avgFat.toFixed(2),
          collection?.avgSNF.toFixed(2),
          collection?.totalAmount.toFixed(2),
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
    // fetchUserCollections()
    fetchAllUsers()
  }, [])

  useEffect(() => {
    // Define a flag to check if any of the relevant state values have changed
    const shouldFetchData =
      debouncedSearch !== search ||
      startDate !== prevStartDate ||
      endDate !== prevEndDate ||
      shift !== prevShift;
  
    if (shouldFetchData) {
      // Update the previous state values
      setPrevStartDate(startDate);
      setPrevEndDate(endDate);
      setPrevShift(shift);
  
      // Make the API request only if necessary
      fetchUserCollections();
    }
  }, [debouncedSearch, startDate, endDate, shift, search, prevStartDate, prevEndDate, prevShift]);
  

  useEffect(() => {
    if (username != null) {
      setFilteredTableData(tableData.filter((row) => row[1] == username))
    }
  }, [username, tableData])

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
          handleSearchDebounced(e); // Debounce the search input
          if (e === '') 
          {
            setUsername(null)
          }
        }}
        onFocus={() => setFocus(true)}
        value={search}
        style={styles.searchBar}
      />

      {focus && (
      //   <FlatList
      //   data={search !== '' && userData.filter(({ username, userId}) =>
      //     {
      //       if (!isNaN(parseFloat(search))) return search == userId
      //       return username.toLowerCase().startsWith(search.toLowerCase())
      //     }
      //   )}
      //   renderItem={({ item }) => (
      //     <TouchableOpacity onPress={() => {
      //       setUsername(item.username)
      //       setSearch(item.username)
      //       setFocus(false)
      //       }}
      //       style={styles.item}>
      //         <Text style={{ width: 0.2 * windowWidth, textAlign: 'center', fontWeight: 'bold' }}>
      //           {item.userId}
      //         </Text>
      //         <Text
      //           style={{
      //             width: 0.6 * windowWidth,
      //             textAlign: 'left',
      //             padding: 5,
      //             fontWeight: 'bold',
      //           }}
      //         >
      //           {item.username}
      //         </Text>
      //     </TouchableOpacity>
      //   )}
      //   keyExtractor={(item) => item._id}
      //   initialNumToRender={10}
      //   windowSize={21}
      // />

        <FlashList
            data={search !== '' && userData.filter(({ username, userId}) =>
              {
                if (!isNaN(parseFloat(search))) return search == userId
                return username.toLowerCase().startsWith(search.toLowerCase())
              }
            )}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                setUsername(item.username)
                setSearch(item.username)
                setFocus(false)
                }}
                style={styles.item}>
                  <Text style={{ width: 0.2 * windowWidth, textAlign: 'center', fontWeight: 'bold' }}>
                    {item.userId}
                  </Text>
                  <Text
                    style={{
                      width: 0.6 * windowWidth,
                      textAlign: 'left',
                      padding: 5,
                      fontWeight: 'bold',
                    }}
                  >
                    {item.username}
                  </Text>
              </TouchableOpacity>
            )}
            estimatedItemSize={69}
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

      

      <View>
        <Text style={{ fontSize: 20, paddingLeft: 10, color: 'black', fontWeight: 'bold' }}>
          {username}
        </Text>
      </View>

      <Row
        data={tableHead.map((header) => header.label)}
        flexArr={tableHead.map((header) => header.flex)}
        style={styles.head}
        textStyle={styles.headText}
      />

      {loading &&  (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>Fetching Collections...</Text>
        </View>
      )}

      {!loading && search === '' && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>Please Search by Id</Text>
        </View>
      )}

      {!loading && search !== '' && filteredTableData.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>No Collections Found</Text>
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
    backgroundColor: '#059c11',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  borderStyle: {
    // borderLeftWidth: 2,
    // borderRightWidth: 2,
    // borderBottomWidth: 2,
    // borderColor: '#6987d0',
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

export default CollectionReport