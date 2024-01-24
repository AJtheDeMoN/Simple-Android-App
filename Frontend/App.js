import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './src/pages/signin';
import SignUp from './src/pages/signup';
import OTP from './src/pages/otp';
import AuthProvider from './src/Firebase/UserAuthContext';
import Dashboard from './src/pages/DashBoard';
// import { useAuth } from './src/Firebase/UserAuthContext';
const Stack=createStackNavigator();
const InsideStack = createStackNavigator();

function InsideLayout(){
  return(
    // changes required
    <InsideStack.Navigator>
      <InsideStack.Screen name="Home" component={SignIn}/>
      <InsideStack.Screen name="SignUp" component={SignUp}/>
    </InsideStack.Navigator>
    // till here
  );
}

export default function App() {
  const handleSignIn = () => {
    // Add your authentication logic here
    console.log('Username:', username);
    // You can replace the console.log statements with your authentication logic
  };
  return(
    <AuthProvider>
    <NavigationContainer>
    <Stack.Navigator initialRouteName="SignIn">
    <Stack.Screen    name="SignIn" component={SignIn} options={{headerShown:false}}/>
    <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}}/>
    <Stack.Screen  name="OTP" component={OTP} options={{headerShown:false}}/>
    <Stack.Screen    name="Dashboard" component={Dashboard} options={{headerShown:false}}/>
    </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
  )
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
