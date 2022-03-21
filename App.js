/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';

///// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
///// TODO: Add SDKs for Firebase products that you want to use
///// https://firebase.google.com/docs/web/setup#available-libraries
///import {
///  firebase,
///  getAuth,
///  createUserWithEmailAndPassword,
///} from '@react-native-firebase/auth';
import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import {Colors} from 'react-native/Libraries/NewAppScreen';

// Your web app's Firebase configuration
// TODO: Replace with your own config object
const firebaseConfig = {
  apiKey: 'AIzaSyCZGwg7hPGEBoSQO3TGNWCmZrjkwv8-6uU',
  authDomain: 'rn--auth-c0b58.firebaseapp.com',
  projectId: 'rn--auth-c0b58',
  storageBucket: 'rn--auth-c0b58.appspot.com',
  messagingSenderId: '1011840353117',
  appId: '1:1011840353117:web:4617f3847bb2b1d024deb4',
};

// Initialize Firebase
const firebaseAppConfig = initializeApp(firebaseConfig);
const auth = getAuth(firebaseAppConfig);

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const signInUser = () => {
    auth
      .signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsSignedIn(true);
      })
      .catch(error => {
        console.log(error);
        setError(error.message);
      });
  };

  const signUpUser = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(credential => {
        setIsSignedIn(true);
        const user = credential.user;
        setInfo(`Welcome ${user.email}`);
        setError('');
        console.log(user);
      })
      .catch(error => {
        setError(error.message);
        console.log(error);
      });
  };

  return (
    <>
      <View style={styles.container}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
        />
        <Button title="Register" onPress={signUpUser} />
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.infoText}>{info}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
  },
  infoText: {
    color: 'blue',
  },
});

export default App;
