import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import { Button, Searchbar, IconButton, MD3Colors } from 'react-native-paper'
import { FlatList } from 'react-native'
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native'
import axios from 'axios'
import { URL } from '@env'

const AddFarmer = ({ route }) => {
  const [search, setSearch] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedFarmer, setSelectedFarmer] = useState(null)
  const navigator = useNavigation()
  const { username } = route.params

  const [farmerData, setFarmerData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    try {
      if (username) {
        setIsLoading(true)
        const response = await axios.get(`${URL}admin/${username}/farmer`)
        setIsLoading(false)
        setFarmerData(response.data)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const deleteFarmer = async (farmerId) => {
    try {
      if (username) {
        const res = await axios.delete(`${URL}admin/${username}/farmer/${farmerId}`)
        alert('Farmer Deleted Successfully')
        setModalVisible(false)
        fetchData()
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const Item = ({ farmerId, farmerName, farmerLevel, mobileNumber, id }) => (
    <View style={styles.item}>
      <Text>{farmerId}</Text>
      <View>
        <Text style={styles.name}>{farmerName}</Text>
        <Text>{mobileNumber}</Text>
      </View>
      <Text>Level {farmerLevel}</Text>
      <IconButton
        icon='pencil'
        iconColor={MD3Colors.error50}
        size={20}
        onPress={() => {
          navigator.navigate('EditFarmerDetails', { username, farmerId })
        }}
      />
      <IconButton
        icon='delete'
        iconColor={MD3Colors.error50}
        size={20}
        onPress={() => {
          setSelectedFarmer({ farmerId, id, farmerName })
          setModalVisible(true)
        }}
      />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder='Search by farmer name'
        onChangeText={(e) => setSearch(e)}
        value={search}
        style={{
          margin: 10,
          backgroundColor: '#fff',
          borderColor: '#edebeb',
          borderWidth: 2,
        }}
      />

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>Loading Farmers...</Text>
        </View>
      )

      : farmerData.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>No Farmers Found</Text>
        </View>
      ) : (
        // <FlatList
        //   data={farmerData.filter(({ farmerName }) =>
        //     farmerName.toLowerCase().startsWith(search.toLowerCase())
        //   )}
        //   renderItem={({ item }) => (
        //     <Item
        //       farmerId={item.farmerId}
        //       farmerName={item.farmerName}
        //       farmerLevel={item.farmerLevel}
        //       mobileNumber={item.mobileNumber}
        //       id={item._id}
        //     />
        //   )}
        //   keyExtractor={(item) => item._id.toString()} 
        //   initialNumToRender={10} 
        //   windowSize={21}
        //   removeClippedSubviews={true} 
        // />

        <FlashList
            data={farmerData.filter(({ farmerName }) =>
              farmerName.toLowerCase().startsWith(search.toLowerCase())
            )}
            renderItem={({ item }) => (
              <Item
                farmerId={item.farmerId}
                farmerName={item.farmerName}
                farmerLevel={item.farmerLevel}
                mobileNumber={item.mobileNumber}
                id={item._id}
              />
            )}
            estimatedItemSize={69}
        />

      )}

      <Button
        icon='plus'
        mode='contained'
        onPress={() => navigator.navigate('AddFarmerDetails', { username })}
        style={styles.button}
        buttonColor='#77b300'
      >
        Add farmer
      </Button>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Confirm Delete?</Text>
            <Text>{`Farmer Name: ${selectedFarmer?.farmerName}`}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={() => deleteFarmer(selectedFarmer?.farmerId)}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 2,
    backgroundColor: '#A7BEAE',
  },
  item: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    height: 70,
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    width: 150,
  },
  button: {
    padding: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonCancel: {
    backgroundColor: '#ccc',
  },
  modalButtonDelete: {
    backgroundColor: '#f00',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
})
export default AddFarmer
