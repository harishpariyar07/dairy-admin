import React, { useEffect, useState } from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import { Button, Searchbar, IconButton, MD3Colors } from 'react-native-paper'
import { FlatList } from 'react-native'
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

  const fetchData = async () => {
    try {
      if (username) {
        const response = await axios.get(`${URL}admin/${username}/farmer`)
        setFarmerData(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const deleteFarmer = async (id) => {
    try {
      if (username) {
        const res = await axios.delete(`${URL}admin/${username}/farmer/${id}`)
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
      <View style={styles.icon}>
        <IconButton icon='account' iconColor={MD3Colors.error50} size={20} />
      </View>
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
          setSelectedFarmer({ id, farmerName })
          setModalVisible(true)
        }}
      />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder='Search'
        onChangeText={(e) => setSearch(e)}
        value={search}
        style={{
          margin: 10,
          backgroundColor: '#fff',
          borderColor: '#edebeb',
          borderWidth: 2,
        }}
      />

      {farmerData.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No Farmers Found</Text>
        </View>
      )}

      <FlatList
        data={farmerData.filter(({ farmerName }) =>
          farmerName.toLowerCase().includes(search.toLowerCase())
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
        keyExtractor={(item) => item._id}
      />

      <Button
        icon='plus'
        mode='contained'
        onPress={() => navigator.navigate('AddFarmerDetails', { username })}
        style={styles.button}
        buttonColor='#6987d0'
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
                onPress={() => deleteFarmer(selectedFarmer?.id)}
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
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    width: 200,
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
