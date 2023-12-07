import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
import { roomConnectingToOtherMutation } from '../../graphql/mutations';
import { Text, Image, StyleSheet, Pressable, View, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CallingPage = ({ navigation, route }: any) => {
    let { firstParticipantToken } = route.params
    const [counter, setCounter] = React.useState(0);
    const [room_Connecting_To_Other] = useMutation(roomConnectingToOtherMutation);

    async function findAnotherUser() {
        const username = await AsyncStorage.getItem('mobileNumber')
        await room_Connecting_To_Other({
            variables: {
                joinRoomArgs: {
                    username: firstParticipantToken,
                },
            },
        }).then(async (res: any) => {
            if (res.data.connectingRoom.secondParticipantToken != null) {
                if (username === res.data.connectingRoom.firstParticipantMobileNumber) {
                    setCounter(20);
                    navigation.push('RoomPage', { url: 'wss://audio-chat-nextjs-eqg35w5o.livekit.cloud/' + res.data.connectingRoom.roomName, token: res.data.connectingRoom.secondParticipantToken });
                } else {
                    // setData(res.data.connectingRoom.secondParticipantToken)
                    setCounter(20);
                    navigation.push('RoomPage', { url: 'wss://audio-chat-nextjs-eqg35w5o.livekit.cloud/' + res.data.connectingRoom.roomName, token: res.data.connectingRoom.firstParticipantToken });
                }
            } else {
                // setData(res.data.connectingRoom.secondParticipantToken)
                setCounter((prevCounter) => prevCounter + 1);
                // navigation.push('RoomPage', { url: 'wss://audio-chat-nextjs-eqg35w5o.livekit.cloud/' + res.data.connectingRoom.roomName, token: res.data.connectingRoom.firstParticipantToken });
            }
        }).catch(error => {
            Toast.show(error?.message);
        });
    }
    // useEffect(() => {
    //     findAnotherUser();
    // }, []);
    useEffect(() => {
        const maxCalls = 20;

        const intervalId = setInterval(() => {
            if (counter < maxCalls) {
                    findAnotherUser()
            } else {
                clearInterval(intervalId); // Stop the interval after 5 calls
            }
        }, 30000); // Call the function every 20 seconds

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [counter]);

    // const [data, setData] = React.useState(null);
    // const [fetchAttempts, setFetchAttempts] = React.useState(0);
    // const maxFetchAttempts = 5; // Set your desired maximum fetch attempts
    // // let intervalId = ''

    // const fetchDataAndUpdate = async () => {
    //     // Check if the maximum number of fetch attempts has been reached
    //     if (fetchAttempts >= maxFetchAttempts) {
    //         clearInterval(intervalId); // Stop the subscription
    //         return;
    //     }

    //     // async function findAnotherUser() {
    //     const username = await AsyncStorage.getItem('mobileNumber')
    //     await room_Connecting_To_Other({
    //         variables: {
    //             joinRoomArgs: {
    //                 username: firstParticipantToken,
    //             },
    //         },
    //     }).then(async (res: any) => {
    //         if (res.data.connectingRoom.secondParticipantToken != null) {
    //             if (username === res.data.connectingRoom.firstParticipantMobileNumber) {
    //                 setData(res.data.connectingRoom.secondParticipantToken)
    //                 navigation.push('RoomPage', { url: 'wss://audio-chat-nextjs-eqg35w5o.livekit.cloud/' + res.data.connectingRoom.roomName, token: res.data.connectingRoom.secondParticipantToken });
    //             } else {
    //                 // setData(res.data.connectingRoom.secondParticipantToken)
    //                 navigation.push('RoomPage', { url: 'wss://audio-chat-nextjs-eqg35w5o.livekit.cloud/' + res.data.connectingRoom.roomName, token: res.data.connectingRoom.firstParticipantToken });
    //             }
    //         }
    //     }).catch(error => {
    //         Toast.show(error?.message);
    //     });

    //     // Increment the fetch attempts counter
    //     setFetchAttempts((prevAttempts) => prevAttempts + 1);
    //     // };
    // }

    // useEffect(() => {
    //     // Initial data fetch
    //     fetchDataAndUpdate();

    //     // Subscription (e.g., polling every 10 seconds)
    //     const intervalId = setInterval(() => {
    //         fetchDataAndUpdate();
    //     }, 10000);

    //     // Cleanup function to clear the interval when the component unmounts
    //     return () => clearInterval(intervalId);
    // }, [data, fetchAttempts]); // Include 'data' and 'fetchAttempts' in the dependency array

    // const [data, setData] = React.useState(null);
    // // const [fetchAttempts, setFetchAttempts] = React.useState(20);
    // // const maxFetchAttempts = 20; // Set your desired maximum fetch attempts
    // let intervalId: any; // Declare intervalId outside useEffect

    // const fetchDataAndUpdate = async () => {
    //     // Check if the maximum number of fetch attempts has been reached
    //     // if (fetchAttempts >= maxFetchAttempts) {
    //     //     clearInterval(intervalId); // Stop the subscription
    //     //     return;
    //     // }

    //     const username = await AsyncStorage.getItem('mobileNumber')
    //     await room_Connecting_To_Other({
    //         variables: {
    //             joinRoomArgs: {
    //                 username: firstParticipantToken,
    //             },
    //         },
    //     }).then(async (res: any) => {
    //         if (res.data.connectingRoom.secondParticipantToken != null) {
    //             if (username === res.data.connectingRoom.firstParticipantMobileNumber) {
    //                 navigation.push('RoomPage', { url: 'wss://audio-chat-nextjs-eqg35w5o.livekit.cloud/' + res.data.connectingRoom.roomName, token: res.data.connectingRoom.secondParticipantToken });
    //             } else {
    //                 // setData(res.data.connectingRoom.secondParticipantToken)
    //                 navigation.push('RoomPage', { url: 'wss://audio-chat-nextjs-eqg35w5o.livekit.cloud/' + res.data.connectingRoom.roomName, token: res.data.connectingRoom.firstParticipantToken });
    //             }
    //             setData(res.data.connectingRoom.secondParticipantToken)
    //         } else {
    //             // setData(res.data.connectingRoom.secondParticipantToken)
    //             navigation.push('RoomPage', { url: 'wss://audio-chat-nextjs-eqg35w5o.livekit.cloud/' + res.data.connectingRoom.roomName, token: res.data.connectingRoom.firstParticipantToken });
    //         }
    //     }).catch(error => {
    //         Toast.show(error?.message);
    //     });

    //     // Increment the fetch attempts counter
    //     // setFetchAttempts((prevAttempts) => prevAttempts + 1);
    // };

    // useEffect(() => {
    //     // Initial data fetch
    //     fetchDataAndUpdate();

    //     // Subscription (e.g., polling every 10 seconds)
    //     intervalId = setInterval(() => {
    //         fetchDataAndUpdate();
    //     }, 30000);

    //     // Cleanup function to clear the interval when the component unmounts
    //     return () => clearInterval(intervalId);
    // }, [data, 2]);

    return (
        <View>
            <ImageBackground style={{ height: '100%' }} source={{ uri: 'https://w0.peakpx.com/wallpaper/925/686/HD-wallpaper-whatsapp-background-patterns-texture.jpg' }} resizeMode="cover">
                <View style={{ width: '100%' }}>
                    <Image
                        style={styles.userIcon}
                        source={{ uri: 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png' }}
                    />
                </View>
                <Text style={{ color: 'white', fontSize: 24, textAlign: 'center', marginTop: 15 }}>Connecting User...</Text>
                <View style={styles.container}>
                    <Pressable>
                        <View style={{ borderRadius: 100, padding: 7 }}>
                            <Image style={styles.iconOption} source={require('./icons/speaker.png')} />
                        </View>
                    </Pressable>
                    <Pressable>
                        <View style={{ borderRadius: 100, padding: 7 }}>
                            <Image style={styles.iconOption} source={require('./icons/baseline_videocam_white_24dp.png')} />
                        </View>
                    </Pressable>
                    <Pressable>
                        <View style={{ borderRadius: 100, padding: 7 }}>
                            <Image style={styles.iconOption} source={require('./icons/baseline_mic_white_24dp.png')} />
                        </View>
                    </Pressable>
                    <Pressable>
                        <View style={{ borderRadius: 100, backgroundColor: 'white' }}>
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={{ uri: 'https://img.freepik.com/free-icons/call_318-350612.jpg?w=2000' }}
                            />
                        </View>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>
    )
};

const styles = StyleSheet.create({
    userIcon: {
        width: 100,
        height: 100,
        marginTop: 50,
        alignSelf: 'center',
        borderRadius: 100,
    },

    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: 10,
        backgroundColor: '#222C35',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    iconOption: {
        width: 30,
        height: 30,
    },
});

export default CallingPage;
