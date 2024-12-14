import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Pressable, StyleSheet, Text, TextInput, View, Alert, ScrollView, SafeAreaView ,KeyboardAvoidingView, Platform} from 'react-native';
import { useEffect } from 'react';
import { useState } from 'react';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function chat() {

    //get parameters
    const item = useLocalSearchParams();

    const [getChatArray, setChatArray] = useState([]);
    const [getChatText, setChatText] = useState([]);

    const [loaded, error] = useFonts({
        'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
        'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]
    );


    //fetch chat array from server
    useEffect(
        () => {
            async function fetchChatArray() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                let response = await fetch(process.env.EXPO_PUBLIC_URL+"/Ramble/LoadChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id);

                if (response.ok) {
                    let chatArray = await response.json();
                    setChatArray(chatArray);
                }
            }

            fetchChatArray(); 

            console.log("Avatar found:", item.avatar_img_found);

            setInterval(() => {
                fetchChatArray(); 
            }, 5000);
        }
        , []
    );

    return (
        <LinearGradient colors={['#96ceb4', '#fff', '#cccccc']} style={stylesheet.view1}>
            <StatusBar hidden={true} />

            <View style={stylesheet.view2}>
                <View style={stylesheet.view3}>
                    {
                        item.avatar_img_found == "true"
                            ?
                            <Image source={{uri:process.env.EXPO_PUBLIC_URL+"/Ramble/AvatarImages/" + item.other_user_mobile + ".png"}} 
                            contentFit={'contain'} style={stylesheet.image1} onError={() => console.log("Error loading image")}/>
                            :
                            <Text style={stylesheet.text1}>{item.other_user_avatar_letters}</Text>
                    }
                    
                </View>
                <View style={stylesheet.view4}>
                    <Text style={stylesheet.text2}>{item.other_user_name}</Text>
                    <Text style={stylesheet.text3}>{item.other_user_status == 1 ? "Online" : "Offline"}</Text>
                </View>
            </View>

            <View style={stylesheet.center_view}>

                <FlashList
                    data={getChatArray}
                    renderItem={
                        ({ item }) =>
                            <View style={item.side == "right" ? stylesheet.view5_a : stylesheet.view5_b}>
                                <Text style={stylesheet.text3}>{item.message}</Text>
                                <View style={stylesheet.view6}>
                                    <Text style={stylesheet.text4}>{item.datetime}</Text>
                                    {
                                        item.side == "right" ?
                                            <FontAwesome name={"check"} size={18}
                                                color={item.status == 1 ? "#318CE7" : "#B0C4DE"}
                                            />
                                            :
                                            null
                                    }
                                </View>
                            </View>
                    }
                    estimatedItemSize={200}
                />

            </View>

            <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={stylesheet.view7}>
                <TextInput style={stylesheet.input1} placeholder={"Type Here..."} value={getChatText} onChangeText={
                    (text) => {
                        setChatText(text);
                    }
                } />
                <Pressable style={stylesheet.press1} onPress={
                    async () => {

                        if (getChatText.length == 0) {
                            Alert.alert("Error","Please Enter Your Message");
                        } else {
                            let userJson = await AsyncStorage.getItem("user");
                            let user = JSON.parse(userJson);

                            let response = await fetch(process.env.EXPO_PUBLIC_URL+"/Ramble/SendChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id + "&message=" + getChatText);
                            if (response.ok) {
                                let json = await response.json();

                                if (json.success) {
                                    console.log("message sent");
                                    setChatText("");
                                }
                            }
                        }

                    }
                }>
                    <FontAwesome name={"arrow-right"} size={20} />
                </Pressable>
            </KeyboardAvoidingView>

        </LinearGradient>
    );
}


const stylesheet = StyleSheet.create({
    view1: {
        flex: 1,
    },
    view2: {
        marginTo: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        columnGap: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    view3: {
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderColor: "green"
    },
    view4: {
        rowGap: 4
    },
    view5_a: {
        backgroundColor: "white",
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        justifyContent: "center",
        alignSelf: "flex-end",
        rowGap: 5
    },
    view5_b: {
        backgroundColor: "white",
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        justifyContent: "center",
        alignSelf: "flex-start",
        rowGap: 5
    },
    view6: {
        flexDirection: "row",
        columnGap: 10
    },
    view7: {
        flex:1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 10,
        paddingHorizontal: 20,
        backgroundColor: "#96ceb4",
    },
    center_view: {
        flex: 2,
        marginVertical: 20
    },
    input1: {
        height: 40,
        borderRadius: 10,
        fontFamily: "Lato-Regular",
        fontSize: 18,
        flex: 1,
        paddingStart: 10,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#306B5A"
    },
    press1: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#306B5A"
    },
    text1: {
        fontSize: 26,
        fontFamily: "Lato-Regular",
    },
    text2: {
        fontSize: 20,
        fontFamily: "Lato-Regular",
    },
    text3: {
        fontSize: 16,
        fontFamily: "Lato-Regular",
    },
    text4: {
        fontSize: 12,
        fontFamily: "Lato-Regular",
    },
    image1: {
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: "white",
        justifyContent: "center",
        alignSelf: "center"
    }
});