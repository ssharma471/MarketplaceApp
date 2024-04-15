import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { db, auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import {
  getDocs,
  collection,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BookListItem from "../components/BookListItem";

const MyListings = ({ navigation }) => {
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const email = auth.currentUser?.email;
    if (email) {
      try {
        // https://firebase.google.com/docs/firestore/query-data/get-data?_gl=1*1kwumxn*_up*MQ..*_ga*NzA2ODg3NjgwLjE3MTI4ODI1NDI.*_ga_CW55HF8NVT*MTcxMjg4MjU0MS4xLjAuMTcxMjg4MjU0MS4wLjAuMA..#get_multiple_documents_from_a_collection
        // Query to get all items with the current user's email
        const Q = query(collection(db, "items"), where("emailId", "==", email));
        const querySnapshot = await getDocs(Q);
        const promises = querySnapshot.docs.map(async (document) => {
          const data = document.data();
          if (
            /*
             * Check if the status is AVAILABLE or CANCELLED before fetching borrower
             */
            !["AVAILABLE", "CANCELLED"].includes(
              data.booking?.status.toUpperCase()
            ) &&
            data.booking.borrower // Check if there is a borrower
          ) {
            try {
              const borrowerDoc = await getDoc(
                doc(db, "renters", data.booking.borrower)
              );
              const borrowerData = borrowerDoc.data();
              if (borrowerData) {
                data.booking.borrower = {
                  pic: borrowerData.pic,
                  name: borrowerData.name,
                  email: borrowerData.email,
                };
              }
            } catch (error) {
              console.log("ERROR when fetching borrower", error);
            }
          } else {
            /**
             * Set borrower to empty string if status is AVAILABLE or CANCELLED
             * to prevent showing previous borrower - A residual error from Renter's Application
             */
            data.booking.borrower = "";
          }
          return { id: document.id, ...data };
        });
        /**
         * I have used async in .map() so I need to use Promise.all() to wait for all promises to resolve
         * This took me a while to figure out, Thank to this StackOverflow answer: https://stackoverflow.com/a/37576787
         */
        const user_listings = await Promise.all(promises);
        setUserListings(user_listings);
      } catch (error) {
        console.log("ERROR when fetching user listings", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login"); // Replace to prevent going back
    } catch (error) {
      console.log("ERROR when logging out", error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3a86ff" />
          <Text style={styles.loadingText}>Loading your listings...</Text>
        </View>
      ) : (
        <FlatList
          style={{ flex: 9 }}
          data={userListings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookListItem book={item} />}
          contentContainerStyle={userListings.length === 0 && styles.emptyList}
          ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
              <MaterialCommunityIcons
                name="emoticon-sad-outline"
                size={50}
                color="#e76f51"
              />
              <Text style={styles.emptyListText}>
                You didn't list any books yet!
              </Text>
            </View>
          )}
        />
      )}

      <Pressable onPress={fetchData} style={styles.fetchBtn}>
        <Text style={styles.btnLabel}>Reload Listings</Text>
      </Pressable>
      <Pressable onPress={handleLogout} style={styles.btn}>
        <Text style={styles.btnLabel}>Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
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
  listItem: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4, // For Android shadow effect
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemText: {
    fontSize: 16,
  },
  btn: {
    paddingVertical: 14,
    marginTop: 10,
    backgroundColor: "#e76f51",
    alignSelf: "center", // Center button
    width: "100%",
  },
  fetchBtn: {
    paddingVertical: 14,
    marginTop: 20,
    backgroundColor: "#3a86ff",
    width: "100%",
  },
  btnLabel: {
    fontSize: 18,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  emptyListText: {
    fontSize: 16,
    color: "#e76f51",
    marginTop: 10,
  },
});

export default MyListings;
