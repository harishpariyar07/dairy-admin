// SplashScreen.js

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
        <Image source={require('../assets/icons/adminLogo.png')} style={{width: 350, height: 350}}/>
       {/* <ActivityIndicator size="large" color="#007AFF" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
});

export default SplashScreen;
