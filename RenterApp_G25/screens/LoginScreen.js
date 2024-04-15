import { StyleSheet, Text, View, TextInput, Switch, Pressable} from 'react-native';
import {useState} from "react"

// 1. TODO: import the required service  (db, auth, etc) from FirebaseConfig.js
import { db, auth } from '../firebaseConfig'


// 2. TODO: import the specific functions from the service (import ___ from "firebase/firestore)
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";

const LoginScreen = ({navigation}) => {

    // form fields
    const [emailFromUI, setEmailFromUI] = useState("")
    const [passwordFromUI, setPasswordFromUI] = useState("")
    const [errorMessageLabel, setErrorMessageLabel] = useState("Error messages go here")

    const roleDecider = async () => {
        // get the current user id
        const userId = auth.currentUser.uid
        console.log("userId is:", userId)

        if(userId){
            navigation.navigate("OldSearch")
        }else{
            console.log("No such user exists")
        }
        //from user id find role
        // const docRef = doc(db, "renters", userId)
        // const docSnap = await getDoc(docRef);
        // console.log("Data", docSnap.data())
        // //console.log("Role Decider", docSnap.data().Role)
        // //based on role navigate to the correct screen
        // if (docSnap.exists()) {
        //     if (docSnap.data().Role === "owner") {
        //         console.log("Owner", docSnap.data())
        //         navigation.navigate("Listing")
        //     } else if (docSnap.data().Role === "renter") {
        //         console.log("Renter", docSnap.data())
        //         navigation.navigate("OldSearch")
        //     }
        // } else {
        //     console.log("No such document")
        // }
    };


    
    const loginPressed = async () => {
        console.log("Logging in...")
        try{
            await signInWithEmailAndPassword(
                auth,
                emailFromUI,
                passwordFromUI
            )
            
            //function to decide the role of the user
            roleDecider()


        }catch(error){
            console.log(`Error code : ${error.code}`)
            console.log(`Error code : ${error.message}`)
            setErrorMessageLabel(error.message)
        }
    }


   return(
       <View style={styles.container}>  
            <Text>Login or Signup</Text>
            {/* email tb */}
            <TextInput placeholder="Enter email" onChangeText={setEmailFromUI} value={emailFromUI} style={styles.tb}/>
          
            {/* password tb */}
            <TextInput placeholder="Enter password" onChangeText={setPasswordFromUI} value={passwordFromUI} style={styles.tb}/>
          

            {/* button */}
            <Pressable onPress={loginPressed} style={styles.btn}>
                <Text style={styles.btnLabel}>Login</Text>
            </Pressable>

            <Text>{errorMessageLabel}</Text>
       </View>
   )
}
export default LoginScreen


const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',     
     padding:20,
   },
   tb: {
       width:"100%",   
       borderRadius:5,
       backgroundColor:"#efefef",
       color:"#333",
       fontWeight:"bold", 
       paddingHorizontal:10,
       paddingVertical:15,
       marginVertical:10,       
   },
   btn: {
       borderWidth:1,
       borderColor:"#141D21",
       borderRadius:8,
       paddingVertical:16,
       marginVertical:20
   },
   btnLabel: {
       fontSize:16,
       textAlign:"center"
   }, 
   error: {
        fontSize:16,
        textAlign:"center",
        color:"red"
   }
});
