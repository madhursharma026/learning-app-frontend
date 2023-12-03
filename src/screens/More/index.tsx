import { Dispatch } from 'redux';
import RNFS from 'react-native-fs';
import SVG from '../../constants/svgs';
import React, { useState } from 'react';
import COLORS from '../../themes/colors';
import { SvgXml } from 'react-native-svg';
import { RootState } from '../../redux/store';
import { useLazyQuery } from '@apollo/client';
import { Header } from '../../components/Header';
import { STRINGS } from '../../constants/strings';
import { connect, useDispatch } from 'react-redux';
import { GET_SINGLE_USER } from '../../graphql/query';
import { SET_THEME } from '../../redux/actions/themeActions';
import { THEME_SETTINGS_OPTIONS } from '../../utils/commonUtils';
import { clearAll, setThemeMode } from '../../utils/storageUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeAuthTokenAction } from '../../redux/reducers/authReducer';
import { StyleSheet, TouchableOpacity, Text, View, StatusBar, Appearance, Platform, Image, ScrollView, Dimensions, } from 'react-native';
import { getResponsiveFontSize, responsiveHeight, responsiveWidth, scale, } from '../../utils/scalingUtils';
import { SafeAreaView } from 'react-native-safe-area-context';

const More = ({ navigation, isDark, themeMode, setTheme, colors, }: { navigation: any; isDark: any; themeMode: any; setTheme: any; colors: any; }) => {
  const defaultMode = THEME_SETTINGS_OPTIONS.find(
    t => t.theme === themeMode,
  )?.value;
  const [selectedThemeMode, setSelectedThemeMode] = useState(
    defaultMode || THEME_SETTINGS_OPTIONS[0]?.value,
  );

  const dispatch = useDispatch();
  const [SingleUser] = useLazyQuery(GET_SINGLE_USER);
  const [imageUri, setImageUri] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [showThemeOption, setShowThemeOption] = useState(false);
  const [mobileNumberInput, setMobileNumberInput] = React.useState('');

  const getSingleUserDetails = async () => {
    const mobileNumber = await AsyncStorage.getItem('mobileNumber')
    setMobileNumberInput(mobileNumber)
    await SingleUser({
      variables: {
        mobileNumber: mobileNumber
      },
    })
      .then(res => {
        setFirstName(res.data.user.firstName)
        setLastName(res.data.user.lastName)
        setImageUri(`${RNFS.DocumentDirectoryPath}/${res.data.user.profileImage}`)
      })
      .catch(err => console.log('getAllUsers err ==> ', err));
  };

  React.useEffect(() => {
    getSingleUserDetails()
  }, []);

  const renderThemeSection = () => {
    return (
      <View style={styles.themeSectionViewStyle}>
        <Text
          style={[
            styles.themeTextStyle,
            {
              color: colors.INPUT_FIELD_COLOR,
            },
          ]}>
          {STRINGS.CHOOSE_THEME}
        </Text>
        <TouchableOpacity
          // onPress={() => setShowThemeOption(!showThemeOption)}
          style={[
            styles.dropdownContentViewStyle,
            { borderColor: colors.INPUT_FIELD_COLOR },
          ]}>
          <Text
            style={{
              color: colors.INPUT_FIELD_COLOR,
            }}>
            {selectedThemeMode}
          </Text>
          <SvgXml
            xml={isDark ? SVG.DOWN_ARROW_WHITE_ICON : SVG.DOWN_ARROW_ICON}
            height={20}
            width={20}
          />
        </TouchableOpacity>
        {showThemeOption ? (
          <View
            style={[
              styles.dropdownListContentViewStyle,
              { borderColor: colors.INPUT_FIELD_COLOR },
            ]}>
            {THEME_SETTINGS_OPTIONS.map((option, index) => {
              return (
                <TouchableOpacity
                  onPress={() => onChangeSelect(index, option)}
                  key={index}
                  style={[
                    styles.optionContentStyle,
                    { borderBottomColor: colors.INPUT_FIELD_COLOR },
                  ]}>
                  <Text
                    style={{
                      color: colors.INPUT_FIELD_COLOR,
                    }}>
                    {option.value}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </View>
    );
  };

  const onChangeSelect = async (key: any, value: any) => {
    try {
      setSelectedThemeMode(value.value);
      setTheme(THEME_SETTINGS_OPTIONS[key].theme);
      await setThemeMode(THEME_SETTINGS_OPTIONS[key].theme);
      if (THEME_SETTINGS_OPTIONS[key].theme === 'light') {
        StatusBar.setBarStyle('dark-content');
      } else if (THEME_SETTINGS_OPTIONS[key].theme === 'dark') {
        if (Platform.OS === 'ios') {
          StatusBar.setBarStyle('light-content');
        } else {
          StatusBar.setBarStyle('dark-content');
        }
      } else if (THEME_SETTINGS_OPTIONS[key].theme === 'system') {
        const systemColor = Appearance.getColorScheme() || 'light';
        if (systemColor === 'light') {
          StatusBar.setBarStyle('dark-content');
        } else {
          StatusBar.setBarStyle('light-content');
        }
      }

      setShowThemeOption(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  const renderSectionMenu = () => {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 75, }}>
        <View style={styles.sectionContentViewStyle}>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
            {(imageUri !== '/data/user/0/com.englishniti/files/null') ? (
              <Image source={{ uri: `file://${imageUri}` }} style={styles.profileImage} />
            ) :
              <Image style={styles.profileImage}
                source={{ uri: ('https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg') }}
              />}
            <Text style={[styles.sectionItemNameStyle, { color: colors.SLIDE_TITLE_COLOR, marginTop: 10, fontWeight: '700' },]}>
              {firstName + ' ' + lastName}
            </Text>
            <Text style={[styles.sectionItemNameStyle, { color: colors.SLIDE_TITLE_COLOR, fontSize: 16 },]}>
              Mobile Number: {mobileNumberInput}
            </Text>
          </View>
          <View style={{ backgroundColor: 'white'}}>
            <TouchableOpacity style={styles.sectionItemViewStyle}>
              <Text
                style={[
                  styles.sectionItemNameStyle,
                  {
                    color: colors.SLIDE_TITLE_COLOR,
                  },
                ]}>
                {STRINGS.STATS}
              </Text>
              <SvgXml xml={SVG.ARROW_RIGHT_ICON} height={20} width={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionItemViewStyle} onPress={() => navigation.push("Profile")}>
              <Text
                style={[
                  styles.sectionItemNameStyle,
                  {
                    color: colors.SLIDE_TITLE_COLOR,
                  },
                ]}>
                {STRINGS.PROFILE}
              </Text>
              <SvgXml xml={SVG.ARROW_RIGHT_ICON} height={20} width={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowThemeOption(!showThemeOption)}
              style={styles.sectionItemViewStyle}>
              <Text
                style={[
                  styles.sectionItemNameStyle,
                  {
                    color: colors.SLIDE_TITLE_COLOR,
                  },
                ]}>
                {STRINGS.THEME}
              </Text>
              <SvgXml xml={SVG.ARROW_RIGHT_ICON} height={20} width={20} />
            </TouchableOpacity>
            {showThemeOption ? renderThemeSection() : null}
            <TouchableOpacity style={styles.sectionItemViewStyle}>
              <Text
                style={[
                  styles.sectionItemNameStyle,
                  {
                    color: colors.SLIDE_TITLE_COLOR,
                  },
                ]}>
                {STRINGS.CLASS_HISTORY}
              </Text>
              <SvgXml xml={SVG.ARROW_RIGHT_ICON} height={20} width={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionItemViewStyle}>
              <Text
                style={[
                  styles.sectionItemNameStyle,
                  {
                    color: colors.SLIDE_TITLE_COLOR,
                  },
                ]}>
                {STRINGS.REFERRAL}
              </Text>
              <SvgXml xml={SVG.ARROW_RIGHT_ICON} height={20} width={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionItemViewStyle}>
              <Text
                style={[
                  styles.sectionItemNameStyle,
                  {
                    color: colors.SLIDE_TITLE_COLOR,
                  },
                ]}>
                {STRINGS.MEMBERSHIP}
              </Text>
              <SvgXml xml={SVG.ARROW_RIGHT_ICON} height={20} width={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionItemViewStyle}>
              <Text
                style={[
                  styles.sectionItemNameStyle,
                  {
                    color: colors.SLIDE_TITLE_COLOR,
                  },
                ]}>
                {STRINGS.CONTACT_US}
              </Text>
              <SvgXml xml={SVG.ARROW_RIGHT_ICON} height={20} width={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSignOut}
              style={styles.sectionItemViewStyle}>
              <Text
                style={[
                  styles.sectionItemNameStyle,
                  {
                    color: colors.SLIDE_TITLE_COLOR,
                  },
                ]}>
                {STRINGS.SIGN_OUT}
              </Text>
              <SvgXml xml={SVG.ARROW_RIGHT_ICON} height={20} width={20} />
            </TouchableOpacity>
            <Text
              style={[
                styles.appVersionTextStyle,
                {
                  color: colors.SLIDE_TITLE_COLOR,
                },
              ]}>
              {`${STRINGS.APP_VERSION} v0.0.1`}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const onSignOut = async () => {
    await clearAll();
    dispatch(removeAuthTokenAction());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.SCREEN_BG_COLOR }]}>
      <Header title={STRINGS.MORE} navigation={navigation} colors={colors} />
      {/* {renderThemeSection()} */}
      {renderSectionMenu()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
  dropdownContentViewStyle: {
    borderWidth: 1,
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(2),
  },
  dropdownListContentViewStyle: {
    borderWidth: 1,
    marginTop: responsiveHeight(1),
    borderRadius: 8,
  },
  optionContentStyle: {
    borderBottomWidth: 1,
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeSectionViewStyle: {
    // marginHorizontal: responsiveWidth(10),
    marginTop: responsiveHeight(2),
  },
  themeTextStyle: {
    color: COLORS.WHITE,
    fontSize: getResponsiveFontSize(15),
    lineHeight: getResponsiveFontSize(20),
  },
  sectionItemViewStyle: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BLUE_STONE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: responsiveHeight(0.5),
    height: scale(40),
    alignItems: 'flex-end',
    paddingHorizontal: responsiveWidth(5)
  },
  sectionItemNameStyle: {
    fontSize: getResponsiveFontSize(20),
    paddingBottom: 5
  },
  sectionContentViewStyle: {
    flex: 0.8,
    // marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2),
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  appVersionTextStyle: {
    fontSize: getResponsiveFontSize(14),
    margin: responsiveWidth(5),
    textAlign: 'center'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'black',
  },
});

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
  return {
    setTheme: (payload: string) => dispatch({ type: SET_THEME, payload }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(More);
