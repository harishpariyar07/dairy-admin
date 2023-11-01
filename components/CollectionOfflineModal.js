import { View, Text } from 'react-native'
import { Button } from 'react-native-paper'
import CollectionOfflineTable from './CollectionOfflineTable'
import axios from 'axios'
import checkConnection from '../utils/internetConnectivity'
import AsyncStorage from '@react-native-async-storage/async-storage'
import URL from '../constants/ServerUrl'
import { useState } from 'react'

const CollectionOfflineModal = ({
    collectionsOffline,
    hideModal,
    username
}) => {

    const [isLoading, setIsLoading] = useState(false)

    const handleUpload = async () => {

        if (checkConnection()) {

            setIsLoading(true)

            collectionsOffline.forEach(async (collection) => {
                try {
                    const res = await axios.post(`${URL}admin/${username}/collection`, collection)
                } catch (error) {
                    console.log(error)
                }
            })

            await AsyncStorage.removeItem('collectionsOffline')

            hideModal()

            setIsLoading(false)
        }
        else{
            alert('No Internet Connection')
        }
    }

    return (
        <View>

            <CollectionOfflineTable collectionsOffline={collectionsOffline} />


            <Button
                onPress={handleUpload}
                mode='contained'
                style={{
                    marginTop: 10,
                    marginBottom: 10,
                    backgroundColor: 'green'
                }}
                loading={isLoading}
                disabled={isLoading}
            >
                Upload Data to Server
            </Button>

        </View>
    )
}

export default CollectionOfflineModal
