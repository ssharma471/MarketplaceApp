
import { StyleSheet, Text, View, TextInput, Switch, Pressable} from 'react-native';
import {useEffect, useState} from "react"

const ReservationScreen = ({ route, navigation }) => {
    const { city, latitude, longitude } = route.params

    return( 
        <Text>Reservation Screen</Text> 
        // <View>
        //     <Text>Reservation Screen</Text>
        //     <Text>City: {city}</Text>
        //     <Text>Latitude: {latitude}</Text>
        //     <Text>Longitude: {longitude}</Text>
        // </View>
    )
}

export default ReservationScreen;
