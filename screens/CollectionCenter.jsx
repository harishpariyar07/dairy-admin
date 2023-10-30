import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import axios from 'axios'
import URL from '../constants/ServerUrl'

const CollectionCenter =  ({ navigation }) => {
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${URL}user`)
        setUsers(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchUsers()
  }, [])

  const handleUserClick = (username) => {
    navigation.navigate('Features', { username })
  }

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => handleUserClick(item.username)}>
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={styles.username}>{item.contactPerson}</Text>
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <Text style={styles.userId}>- UserId: {item.userId}</Text>
          <Text style={styles.userId}>- Farmers: {item.farmersCount}</Text>
          <Text style={styles.userId}>- Username: {item.username}</Text>
          <Text style={styles.userId}>- Address: {item.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose Collection Center</Text>
      <View style={styles.box}>
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: '#A7BEAE',
  },
  box: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8fa',
    paddingVertical: 8,
  },
  username: {
    fontSize: 18,
    fontFamily: 'Inter',
    color: '#059c11',
    paddingLeft: 10,
  },
  userId: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#000',
  },
   heading: {
    fontSize: 27,
    alignItems:'center',
    fontFamily: 'LeagueSB',
    color: '#059c11',
    marginBottom: 20, 
  },
})

export default CollectionCenter
