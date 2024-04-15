import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AddListings from "./screens/AddListings";
import LoginScreen from "./screens/LoginScreen";
import MyListings from "./screens/MyListings";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="My Listings" component={MyListings} />
    <Tab.Screen name="Add Listing" component={AddListings} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Book Lenders" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
