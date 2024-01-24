import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import OTP from "./otp";
import { useAuth } from "../Firebase/UserAuthContext";
import { db } from '../Firebase/firebase';
import Toast from 'react-native-toast-message';
import { getDocs, query, where, collection } from 'firebase/firestore';
const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useAuth();
  // if(currentUser){
  //   navigation.navigate("Dashboard")
  // }
  const showToast = (message, type = 'error') => {
    Toast.show({
      text1: message,
      type: type === 'error' ? 'error' : 'success',
    });
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
  const emailValidator = (email) => {
    const isEmailValid =
      /^[a-zA-Z]+@iitrpr\.ac\.in$/.test(email) ||
      /^[a-zA-Z]+\.[a-zA-Z]+@iitrpr\.ac\.in$/.test(email) ||
      /^20\d{2}[a-zA-Z]{3}1\d{3}@iitrpr\.ac\.in$/.test(email) ||
      /^[a-zA-Z]+\.\d{2}[a-zA-Z]{2}z\d{4}@iitrpr\.ac\.in$/.test(email);

      return isEmailValid;
  }
  const handleSignIn = async () => {
    // fetch("http://10.0.2.2:5000/create_otp", {
      try {
        if (email === "") {
          showToast("Enter Your Email !");Alert.alert("Enter Your Email !");
        } else if (!emailValidator(email)) {
          Alert.alert("Enter Valid Email !");
        } else {
          const isRegistered = await checkIfRegistered(email);
  
          if (!isRegistered) {
            console.log("Email not registered");
            Alert.alert("Email not registered", "Please sign up to continue.");
            // showToast("Email not registered");
          } else {
            // setSpinner(true);
            const url = process.env.REACT_APP_BACKEND_URL;
            const response = await fetch("http://10.0.2.2:5000/create_otp", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                email: email
              })
            });
  
            const data = await response.json();
            // setSpinner(false);
  
            if (data.message === "OTP already sent") {
              Alert.alert("OTP already sent!!");
              showToast("OTP already sent");
              navigation.navigate("OTP", { email: email });
            } else if (data.message === "OTP sent successfully") {
              navigation.navigate("OTP", { email: email });
              showToast("OTP Sent Successfully !");
            } else {
              showToast("Error sending OTP");
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    useEffect(() => {
      console.log(currentUser)
      if (currentUser) {
        navigation.navigate("Dashboard");
      }
    }, [])
  return (
    <View style={styles.container}>
  
        <>
          <Text style={styles.title}>Sign In</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={() => handleSignIn()}>
              Generate OTP
            </Text>
          </TouchableOpacity>

          <Text style={styles.signUpText}>
            Don't have an account?{" "}
            <Text
              style={styles.signUpLink}
              onPress={() => navigation.navigate("SignUp")}
            >
              Sign Up
            </Text>
          </Text>
        </>
      
    </View>
  );
};
export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  signUpText: {
    marginTop: 20,
    fontSize: 16,
  },
  signUpLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});
