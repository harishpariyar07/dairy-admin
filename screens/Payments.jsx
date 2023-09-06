import React, { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform, FlatList } from 'react-native';
import { Button, Searchbar } from 'react-native-paper'; 
import { Row } from 'react-native-table-component';
import DateTimePicker from '@react-native-community/datetimepicker';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { SafeAreaView } from 'react-native';
import { URL } from '@env';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;

const tableHead = [
  { label: 'Date', width: 0.2 * windowWidth },
  { label: 'Id', width: 0.1 * windowWidth },
  { label: 'Name', width: 0.3 * windowWidth },
  { label: 'Amt', width: 0.1 * windowWidth },
  { label: 'Remarks', width: 0.3 * windowWidth }
];

const tableHeadWidthArr = tableHead.map((header) => header.width);

const Payments = ({ route }) => {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const [isPickerShow1, setIsPickerShow1] = useState(false);
  const [isPickerShow2, setIsPickerShow2] = useState(false);
  const [startDateString, setStartDateString] = useState(
    `${startDate.toUTCString().split(' ').slice(1, 4).join(' ')}`
  );
  const [endDateString, setEndDateString] = useState(
    `${endDate.toUTCString().split(' ').slice(1, 4).join(' ')}`
  );
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { username } = route.params;

  const showPicker1 = () => {
    setIsPickerShow1(true);
  };

  const showPicker2 = () => {
    setIsPickerShow2(true);
  };

  const onChangeStart = (_, date) => {
    setStartDate(date);
    const dateInStr = date.toUTCString().split(' ').slice(1, 4).join(' ');
    setStartDateString(dateInStr);
    if (Platform.OS === 'android') {
      setIsPickerShow1(false);
    }
  };

  const onChangeEnd = (_, date) => {
    setEndDate(date);
    const dateInStr = date.toUTCString().split(' ').slice(1, 4).join(' ');
    setEndDateString(dateInStr);
    if (Platform.OS === 'android') {
      setIsPickerShow2(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        if (username) {
          setIsLoading(true);

          const collections = await axios.get(
            `${URL}admin/${username}/payment?startDate=${startDate}&endDate=${endDate}`
          );

          collections.data.forEach((collection) => {
            if(!collection.farmerName){
              collection.farmerName = 'NIL';
            }
            collection.date = formatDate(collection.date);
          });

          setFilteredTableData(collections.data);
          setTableData(collections.data);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    fetchCollections();
  }, [startDate, endDate, username])

  const handleSearch = (text) => {
    setSearch(text);

    if(text === '') return setFilteredTableData(tableData)

    const filteredData = tableData.filter((item) => {
      return item.farmerName.toLowerCase().includes(text.toLowerCase());
    });
    setFilteredTableData(filteredData);
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


  const Item = ({ date, farmerId, farmerName, amountToPay, remarks }) => (
    <View style={styles.item}>
      <Text style={{ width: 0.2 * windowWidth, textAlign: 'center' }}>
        {formatDate(date)}
      </Text>
      <Text style={{ width: 0.1 * windowWidth, textAlign: 'center' }}>{farmerId}</Text>
      <Text style={{ width: 0.3 * windowWidth, textAlign: 'center', padding: 5 }}>
        {farmerName}
      </Text>
      <Text style={{ width: 0.1 * windowWidth, textAlign: 'center' }}>{amountToPay}</Text>
      <Text style={{ width: 0.3 * windowWidth, textAlign: 'center' }}>{remarks}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container1}>

        {/* DATE CONTAINER */}

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
          placeholder='Search by name'
          onChangeText={(text)=>{
            handleSearch(text)
          }}
          value={search}
          style={styles.searchBar}
        />

      </View>

      <ScrollView>
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
              <Text style={{ fontSize: 20 }}>Loading Payments...</Text>
            </View>
          )}

          {isLoading === false && tableData.length === 0 && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>No Payments Found</Text>
            </View>
          )}

          {isLoading === false && tableData.length > 0 && (
            filteredTableData.map((item) => {
              return (
                <Item
                  date={item.date}
                  farmerId={item.farmerId}
                  farmerName={item.farmerName}
                  amountToPay={item.amountToPay}
                  remarks={item.remarks}
                />
              )

            }
            ))}
        </View>
      </ScrollView>



      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
        <HideWithKeyboard style={styles.container3}>
          <Button
            icon='plus'
            mode='contained'
            style={styles.button}
            buttonColor='#77b300'
            onPress={() => navigateToAddCollection()}
          >
            Add Payment
          </Button>
        </HideWithKeyboard>
      </View>

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

export default Payments
