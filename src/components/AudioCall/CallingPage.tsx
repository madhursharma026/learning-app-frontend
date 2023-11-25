import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
import { roomConnectingToOtherMutation } from '../../graphql/mutations';
import { Text, Image, StyleSheet, Pressable, View, ImageBackground } from 'react-native';

const CallingPage = ({ navigation, route }: any) => {
    let { firstParticipantToken } = route.params
    const [room_Connecting_To_Other] = useMutation(roomConnectingToOtherMutation);

    async function findAnotherUser() {
        await room_Connecting_To_Other({
            variables: {
                joinRoomArgs: {
                    username: firstParticipantToken,
                },
            },
        }).then(async (res: any) => {
            if (res.data.connectingRoom.secondParticipantToken != null) {
                navigation.push('RoomPage', { url: 'wss://audio-chat-nextjs-eqg35w5o.livekit.cloud/' + res.data.connectingRoom.roomName, token: res.data.connectingRoom.secondParticipantToken });
            } else {
                navigation.push('RoomPage', { url: 'wss://audio-chat-nextjs-eqg35w5o.livekit.cloud/' + res.data.connectingRoom.roomName, token: res.data.connectingRoom.firstParticipantToken });
            }
        }).catch(error => {
            Toast.show(error?.message);
        });
    }
    useEffect(() => {
        findAnotherUser();
    }, []);

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
