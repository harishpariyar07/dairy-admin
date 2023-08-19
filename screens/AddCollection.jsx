import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Searchbar, Button, TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native'
import axios from 'axios'
import { URL } from '@env'

import { FlatList } from 'react-native'

const AddCollection = ({ route }) => {
  const [totalAmt, setTotalAmt] = useState(0)
  const [rate, setRate] = useState(0)
  const [qty, setQty] = useState(null)
  const [fat, setFat] = useState(null)
  const [snf, setSnf] = useState(null)
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [farmerData, setFarmerData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const { dateString, username, shift } = route.params
  const date = new Date(dateString)

  useEffect(() => {
    const fetchAllFarmers = async () => {
      try {
        if (username) {
          const farmers = await axios.get(`${URL}admin/${username}/farmer`)
          const farmersArray = farmers.data.map((farmer) => ({
            farmerName: farmer.farmerName,
            farmerId: farmer.farmerId,
          }))

          const farmerData = farmers.data.map((farmer) => ({
            farmerName: farmer.farmerName,
            farmerId: farmer.farmerId,
            farmerLevel: farmer.farmerLevel,
          }))

          setFarmerData(farmerData)
          setData(farmersArray)
        }
      } catch (error) {
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

  const Item = ({ farmerId, farmerName, farmerLevel }) => (
    <View style={styles.item}>
      <Text>{farmerId}</Text>
      <Text style={{ marginRight: 5 }}>{farmerName}</Text>
      <Text style={{ marginRight: 10 }}>{farmerLevel}</Text>
    </View>
  )

  const filteredData = data.filter((item) => String(item.farmerId).includes(search))

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        style={styles.search}
        placeholder='Search by Farmer ID'
        onChangeText={(text) => {
          setSearch(text)
          setQty(0)
          setFat(0)
          setSnf(0)
          setTotalAmt(0)
          setRate(0)
        }}
        value={search}
        keyboardType='numeric'
      />

      {filteredData.length > 0 && search.length === String(filteredData[0].farmerId).length ? (
        filteredData.map((item, index) => (
          <View style={styles.farmerDetails} key={index}>
            <View style={{ flexDirection: 'row', padding: 10 }}>
              <Text style={{ color: 'red', fontFamily: 'InterB' }}>FARMER NAME: </Text>
              <Text>{item.farmerName}</Text>
            </View>

            <View style={{ flexDirection: 'row', padding: 10 }}>
              <Text style={{ color: 'red', fontFamily: 'InterB' }}>FARMER ID: </Text>
              <Text>{item.farmerId}</Text>
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
        <SafeAreaView style={styles.container2}>
          <View style={styles.head}>
            <Text style={[styles.headText]}>Id</Text>
            <Text style={[styles.headText]}>Name</Text>
            <Text style={[styles.headText]}>Level</Text>
          </View>

          <FlatList
            data={farmerData}
            renderItem={({ item }) => (
              <Item
                farmerId={item.farmerId}
                farmerName={item.farmerName}
                farmerLevel={item.farmerLevel}
              />
            )}
            keyExtractor={(item) => item.farmerId}
          />
        </SafeAreaView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    top: 40,
    gap: 20,
  },
  container2: {
    flex: 1,
    marginBottom: 2,
    width: '100%',
  },
  search: {
    width: '90%',
    backgroundColor: '#fff',
    borderColor: '#edebeb',
    borderWidth: 2,
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
