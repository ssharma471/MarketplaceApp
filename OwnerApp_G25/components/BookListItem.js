import React from "react";
import { View, Text, Image, StyleSheet, Pressable, Alert } from "react-native";
import { db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const BookListItem = ({ book }) => {
  const handleCancelBooking = async (selectedBook) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel the booking?",
      [
        {
          text: "Yes",
          onPress: async () => {
            try {
              await updateDoc(doc(db, "items", selectedBook.id), {
                booking: {
                  status: "AVAILABLE",
                  borrower: "",
                },
              });
            } catch (error) {
              console.log("Error cancelling booking", error);
            }
          },
        },
        {
          text: "No",
          onPress: () => console.log("Cancellation aborted"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.bookContainer}>
        <Image source={{ uri: book.pictureURI }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.detail}>Author: {book.author}</Text>
          <Text style={styles.detail}>Genre: {book.genre}</Text>
          <Text style={styles.detail}>City: {book.city}</Text>
          <Text style={styles.detail}>Price: ${book.price}</Text>
          <Text style={styles.detail}>Address: {book.address}</Text>
          {["AVAILABLE", "CANCELLED"].includes(
            book.booking?.status.toUpperCase()
          ) ? (
            <Text style={styles.available}>Available</Text>
          ) : (
            <Text style={styles.notAvailable}>Not Available</Text>
          )}
        </View>
      </View>
      {book.booking?.borrower && (
        <View style={styles.borrowerContainer}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Image
              source={{ uri: book.booking.borrower.pic }}
              style={styles.borrowerImage}
            />
            <View style={{ flex: 3 }}>
              <Text style={styles.borrowerDetails}>
                Borrower's Name: {book.booking.borrower.name}
              </Text>
              <Text style={styles.borrowerDetails}>
                Email: {book.booking.borrower.email}
              </Text>
            </View>
          </View>
          <View>
            <Pressable
              style={styles.button}
              onPress={() => handleCancelBooking(book)}
            >
              <Text style={styles.buttonText}>Cancel Booking</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: "#a3b18a",
  },
  bookContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  borrowerContainer: {
    padding: 10,
    backgroundColor: "#fff",
  },
  image: {
    width: 100,
    height: 130,
    marginRight: 10,
    borderRadius: 5,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    marginBottom: 2,
  },
  borrowerDetails: {
    marginLeft: 15,
    marginTop: 2,
    fontSize: 14,
    marginBottom: 2,
  },
  separator: {
    marginVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  borrowerImage: {
    flex: 1,
    width: 70,
    height: 70,
    borderRadius: 25,
    marginTop: 5,
    marginRight: 10,
    marginBottom: 5,
  },
  button: {
    marginTop: 5,
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  available: {
    marginTop: 5,
    fontWeight: "bold",
    color: "green",
  },
  notAvailable: {
    marginTop: 5,
    fontWeight: "bold",
    color: "red",
  },
});

export default BookListItem;
