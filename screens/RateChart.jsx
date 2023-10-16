import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Button, IconButton, MD3Colors, Modal } from 'react-native-paper'
import { FlatList } from 'react-native'
import { SafeAreaView } from 'react-native'
import axios from 'axios'
import { URL } from '@env'

const windowWidth = Dimensions.get('window').width

const RateChart = ({ route }) => {
  const navigator = useNavigation()
  const [search, setSearch] = useState('')
  const [rateChartData, setRateChartData] = useState([])
  const [selectedRateChart, setSelectedRateChart] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const { username } = route.params
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    try {
      if (username) {
        setIsLoading(true)
        const response = await axios.get(`${URL}admin/${username}/ratelist`)
        setIsLoading(false)
        setRateChartData(response.data)
      }
    } catch (error) {
      setIsLoading(false)
      alert('Only Admin can access this page')
      navigator.goBack()
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const Item = ({ category, rateChartName, level, id }) => (
    <View style={styles.item}>
      <View style={styles.itemDetails}>
        <View style={styles.wrapper}>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>{rateChartName}</Text>
        </View>
        <View style={styles.wrapper}>
          <Text>Level {level}</Text>
          <Text>({category})</Text>
        </View>
      </View>
      <IconButton
        icon='pencil'
        iconColor={MD3Colors.error50}
        size={20}
        style={{ width: windowWidth * 0.15 }}
        onPress={() => navigator.navigate('EditRateChart', { username, id })}
      />
      <IconButton
        icon='delete'
        iconColor={MD3Colors.error50}
        size={20}
        style={{ width: windowWidth * 0.15 }}
        onPress={() => {
          setSelectedRateChart({ category, rateChartName, level, id })
          setModalVisible(true)
        }}
      />
    </View>
  )

  const deleteRateChart = async (id) => {
    try {
      if (username) {
        const res = await axios.delete(`${URL}admin/${username}/ratelist/${id}`)
        alert('Rate Chart Deleted Successfully')
        setModalVisible(false)
        fetchData()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>Loading Rate Chart...</Text>
        </View>
      )}
      {isLoading === false && rateChartData.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>No Rate Chart Found</Text>
        </View>
      )}

      {isLoading === false && rateChartData.length > 0 && (
        <FlatList
          data={rateChartData.filter(({ rateChartName }) =>
            rateChartName.toLowerCase().startsWith(search.toLowerCase())
          )}
          renderItem={({ item }) => (
            <Item
              rateChartName={item.rateChartName}
              level={item.level}
              animal={item.animal}
              category={item.category}
              id={item._id}
              key={item._id}
            />
          )}
          key={(item) => item._id}
          keyExtractor={(item) => item._id}
        />
      )}

      <Button
        icon='plus'
        mode='contained'
        onPress={() => navigator.navigate('AddRateChart', { username })}
        style={styles.button}
      >
        Add Rate Chart
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
            <Text>{`Rate Chart: ${selectedRateChart?.rateChartName}`}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={() => deleteRateChart(selectedRateChart?.id)}
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
  },
  itemDetails: {
    width: windowWidth * 0.6,
  },
  wrapper: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
  },
  button: {
    padding: 4,
    backgroundColor: '#77b300',
  },
  centeredView: {
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

export default RateChart
