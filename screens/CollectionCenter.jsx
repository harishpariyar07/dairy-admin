import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import URL from '../constants/ServerUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import checkConnection from '../utils/internetConnectivity';

const CollectionCenter = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [farmersCount, setFarmersCount] = useState({});
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (await checkConnection()) {
          const response = await axios.get(`${URL}user`);
          setUsers(response.data);
          setIsLoading(false);

          await AsyncStorage.setItem('users', JSON.stringify(response.data));
        } else {
          const users = await AsyncStorage.getItem('users');
          setUsers(JSON.parse(users));
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const getNoOfFarmers = async (username) => {
    try {
      if (username) {
        const res = await axios.get(`${URL}admin/${username}/farmer`);
        return res.data.length;
      }
      return 0;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  useEffect(() => {
    const fetchFarmersCount = async () => {
      try {
        if (await checkConnection()) {
          const counts = {};
          for (const user of users) {
            const count = await getNoOfFarmers(user.username);
            counts[user.username] = count;
          }
          setFarmersCount(counts);
          setIsLoading(false);

          await AsyncStorage.setItem('farmersCount', JSON.stringify(counts));
        } else {
          const counts = await AsyncStorage.getItem('farmersCount');
          setFarmersCount(JSON.parse(counts));
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }

    fetchFarmersCount();
  }, [users]);

  const handleUserClick = (username) => {
    navigation.navigate('Features', { username });
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
          <Text style={styles.userId}>- Farmers: {farmersCount[item.username] || 0}</Text>
          <Text style={styles.userId}>- Username: {item.username}</Text>
          <Text style={styles.userId}>- Address: {item.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose Collection Center</Text>
      <View style={styles.box}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#059c11" />
        ) : (
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </View>
  );
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
    alignitems: 'center',
    fontFamily: 'LeagueSB',
    color: '#059c11',
    marginBottom: 20,
  },
});

export default CollectionCenter;
