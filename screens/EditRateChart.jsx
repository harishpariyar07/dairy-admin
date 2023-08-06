import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput, Button } from 'react-native-paper'
import DropDown from 'react-native-paper-dropdown'
import { SafeAreaView } from 'react-native'
import axios from 'axios'
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

const EditRateChart = ({ route }) => {
  const [showDropDown1, setShowDropDown1] = useState(false)
  const [showDropDown2, setShowDropDown2] = useState(false)
  const [category, setCategory] = useState('KGFAT + KGSNF')
  const [level, setLevel] = useState(null)
  const [rateChartName, setRateChartName] = useState('')
  const [stdFatRate, setStdFatRate] = useState()
  const [stdSNFRate, setStdSNFRate] = useState()
  const [stdTSRate, setStdTSRate] = useState()
  const [incentive, setIncentive] = useState()
  const { username, id } = route.params

  const fetchRateData = async () => {
    try {
      if (username) {
        const res = await axios.get(`${URL}admin/${username}/ratelist/${id}`)

        setCategory(res.data.category)
        setLevel(res.data.level)
        setRateChartName(res.data.rateChartName)
        setStdFatRate(res.data.stdFatRate)
        setStdSNFRate(res.data.stdSNFRate)
        setStdTSRate(res.data.stdTSRate)
        setIncentive(res.data.incentive)
      }
    } catch (error) {
      console.log('Error:', error)
    }
  }

  useEffect(() => {
    fetchRateData()
  }, [])

  const updateRateChart = async () => {
    try {
      if (username) {
        const res = await axios.put(`${URL}admin/${username}/ratelist/${id}`, {
          category,
          level,
          rateChartName,
          stdFatRate,
          stdSNFRate,
          stdTSRate,
          incentive,
        })

        alert('Rate Chart Updated Successfully')
        fetchRateData()
      }
    } catch (error) {
      alert('Error in updating farmer details')
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='auto' />

      <ScrollView>
        <DropDown
          label={'ENTER CATEGORY'}
          mode={'flat'}
          visible='false'
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
          visible='false'
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
        onPress={() => updateRateChart()}
        style={styles.button}
      >
        Update
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

export default EditRateChart
