import { StyleSheet, Text, View, TextInput, Switch, Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from "react"
import MapView, { Marker, Callout } from "react-native-maps"
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { doc, setDoc, deleteDoc, getDoc  } from "firebase/firestore";

// 1. TODO: import the required service  (db, auth, etc) from FirebaseConfig.js
import { db, auth } from '../firebaseConfig'

const SearchScreen = ({ route, navigation }) => {
    const { city, latitude, longitude } = route.params
    console.log(`${latitude} and ${longitude}  and ${city} and ${typeof (city)}`)
    const [markers, setMarkers] = useState([]);
    var MARKERS_ARRAY = []
    const [activeMarker, setActiveMarker] = useState([]);
    const renterId = auth.currentUser.uid

    //stores data in renter listings ,so the renters collection which 
    const bookNowBtn = async(activeMarkerData) => {
        console.log("active marker data",typeof(activeMarkerData) , activeMarkerData, renterId, activeMarkerData.ownerId, activeMarkerData.id)
        
        //i will use setDoc to create collection based on the user email 
        //find document with id activeMarkerData.id
        const emailId = auth.currentUser.email
        const receivedDocRef = doc(db, "renters", emailId);
        console.log("receivedDocRef   $$$$$$$", receivedDocRef)   
        const docSnap = await getDoc(receivedDocRef);
        console.log("docSnap #####", docSnap.id)

        // we will check if the docSnap with the emailId exists or not
        if(docSnap.exists()){
            const documentData = docSnap.data()
            const arrayOfObjects = documentData.userId || []
            arrayOfObjects.push(activeMarkerData)
            console.log("arrayOfObjects", arrayOfObjects)

            const updatedArrayOfObjects = arrayOfObjects.map(obj => ({ ...obj, status: "CONFIRMED" }));
            await updateDoc(receivedDocRef, { userId: updatedArrayOfObjects });

        }else{
            //setDoc will be used to enter the data in renter listings collection
            console.log("emailId $$$$$$", emailId)
            console.log("try for create document for first user", typeof(activeMarkerData))
            await setDoc(receivedDocRef, {userId: [{...activeMarkerData, status: "CONFIRMED"}]})
        }



        // //modify the data from owners collection
        const ownerDocRef = doc(db, "owners", activeMarkerData.ownerId);
        console.log("ownerDocRef:::", ownerDocRef) 
        await updateDoc(ownerDocRef, {

            customerName: "Mohan",
            status: 'CONFIRMED'
        });

        alert("Wait for the owner approval!")
    }



    const handleMarkerPress = (markerData) => {
        setActiveMarker(markerData); // Set the active marker to the one pressed
    };




    //from owners collection get listings and display on map. Only the listings in the city will be displayed
    useEffect(() => {
        const retrivalData = async () => {
            const q = query(collection(db, "items"))
            const querySnapshot = await getDocs(q);
            // console.log(getDocs(q), q)
            if (querySnapshot.empty) {
              console.log("No matching documents.");
            } else {
                //find Markers
              querySnapshot.forEach((doc) => {
                try{
                    console.log(doc.id, "->>","doc data is :", doc.data());

                    const users = doc.data().userId;
                    // find the all the array of objects with the current city
                    MARKERS_ARRAY= users.filter((user) => user.city === city);
                    MARKERS_ARRAY = MARKERS_ARRAY.map(user => ({
                        ...user, // Spread the existing user properties
                        ownerId: doc.id // Add the doc.id as a new property, named 'Owner' here
                    }));

                    console.log("foundCity is:", MARKERS_ARRAY, typeof(MARKERS_ARRAY))
                }catch(err){
                    console.log("Error", err)
                }
              });
            }
            setMarkers(MARKERS_ARRAY)
        }

        retrivalData()
    }, [city])



    return (
        <View>
            <MapView style={{ height: "60%", width: "100%" }}
                initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5
                }}
                mapType={"terrain"} showsTraffic={true}
            >

                <Marker
                    coordinate={{ latitude: latitude, longitude: longitude }}
                    onPress={() => { alert("Your location!") }}
                />


                {markers && markers.map(
                        (currMarker, index) =>  (
                                <Marker
                                    key={index}
                                    coordinate={{ latitude: currMarker.latitude, longitude: currMarker.longitude }}
                                    title={currMarker.price.toString()}
                                    description={currMarker.job}
                                    onPress={() => handleMarkerPress(currMarker)}
                                > 
                                </Marker>
                            )
                )}

            </MapView>

            
            <Text> Selected Listing </Text>
            {activeMarker && ( // Only render this view if there is an active marker
                <View>
                    <ScrollView horizontal>
                        <View>
                            <Text>{activeMarker.fullName}</Text>
                            <Text>{activeMarker.price}</Text>
                            {/* Assuming you have an image URL in your marker data */}
                            {/* <Image source={{ uri: activeMarker.imageUrl }} style={styles.image} /> */}
                        </View>
                    </ScrollView>

                    <Pressable onPress={() => bookNowBtn(activeMarker)} style={styles.btn}>
                        <Text style={styles.btnLabel}>Book Now</Text>
                    </Pressable>

                    {/* <Pressable onPress={listingsBtn(activeMarker)} style={styles.btn}>
                        <Text style={styles.btnLabel}>Listings near me</Text>
                    </Pressable> */}

                </View>
            )}
        </View>
    )
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
        paddingVertical: 5,
        marginVertical: 20
    },
    btnLabel: {
        fontSize: 16,
        textAlign: "center"
    }
 });


export default SearchScreen


