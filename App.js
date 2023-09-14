import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, PaperProvider, Text } from 'react-native-paper';
import { useFonts } from 'expo-font';

import Users from './screens/Users'
import Features from './screens/Features'
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PermissionsScreen from './screens/PermissionsScreen';
import AddFarmer from './screens/AddFarmer';
import CollectMilk from './screens/CollectMilk';
import Dues from './screens/Dues';
import Ledger from './screens/Ledger';
import AddPayments from './screens/AddPayments';
import Payments from './screens/Payments';
import RateChart from './screens/RateChart';
import AddFarmerDetails from './screens/AddFarmerDetails';
import EditFarmerDetails from './screens/EditFarmerDetails';
import AddRateChart from './screens/AddRateChart';
import EditRateChart from './screens/EditRateChart';
import AddCollection from './screens/AddCollection';
import { AuthProvider, useAuth } from './context/AuthContext';
import GenerateBill from './screens/GenerateBill';
import BillDetails from './screens/BillDetails';
import Bills from './screens/Bills';
import EditCollection from './screens/EditCollection';
import EditUser from './screens/EditUser';
import EditPermissionsScreen from './screens/EditPremissionsScreen';
import CollectionCenter from './screens/CollectionCenter';
import MilkReport from './screens/MilkReport';
import CollectionReport from './screens/CollectionReport';
import ForgotPassword from './screens/ForgotPassword';
import EditPayment from './screens/EditPayment';

const screens = [
  { name: 'HomeScreen', component: HomeScreen },
  { name: 'Features', component: Features },
  { name: 'Users', component: Users },
  { name: 'CollectionCenter', component: CollectionCenter },
  { name: 'EditUser', component: EditUser },
  { name: 'AddFarmer', component: AddFarmer },
  { name: 'AddFarmerDetails', component: AddFarmerDetails },
  { name: 'EditFarmerDetails', component: EditFarmerDetails },
  { name: 'CollectMilk', component: CollectMilk },
  { name: 'AddCollection', component: AddCollection },
  { name: 'EditCollection', component: EditCollection },
  { name: 'MilkReport', component: MilkReport },
  { name: 'CollectionReport', component: CollectionReport },
  { name: 'RateChart', component: RateChart },
  { name: 'AddRateChart', component: AddRateChart },
  { name: 'EditRateChart', component: EditRateChart },
  { name: 'Payments', component: Payments },
  { name: 'Dues', component: Dues },
  { name: 'Ledger', component: Ledger },
  { name: 'Bills', component: Bills },
  { name: 'GenerateBill', component: GenerateBill },
  { name: 'BillDetails', component: BillDetails },
  { name: 'RegisterScreen', component: RegisterScreen },
  { name: 'PermissionsScreen', component: PermissionsScreen },
  { name: 'EditPermissionsScreen', component: EditPermissionsScreen },
  { name: 'ForgotPassword', component: ForgotPassword},
  { name: 'AddPayments', component: AddPayments},
  { name: 'EditPayment', component: EditPayment},
];

const Stack = createNativeStackNavigator();

const AuthenticatedStack = () => {
  const { onLogout } = useAuth()
  return (
    <Stack.Navigator>
      {screens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.name === 'HomeScreen' && {
            headerTitle: 'HAMROO DAIRY ADMIN',
            headerRight: () => <Button onPress={onLogout} title="Logout" > <Text>Logout</Text> </Button>,
          }}
        />
      ))}
    </Stack.Navigator>)
};


const NonAuthenticatedStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
  </Stack.Navigator>
);

const Layout = () => {
  const { authState } = useAuth()
  return (<NavigationContainer>
    {authState && authState.authenticated ? (
      <AuthenticatedStack />
    ) : (
      <NonAuthenticatedStack />
    )}
  </NavigationContainer>)
}

export default function App() {

  const [loaded] = useFonts({
    Inter: require('./assets/fonts/Inter-Medium.ttf'),
    InterB: require('./assets/fonts/Inter-Bold.ttf'),
    LeagueSB: require('./assets/fonts/LeagueSpartan-Bold.ttf')
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <PaperProvider style={{
        fontFamily: 'Inter'
      }}>
        <Layout />
      </PaperProvider>
    </AuthProvider>
  );
}
