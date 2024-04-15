import {View, Button} from "react-native"
// react navigation plugin imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// used with stack navigators:
import 'react-native-gesture-handler';

import LoginScreen from "./screens/LoginScreen";
import OldSearchScreen from "./screens/OldSearchScreen";
import SearchScreen from "./screens/SearchScreen";
import ReservationScreen from "./screens/ReservationScreen";

const Stack = createStackNavigator();

export default function App() {
 
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">    
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="OldSearch" component={OldSearchScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Reservation" component={ReservationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
