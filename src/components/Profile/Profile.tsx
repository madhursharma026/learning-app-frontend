import * as React from 'react';
import { Dispatch } from 'redux';
import { Header } from '../Header';
import RNFS from 'react-native-fs';
import { connect } from 'react-redux';
import TextInputBox from '../TextInput';
import COLORS from '../../themes/colors';
import { RootState } from '../../redux/store';
import { GET_SINGLE_USER } from '../../graphql/query';
import DocumentPicker from 'react-native-document-picker';
import { EditUserProfile } from '../../graphql/mutations';
import { useLazyQuery, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet, View, Button, Keyboard, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getResponsiveFontSize, responsiveHeight } from '../../utils/scalingUtils';

const Profile = ({ navigation, colors }: { navigation: any; colors: any }) => {
  const [imageUri, setImageUri] = React.useState('');
  const [SingleUser] = useLazyQuery(GET_SINGLE_USER);
  const [lastName, setLastName] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [alertData, setAlertData] = React.useState('');
  const [Edit_User_Profile] = useMutation(EditUserProfile);
  const [isAlertVisible, setIsAlertVisible] = React.useState(false);
  const [errorMessageLastName, setErrorMessageLastName] = React.useState('');
  const [errorMessageFirstName, setErrorMessageFirstName] = React.useState('');

  const getSingleUserDetails = async () => {
    const mobileNumber = await AsyncStorage.getItem('mobileNumber')
    await SingleUser({
      variables: {
        mobileNumber: mobileNumber
      },
    })
      .then(res => {
        setFirstName(res.data.user.firstName)
        setLastName(res.data.user.lastName)
        setImageUri(`${RNFS.DocumentDirectoryPath}/${res.data.user.profileImage}`)
        console.log(`${RNFS.DocumentDirectoryPath}/${res.data.user.profileImage}`)
      })
      .catch(err => console.log('getAllUsers err ==> ', err));
  };

  React.useEffect(() => {
    getSingleUserDetails()
  }, []);

  async function SaveDetails() {
    Keyboard.dismiss();
    if (!firstName || firstName === '') {
      setErrorMessageFirstName("First Name Is Required*");
      return;
    }
    if (!lastName || lastName === '') {
      setErrorMessageLastName("Last Name Is Required*");
      return;
    }
    const mobileNumber = await AsyncStorage.getItem('mobileNumber')
    await Edit_User_Profile({
      variables: {
        updateUserInput: {
          firstName: firstName,
          lastName: lastName,
          mobileNumber: mobileNumber,
        },
      },
    })
      .then(async (res: any) => {
        setAlertData("Profile Updated Successfully!")
        setIsAlertVisible(true);
        getSingleUserDetails()
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 3000);
      })
      .catch((error: any) => {
        setAlertData(error?.message);
        setIsAlertVisible(true);
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 3000);
      });
  }

  async function updateProfileImage(gettingProfileImage: any) {
    const mobileNumber = await AsyncStorage.getItem('mobileNumber')
    const fileName = gettingProfileImage.name; // Set a filename for the saved image
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    await RNFS.copyFile(gettingProfileImage.uri, path);
    setImageUri(path)
    console.log(path)
    await Edit_User_Profile({
      variables: {
        updateUserInput: {
          mobileNumber: mobileNumber,
          profileImage: fileName,
        },
      },
    })
      .then(async (res: any) => {
        setAlertData("Profile Updated Successfully!")
        setIsAlertVisible(true);
        // getSingleUserDetails()
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 3000);
      })
      .catch((error: any) => {
        setAlertData(error?.message);
        setIsAlertVisible(true);
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 3000);
      });
  }

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      updateProfileImage(res[0])
      console.log(res)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picking');
      } else {
        console.log('DocumentPicker Error: ', err);
      }
    }
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.SCREEN_BG_COLOR }]}>
      <Header title="Profile" navigation={navigation} colors={colors} />
      {isAlertVisible ?
        <View style={styles.alertView}>
          <Text style={styles.mainHeading}>{alertData}</Text>
        </View>
        :
        <></>
      }
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 20 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
            {(imageUri !== '') ? (
              <Image source={{ uri: `file://${imageUri}` }} style={styles.profileImage} />
            ) :
              <Image style={styles.profileImage}
                source={{ uri: ('https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg') }}
              />}
            <Button title="Change" onPress={() => selectFile()} />
          </View>
          <TextInputBox inputTitle="First Name"
            textInputProps={{ placeholder: 'FirstName', value: firstName, onChangeText: (text: any) => { setFirstName(text); setErrorMessageFirstName(''); }, placeholderTextColor: colors.SLIDE_NOTE_COLOR, }}
            inputStyle={[styles.inputTextStyle, { borderBottomColor: colors.SLIDE_NOTE_COLOR, color: colors.INPUT_FIELD_COLOR, },]}
            wrapperStyle={{ marginTop: 0 }}
            colors={colors}
            error={errorMessageFirstName ? errorMessageFirstName : ''}
          />
          <View style={{ marginVertical: 20 }}>
            <TextInputBox inputTitle="Last Name"
              textInputProps={{ placeholder: 'LastName', value: lastName, onChangeText: (text: any) => { setLastName(text); setErrorMessageLastName(''); }, placeholderTextColor: colors.SLIDE_NOTE_COLOR, }}
              inputStyle={[styles.inputTextStyle, { borderBottomColor: colors.SLIDE_NOTE_COLOR, color: colors.INPUT_FIELD_COLOR, },]}
              wrapperStyle={{ marginTop: 0 }}
              colors={colors}
              error={errorMessageLastName ? errorMessageLastName : ''}
            />
          </View>
          <Button title="Save Details" onPress={() => SaveDetails()} />
        </View>
      </KeyboardAwareScrollView>
    </View>

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
export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  profileImage: {
    width: 150,
    height: 150,
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: 'black',
  },
  inputTextStyle: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BLACK_OPACITY_2,
    fontSize: getResponsiveFontSize(14),
    paddingBottom: responsiveHeight(0.2),
  },
  alertView: {
    backgroundColor: '#28A745',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  mainHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
});

