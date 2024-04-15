import { StyleSheet, Text, View, TextInput, Switch, Pressable} from 'react-native';
import {useEffect, useState} from "react"

// 1. TODO: import the required service  (db, auth, etc) from FirebaseConfig.js
import { db, auth } from '../firebaseConfig'

// 1. import the mapview component
import MapView, {Marker} from "react-native-maps"

// import location from expo
import * as Location from 'expo-location'


const OldSearchScreen = ({navigation}) => {

    const [latcurrLocation, setLatcurrLocation] = useState("")
    const [longcurrLocation, setLongcurrLocation] = useState("")

    const doReverseGeocoding = async (lat, long) => {
        try {
            const coords = {
                latitude: parseFloat(lat),
                longitude: parseFloat(long)
           }

           
            let postalAddresses = await Location.reverseGeocodeAsync(coords,{})
            // console.log(`postalAddresses: ${JSON.stringify(postalAddresses)}`)
            const result = postalAddresses[0]
          
            if (result === undefined) {
               alert("No results found.")
               return
            }
       
       
            // console.log(`Street: ${result.street}`)
            // console.log(`City: ${result.city}`)
            // console.log(`Province/State: ${result.region}`)
            // console.log(`Country: ${result.country}`)
       
            const navigationInfo= {
                city: result.city,
                ...coords
            }
       
            navigation.navigate("Search", navigationInfo)
            
       } catch(err) {
            console.log(err)
       }

    }


    const findCurrentLocation = async () => {
        try {           
            let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Balanced});           
        
            // console.log(`The current location is:`)
            // console.log(location.coords.latitude, location.coords.longitude)
            const lat = location.coords.latitude
            const long = location.coords.longitude
            // console.log(`The current location is: ${lat} and ${long}`)
            setLatcurrLocation(lat)
            setLongcurrLocation(long)
            return ({lat:lat, long:long})
            //setCurrLocationLabel(`Current location: ${JSON.stringify(location)}`)
         } catch (err) {
            console.log(err)
         }     
    }


    const buttonPressed = async () => {
        // console.log("Button pressed")
        const loc = await findCurrentLocation()
        // console.log("Current loc:", loc)
        // console.log("Current loc.lat and loc.long:", loc.lat, loc.long)
        await doReverseGeocoding(loc.lat, loc.long)
    }


    useEffect(() => {
        const requestPermissions = async () => {
            try {           
               const permissionsObject =  
                   await Location.requestForegroundPermissionsAsync()
               if (permissionsObject.status  === "granted") {
                   alert("Permission granted!")               
               } else {
                   alert("Permission denied or not provided")               
               }
            } catch (err) {
               console.log(err)
            }
         }
         
       requestPermissions()
    }, [])


    return (
        <View>
            <Text style={styles.headingText}>Map Demo</Text>
            {/* // 2. Add the MapView component to the UI */}


            <Pressable onPress={buttonPressed} style={styles.btn}>
                <Text style={styles.btnLabel}>Listings near me</Text>
            </Pressable>

        </View>
    );
 }
 
 
 const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
        fontSize:18,
        marginVertical:8
    },
    headingText: {
        fontSize:24,
        marginVertical: 8,
        textAlign:"center"
    },   
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    btn: {
        borderWidth: 1,
        borderColor: "#141D21",
        borderRadius: 8,
        paddingVertical: 16,
        marginVertical: 20
    },
    btnLabel: {
        fontSize: 16,
        textAlign: "center"
    }
 });
 
 
 
 
 export default OldSearchScreen
 