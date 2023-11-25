// import * as React from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import {Header} from '../../components/Header';
// import {STRINGS} from '../../constants/strings';
// import COLORS from '../../themes/colors';
// import {RootState} from '../../redux/store';
// import {connect} from 'react-redux';
// import {Dispatch} from 'redux';
// import {UPCOMING_CLASSES_LIST} from '../../utils/commonUtils';
// import {ClassItem} from '../../schema/classSchema';
// import {
//   responsiveHeight,
//   responsiveWidth,
//   getResponsiveFontSize,
//   scale,
// } from '../../utils/scalingUtils';
// import Button from '../../components/Button';
// import SCREENS from '../../constants/screens';

// const Classes = ({navigation, colors}: {navigation: any; colors: any}) => {
//   const renderClassesList = () => {
//     return (
//       <FlatList
//         contentContainerStyle={styles.contentContainerStyle}
//         data={UPCOMING_CLASSES_LIST}
//         renderItem={renderClassItem}
//         showsVerticalScrollIndicator={false}
//         keyExtractor={(item, index) => index.toString()}
//       />
//     );
//   };

//   const renderClassItem = ({item, index}: {item: ClassItem; index: number}) => {
//     return (
//       <TouchableOpacity
//         style={[
//           styles.sectionContainerViewStyle,
//           {
//             backgroundColor: colors.HEADER_BG_COLOR,
//           },
//         ]}
//         key={index}
//         onPress={() =>
//           navigation.navigate(SCREENS.CLASS_DETAILS, {classDetails: item})
//         }>
//         <View>
//           <View style={styles.imageSectionViewStyle}>
//             <Image
//               source={item.thumbnail}
//               style={styles.imageContentViewStyle}
//             />
//           </View>
//           <Text
//             style={[
//               styles.classNameTextStyle,
//               {color: colors.SLIDE_TITLE_COLOR},
//             ]}>
//             {item.className}
//           </Text>
//           <Text
//             style={[
//               styles.classDescriptionTextStyle,
//               {color: colors.SLIDE_NOTE_COLOR},
//             ]}>
//             {item.description}
//           </Text>
//           <Text
//             style={[
//               styles.classDescriptionTextStyle,
//               {color: colors.SLIDE_NOTE_COLOR},
//             ]}>
//             {`class time : ${item.startTime}`}
//           </Text>
//           <Button title={STRINGS.JOIN} wrapperStyle={styles.joinBtnViewStyle} />
//         </View>
//       </TouchableOpacity>
//     );
//   };
//   return (
//     <View style={[styles.container, {backgroundColor: colors.SCREEN_BG_COLOR}]}>
//       <Header title={STRINGS.CLASSES} navigation={navigation} colors={colors} />
//       <View style={styles.classesListContentView}>
//         <Text
//           style={[
//             styles.pageHeaderTextStyle,
//             {color: colors.SLIDE_TITLE_COLOR},
//           ]}>
//           {STRINGS.UPCOMING_CLASSES}
//         </Text>
//         {renderClassesList()}
//       </View>
//     </View>
//   );
// };

// const mapStateToProps = (state: RootState) => {
//   const {themeReducer} = state;
//   const {themeMode, isDark, colors} = themeReducer;
//   return {
//     themeMode,
//     isDark,
//     colors,
//   };
// };

// const mapDispatchToProps = (dispatch: Dispatch) => {
//   return {};
// };
// export default connect(mapStateToProps, mapDispatchToProps)(Classes);

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: COLORS.WHITE},
//   pageHeaderTextStyle: {
//     fontSize: getResponsiveFontSize(24),
//     fontWeight: 'bold',
//   },
//   sectionContainerViewStyle: {
//     paddingHorizontal: responsiveWidth(5),
//     paddingVertical: responsiveHeight(3),
//     borderRadius: 24,
//     marginTop: responsiveHeight(2),
//   },
//   imageSectionViewStyle: {
//     paddingBottom: responsiveHeight(1),
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: responsiveHeight(15),
//   },
//   imageContentViewStyle: {height: '100%', width: '100%', resizeMode: 'cover'},
//   classNameTextStyle: {
//     fontSize: getResponsiveFontSize(22),
//     lineHeight: getResponsiveFontSize(26),
//     textAlign: 'left',
//     fontWeight: 'bold',
//   },
//   classDescriptionTextStyle: {
//     fontSize: getResponsiveFontSize(15),
//     lineHeight: getResponsiveFontSize(20),
//     textAlign: 'left',
//     color: COLORS.GRAY_DARK,
//   },
//   joinBtnViewStyle: {
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: scale(45),
//     backgroundColor: COLORS.BLUE_STONE,
//     marginTop: responsiveHeight(1),
//     marginHorizontal: 0,
//   },
//   classesListContentView: {
//     flex: 1,
//     marginHorizontal: responsiveWidth(5),
//     marginTop: responsiveHeight(2),
//   },
//   contentContainerStyle: {paddingBottom: responsiveHeight(18)},
// });



