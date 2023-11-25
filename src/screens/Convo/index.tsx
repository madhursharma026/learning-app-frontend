import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import COLORS from '../../themes/colors';
import Button from '../../components/Button';
import { RootState } from '../../redux/store';
import Toast from 'react-native-toast-message';
import { FlatList, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Header } from '../../components/Header';
import { STRINGS } from '../../constants/strings';
import { GET_ALL_USERS } from '../../graphql/query';
import { responsiveHeight, scale } from '../../utils/scalingUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApolloClient, useLazyQuery, useMutation, } from '@apollo/client';
import { CallHistoryIncomming, CallHistoryOutGoing, INITIATE_CONVERSATION, JoinRoomMutation, PAIR_MATCHES, roomConnectingToOtherMutation } from '../../graphql/mutations';

const Convo = ({ navigation, colors }: { navigation: any; colors: any }) => {
  const client = useApolloClient();
  const [allUsers] = useLazyQuery(GET_ALL_USERS);
  const subscription = client.subscribe({ query: PAIR_MATCHES });
  const [initiateConversation] = useMutation(INITIATE_CONVERSATION);
  const [Join_Room_Mutation] = useMutation(JoinRoomMutation);
  const [room_Connecting_To_Other] = useMutation(roomConnectingToOtherMutation);
  const [call_History_Incomming] = useMutation(CallHistoryIncomming);
  const [call_History_OutGoing] = useMutation(CallHistoryOutGoing);
  const [callDetailsIncomming, setCallDetailsIncomming] = React.useState()
  const [callDetailsOutGoing, setCallDetailsOutGoing] = React.useState()

  const getAllUsers = async () => {
    await allUsers({
      variables: {},
    })
      .then(res => {
        console.log('getAllUsers res ==> ', res.data.users[0].id);
      })
      .catch(err => console.log('getAllUsers err ==> ', err));
  };

  React.useEffect(() => {
    getAllUsers()
  }, []);

  React.useEffect(() => {
    initiateChat();
    return () => { };
  }, []);

  const initiateChat = async () => {
    await initiateConversation({
      variables: {},
    }).then(res => {
      console.log('API Call initiateConversation res ==> ', res);
      matchPair();
    }).catch(err => console.log('API Call initiateConversation err ==> ', err));
  };

  const matchPair = () => {
    subscription.subscribe({
      next: result => {
        console.log('API Call Received subscription data:', result.data);
      },
      complete: () => {
        console.log('subscription complete ==> ');
      },
      error: error => {
        console.error('API Call Subscription error:', error);
      },
    });
  };

  async function joinRoom2(userToken: string) {
    await room_Connecting_To_Other({
      variables: {
        joinRoomArgs: {
          username: userToken,
        },
      },
    }).then(async (res: any) => {
      AsyncStorage.setItem("roomName", res.data.connectingRoom.roomName)
      navigation.push('CallingPage', { firstParticipantToken: res.data.connectingRoom.firstParticipantToken });
    })
      .catch(error => {
        Toast.show(error?.message);
      });
  }

  async function joinRoom() {
    const username = await AsyncStorage.getItem('mobileNumber')
    await Join_Room_Mutation({
      variables: {
        joinRoomArgs: {
          username: username,
        },
      },
    })
      .then(async (res: any) => {
        joinRoom2(res.data.joinRoom.firstParticipantToken)
      })
      .catch(error => {
        Toast.show(error?.message);
      });
  }

  async function OutGoingCallHistoryFunction() {
    const username = await AsyncStorage.getItem('mobileNumber')
    await call_History_OutGoing({
      variables: {
        joinRoomArgs: {
          username: username,
        },
      },
    }).then(async (res: any) => {
      setCallDetailsOutGoing(res.data.showMyAllCallsInLast24HrsOutGoing)
    })
      .catch(error => {
        Toast.show(error?.message);
      });
  }

  async function IncommingCallHistoryFunction() {
    const username = await AsyncStorage.getItem('mobileNumber')
    await call_History_Incomming({
      variables: {
        joinRoomArgs: {
          username: username,
        },
      },
    }).then(async (res: any) => {
      setCallDetailsIncomming(res.data.showMyAllCallsInLast24HrsIncomming)
      OutGoingCallHistoryFunction()
    })
      .catch(error => {
        Toast.show(error?.message);
      OutGoingCallHistoryFunction()
      });
  }

  React.useEffect(() => {
    IncommingCallHistoryFunction()
  }, [])


  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: colors.SCREEN_BG_COLOR }]}>
        <Header title={STRINGS.CONVO} navigation={navigation} colors={colors} />
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 22, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: 'black', }}>Call Histroy</Text>
          <FlatList data={callDetailsIncomming} style={{ marginBottom: 0, paddingBottom: 10 }} renderItem={({ item, index }) =>
            <>
              {item.participants === 1 ?
                <Text style={{ fontSize: 18, paddingVertical: 5 }}>{item.firstParticipantMobileNumber} {'        '}🔁{'        '} <Text style={{ textAlign: 'right' }}>Not Connected</Text></Text>
                :                
                <Text style={{ fontSize: 18, paddingVertical: 5 }}>{item.secondParticipantMobileNumber} {'        '}🔁{'        '} <Text style={{ textAlign: 'right' }}>Connected</Text></Text>
              }
            </>
          }
          />
          <FlatList data={callDetailsOutGoing} style={{ marginBottom: 0, paddingBottom: 10 }} renderItem={({ item, index }) =>
            <>
              {item.participants === 1 ?
                <Text style={{ fontSize: 18, paddingVertical: 5 }}>{item.secondParticipantMobileNumber} {'        '}🔁{'        '} <Text style={{ textAlign: 'right' }}>Not Connected</Text></Text>
                :
                <Text style={{ fontSize: 18, paddingVertical: 5 }}>{item.firstParticipantMobileNumber} {'        '}🔁{'        '} <Text style={{ textAlign: 'right' }}>Connected</Text></Text>
              }
            </>
          }
          />
          <Button title={'Find Random Partner'} wrapperStyle={styles.loginBtnViewStyle} onClick={() => joinRoom()} />

          <Button title={'Get All Users'} wrapperStyle={styles.loginBtnViewStyle} />
        </View>
      </View>
    </ScrollView>
  );
};

const mapStateToProps = (state: RootState) => {
  const { themeReducer } = state;
  const { themeMode, isDark, colors } = themeReducer;
  return {
    themeMode,
    isDark,
    colors,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Convo);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE, },
  loginBtnViewStyle: {
    borderRadius: 8,
    height: scale(45),
    marginHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(1),
    backgroundColor: COLORS.BLUE_STONE,
  },
});


