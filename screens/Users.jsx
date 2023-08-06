import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import axios from 'axios'
import { URL } from '@env'

const Users = ({ navigation }) => {
  const [users, setUsers] = useState([])
  const [farmersCount, setFarmersCount] = useState({})

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log(`${URL}user`)
        const response = await axios.get(`${URL}user`)
        setUsers(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchUsers()
  }, [])

  const getNoOfFarmers = async (username) => {
    try {
      if (username) {
        const res = await axios.get(`${URL}admin/${username}/farmer`)
        return res.data.length
      }
      return 0
    } catch (error) {
      console.log(error)
      return 0
    }
  }

  useEffect(() => {
    const fetchFarmersCount = async () => {
      try {
        const counts = {}
        for (const user of users) {
          const count = await getNoOfFarmers(user.username)
          counts[user.username] = count
        }
        setFarmersCount(counts)
      } catch (error) {
        console.log(error)
      }
    }

    fetchFarmersCount()
  }, [users])

  const handleUserClick = (username) => {
    navigation.navigate('Features', { username })
  }

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => handleUserClick(item.username)}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={[styles.username, { flex: 1 }]} sty>
          Name: {item.contactPerson}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
          }}
        >
          <Text style={styles.userId}>Username: {item.username}</Text>
          <Text style={styles.userId}>User ID: {item.userId}</Text>
          <Text style={styles.userId}>Password: {item.password}</Text>
          <Text style={styles.userId}>Farmers: {farmersCount[item.username] || 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
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
  },
  box: {
    width: '90%',
    height: 120,
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
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#1f4fc2',
  },
  userId: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#777',
  },
})

export default Users
