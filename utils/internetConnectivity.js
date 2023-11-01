import * as Network from 'expo-network';

const checkConnection = async () => {
    const networkState = await Network.getNetworkStateAsync();

    console.log(networkState.isConnected);

    return networkState.isConnected;
}

export default checkConnection;