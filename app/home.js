import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Pressable, StyleSheet, Text, TextInput, View, Alert, ScrollView } from 'react-native';
import { useEffect } from 'react';
import { useState } from 'react';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { FlashList } from "@shopify/flash-list";
import { router } from 'expo-router';
import { Stack } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const imagePath = require('../assets/images/app (2).png')

export default function home() {

    const [loaded, error] = useFonts({
        'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
        'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
    });

    const [getChatArray, setChatArray] = useState([]);

    useEffect(
        () => {
            async function fetchdata() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                let response = await fetch(process.env.EXPO_PUBLIC_URL+"/Ramble/LoadHomeData?id=" + user.id);

                if (response.ok) {
                    let json = await response.json();

                    if (json.success) {
                        let chatArray = json.jsonChatArray;
                        setChatArray(chatArray);
                    }

                }
            }
            fetchdata();
        }, []
    );

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]
    );

    const updateUserStatus = async () => {
        let userJson = await AsyncStorage.getItem("user");
        let user = JSON.parse(userJson);

        let response = await fetch(process.env.EXPO_PUBLIC_URL+"/Ramble/UpdateUserStatus?id=" + user.id);

        if(response.ok){
            let json = await response.json();
            console.log(json);
        }
    };

    return (


        <LinearGradient colors={['#96ceb4', '#fff', '#cccccc']} style={stylesheet.view1}>

            <StatusBar hidden={true} />

            <View style={stylesheet.header}>
                <Image source={imagePath} style={stylesheet.appImg} contentFit='contain' />
                <Text style={stylesheet.appName}>Ramble</Text>
                <Pressable style={stylesheet.profileButton} onPress={
                    () => {
                        //set user id to the chat page through URL
                        router.push("/profile");
                    }
                }>
                    <FontAwesome name="user" size={26} color="#fff" />
                </Pressable>

                <Pressable style={stylesheet.logoutButton} onPress={
                    () => {
                        Alert.alert(
                            "Logout Confirmation",
                            "Are you sure you want to logout?",
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                {
                                    text: "Yes",
                                    onPress:
                                        async () => {
                                            try {
                                                await updateUserStatus();

                                                await AsyncStorage.removeItem("user");
                                                console.log("User data cleared from AsyncStorage");

                                                router.replace("/");
                                            } catch (error) {
                                                console.error("Error clearing user data from AsyncStorage:", error);
                                            }
                                        }
                                }
                            ]
                        );

                    }
                }>
                    <FontAwesome name="power-off" size={26} color="#fff" />
                </Pressable>
            </View>

            <FlashList
                data={getChatArray}
                renderItem={
                    ({ item }) =>

                        <View style={stylesheet.listView}>

                            <Pressable style={stylesheet.view5} onPress={
                                () => {
                                    //set user id to the chat page through URL
                                    router.push(
                                        {
                                            pathname: "/chat",
                                            params: item
                                        }
                                    );
                                }
                            }>

                                <View style={item.other_user_status === 1 ? stylesheet.view6_a : stylesheet.view6_b}>
                                    {
                                        item.avatar_img_found ?
                                            //<Image source={process.env.EXPO_PUBLIC_URL+"/Ramble/AvatarImages/" + item.other_user_mobile + ".png"}
                                            <Image source={process.env.EXPO_PUBLIC_URL+"/Ramble/AvatarImages/" + item.other_user_mobile + ".png"}
                                                contentFit='contain'
                                                style={stylesheet.image1} />
                                            :
                                            <Text style={stylesheet.text6}>{item.other_user_avatar_letters}</Text>
                                    }
                                </View>

                                <View style={stylesheet.view4}>
                                    <Text style={stylesheet.text1}>{item.other_user_name}</Text>
                                    <Text style={stylesheet.text4}>{item.message}</Text>

                                    <View style={stylesheet.view7}>
                                        <Text style={stylesheet.text5}>{item.dateTime}</Text>

                                        <View style={stylesheet.view8}>
                                            <FontAwesome name={"check"} size={18}
                                                color={item.chat_status_id === 2 ? "#B0C4DE":"#318CE7" }
                                            />
                                        </View>
                                    </View>

                                </View>

                            </Pressable>

                        </View>

                }
                estimatedItemSize={200}
            />

        </LinearGradient>
    );
}


const stylesheet = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#01796f',
    },
    appImg: {
        width: 40,
        height: 40,
    },
    appName: {
        fontSize: 24,
        flex: 1,
        textAlign: 'left',
        paddingStart: 15,
        color: "white",
        fontFamily: "Lato-Regular",
    },
    profileButton: {
        paddingRight: 10
    },
    logoutButton: {
        paddingLeft: 20,
    },
    listView: {
        paddingHorizontal: 25,
    },
    view1: {
        flex: 1,
    },
    view4: {
        flex: 1,
    },
    view5: {
        flexDirection: "row",
        marginVertical: 10,
        columnGap: 10,
    },
    view6_a: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "white",
        borderStyle: "solid",
        borderWidth: 4,
        borderColor: "#318CE7",
        justifyContent: "center",
        alignItems: "center"
    },
    view6_b: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "white",
        borderStyle: "solid",
        borderWidth: 4,
        borderColor: "#B0C4DE",
        justifyContent: "center",
        alignItems: "center"
    },
    view7: {
        flexDirection: "row",
        columnGap: 10,
        alignSelf: "flex-end",
        alignItems: "center"
    },
    view8: {
        borderWidth: 1,
        borderColor: 'darkgray',
        borderRadius: 50,
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text1: {
        fontFamily: "Lato-Bold",
        fontSize: 16
    },
    text2: {
        fontFamily: "Lato-Regular",
        fontSize: 18
    },
    text3: {
        fontFamily: "Lato-Regular",
        fontSize: 14,
        alignSelf: "flex-end"
    },
    text4: {
        fontFamily: "Lato-Regular",
        fontSize: 16,
        overflow: "hidden",
    },
    text5: {
        fontFamily: "Lato-Regular",
        fontSize: 12,
    },
    text6: {
        fontFamily: "Lato-Regular",
        fontSize: 26
    },
    scrollView1: {
        marginTop: 2
    },
    image1: {
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: "white",
        justifyContent: "center",
        alignSelf: "center"
    }
}
);