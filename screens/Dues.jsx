import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import axios from 'axios';
import URL from '../constants/ServerUrl';

const Dues = ({ route }) => {
  const [data, setData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const { username } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAllFarmers = async () => {
      try {
        if (username) {
          setIsLoading(true);
          const dues = await axios.get(`${URL}admin/${username}/dues`);
          const duesArray = dues.data.map((due) => ({
            farmerName: due.farmerName,
            farmerId: due.farmerId,
            netBalance: due.dues,
          }));

          setData(duesArray);
          const total = duesArray.reduce((acc, item) => acc + parseFloat(item.netBalance), 0);
          setTotalBalance(total.toFixed(2));
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchAllFarmers();
  }, [username]);

  const tableHead = [
    { label: 'Farmer Id', flex: 0.2 },
    { label: 'Farmer Name', flex: 0.5 },
    { label: 'Net Balance', flex: 0.3 },
  ];

  const tableData = data.map((item) => [item.farmerId, item.farmerName, item.netBalance]);

  return (
    <View style={styles.container}>
      <Row
        data={tableHead.map((header) => header.label)}
        flexArr={tableHead.map((header) => header.flex)}
        style={styles.head}
        textStyle={styles.headText}
      />
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>Loading Farmer Dues...</Text>
        </View>
      ) : tableData.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>No Farmers Found</Text>
        </View>
      ) : (
        <ScrollView style={styles.tableCnt}>
          <Table style={styles.table}>
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
                flexArr={tableHead.map((header) => header.flex)}
              />
            ))}
          </Table>
        </ScrollView>
      )}

      <View style={styles.btnCnt}>
        <Text style={styles.totalAmt}>TOTAL AMOUNT: {totalBalance}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tableCnt: {
    flex: 1,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  table: {
    width: '100%',
  },
  head: {
     backgroundColor: '#059c11',
    padding: 15,
  },
  headText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'InterB',
  },
  row: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 5,
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
    fontSize: 13,
    fontFamily: 'Inter',
  },
  totalAmt: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  btnCnt: {
    flex: 0.1,
    width: '90%',
  },
})

export default Dues
