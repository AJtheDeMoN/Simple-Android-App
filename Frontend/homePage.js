import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './signin';
import SignUp from './signup';
const Stack=createStackNavigator();

export default function App() {
  

  const handleSignIn = () => {
    // Add your authentication logic here
    console.log('Username:', username);
    // You can replace the console.log statements with your authentication logic
  };
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SignIn'>
        <Stack.Screen name="SignIn" component={SignIn}/>
        <Stack.Screen name="SignUp" component={SignUp}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.title}>Sign In</Text>
  //     <TextInput
  //       style={styles.input}
  //       placeholder="Username"
  //       onChangeText={(text) => setUsername(text)}
  //       value={username}
  //     />
  //     <TouchableOpacity style={styles.button} onPress={handleSignIn}>
  //       <Text style={styles.buttonText}>Sign In</Text>
  //     </TouchableOpacity>
  //     <Text style={styles.signUpText}>Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text></Text>
  //     <StatusBar style="auto" />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  signUpText: {
    marginTop: 20,
    fontSize: 16,
  },
  signUpLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
