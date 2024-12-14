import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Pressable, StyleSheet, Text, TextInput, View, Alert, ScrollView, Button } from 'react-native';
import { useEffect } from 'react';
import { useState } from 'react';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

const imagePath = require('../assets/images/app (1).png')

export default function Profile() {

    const [getImage, setImage] = useState(null);
    const [getMobile, setMobile] = useState("");
    const [getFName, setFName] = useState("");
    const [getLName, setLName] = useState("");
    const [getPassword, setPassword] = useState("");
    const [getRegisterDate, setRegisterDate] = useState("");

    const [loaded, error] = useFonts({
        'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
        'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
    });

    useEffect(
        () => {
            async function setUserProfileData() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                setImage(
                    { uri: process.env.EXPO_PUBLIC_URL+"/Ramble/AvatarImages/" + user.mobile + ".png" }
                );

                setFName(user.first_name);
                setLName(user.last_name);
                setMobile(user.mobile);
                setPassword(user.password);
                setRegisterDate(user.registered_date_time);

            }

            setUserProfileData();
        }
        , []
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
                        <Text style={stylesheet.text1}>Welcome to your Ramble Profile!</Text>
                    </View>

                    <Pressable style={stylesheet.avatar1} onPress={
                        async () => {
                            let result = await ImagePicker.launchImageLibraryAsync(
                                {

                                }
                            );


                            if (!result.canceled) {
                                setImage(result.assets[0].uri);
                            }

                        }
                    }>
                        <Image source={getImage} style={stylesheet.avatar1} contentFit={"contain"} />
                    </Pressable>


                    <Text style={stylesheet.text4}>Mobile</Text>
                    <TextInput style={stylesheet.input1} inputMode={"tel"} maxLength={10} editable={false} value={getMobile} />

                    <Text style={stylesheet.text4}>First Name</Text>
                    <TextInput style={stylesheet.input1} value={getFName} onChangeText={
                        (text) => {
                            setFName(text);
                        }
                    } />

                    <Text style={stylesheet.text4}>Last Name</Text>
                    <TextInput style={stylesheet.input1} value={getLName} onChangeText={
                        (text) => {
                            setLName(text);
                        }
                    } />

                    <Text style={stylesheet.text4}>Password</Text>
                    <TextInput style={stylesheet.input1} secureTextEntry={true} maxLength={10} value={getPassword} onChangeText={
                        (text) => {
                            setPassword(text);
                        }
                    } />

                    <View style={stylesheet.view4}>
                        <Text style={stylesheet.text4}>Registered on :</Text>
                        <Text style={stylesheet.text4}>{getRegisterDate}</Text>
                    </View>

                    <Pressable style={stylesheet.press1} onPress={
                        async () => {

                            try {
                                let formData = new FormData();
                                formData.append("mobile", getMobile);
                                formData.append("firstname", getFName);
                                formData.append("lastName", getLName);
                                formData.append("password", getPassword);

                                if (getImage != null) {
                                    formData.append("avatarImage",
                                        {
                                            name: "avatar.png",
                                            type: "image/png",
                                            uri: getImage
                                        }
                                    );
                                }

                                let response = await fetch(
                                    process.env.EXPO_PUBLIC_URL+"/Ramble/UpdateProfile",
                                    {
                                        method: "POST",
                                        body: formData,
                                    }
                                );

                                if (response.ok) {
                                    let json = await response.json();

                                    if (json.success) {
                                        //user profile update completed
                                        let updatedUser = json.updatedUser;
                                        console.log(updatedUser);
                                        try {
                                            await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
                                            Alert.alert("User Updated", "User Successfully Updated!");
                                        } catch (error) {
                                            console.log("error while processing");
                                        }
                                    } else {
                                        //error
                                        Alert.alert("Error", json.message);
                                    }
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }>
                        <FontAwesome name={"arrow-up"} size={18} color={"black"} />
                        <Text style={stylesheet.text4}>Update Profile</Text>
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
        marginBottom: 10
    },
    view4: {
        flexDirection: "row",
        columnGap: 10,
        marginTop: 10
    },
    img1: {
        alignSelf: "center",
        marginTop: 50,
        width: "100%",
        height: 64
    },
    text1: {
        fontSize: 23,
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
    scrollView1:{
        flex:1
    }
});
