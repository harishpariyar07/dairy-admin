import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { Table, Row } from 'react-native-table-component'
import axios from 'axios'
import { URL } from '@env'

const Dues = ({ route }) => {
  const [data, setData] = useState([])
  const [totalBalance, setTotalBalance] = useState(0)
  const { username } = route.params

  useEffect(() => {
    const fetchAllFarmers = async () => {
      try {
        if (username) {
          const dues = await axios.get(`${URL}admin/${username}/dues`)
          const duesArray = dues.data.map((due) => ({
            farmerName: due.farmerName,
            farmerId: due.farmerId,
            netBalance: due.dues,
          }))

          setData(duesArray)
          const total = duesArray.reduce((acc, item) => acc + parseFloat(item.netBalance), 0)
          setTotalBalance(total)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchAllFarmers()
  }, [])

  const tableHead = [
    { label: 'Farmer Id', width: 100 },
    { label: 'Farmer Name', width: 130 },
    { label: 'Net Balance', width: 100 },
  ]
  const tableData = data.map((item) => {
    return [item.farmerId, item.farmerName, item.netBalance]
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tableCnt}>
        <Table style={styles.table}>
          <Row
            data={tableHead.map((header) => header.label)}
            widthArr={tableHead.map((header) => header.width)}
            style={styles.head}
            textStyle={styles.headText}
          />
          {tableData.map((rowData, index) => (
            <Row
              key={index}
              data={rowData}
              style={[
                styles.row,
                index % 2 === 0 && styles.evenRow,
                index === 0 && styles.firstRow,
              ]}
              textStyle={styles.text}
              widthArr={tableHead.map((header) => header.width)}
            />
          ))}
        </Table>
      </View>

      <View style={styles.btnCnt}>
        <Text style={styles.totalAmt}>TOTAL AMOUNT : {totalBalance}</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  table: {
    width: '100%',
  },
  head: {
    height: 30,
    backgroundColor: '#6987d0',
  },
  headText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'InterB',
  },
  row: {
    height: 45,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  firstRow: {
    borderTopWidth: 1,
  },
  text: {
    margin: 6,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter',
  },
  tableCnt: {
    flex: 5,
  },
  totalAmt: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  btnCnt: {
    flex: 0.85,
    width: '90%',
  },
})

export default Dues