import * as React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, } from 'react-native';
import { Header } from '../../components/Header';
import { STRINGS } from '../../constants/strings';
import COLORS from '../../themes/colors';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { responsiveHeight, responsiveWidth, getResponsiveFontSize, scale, } from '../../utils/scalingUtils';
import Button from '../../components/Button';
import { useMutation } from '@apollo/client';
import { AllClasses } from '../../graphql/mutations';
import Toast from 'react-native-toast-message';

const Classes = ({ navigation, colors }: { navigation: any; colors: any }) => {
  const [allClassesData, setAllClassesData] = React.useState();
  const [allClasses] = useMutation(AllClasses);

  function getAllClasses() {
    allClasses()
      .then(res => {
        setAllClassesData(res.data.teachingClasses.reverse())
      })
      .catch(err => Toast.show(err))
  }

  React.useEffect(() => {
    getAllClasses()
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.SCREEN_BG_COLOR }]}>
      <Header title={STRINGS.CLASSES} navigation={navigation} colors={colors} />
      <View style={styles.classesListContentView}>
        <Text style={[styles.pageHeaderTextStyle, { color: colors.SLIDE_TITLE_COLOR },]}>
          {STRINGS.UPCOMING_CLASSES}
        </Text>
        <FlatList style={{ marginBottom: 80 }} data={allClassesData} renderItem={({ item, index }) =>
          <View>
            <View style={styles.imageSectionViewStyle}>
              <Image source={require('../.././assets/images/slide1.png')} style={styles.imageContentViewStyle} />
            </View>
            <Text style={[styles.classNameTextStyle, { color: colors.SLIDE_TITLE_COLOR },]}>
              {item.title}
            </Text>
            <Text style={[styles.classDescriptionTextStyle, { color: colors.SLIDE_NOTE_COLOR },]}>
              {item.description}
            </Text>
            <Text style={[styles.classDescriptionTextStyle, { color: colors.SLIDE_NOTE_COLOR },]}>
              {`class time : ${new Date(item.startsAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}
              `}
            </Text>
            <Button title={STRINGS.JOIN} wrapperStyle={styles.joinBtnViewStyle} />
          </View>
        } />
      </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(Classes);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
  pageHeaderTextStyle: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
  },
  sectionContainerViewStyle: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(3),
    borderRadius: 24,
    marginTop: responsiveHeight(2),
  },
  imageSectionViewStyle: {
    paddingTop: responsiveHeight(3),
    paddingBottom: responsiveHeight(1),
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveHeight(15),
  },
  imageContentViewStyle: { height: '100%', width: '100%', resizeMode: 'cover' },
  classNameTextStyle: {
    fontSize: getResponsiveFontSize(22),
    lineHeight: getResponsiveFontSize(26),
    textAlign: 'left',
    fontWeight: 'bold',
  },
  classDescriptionTextStyle: {
    fontSize: getResponsiveFontSize(15),
    lineHeight: getResponsiveFontSize(20),
    textAlign: 'left',
    color: COLORS.GRAY_DARK,
  },
  joinBtnViewStyle: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: scale(45),
    backgroundColor: COLORS.BLUE_STONE,
    marginTop: responsiveHeight(1),
    marginHorizontal: 0,
  },
  classesListContentView: {
    flex: 1,
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2),
  },
  contentContainerStyle: { paddingBottom: responsiveHeight(18) },
});