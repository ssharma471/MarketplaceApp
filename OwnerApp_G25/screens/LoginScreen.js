import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db, auth } from "../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  // form fields
  const [emailFromUI, setEmailFromUI] = useState("");
  const [passwordFromUI, setPasswordFromUI] = useState("");
  const [errorMessageLabel, setErrorMessageLabel] = useState("");
  const [loading, setLoading] = useState(false);

  const loginPressed = async () => {
    setLoading(true);
    if (emailFromUI.trim() === "" || passwordFromUI.trim() === "") {
      setErrorMessageLabel("Please provide email and password");
      setLoading(false);
      return;
    }
    try {
      const user = await getDoc(doc(db, "owners", emailFromUI.toLowerCase()));
      if (!user.exists()) {
        setErrorMessageLabel("Invalid email or password");
        setLoading(false);
        return;
      }
      await signInWithEmailAndPassword(auth, emailFromUI, passwordFromUI);
      setErrorMessageLabel("");
      setLoading(false);
      navigation.navigate("Book Lenders");
    } catch (error) {
      console.log("ERROR when logging in", error);
      setErrorMessageLabel("Invalid email or password");
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3a86ff" />
          <Text style={styles.loadingText}>
            Please wait while we log you in....
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.appTitleContainer}>
            <MaterialCommunityIcons
              name="bookshelf"
              size={40}
              color="#2a9d8f"
            />
            <Text style={styles.appTitleText}>Book Lenders</Text>
          </View>
          <Text style={styles.headerText}>
            Please provided your email and password to continue
          </Text>
          <TextInput
            placeholder="Enter email"
            onChangeText={setEmailFromUI}
            value={emailFromUI.toLowerCase()}
            style={styles.tb}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Enter password"
            onChangeText={setPasswordFromUI}
            value={passwordFromUI}
            style={styles.tb}
            secureTextEntry={true}
          />
          <Pressable onPress={loginPressed} style={styles.btn}>
            <Text style={styles.btnLabel}>Login</Text>
          </Pressable>
          <Text style={styles.error}>{errorMessageLabel}</Text>
        </>
      )}
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    justifyContent: "center",
  },
  appTitleContainer: {
    flexDirection: "row",
    marginBottom: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2a9d8f",
    marginLeft: 10,
  },
  headerText: {
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 32,
    textAlign: "center",
  },

  tb: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    color: "#333",
    fontWeight: "500",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  btn: {
    borderRadius: 8,
    paddingVertical: 14,
    marginVertical: 20,
    backgroundColor: "#2a9d8f",
  },
  btnLabel: {
    fontSize: 18,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "600",
  },
  error: {
    fontSize: 14,
    textAlign: "center",
    color: "#EF4444",
    marginTop: 10,
  },
  loadingContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#3a86ff",
  },
});
