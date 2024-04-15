import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { db, auth, storage } from "../firebaseConfig";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc } from "firebase/firestore";
import * as Location from "expo-location";

const AddListing = ({ navigation }) => {
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [genre, setGenre] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [bookPictureURI, setBookPictureURI] = useState("");
  const [pictureName, setPictureName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      if (auth.currentUser === null) {
        console.log("There is no user to logout!");
        navigation.navigate("Login");
      }
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.log("ERROR when logging out", error);
    }
  };

  const onChooseImagePress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    // check if user selected a photo
    if (result.canceled === true) {
      console.log("User did not select a photo");
      setBookPictureURI("");
      return;
    }

    try {
      const fileName = result.assets[0].uri.split("/").pop();
      setPictureName(
        `Selected: ....${fileName?.substring(
          fileName.length - 10,
          fileName.length
        )}`
      );
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `images/${fileName}`);
      await uploadBytesResumable(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      setBookPictureURI(url);
    } catch (error) {
      setError("Error when uploading image");
      console.log("ERROR when uploading image", error);
    }
  };

  const doFwdGeoCode = async (address) => {
    try {
      const geocodedLocation = await Location.geocodeAsync(address);
      const result = geocodedLocation[0];

      if (result === undefined) {
        alert("No coordinates found");
        setError("Address not found, try nearby.");
        return;
      }
      return { latitude: result.latitude, longitude: result.longitude };
    } catch (err) {
      setError("Address not found, try nearby.");
      console.log(err);
    }
  };

  const addListing = async () => {
    setLoading(true);

    /*
     * Request permission to access location
     * only if not already granted
     * in order to use the geocoding API
     */
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError(
        "Permission to access location was denied - please enable in settings"
      );
      setLoading(false);
      return;
    }
    if (
      bookTitle.trim() === "" ||
      author.trim() === "" ||
      price.trim() === "" ||
      genre.trim() === "" ||
      city.trim() === "" ||
      address.trim() === "" ||
      bookPictureURI.trim() === ""
    ) {
      setError("Please fill out all fields");
      setLoading(false);
      return;
    }

    const emailId = auth.currentUser.email;
    const location = await doFwdGeoCode(address);

    const newListing = {
      title: bookTitle,
      author: author,
      price: parseFloat(price),
      genre: genre,
      city: city,
      address: address,
      emailId: emailId,
      pictureURI: bookPictureURI,
      location: location,
      booking: {
        status: "available",
        borrower: "",
      },
    };

    try {
      await addDoc(collection(db, "items"), newListing);
      clearForm();
    } catch (error) {
      setError("Error when adding listing");
      console.log("ERROR when adding listing", error);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigation.navigate("My Listings");
  };

  const clearForm = () => {
    setBookTitle("");
    setAuthor("");
    setPrice("");
    setGenre("");
    setCity("");
    setAddress("");
    setBookPictureURI("");
    setPictureName("");
    setError(null);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3a86ff" />
            <Text style={styles.loadingText}>
              Listing is currently being added...
            </Text>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.imagePickerContainer}>
              <TextInput
                style={([styles.tb], { flex: 4, fontWeight: "500" })}
                value={pictureName}
                editable={false}
                placeholder="Please Choose Picture -->"
              />
              <Pressable
                style={{
                  padding: 10,
                  backgroundColor: "#a8dadc",
                  borderRadius: 8,
                }}
                onPress={onChooseImagePress}
              >
                <Text style={styles.btnLabel}>Choose Picture</Text>
              </Pressable>
            </View>
            <TextInput
              style={styles.tb}
              onChangeText={setBookTitle}
              value={bookTitle}
              placeholder="Book Title (e.g. The Great Gatsby)"
            />
            <TextInput
              style={styles.tb}
              onChangeText={setAuthor}
              value={author}
              placeholder="Author (e.g. F. Scott Fitzgerald)"
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextInput
                style={[styles.tb, { flex: 4 }]}
                onChangeText={setPrice}
                value={price}
                placeholder="Price (e.g. 10.99)"
              />
              <Text style={styles.priceText}>$ /day</Text>
            </View>
            <TextInput
              style={styles.tb}
              onChangeText={setGenre}
              value={genre}
              placeholder="Genre (e.g. Fiction)"
            />
            <TextInput
              style={styles.tb}
              onChangeText={setCity}
              value={city}
              placeholder="City (e.g. Toronto)"
            />
            <TextInput
              style={styles.tb}
              onChangeText={setAddress}
              value={address}
              placeholder="Address (e.g. 1234 Elm St)"
            />

            <View style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={addListing}>
                <Text style={styles.buttonText}>Add Listing</Text>
              </Pressable>
              <Pressable style={styles.buttonDanger} onPress={clearForm}>
                <Text style={styles.buttonText}>Clear Form</Text>
              </Pressable>
            </View>
            <Text style={styles.error}>{error}</Text>
          </View>
        )}

        <Pressable onPress={handleLogout} style={styles.btnLogOut}>
          <Text style={styles.btnLogOutLabel}>Logout</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  formContainer: {
    flexDirection: "column",
    flex: 9,
    width: "95%",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  btnLogOut: {
    paddingVertical: 14,
    marginTop: 5,
    backgroundColor: "#e76f51",
    width: "100%",
  },
  btnLogOutLabel: {
    fontSize: 18,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "600",
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
  priceText: {
    flex: 1,
    textAlign: "left",
    marginLeft: 10,
    fontWeight: "600",
  },
  btnPicture: {
    borderRadius: 8,
    paddingVertical: 14,
    marginVertical: 20,
    backgroundColor: "#a8dadc",
  },
  btnLabel: {
    fontSize: 18,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "600",
  },
  imagePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingLeft: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 35,
    padding: 5,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: "#2a9d8f",
    borderRadius: 8,
    minWidth: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDanger: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: "#f28482",
    borderRadius: 8,
    minWidth: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  error: {
    fontSize: 14,
    textAlign: "center",
    color: "#EF4444",
    marginTop: 10,
  },
  loadingContainer: {
    flex: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#3a86ff",
  },
});

export default AddListing;
