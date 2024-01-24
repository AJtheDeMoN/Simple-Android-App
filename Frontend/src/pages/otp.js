import React, { useState, useEffect } from "react";
// import {useLocation, useNavigate} from 'react-router-dom';
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useAuth } from "../Firebase/UserAuthContext";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
const OTP = ({ route }) => {
  // const { login, register } = useAuth();
  const navigation = useNavigation();
  // const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(true);
  const [signInLock, setsignInLock] = useState(false);
  const [resendTimer, setResendTimer] = useState(30); // Initial timer value in seconds
  const { login, register, currentUser } = useAuth();
  const url = process.env.REACT_APP_BACKEND_URL;
  const { email, phone, name } = route.params;
  const sendOtp = () => {
    setsignInLock(0);
    console.log(email),
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
          console.log("OTP sent again");
          // setIsResending(false);
        });
  };
  useEffect(() => {
    let timer;
    if (isResending && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (resendTimer <= 0) {
      setIsResending(false);
      setResendTimer(30);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isResending, resendTimer]);

  const showToast = (message, type = "error") => {
    Toast.show({
      text1: message,
      type: type === "error" ? "error" : "success",
    });
  };

  const handleOtp = async () => {
    console.log(otp);

    if (otp === "") {
      showToast("Enter Your OTP !");
      Alert.alert("Enter OTP!");
    } else {
      const response = await fetch("http://10.0.2.2:5000/verify_otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: parseInt(otp),
          email: email,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === "OTP verified successfully") {
            console.log(email);
            if (!phone) {
              console.log("here");
                login(email, "password").then((userCredential) => {
                const user = userCredential.user;
                navigation.navigate('Dashboard');
              }).catch ((error)=> {
                showToast(error.message);
              });
            } else {
              register(email, "password", phone, name)
              .then(() => {
                  console.log("registering");
                  navigation.navigate("Dashboard");
                })
                .catch((error) => {
                  showToast(error.message);
                });
            }
          } else {
            Alert.alert("Enter Valid OTP!");
            // setsignInLock(1);
            // showToast("Error verifying OTP");
            setResendTimer(0);
          }
        });
    }
  };
  const func = () => {
    navigation.navigate("SignIn"); // Replace 'Login' with the name of your login screen
  };

  const handleResendOtp = () => {
    if (!isResending) {
      setIsResending(true);
      sendOtp();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Enter OTP"
        textContentType="oneTimeCode"
        keyboardType="numeric"
        onChangeText={(text) => setOtp(text)}
        value={otp}
      />
      {signInLock ? (
        <Text style={styles.resendText}>Regenerate OTP...</Text>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleOtp}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      )}
      {isResending ? (
        <Text style={styles.resendText}>Resending OTP... ({resendTimer}s)</Text>
      ) : (
        <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp}>
          <Text style={styles.resendButtonText}>Resend OTP</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.signUpText}>
        Want to change email address?{" "}
        <Text style={styles.signUpLink} onPress={() => func(false)}>
          Sign In
        </Text>
      </Text>
    </View>
  );
};

export default OTP;

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
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "48%", // Adjusted width
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  resendButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    width: "48%", // Adjusted width
  },
  resendButtonText: {
    color: "#fff",
    textAlign: "right",
  },
  resendText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#777",
  },
  signUpText: {
    marginTop: 20,
    fontSize: 16,
  },
  signUpLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },

  resendButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    width: "48%",
  },
  resendButtonText: {
    color: "#fff",
    textAlign: "center",
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     width: 200,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingLeft: 10,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     paddingHorizontal: 20,
//     marginTop: 10,
//   },
//   button: {
//     backgroundColor: "#007BFF",
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//     width: "48%", // Adjusted width
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//   },
//   resendButton: {
//     backgroundColor: "#007BFF",
//     padding: 10,
//     borderRadius: 5,
//     width: "48%", // Adjusted width
//   },
//   resendButtonText: {
//     color: "#fff",
//     textAlign:"right",
//   },
//   resendText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "#777",
//   },
//   signUpText: {
//     marginTop: 20,
//     fontSize: 16,
//   },
//   signUpLink: {
//     color: "#007BFF",
//     fontWeight: "bold",
//   },
// });

// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import { useAuth } from "./UserAuthContext";

// const handleSignIn =async () => {
//   fetch('http://10.0.2.2:5000/create_otp', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       email: username,
//     })
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//     console.log("hello")
//   })

// }

// const OTP = ({ navigation, email, func, phone, name }) => {
//   const [username, setUsername] = useState("");
//   const { login, register , currentUser} = useAuth();
//   // console.log(currentUser.uid)
//   const getJWTToken = () => {
//     fetch("http://10.0.2.2:5000/gen_token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: email,
//       }),
//     })
//       .then((res) => {
//         return res.json();
//       })
//       .then((data) => {
//         console.log(data);
//         if (data.token) {
//           // localStorage.setItem("token", data.token);
//         }
//       });
//   };
//   const handleSignIn = () => {
//     console.log('clicked')
//     fetch("http://10.0.2.2:5000/verify_otp", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         otp: parseInt(username),
//         email: email,
//       }),
//     })
//       .then((res) => {
//         return res.json();
//       })
//       .then((data) => {
//         if (data.message === "OTP verified successfully") {
// toast.success("OTP verified successfully");
//           console.log('here', phone, email)
//           if (!phone) {
//             login(mail, "password")
//               .then((userCredential) => {
//                 // Signed in
//                 const user = userCredential.user;
//                 console.log('sigin success', user);
//                 // ...
//                 // getJWTToken();
// toast.success("Login Successfully");
//                 // setTimeout(() => {
//                 //   navigate("../dashboard");
//                 // }, 2000);
//               })
//               .catch((error) => {
// toast.error(error.message);
//                 console.log(error)
//               });
//           } else {
//             console.log("registering");
//             register(email, "password", phone, name)
//               .then(() => {
// toast.success("Register Successfully");
//                 getJWTToken();
//                 setTimeout(() => {
//                   navigate("../dashboard");
//                 }, 2000);
//               })
//               .catch((error) => {
// toast.error(error.message);
//               });
//           }
//         } else {
// toast.error("Error verifying OTP");
//         }
//       });
//     }
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Enter OTP</Text>
//         <TextInput
//           style={styles.input}
//           secureTextEntry={true}
//           placeholder="Enter OTP"
//           textContentType="oneTimeCode"
//           keyboardType="numeric"
//           onChangeText={(text) => setUsername(text)}
//           value={username}
//         />
//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.buttonText} onPress={handleSignIn}>
//             Sign In
//           </Text>
//         </TouchableOpacity>
//         <Text style={styles.signUpText}>
//           Want to change email address?{" "}
//           <Text style={styles.signUpLink} onPress={() => func(false)}>
//             Sign In
//           </Text>
//         </Text>
//       </View>
//     );
// }
// export default OTP;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     width: 200,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingLeft: 10,
//   },
//   button: {
//     backgroundColor: "#007BFF",
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//   },
//   signUpText: {
//     marginTop: 20,
//     fontSize: 16,
//   },
//   signUpLink: {
//     color: "#007BFF",
//     fontWeight: "bold",
//   },
// });
