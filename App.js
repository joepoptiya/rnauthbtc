/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

///// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} from 'firebase/auth';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

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
const emailAuth = getAuth(firebaseAppConfig);

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [authProvider, setAuthProvider] = useState('');

  GoogleSignin.configure({
    webClientId:
      '1011840353117-nb14k1mv796clus774fsv8lrpqqb7jl2.apps.googleusercontent.com',
  });

  const AuthProviderType = {
    None: 'None',
    Email: 'Email',
    Google: 'Google',
  };

  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@storage_Key', jsonValue);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  const signInUser = () => {
    signInWithEmailAndPassword(emailAuth, email, password)
      .then(credential => {
        setIsSignedIn(true);
        const user = credential.user;
        setInfo(`Welcome ${user.email}`);
        setError('');
        console.log(JSON.stringify(credential));
        setAuthProvider(AuthProviderType.Email);
      })
      .catch(error => {
        setAuthProvider(AuthProviderType.None);
        setIsSignedIn(false);
        console.log(error);
        setError(error.message);
      });
  };

  const signUpUser = () => {
    createUserWithEmailAndPassword(emailAuth, email, password)
      .then(credential => {
        setIsSignedIn(true);
        const user = credential.user;
        setInfo(`Welcome ${user.email}`);
        setError('');
        setAuthProvider(AuthProviderType.Email);
        console.log(user);
      })
      .catch(error => {
        setIsSignedIn(false);
        setError(error.message);
        setAuthProvider(AuthProviderType.None);
        console.log(error);
      });
  };

  const signOutUser = () => {
    signOut(emailAuth)
      .then(() => {
        setIsSignedIn(false);
        setInfo('You have been signed out');
        setError('');
        setAuthProvider(AuthProviderType.None);
        console.log('User signed out');
      })
      .catch(error => {
        setIsSignedIn(false);
        setError(error.message);
        setAuthProvider(AuthProviderType.None);
        console.log(error);
      });
  };

  const googleSignInAsync = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in
      .then(credential => {
        setIsSignedIn(true);
        const user = credential.user;
        setInfo(`Welcome ${user.email}`);
        setError('');
        console.log(JSON.stringify(credential));
        const cu = GoogleSignin.getTokens().then(tokens => {
          console.log(tokens);
        });
        console.log();
        setAuthProvider(AuthProviderType.Google);
      })
      .catch(error => {
        setAuthProvider(AuthProviderType.None);
        setIsSignedIn(false);
        setError(error.message);
        console.log(error);
      });
  };

  const googleSignOutAsync = async () => {
    try {
      const res_ra = await GoogleSignin.revokeAccess();
      console.log(res_ra);
      const res_so = await GoogleSignin.signOut();
      console.log(res_so);
      setIsSignedIn(false);
      setInfo('You have been signed out');
      setError('');
      setAuthProvider(AuthProviderType.None);
      console.log('Google User signed out');
    } catch (error) {
      setAuthProvider(AuthProviderType.None);
      console.error(error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {!isSignedIn || authProvider === AuthProviderType.None ? (
          <>
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
            <Button title="Sign In" onPress={signInUser} />
            <Button title="Register" onPress={signUpUser} />
            <Button title="Sign In with Google" onPress={googleSignInAsync} />
          </>
        ) : (
          <>
            {authProvider === AuthProviderType.Email ? (
              <Button title="Sign Out" onPress={signOutUser} />
            ) : (
              <Button title="Google Sign Out" onPress={googleSignOutAsync} />
            )}
          </>
        )}
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
