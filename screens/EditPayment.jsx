import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import URL from '../constants/ServerUrl';

const EditPayment = ({ route }) => {
    const { _id, username, date, farmerId, farmerName, amountToPay, remarks } = route.params;
    const [newAmountToPay, setNewAmountToPay] = useState(String(amountToPay));
    const [newRemarks, setNewRemarks] = useState(remarks);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false)
    const navigator = useNavigation();

    const updatePayment = async () => {
        try {
            if (username) {
                setIsLoading(true);

                const paymentResponse = await axios.put(
                    `${URL}admin/${username}/payment/${_id}`,
                    {
                        amountToPay: newAmountToPay,
                        remarks: newRemarks
                    }
                )

                if (paymentResponse.status === 200) {
                    setIsLoading(false)
                    alert('Payment Updated')
                    navigator.goBack()
                }
            }
        } catch (err) {
            setIsLoading(false);
            alert('Error updating payment');
            console.log(err);
        }
    };

    const deletePayment = async () => {
        try {
            if (username) {
                setIsDeleting(true)
                const deleteResponse = await axios.delete(
                    `${URL}admin/${username}/payment/${_id}`
                )

                if (deletePayment.status === 200) {
                    setIsDeleting(false)
                    alert('Data Deleted')
                    navigator.goBack()
                }
            }
        }
        catch (err) {
            setIsDeleting(false)
            alert('Error while Deleting')
            console.log(err)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.paymentDetails}>
                <Text style={styles.detailLabel}>Farmer Name: {farmerName}</Text>
                <Text style={styles.detailLabel}>Farmer ID: {farmerId}</Text>
                <Text style={styles.detailLabel}>Date: {date}</Text>

                <TextInput
                    placeholder="Amount to Pay"
                    style={styles.textInput}
                    label="Amount to Pay"
                    mode="outlined"
                    value={newAmountToPay}
                    onChangeText={(text) => setNewAmountToPay(text)}
                    keyboardType="numeric"
                />

                <TextInput
                    placeholder="Remarks"
                    style={styles.textInput}
                    label="Remarks"
                    mode="outlined"
                    value={newRemarks}
                    onChangeText={(text) => setNewRemarks(text)}
                />

                <Button
                    style={styles.button}
                    icon="file"
                    mode="contained"
                    buttonColor="#77b300"
                    onPress={() => {
                        if (!isLoading) {
                            updatePayment();
                        }
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Update Payment'}
                </Button>

                <Button
                    style={styles.button}
                    icon='delete'
                    mode='contained'
                    buttonColor='#ed2f21'
                    onPress={() => {
                        if (!isDeleting) {
                            deleteCollection()
                        }
                    }}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Delete Collection'}
                </Button>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentDetails: {
        width: '90%',
        backgroundColor: '#fff',
        borderColor: '#edebeb',
        borderWidth: 2,
        padding: 10,
    },
    detailLabel: {
        fontFamily: 'Inter',
        fontSize: 16,
        marginVertical: 5,
    },
    textInput: {
        marginVertical: 10,
        fontSize: 13,
        fontFamily: 'Inter',
    },
    button: {
        marginVertical: 10,
    },
});

export default EditPayment;
