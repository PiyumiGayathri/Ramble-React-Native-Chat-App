import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Pressable, StyleSheet, Text, TextInput, View, Alert, ScrollView } from 'react-native';
import { useEffect } from 'react';
import { useState } from 'react';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

const imagePath = require('../assets/images/app (1).png')

export default function index() {

  const [getImage, setImage] = useState(null);

  const [getMobile, setMobile] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getName, setName] = useState("");


  const [loaded, error] = useFonts({
    'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
    'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
  });

  useEffect(
    () => {
      async function checkUserInAsyncStorage(){

        try {
          let userjson = await AsyncStorage.getItem("user");

          if (userjson != null) {

            //user exists in AsyncStorage
            router.replace("/home");
          }

        } catch (error) {
          console.log(error);
        }
      }
      checkUserInAsyncStorage();
    },[]

  );

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]
  );

  
  return (


    <LinearGradient colors={['#96ceb4', '#fff', '#cccccc']} style={stylesheet.view1}>

      <StatusBar hidden={true} />

      <ScrollView style={stylesheet.scrollView1}>

        <View style={stylesheet.View2}>

          <Image source={imagePath} style={stylesheet.img1} contentFit='contain' />

          <View style={stylesheet.view3}>
            <Text style={stylesheet.text1}>Sign In</Text>
            <Text style={stylesheet.text2}>Welcome Back to Ramble!</Text>
          </View>

          <View style={stylesheet.avatar1}>
            <Text style={stylesheet.text5}>{getName}</Text>
          </View>

          <Text style={stylesheet.text4}>Mobile</Text>
          <TextInput style={stylesheet.input1} inputMode={"tel"} maxLength={10} onChangeText={
            (text) => {
              setMobile(text);
            }
          }

            onEndEditing={
              async () => {
                if (getMobile.length == 10) {
                  let response = await fetch(process.env.EXPO_PUBLIC_URL+"/Ramble/GetLetters?mobile=" + getMobile);

                  if (response.ok) {
                    let json = await response.json();
                    setName(json.letters);

                  } else {
                    Alert.alert("Message", "Letters Didn't Set");
                  }
                }
              }
            }
          />

          <Text style={stylesheet.text4}>Password</Text>
          <TextInput style={stylesheet.input1} secureTextEntry={true} maxLength={10} onChangeText={
            (text) => {
              setPassword(text);
            }
          } />

          <Pressable style={stylesheet.press1} onPress={
            async () => {

              let response = await fetch(
                process.env.EXPO_PUBLIC_URL+"/Ramble/SignIn",
                {
                  method: "POST",
                  body: JSON.stringify(
                    {
                      mobile: getMobile,
                      password: getPassword
                    }
                  ),
                }
              );

              if (response.ok) {
                let json = await response.json();
                //json is a js object

                if (json.success) {
                  //Sign In Success
                  let user = json.user;

                  try {
                    await AsyncStorage.setItem("user", JSON.stringify(user));
                    router.replace("/home");

                  } catch (error) {
                    Alert.alert("Error Occured!");
                  }

                } else {
                  //error
                  Alert.alert("Error", json.message);
                }
              }
            }
          }>
            <FontAwesome name={"arrow-up"} size={18} color={"black"} />
            <Text style={stylesheet.text4}>Sign In</Text>
          </Pressable>

          <Pressable style={stylesheet.press2} onPress={() => {
            router.replace("/signup");
          }}>
            <FontAwesome name={"arrow-right"} size={18} />
            <Text style={stylesheet.text4}>Sign Up</Text>
          </Pressable>

        </View>

      </ScrollView>

    </LinearGradient>
  );
}

const stylesheet = StyleSheet.create({
  view1: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  View2: {
    paddingHorizontal: 20,
    rowGap: 10,
    height: "100%"
  },
  view3: {
    justifyContent: 'center',
    alignItems: "center",
    marginBottom: 20
  },
  img1: {
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 50,
    width: "100%",
    height: 64
  },
  text1: {
    fontSize: 36,
    color: "grey",
    fontFamily: "Lato-Bold",
  },
  text2: {
    fontSize: 20,
    fontFamily: "Lato-Regular"
  },
  text4: {
    fontSize: 16,
    fontFamily: "Lato-Bold",
    paddingStart: 5
  },
  text5: {
    fontSize: 40,
    fontFamily: "Lato-Bold",
    color: "grey",
    alignSelf: "center"
  },
  input1: {
    width: "100%",
    height: 40,
    fontSize: 18,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingStart: 20,
    borderRadius: 50,
  },
  press1: {
    backgroundColor: "#eeeeee",
    height: 50,
    width: "100%",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    marginTop: 20,
    flexDirection: "row",
    columnGap: 15
  },
  press2: {
    backgroundColor: "#96ceb4",
    height: 50,
    width: "100%",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    marginTop: 20,
    flexDirection: "row",
    columnGap: 15
  },
  avatar1: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignSelf: "center"
  },
});
