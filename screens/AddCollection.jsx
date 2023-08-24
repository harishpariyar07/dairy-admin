import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { Searchbar, Button, TextInput, IconButton } from 'react-native-paper'
import { SafeAreaView } from 'react-native'
import axios from 'axios'
import { URL } from '@env'
import { useAuth } from '../context/AuthContext'
import { FlatList } from 'react-native'
import { Row } from 'react-native-table-component'
const windowWidth = Dimensions.get('window').width

const tableHead = [
  { label: 'Id', width: 0.2 * windowWidth },
  { label: 'Name', width: 0.4 * windowWidth },
  { label: 'Level', width: 0.3 * windowWidth },
]

const tableHeadWidthArr = tableHead.map((header) => header.width)

const AddCollection = ({ route }) => {
  const [totalAmt, setTotalAmt] = useState(0)
  const [rate, setRate] = useState(0)
  const [qty, setQty] = useState(null)
  const [fat, setFat] = useState(null)
  const [snf, setSnf] = useState(null)
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { username } = route.params
  const [filteredData, setFilteredData] = useState([])
  const [selectedOption, setSelectedOption] = useState('ID')
  const [isLoadingFarmer, setIsLoadingFarmer] = useState(true)

  const { dateString, shift } = route.params
  const date = new Date(dateString)

  useEffect(() => {
    const fetchAllFarmers = async () => {
      try {
        if (username) {
          setIsLoadingFarmer(true)
          const farmers = await axios.get(`${URL}admin/${username}/farmer`)
          const farmersArray = farmers.data.map((farmer) => ({
            farmerName: farmer.farmerName,
            farmerId: farmer.farmerId,
            farmerLevel: farmer.farmerLevel,
          }))

          setIsLoadingFarmer(false)
          setData(farmersArray)
        }
      } catch (error) {
        setIsLoadingFarmer(false)
        console.log(error)
      }
    }

    fetchAllFarmers()
  }, [])

  const addCollection = async (farmerId, farmerName, fixedRate) => {
    try {
      if (username && qty !== null) {
        setIsLoading(true)
        const rateResponse = await axios.get(
          `${URL}admin/${username}/ratelist/${farmerId}/rate?fat=${fat}&snf=${snf}`
        )

        const rateData = rateResponse.data

        if (rateData.rate) {
          setRate(rateData.rate)
          setTotalAmt(qty * rateData.rate)
          const collectionResponse = await axios.post(`${URL}admin/${username}/collection`, {
            shift: shift,
            qty: qty,
            fat: Number(fat),
            snf: Number(snf),
            farmerId: farmerId,
            farmerName: farmerName,
            collectionDate: date,
            amount: Number(qty * rateData.rate).toFixed(2),
            rate: Number(rateData.rate),
          })

          if (collectionResponse) {
            setRate(0)
            setTotalAmt(0)
            setQty(null)
            setSearch('')
            setIsLoading(false)
            alert('Collection Added Successfully')
          }
        }
      }
    } catch (error) {
      setIsLoading(false)
      alert('Error adding collection')
      console.log(error.message)
    }
  }

  const Farmer = ({ farmerName, farmerId }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setFilteredData(data.filter((item) => item.farmerId === farmerId))
        if (selectedOption === 'ID') {
          setSearch(String(farmerId))
        } else {
          setSearch(String(farmerName))
        }
      }}
    >
      <Text style={{ width: 0.2 * windowWidth, textAlign: 'center', fontWeight: 'bold' }}>
        {farmerId}
      </Text>
      <Text
        style={{
          width: 0.6 * windowWidth,
          textAlign: 'left',
          padding: 5,
          fontWeight: 'bold',
        }}
      >
        {farmerName}
      </Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      {search === '' && (
        <View style={styles.iconButtonContainer}>
          <TouchableOpacity
            style={[styles.iconButton, selectedOption === 'ID' && styles.selectedOption]}
            onPress={() => {
              setSelectedOption('ID')
            }}
          >
            <Text style={{ color: '#000', fontWeight: 'bold' }}>ID</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, selectedOption === 'NAME' && styles.selectedOption]}
            onPress={() => setSelectedOption('NAME')}
          >
            <Text style={{ color: '#000', fontWeight: 'bold' }}>NAME</Text>
          </TouchableOpacity>
        </View>
      )}

      <Searchbar
        style={styles.search}
        placeholder='Search'
        onChangeText={(text) => {
          setSearch(text)
          setQty(0)
          setFat(0)
          setSnf(0)
          setTotalAmt(0)
          setRate(0)
          if (selectedOption === 'ID') {
            setFilteredData(data.filter((item) => String(item.farmerId) === text))
          }
        }}
        value={search}
        keyboardType={selectedOption === 'ID' ? 'numeric' : 'default'}
      />

      {filteredData.length > 0 && search !== '' ? (
        filteredData.map((item, index) => (
          <View style={styles.farmerDetails} key={index}>
            <View style={{ flexDirection: 'row', padding: 10 }}>
              <Text style={{ color: 'red', fontFamily: 'InterB' }}>FARMER NAME: </Text>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.farmerName}</Text>
            </View>
            <View style={{ flexDirection: 'row', padding: 10 }}>
              <Text style={{ color: 'red', fontFamily: 'InterB' }}>FARMER ID: </Text>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.farmerId}</Text>
            </View>
            <Text style={styles.amountRateText}>
              Total Amount: <Text style={styles.amountText}>{totalAmt}</Text> Rate:{' '}
              <Text style={styles.rateText}>{rate}</Text>
            </Text>

            <View>
              <TextInput
                placeholderTextColor='black'
                style={styles.textInput}
                label='Quantity'
                mode='outlined'
                outlineColor='#e6e6e6'
                underlineColor='#e6e6e6'
                activeUnderlineColor='#e6e6e6'
                activeOutlineColor='#737373'
                value={qty > 0 ? qty.toString() : ''}
                onChangeText={(text) => {
                  setQty(text)
                  setTotalAmt((text * rate).toFixed(2))
                }}
                keyboardType='numeric'
              />

              <TextInput
                placeholderTextColor='black'
                style={styles.textInput}
                label='Fat'
                mode='outlined'
                outlineColor='#e6e6e6'
                underlineColor='#e6e6e6'
                activeUnderlineColor='#e6e6e6'
                activeOutlineColor='#737373'
                value={fat > 0 ? fat.toString() : ''}
                onChangeText={(text) => setFat(text)}
                keyboardType='numeric'
              />

              <TextInput
                placeholderTextColor='black'
                style={styles.textInput}
                label='SNF'
                mode='outlined'
                outlineColor='#e6e6e6'
                underlineColor='#e6e6e6'
                activeUnderlineColor='#e6e6e6'
                activeOutlineColor='#737373'
                value={snf > 0 ? snf.toString() : ''}
                onChangeText={(text) => setSnf(text)}
                keyboardType='numeric'
              />
            </View>
            <Button
              style={styles.button}
              icon='plus'
              mode='contained'
              buttonColor='#77b300'
              onPress={() => {
                if (!isLoading) {
                  addCollection(item.farmerId, item.farmerName, item.fixedRate)
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Collection'}
            </Button>
          </View>
        ))
      ) : (
        <View>
          {isLoadingFarmer && (
            <View style={{ flex: 1, top: 150, alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>Loading Farmers...</Text>
            </View>
          )}

          {!isLoadingFarmer && (
            <FlatList
              data={data.filter(({ farmerName }) =>
                farmerName.toLowerCase().includes(search.toLowerCase())
              )}
              renderItem={({ item }) => (
                <Farmer farmerId={item.farmerId} farmerName={item.farmerName} id={item._id} />
              )}
              keyExtractor={(item) => item._id}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    top: 10,
    gap: 20,
  },
  search: {
    width: '90%',
    backgroundColor: '#fff',
    borderColor: '#edebeb',
    borderWidth: 2,
  },
  iconButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  iconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  selectedOption: {
    backgroundColor: '#6987d0',
  },
  farmerDetails: {
    width: '90%',
    backgroundColor: '#fff',
    borderColor: '#edebeb',
    borderWidth: 2,
    padding: 10,
  },
  button: {
    marginVertical: 5,
  },
  textInput: {
    marginVertical: 10,
    fontSize: 13,
    fontFamily: 'Inter',
  },
  amountRateText: {
    fontFamily: 'Inter',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
    backgroundColor: '#e6e6e6',
    padding: 20,
  },
  amountText: {
    color: 'blue',
  },
  rateText: {
    color: 'green',
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
  head: {
    height: 40,
    flexDirection: 'row',
    backgroundColor: '#6987d0',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  headText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'InterB',
  },
})

export default AddCollection
