import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { TextInput, Button } from 'react-native-paper'
import DropDown from 'react-native-paper-dropdown'
import { SafeAreaView } from 'react-native'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { URL } from '@env'
import { StatusBar } from 'expo-status-bar'

const categoryOptions = [
  { value: 'KGFAT + KGSNF', label: 'KGFAT + KGSNF' },
  { value: 'KG FAT ONLY', label: 'KG FAT ONLY' },
]

const levelOptions = [
  { value: 1, label: 'Level 1' },
  { value: 2, label: 'Level 2' },
  { value: 3, label: 'Level 3' },
  { value: 4, label: 'Level 4' },
]

const AddRateChart = ({ route }) => {
  const [showDropDown1, setShowDropDown1] = useState(false)
  const [showDropDown2, setShowDropDown2] = useState(false)
  const [category, setCategory] = useState('KGFAT + KGSNF')
  const [level, setLevel] = useState(null)
  const [rateChartName, setRateChartName] = useState('')
  const [stdFatRate, setStdFatRate] = useState()
  const [stdSNFRate, setStdSNFRate] = useState()
  const [stdTSRate, setStdTSRate] = useState()
  const [incentive, setIncentive] = useState()
  const navigator = useNavigation()
  const { username } = route.params

  const addRateChart = async () => {
    try {
      if (username) {
        const res = await axios.post(`${URL}admin/${username}/ratelist`, {
          category,
          level,
          rateChartName,
          stdFatRate,
          stdSNFRate,
          stdTSRate,
          incentive,
        })
        setCategory('KGFAT + KGSNF')
        setLevel(null)
        setRateChartName('')
        setStdFatRate()
        setStdSNFRate()
        setStdTSRate()
        alert('Rate Chart Saved Successfully')
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data)
        alert(error.response.data)
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error:', error.message)
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='auto' />

      <ScrollView>
        <DropDown
          label={'ENTER CATEGORY'}
          mode={'flat'}
          visible={showDropDown1}
          showDropDown={() => setShowDropDown1(true)}
          onDismiss={() => setShowDropDown1(false)}
          value={category}
          setValue={setCategory}
          list={categoryOptions}
          dropDownStyle={styles.dropStyle}
          dropDownItemStyle={styles.dropDownStyle}
          dropDownItemSelectedStyle={styles.dropDownStyle}
          inputProps={{
            style: {
              backgroundColor: 'white',
              padding: 4,
            },
          }}
        />

        <DropDown
          label={'ENTER LEVEL'}
          mode={'flat'}
          visible={showDropDown2}
          showDropDown={() => setShowDropDown2(true)}
          onDismiss={() => setShowDropDown2(false)}
          value={level}
          setValue={setLevel}
          list={levelOptions}
          dropDownStyle={styles.dropStyle}
          dropDownItemStyle={styles.dropDownStyle}
          dropDownItemSelectedStyle={styles.dropDownStyle}
          inputProps={{
            style: {
              backgroundColor: 'white',
              padding: 4,
            },
          }}
        />

        <TextInput
          label='ENTER RATE CHART NAME'
          value={rateChartName}
          onChangeText={(name) => setRateChartName(name)}
          selectionColor='black'
          style={styles.textInput}
        />

        {(category === 'KGFAT + KGSNF' || category === 'KG FAT ONLY') && (
          <TextInput
            label='ENTER STANDARD FAT RATE'
            value={stdFatRate && stdFatRate.toString()}
            onChangeText={(fat) => setStdFatRate(fat)}
            selectionColor='black'
            style={styles.textInput}
            keyboardType='numeric'
          />
        )}

        {category === 'KGFAT + KGSNF' && (
          <View>
            <TextInput
              label='ENTER STANDARD SNF RATE'
              value={stdSNFRate && stdSNFRate.toString()}
              onChangeText={(snf) => setStdSNFRate(snf)}
              selectionColor='black'
              style={styles.textInput}
              keyboardType='numeric'
            />
            <TextInput
              label='ENTER TS RATE'
              value={stdTSRate && stdTSRate.toString()}
              onChangeText={(rate) => setStdTSRate(rate)}
              selectionColor='black'
              style={styles.textInput}
              keyboardType='numeric'
            />
          </View>
        )}

        <TextInput
          label='ENTER INCENTIVE'
          value={incentive && incentive.toString()}
          onChangeText={(i) => setIncentive(i)}
          selectionColor='black'
          style={styles.textInput}
          keyboardType='numeric'
        />
      </ScrollView>

      <Button
        icon='content-save'
        mode='contained'
        onPress={() => addRateChart()}
        style={styles.button}
      >
        Save
      </Button>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 2,
    width: '100%',
  },
  textInput: {
    backgroundColor: 'white',
    padding: 5,
  },
  button: {
    padding: 4,
  },
  dropDownStyle: {
    backgroundColor: 'white',
    color: 'blue',
  },

  titleStyle: {
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'white',
    paddingLeft: 15,
    paddingTop: 5,
  },
})

export default AddRateChart
