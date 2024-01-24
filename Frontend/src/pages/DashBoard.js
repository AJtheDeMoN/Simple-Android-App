import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { updateDoc, doc, getDoc, setDoc, collection } from "firebase/firestore";
import { db } from '../Firebase/firebase';
import { useAuth } from '../Firebase/UserAuthContext';
import { getDocs, query, where } from 'firebase/firestore';

const Dashboard = ({navigation}) => {
  // const navigation = useNavigation();
  const { currentUser, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log(currentUser)
  const getUserInfo = () => {
    getDoc(doc(db, "users", currentUser)).then((doc) => {
      if (doc.exists()) {
        console.log("Document data:", doc.data());
        setEmail(doc.data().email);
        setName(doc.data().name);
        setPhone(doc.data().phone);
        setLoading(false);
        console.log(email, name, phone);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
  }

  const handleEdit = async () => {
      if (isEditing) {
        // Save the changes
        setDoc(doc(db, "users", currentUser), {
          name: name,
          phone: phone
        },{merge:true});
      }
      setIsEditing(!isEditing);
    }


  const handleSignOut = async () => {
    try {
      await logout();
      // Navigate to the login screen
      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);
return (
  <View style={styles.container}>
    {loading ? (
      <Text>Loading...</Text>
    ) : (
      <View style={styles.userDetailsContainer}>
        <Text style={styles.userName}>User Information</Text>
        <TextInput
          value={name}
          editable={isEditing}
          onChangeText={(text) => setName(text)}
          style={styles.input}
          placeholder="Name"
          color="#000"
        />
        <TextInput
          value={email}
          editable={false}
          style={styles.input}
          color="#000"
          placeholder="Email"
        />
        <TextInput
          value={phone}
          editable={isEditing}
          onChangeText={(text) => setPhone(text)}
          style={styles.input}
          color="#000"
          placeholder="Phone"
        />
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={[styles.bottomButton, styles.saveButton]}
            onPress={handleEdit}
          >
            <Text style={styles.bottomButtonText}>{isEditing ? "Save" : "Edit"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={handleSignOut}
          >
            <Text style={styles.bottomButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  </View>
);
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  userDetailsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  bottomButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    marginHorizontal:10,
    borderRadius: 5,
    width: "48%",
  },
  bottomButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  input: {
    width: "80%",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 5,
  },
  saveButton: {
    paddingLeft:10,
    backgroundColor: "#5cb85c",
  },
});
