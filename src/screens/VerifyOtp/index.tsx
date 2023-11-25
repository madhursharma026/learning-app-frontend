import { Dispatch } from 'redux';
import SyncStorage from 'sync-storage';
import React, { useEffect, useState } from 'react';
import COLORS from '../../themes/colors';
import Button from '../../components/Button';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-simple-toast';
import { RootState } from '../../redux/store';
import { Header } from '../../components/Header';
import { STRINGS } from '../../constants/strings';
import { connect, useDispatch } from 'react-redux';
import TextInputBox from '../../components/TextInput';
import { setAuthToken } from '../../utils/storageUtils';
import { USER_LOGIN_VERIFICATION } from '../../graphql/mutations';
import { setAuthTokenAction } from '../../redux/reducers/authReducer';
import { View, StyleSheet, Keyboard, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { responsiveHeight, responsiveWidth, scale, getResponsiveFontSize, } from '../../utils/scalingUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';


const VerifyOtp = ({ route, navigation, colors, isDark, }: { route: any; navigation: any; colors: any; isDark: boolean; },) => {

  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userLoginVerification] = useMutation(USER_LOGIN_VERIFICATION);

  useEffect(() => {
    AsyncStorage.setItem("mobileNumber", route?.params?.mobileNumber)
  }, [])
  const onSubmit = async () => {
    Keyboard.dismiss();
    if (!otp || otp === '') {
      setErrorMessage(STRINGS.PLEASE_ENTER_OTP);
      return;
    }
    await userLoginVerification({
      variables: {
        loginVerificationInput: {
          mobileNumber: route?.params?.mobileNumber.toString(),
          otpCode: otp.toString(),
        },
      },
    }).then(async res => {
      console.log('res?.data?. ==> userLoginVerification ', res?.data);
      // AsyncStorage.setItem('mobileNumber', route?.params?.mobileNumber);
      let token = res?.data?.userLoginVerification?.jwtToken;
      await setAuthToken(token);
      Toast.show(String(STRINGS.VERIFY_OTP_SUCCESS));
      dispatch(setAuthTokenAction(token));
    }).catch(error => {
      Toast.show(error?.message);
    });
  };

  const renderBottomButtons = () => {
    return (
      <View style={styles.marginBottomViewStyle}>
        <Button title={STRINGS.SUBMIT} onClick={onSubmit} />
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.ONBOARDING_BG_COLOR }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header title={STRINGS.VERIFY_OTP} navigation={navigation} isLeftView={true} colors={colors} isDark={isDark} />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={styles.subContentViewStyle}>
            <View style={styles.inputContentViewStyle}>
              <TextInputBox inputTitle={STRINGS.VERIFY_OTP}
                textInputProps={{ placeholder: STRINGS.ENTER_OTP, value: otp, onChangeText: (text: any) => { setOtp(text); setErrorMessage(''); }, placeholderTextColor: colors.SLIDE_NOTE_COLOR, }}
                inputStyle={[styles.inputTextStyle, { borderBottomColor: colors.SLIDE_NOTE_COLOR, color: colors.INPUT_FIELD_COLOR, },]}
                wrapperStyle={{ marginTop: 0 }}
                colors={colors}
                error={errorMessage ? errorMessage : ''}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        {renderBottomButtons()}
      </SafeAreaView>
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
export default connect(mapStateToProps, mapDispatchToProps)(VerifyOtp);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  subContentViewStyle: {
    flex: 1,
    paddingHorizontal: responsiveWidth(2),
  },
  inputContentViewStyle: {
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(10),
  },
  inputTitleTextStyle: {
    color: COLORS.GRAY_DARK,
    fontSize: getResponsiveFontSize(14),
  },
  inputTextStyle: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BLACK_OPACITY_2,
    fontSize: getResponsiveFontSize(14),
    paddingBottom: responsiveHeight(0.2),
  },
  marginBottomViewStyle: { marginBottom: responsiveHeight(5) },
  loginBtnViewStyle: {
    borderRadius: 8,
    marginHorizontal: responsiveWidth(5),
    alignItems: 'center',
    justifyContent: 'center',
    height: scale(50),
    backgroundColor: COLORS.BLUE_STONE,
  },
  loginBtnTextStyle: {
    color: COLORS.WHITE,
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
  },
});


