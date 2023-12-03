import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import COLORS from '../../themes/colors';
import { RootState } from '../../redux/store';
import Toast from 'react-native-toast-message';
import { Header } from '../../components/Header';
import { STRINGS } from '../../constants/strings';
import { FetchUserReport } from '../../graphql/mutations';
import { useLazyQuery, useMutation, } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GET_SINGLE_USER, gettingAllChapters } from '../../graphql/query';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Learn = ({ navigation, colors, route }: { navigation: any; colors: any, route: any }) => {
  const [userId, setUserId] = React.useState();
  const [dataList, setDataList] = React.useState([]);
  const [allQuestions, setAllQuestions] = React.useState();
  const [gettingSingleUser] = useLazyQuery(GET_SINGLE_USER);
  const [fetchingUserReport] = useMutation(FetchUserReport);
  const [gettingAllChapterFromQuery] = useLazyQuery(gettingAllChapters);

  function getAllChapters() {
    gettingAllChapterFromQuery({
      variables: {},
    })
      .then(res => {
        setAllQuestions(res.data.chapters)
      })
      .catch(err => Toast.show(err))
  }

  React.useEffect(() => {
    getAllChapters()
  }, []);

  async function fetchingUserId() {
    const mobileNumber = await AsyncStorage.getItem('mobileNumber')
    gettingSingleUser({
      variables: {
        "mobileNumber": mobileNumber
      }
    })
      .then(res => {
        setUserId(res.data.user.id)
      })
      .catch(err => Toast.show(err))
  }

  React.useEffect(() => {
    fetchingUserId()
  }, [])

  async function fetchDataCompleteORNot(chapterId: string, gettingIndex: number) {
    fetchingUserReport({
      variables: {
        "gettingUserId": String(userId),
        "gettingChapterId": String(chapterId)
      },
    })
      .then(res => {
        // console.log(gettingIndex)
        const newItem = res.data.findUserReportByIds[gettingIndex].userReportChapterId
        setDataList(prevDataList => [...prevDataList, newItem]);
      })
      .catch(err => Toast.show(err))
  }

  // console.log(route.params)
  React.useEffect(() => {
    if (route.params !== undefined) {
      const { chapterId } = route.params;
      fetchingUserReport({
        variables: {
          "gettingUserId": String(userId),
          "gettingChapterId": String(chapterId)
        },
      })
        .then(res => {
          // console.log(gettingIndex)
          console.log(res.data.findUserReportByIds.reverse()[0].userReportChapterId)
          const newItem = res.data.findUserReportByIds.reverse()[0].userReportChapterId
          setDataList(prevDataList => [...prevDataList, newItem]);
        })
        .catch(err => Toast.show(err))
    }
  }, [])

  console.log(dataList)

  return (
    <View style={[styles.container, { backgroundColor: colors.SCREEN_BG_COLOR }]} onLayout={() => getAllChapters()}>
      <Header title={STRINGS.LEARN} navigation={navigation} colors={colors} />
      <FlatList data={allQuestions} style={{ marginBottom: 80, borderWidth: 10, borderBottomWidth: 0, borderColor: '#59CC00' }} renderItem={({ item, index }) =>
        <ScrollView contentContainerStyle={[styles.containerForSnakeView, { borderWidth: 10, borderColor: 'transparent' }]}>
          <TouchableOpacity onPress={() => navigation.navigate("DescriptionScreen", { chapterId: `${item.id}` })}>
            <View onLayout={() => fetchDataCompleteORNot(item.id, index)}>
              {index % 2 === 0 ?
                <>
                  {dataList.includes(item.id) ?
                    <Text style={styles.itemEven1}>✔</Text>
                    :
                    <Text style={styles.itemEven1}>🔒</Text>
                  }
                </>
                :
                <>
                  {dataList.includes(item.id) ?
                    <Text style={styles.itemEven2}>✔</Text>
                    :
                    <Text style={styles.itemEven2}>🔒</Text>
                  }
                </>
              }
            </View>
          </TouchableOpacity>
        </ScrollView>
      }
      />
    </View >
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
export default connect(mapStateToProps, mapDispatchToProps)(Learn);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  hrStyle: {
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  topicName: {
    fontSize: 18,
    paddingTop: 10,
    cursor: 'pointer'
  },
  containerForSnakeView: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    // height: '100%',
  },
  item: {
    width: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  itemEven1: {
    backgroundColor: '#59CC00',
    padding: 15,
    marginTop: 10,
    borderRadius: 100,
    marginLeft: 180,
    fontSize: 20,
    color: 'white'
  },
  itemEven2: {
    backgroundColor: '#59CC00',
    padding: 15,
    marginTop: 10,
    borderRadius: 100,
    marginRight: 80,
    marginLeft: 100,
    fontSize: 20,
    color: 'white'
  },
});
