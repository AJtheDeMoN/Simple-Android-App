import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,Alert } from 'react-native';
import { ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import OTP from "./otp";
import { useAuth } from "../Firebase/UserAuthContext";

export default function SignUp({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const sendOtp = () => {
    console.log(email)
      fetch("http://10.0.2.2:5000/create_otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          console.log("OTP sent");
          // setIsResending(false);
        });
  };
  const emailValidator = (email) => {
    const isEmailValid =
      /^[a-zA-Z]+@iitrpr\.ac\.in$/.test(email) ||
      /^[a-zA-Z]+\.[a-zA-Z]+@iitrpr\.ac\.in$/.test(email) ||
      /^20\d{2}[a-zA-Z]{3}1\d{3}@iitrpr\.ac\.in$/.test(email) ||
      /^[a-zA-Z]+\.\d{2}[a-zA-Z]{2}z\d{4}@iitrpr\.ac\.in$/.test(email);
      // console.log('inside a
      return isEmailValid;
  }
  const handleSignUp = async () => {
    try {
      if (name === '') {
        ToastAndroid.show('Enter Your Name', ToastAndroid.SHORT);
      } else if (email === '') {
        ToastAndroid.show('Enter Your Email', ToastAndroid.SHORT);
      } else if (phoneNumber === '' || phoneNumber.length !== 10) {
        ToastAndroid.show('Enter Valid Phone Number', ToastAndroid.SHORT);
      } else if (!emailValidator(email)) {
        ToastAndroid.show('Enter Valid Email', ToastAndroid.SHORT);
      } else {
        // Check if email is already registered
        const isRegistered = await checkIfRegistered(email);

        if (isRegistered) {
          Alert.alert("Email already registered!");
          ToastAndroid.show('Email already registered', ToastAndroid.SHORT);
          console.log('Email already registered');
        } else {
          // Add your sign-up logic here
          // For simplicity, I'm logging the data, you can replace this with your actual sign-up logic
          console.log('Name:', name);
          console.log('Email:', email);
          console.log('Phone Number:', phoneNumber);

          // Navigate to OTP screen
          ToastAndroid.show('OTP Send Successfully !', ToastAndroid.SHORT);
          sendOtp();
          navigation.navigate('OTP',
            { email: email, phone: phoneNumber, name: name })
          ;
        }
      }
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Error signing up', ToastAndroid.SHORT);
    }
  };

  const checkIfRegistered = async (email) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      return querySnapshot.size > 0;
    } catch (error) {
      console.error("Error checking if registered:", error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        onChangeText={(text) => setPhoneNumber(text)}
        value={phoneNumber}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.signInText}>
        Already have an account? <Text style={styles.signInLink} onPress={() => navigation.navigate('SignIn')}>Sign In</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 8,
    width:250,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  signInText: {
    marginTop: 16,
  },
  signInLink: {
    color: 'blue',
  },
});
