import React, { useEffect, useState } from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import { Button, Searchbar, IconButton, MD3Colors } from 'react-native-paper'
import { FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native'
import axios from 'axios'
import { URL } from '@env'

const Users = () => {
  const [search, setSearch] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const navigator = useNavigation()

  const [userData, setUserData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${URL}user`)
      setIsLoading(false)
      setUserData(response.data)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = React.useCallback((e) => {
    setSearch(e);
  }, []);

  const Item = React.memo(({ contactPerson, username, userId }) => (
    <View style={styles.item} onPress={() => navigator.navigate('Features', { username })}>
      <Text>{userId}</Text>
      <View>
        <Text style={styles.name}>{contactPerson}</Text>
        <Text style={{ color: 'gray' }}>{username}</Text>
      </View>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={() => {
          navigator.navigate('EditUser', { username })
        }}
      >
        <Text> Edit </Text>
        <IconButton icon='pencil' iconColor={MD3Colors.error50} size={20} />
      </TouchableOpacity>
    </View>
  ));

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder='Search by user name'
        onChangeText={handleSearch}
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
          <Text style={{ fontSize: 20 }}>Loading Users...</Text>
        </View>
      )

      : userData.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>No Users Found</Text>
        </View>
      ) : (
        <FlatList
          data={userData.filter(({ contactPerson }) =>
            contactPerson.toLowerCase().startsWith(search.toLowerCase())
          )}
          renderItem={({ item }) => (
            <Item
              username={item.username}
              contactPerson={item.contactPerson}
              userId={item.userId}
              id={item._id}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      )}

      <Button
        icon='plus'
        mode='contained'
        onPress={() => navigator.navigate('RegisterScreen')}
        style={styles.button}
        buttonColor='#77b300'
      >
        Add User
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
            <Text>{`Username: ${selectedUser?.username}`}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={() => deleteUser(selectedUser?.username)}
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
    justifyContent: 'space-around',
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
export default Users
