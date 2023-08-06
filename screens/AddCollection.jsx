import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Searchbar, Button, TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native'
import axios from 'axios'
import { URL } from '@env'

import { FlatList } from 'react-native'

const AddCollection = ({ route }) => {
  const navigator = useNavigation()
  useLayoutEffect(() => {
    navigator.setOptions({ headerShown: false })
  }, [navigator])

  const [totalAmt, setTotalAmt] = useState(0)
  const [rate, setRate] = useState(0)
  const [qty, setQty] = useState(0)
  const [fat, setFat] = useState(0)
  const [snf, setSnf] = useState(0)
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [farmerData, setFarmerData] = useState([])

  const { dateString, username } = route.params
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

  useEffect(() => {
    const fetchRate = async () => {
      try {
        if (!fixedRate && username) {
          const res = await axios.get(
            `${URL}admin/${username}/ratelist/${farmerId}/rate?fat=${fat}&snf=${snf}`
          )
          setRate(res.data.rate)
          setTotalAmt(qty * res.data.rate)
        }
      } catch (error) {
        alert('Rate not found')
        console.log(error)
      }
    }
  }, [fat, snf])

  const addCollection = async (farmerId, farmerName, fixedRate) => {
    try {
      if (username) {
        if (qty == 0 || fat == 0 || snf == 0) {
          alert('Please fill all the fields')
        } else {
          const res = await axios.get(
            `${URL}admin/${username}/ratelist/${farmerId}/rate?fat=${fat}&snf=${snf}`
          )

          setRate(res.data.rate)
          setTotalAmt(qty * res.data.rate)

          await axios.post(`${URL}admin/${username}/collection`, {
            qty: qty,
            fat: fat,
            snf: snf,
            farmerId: farmerId,
            farmerName: farmerName,
            collectionDate: date,
            rate: rate,
            amount: totalAmt,
          })

          setQty(0)
          setFat(0)
          setSnf(0)
          setRate(0)
          setTotalAmt(0)
          alert('Collection Added Successfully')
        }
      }
    } catch (error) {
      alert('Collection not added')
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
                style={styles.textInput}
                label='Quantity'
                mode='outlined'
                outlineColor='#e6e6e6'
                underlineColor='#e6e6e6'
                activeUnderlineColor='#e6e6e6'
                activeOutlineColor='#737373'
                value={qty.toString()}
                onChangeText={(text) => {
                  setQty(text)
                  setTotalAmt(text * rate)
                }}
                keyboardType='numeric'
              />

              <TextInput
                style={styles.textInput}
                label='Fat'
                mode='outlined'
                outlineColor='#e6e6e6'
                underlineColor='#e6e6e6'
                activeUnderlineColor='#e6e6e6'
                activeOutlineColor='#737373'
                value={fat.toString()}
                onChangeText={(text) => setFat(text)}
                keyboardType='numeric'
              />

              <TextInput
                style={styles.textInput}
                label='SNF'
                mode='outlined'
                outlineColor='#e6e6e6'
                underlineColor='#e6e6e6'
                activeUnderlineColor='#e6e6e6'
                activeOutlineColor='#737373'
                value={snf.toString()}
                onChangeText={(text) => setSnf(text)}
                keyboardType='numeric'
              />
            </View>

            <Button
              style={styles.button}
              icon='plus'
              mode='contained'
              buttonColor='#77b300'
              onPress={() => addCollection(item.farmerId, item.farmerName, item.fixedRate)}
            >
              Add Collection
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
