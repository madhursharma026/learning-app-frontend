import { useEffect, useState } from 'react';
import { ProgressBar } from 'react-native-paper';
import QuestionsDetails from './QuestionsDetails';
import { StyleSheet, Text, View, Image, TouchableHighlight, Button, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';

export default function QuesSection({ navigation, route }) {
  const [yourScore, setYourScore] = useState(0);
  const [questionNO, setQuestionNO] = useState(0);
  const [newDataKey, setNewDataKey] = useState('');
  const [userAnswer, setUserAnswer] = useState("");
  const [skipQuestion, setSkipQuestion] = useState(0);
  const [newDataValue, setNewDataValue] = useState('');
  const [checkAnswer, setCheckAnswer] = useState(false);
  const [lastQuestion, setLastQuestion] = useState(false);
  const [replacedQuestion, setReplacedQuestion] = useState('');

  useEffect(() => {
    if (route.params === undefined) {
      setQuestionNO(0)
      setLastQuestion(QuestionsDetails.length)
    } else {
      const { questionNOParams } = route.params;
      setQuestionNO(Number(questionNOParams))
      setLastQuestion(QuestionsDetails.length)
    }
  })

  function replaceBlanks(questionVar, userAnswerVar) {
    const replaceData = questionVar.replace("______", userAnswerVar);
    setReplacedQuestion(replaceData)
  }

  function sufflingMatchingList() {
    setNewDataKey([
      { key: `${QuestionsDetails[questionNO].options[0].a.key}`, disabledStatus: `${QuestionsDetails[questionNO].options[0].a.disabledStatus}` },
      { key: `${QuestionsDetails[questionNO].options[0].b.key}`, disabledStatus: `${QuestionsDetails[questionNO].options[0].b.disabledStatus}` },
      { key: `${QuestionsDetails[questionNO].options[0].c.key}`, disabledStatus: `${QuestionsDetails[questionNO].options[0].c.disabledStatus}` },
      { key: `${QuestionsDetails[questionNO].options[0].d.key}`, disabledStatus: `${QuestionsDetails[questionNO].options[0].d.disabledStatus}` },
    ].sort(() => Math.random() - 0.5))

    setNewDataValue([
      { value: `${QuestionsDetails[questionNO].options[0].a.value}` },
      { value: `${QuestionsDetails[questionNO].options[0].b.value}` },
      { value: `${QuestionsDetails[questionNO].options[0].c.value}` },
      { value: `${QuestionsDetails[questionNO].options[0].d.value}` },
    ].sort(() => Math.random() - 0.5))
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.column1}>
          <Image onTouchStart={() => navigation.navigate("Learn")}
            style={{ width: 35, height: 35, resizeMode: "contain" }}
            source={{
              uri: 'https://icones.pro/wp-content/uploads/2022/05/icone-fermer-et-x-rouge.png',
            }}
          />
        </View>
        <View style={styles.column2}>
          <ProgressBar progress={questionNO / QuestionsDetails.length} color={'#58CC02'} style={{ height: 18, borderRadius: 10 }} />
        </View>
      </View>

      <Text style={styles.mainHeading}>{QuestionsDetails[questionNO].mainHeading}</Text>

      {(`${QuestionsDetails[questionNO].IsQuestionInMatchingFormate}` !== "true") ?
        <>
          {(`${QuestionsDetails[questionNO].IsQuestionInFillUpsFormate}` !== "true") ?
            <>
              {(`${QuestionsDetails[questionNO].IsQuestionInImageFormate}` !== "true") ?
                <View style={{ marginTop: 30 }}>
                  <View style={styles.row}>
                    <View style={styles.column3}>
                      <Image
                        style={{ width: 120, height: 220, resizeMode: "contain" }}
                        source={{
                          uri: 'https://duoplanet.com/wp-content/uploads/2022/04/Duolingo-Eddy-1-640x1024.png',
                        }}
                      />
                    </View>
                    <View style={styles.column4}>
                      <Text style={styles.quesStyle}>{QuestionsDetails[questionNO].Question}</Text>
                    </View>
                  </View>
                </View>
                :
                <View style={{ alignItems: 'center' }}>
                  <Image
                    style={{ width: 200, height: 220, resizeMode: "contain" }}
                    source={{
                      uri: `${QuestionsDetails[questionNO].Question}`,
                    }}
                  />
                </View>
              }

              <View style={{ marginTop: -23 }}></View>
              {(`${QuestionsDetails[questionNO].IsQuestionInMCQsFormate}` === "true") ?
                <>
                  <View style={styles.hrStyle} />
                  {userAnswer !== "" ?
                    <Text style={styles.optionsStyle} onPress={() => setUserAnswer('')}>{userAnswer}</Text>
                    :
                    <Text style={styles.ansStyle}></Text>
                  }
                  <View style={styles.hrStyle} />
                </>
                :
                <></>
              }
            </>
            :
            <>
              <View style={{ alignItems: 'center' }}>
                <Image
                  style={{ width: 200, height: 220, resizeMode: "contain" }}
                  source={{
                    uri: 'https://duoplanet.com/wp-content/uploads/2022/04/Duolingo-Eddy-1-640x1024.png',
                  }}
                />
              </View>
              {replacedQuestion === "" ?
                <Text style={[styles.quesStyle, { borderBottomLeftRadius: 20, width: '100%', marginLeft: -1 }]}>{QuestionsDetails[questionNO].Question}</Text>
                :
                <Text style={[styles.quesStyle, { borderBottomLeftRadius: 20, width: '100%', marginLeft: -1 }]}>{replacedQuestion}</Text>
              }
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
                {userAnswer !== `${QuestionsDetails[questionNO].options[0].a}` ?
                  <Text style={styles.optionsStyle} onPress={() => (replaceBlanks(`${QuestionsDetails[questionNO].Question}`, `${QuestionsDetails[questionNO].options[0].a}`), setUserAnswer(`${QuestionsDetails[questionNO].options[0].a}`))}>{QuestionsDetails[questionNO].options[0].a}</Text>
                  :
                  <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => (replaceBlanks(`${QuestionsDetails[questionNO].Question}`, '______'), setUserAnswer('______'))}>{QuestionsDetails[questionNO].options[0].a}</Text>
                }
                {userAnswer !== `${QuestionsDetails[questionNO].options[0].b}` ?
                  <Text style={styles.optionsStyle} onPress={() => (replaceBlanks(`${QuestionsDetails[questionNO].Question}`, `${QuestionsDetails[questionNO].options[0].b}`), setUserAnswer(`${QuestionsDetails[questionNO].options[0].b}`))}>{QuestionsDetails[questionNO].options[0].b}</Text>
                  :
                  <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => (replaceBlanks(`${QuestionsDetails[questionNO].Question}`, '______'), setUserAnswer('______'))}>{QuestionsDetails[questionNO].options[0].b}</Text>
                }
                {userAnswer !== `${QuestionsDetails[questionNO].options[0].c}` ?
                  <Text style={styles.optionsStyle} onPress={() => (replaceBlanks(`${QuestionsDetails[questionNO].Question}`, `${QuestionsDetails[questionNO].options[0].c}`), setUserAnswer(`${QuestionsDetails[questionNO].options[0].c}`))}>{QuestionsDetails[questionNO].options[0].c}</Text>
                  :
                  <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => (replaceBlanks(`${QuestionsDetails[questionNO].Question}`, '______'), setUserAnswer('______'))}>{QuestionsDetails[questionNO].options[0].c}</Text>
                }
                {userAnswer !== `${QuestionsDetails[questionNO].options[0].d}` ?
                  <Text style={styles.optionsStyle} onPress={() => (replaceBlanks(`${QuestionsDetails[questionNO].Question}`, `${QuestionsDetails[questionNO].options[0].d}`), setUserAnswer(`${QuestionsDetails[questionNO].options[0].d}`))}>{QuestionsDetails[questionNO].options[0].d}</Text>
                  :
                  <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => (replaceBlanks(`${QuestionsDetails[questionNO].Question}`, '______'), setUserAnswer('______'))}>{QuestionsDetails[questionNO].options[0].d}</Text>
                }
              </View>
            </>
          }
        </>
        :
        <>
          <View style={{ alignItems: 'center' }}>
            <Image
              style={{ width: 200, height: 220, resizeMode: "cover" }}
              source={{
                uri: `https://langcdn.ilovelanguages.com/what_are_the_duolingo_characters_names.png`,
              }}
            />
          </View>
          <View style={styles.row} onLayout={() => sufflingMatchingList()}>
            <View style={styles.column7}>
              <FlatList
                data={newDataKey}
                renderItem={({ item }) =>
                  <TouchableOpacity disabled={item.disabledStatus === 'false' ? false : true}><Text style={item.disabledStatus === 'false' ? [styles.optionsStyle, { width: '90%', textAlign: 'center', marginTop: 10 }] : [styles.optionsStyle, { width: '90%', textAlign: 'center', marginTop: 10, backgroundColor: '#E5E5E5', color: '#777777', borderBottomColor: `${userAnswer === item.value ? "#58CC02" : '#CCCCCC'}` }]}>{item.key}</Text></TouchableOpacity>}
              />
            </View>
            <View style={styles.column8}>
              <FlatList
                data={newDataValue}
                renderItem={({ item }) => <View onTouchStart={() => setUserAnswer(`${item.value}`)}><Text style={[styles.optionsStyle, { width: '90%', textAlign: 'center', marginTop: 10, borderWidth: 3, borderColor: `${userAnswer === item.value ? "#58CC02" : '#CCCCCC'}`, borderBottomColor: `${userAnswer === item.value ? "#58CC02" : '#CCCCCC'}` }]}>{item.value}</Text></View>}
              />
            </View>
          </View>
        </>
      }

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 50 }}>
        {(`${QuestionsDetails[questionNO].IsOptionInImageFormate}` === "true") ?
          <>
            {userAnswer !== `${QuestionsDetails[questionNO].options[0].a}` ?
              <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#CCCCCC', borderBottomColor: '#CCCCCC' }]} onTouchStart={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].a}`)}>
                <Image
                  style={{ width: 132, height: 110, resizeMode: "contain" }}
                  source={{
                    uri: `${QuestionsDetails[questionNO].options[0].a}`,
                  }}
                />
              </View>
              :
              <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#58CC02', borderBottomColor: '#58CC02' }]} onTouchStart={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].a}`)}>
                <Image
                  style={{ width: 132, height: 110, resizeMode: "contain" }}
                  source={{
                    uri: `${QuestionsDetails[questionNO].options[0].a}`,
                  }}
                />
              </View>
            }
            {userAnswer !== `${QuestionsDetails[questionNO].options[0].b}` ?
              <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#CCCCCC', borderBottomColor: '#CCCCCC' }]} onTouchStart={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].b}`)}>
                <Image
                  style={{ width: 132, height: 110, resizeMode: "contain" }}
                  source={{
                    uri: `${QuestionsDetails[questionNO].options[0].b}`,
                  }}
                />
              </View>
              :
              <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#58CC02', borderBottomColor: '#58CC02' }]} onTouchStart={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].b}`)}>
                <Image
                  style={{ width: 132, height: 110, resizeMode: "contain" }}
                  source={{
                    uri: `${QuestionsDetails[questionNO].options[0].b}`,
                  }}
                />
              </View>
            }
            {userAnswer !== `${QuestionsDetails[questionNO].options[0].c}` ?
              <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#CCCCCC', borderBottomColor: '#CCCCCC' }]} onTouchStart={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].c}`)}>
                <Image
                  style={{ width: 132, height: 110, resizeMode: "contain" }}
                  source={{
                    uri: `${QuestionsDetails[questionNO].options[0].c}`,
                  }}
                />
              </View>
              :
              <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#58CC02', borderBottomColor: '#58CC02' }]} onTouchStart={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].c}`)}>
                <Image
                  style={{ width: 132, height: 110, resizeMode: "contain" }}
                  source={{
                    uri: `${QuestionsDetails[questionNO].options[0].c}`,
                  }}
                />
              </View>
            }
            {userAnswer !== `${QuestionsDetails[questionNO].options[0].d}` ?
              <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#CCCCCC', borderBottomColor: '#CCCCCC' }]} onTouchStart={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].d}`)}>
                <Image
                  style={{ width: 132, height: 110, resizeMode: "contain" }}
                  source={{
                    uri: `${QuestionsDetails[questionNO].options[0].d}`,
                  }}
                />
              </View>
              :
              <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#58CC02', borderBottomColor: '#58CC02' }]} onTouchStart={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].d}`)}>
                <Image
                  style={{ width: 132, height: 110, resizeMode: "contain" }}
                  source={{
                    uri: `${QuestionsDetails[questionNO].options[0].d}`,
                  }}
                />
              </View>
            }
          </>
          :
          <></>
        }
        {(`${QuestionsDetails[questionNO].IsQuestionInMCQsFormate}` === "true") ?
          <>
            {userAnswer !== `${QuestionsDetails[questionNO].options[0].a}` ?
              <Text style={styles.optionsStyle} onPress={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].a}`)}>{QuestionsDetails[questionNO].options[0].a}</Text>
              :
              <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].a}`)}>{QuestionsDetails[questionNO].options[0].a}</Text>
            }
            {userAnswer !== `${QuestionsDetails[questionNO].options[0].b}` ?
              <Text style={styles.optionsStyle} onPress={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].b}`)}>{QuestionsDetails[questionNO].options[0].b}</Text>
              :
              <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].b}`)}>{QuestionsDetails[questionNO].options[0].b}</Text>
            }
            {userAnswer !== `${QuestionsDetails[questionNO].options[0].c}` ?
              <Text style={styles.optionsStyle} onPress={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].c}`)}>{QuestionsDetails[questionNO].options[0].c}</Text>
              :
              <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].c}`)}>{QuestionsDetails[questionNO].options[0].c}</Text>
            }
            {userAnswer !== `${QuestionsDetails[questionNO].options[0].d}` ?
              <Text style={styles.optionsStyle} onPress={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].d}`)}>{QuestionsDetails[questionNO].options[0].d}</Text>
              :
              <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => setUserAnswer(`${QuestionsDetails[questionNO].options[0].d}`)}>{QuestionsDetails[questionNO].options[0].d}</Text>
            }
          </>
          :
          <></>
        }
        {(`${QuestionsDetails[questionNO].IsQuestionInInputFormate}` === "true") ?
          <TextInput style={styles.textArea}
            placeholder="Type Something Here!"
            multiline={true}
            onChangeText={(text) => setUserAnswer(text.toUpperCase())}
            value={userAnswer}
          />
          :
          <></>
        }
      </View >

      <View style={styles.bottomView}>
        {
          checkAnswer ?
            <>
              {userAnswer === `${QuestionsDetails[questionNO].correctAns}` ?
                <View style={{ backgroundColor: '#84e67e', padding: 10, borderRadius: 10 }}>
                  <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 5 }}> You are correct!</Text>
                  {(lastQuestion === (questionNO + 1)) ?
                    <Button onPress={() => (setUserAnswer(""), setCheckAnswer(false), navigation.navigate("ScoreCardScreen", { yourScore: yourScore + 1, skipQuestion: skipQuestion }))} title="Show Score Card" color="#3e9139" />
                    :
                    <Button onPress={() => (setUserAnswer(""), setCheckAnswer(false), setYourScore(yourScore + 1), navigation.navigate("QuesSection", { questionNOParams: `${Number(questionNO + 1)}` }))} title="Continue" color="#3e9139" />
                  }
                </View>
                :
                <View style={{ backgroundColor: '#e69975', padding: 10, borderRadius: 10 }}>
                  <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 5 }}> You are Wrong!</Text>
                  {(lastQuestion === (questionNO + 1)) ?
                    <Button onPress={() => (setUserAnswer(""), setCheckAnswer(false), navigation.navigate("ScoreCardScreen", { yourScore: yourScore, skipQuestion: skipQuestion }))} title="Show Score Card" color="#BB2D3B" />
                    :
                    <Button onPress={() => (setUserAnswer(""), setCheckAnswer(false), navigation.navigate("QuesSection", { questionNOParams: `${Number(questionNO + 1)}` }))} title="Okay, Continue" color="#BB2D3B" />
                  }
                </View>
              }
            </>
            :
            <View style={styles.row}>
              <View style={styles.column5}>
                {(lastQuestion === (questionNO + 1)) ?
                  <TouchableHighlight style={styles.skipBtn} onPress={() => (setUserAnswer(""), setCheckAnswer(false), navigation.navigate("ScoreCardScreen", { yourScore: yourScore, skipQuestion: skipQuestion + 1 }))}>
                    <Text style={styles.skipBtnText}>SKIP</Text>
                  </TouchableHighlight>
                  :
                  <TouchableHighlight style={styles.skipBtn} onPress={() => (setUserAnswer(""), setSkipQuestion(skipQuestion + 1), setCheckAnswer(false), navigation.navigate("QuesSection", { questionNOParams: `${Number(questionNO + 1)}` }))}>
                    <Text style={styles.skipBtnText}>SKIP</Text>
                  </TouchableHighlight>
                }

              </View>
              <View style={styles.column6}>
                {userAnswer === "" ?
                  <TouchableHighlight style={styles.checkBtnBlank}>
                    <Text style={styles.checkBtnBlankText}>Check</Text>
                  </TouchableHighlight>
                  :
                  <TouchableHighlight style={styles.checkBtnSuccess}>
                    <Text style={styles.checkBtnSuccessText} onPress={() => setCheckAnswer(true)}>Check</Text>
                  </TouchableHighlight>
                }
              </View>
            </View>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column1: {
    flex: 1.5,
  },
  column2: {
    flex: 10.5,
    marginTop: 12,
    marginHorizontal: 15
  },
  column3: {
    flex: 4,
  },
  column4: {
    flex: 8,
  },
  mainHeading: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 25,
    marginLeft: 3,
  },
  quesStyle: {
    padding: 15,
    fontSize: 18,
    borderWidth: 1,
    marginVertical: 20,
    marginHorizontal: 15,
    borderColor: '#CCCCCC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  ansStyle: {
    padding: 15,
    fontSize: 18,
  },
  optionsStyle: {
    padding: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderBottomColor: '#c7c3c3',
    borderBottomWidth: 3,
    marginHorizontal: 3,
    marginVertical: 3,
  },
  hrStyle: {
    marginTop: -0,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  column5: {
    flex: 4,
  },
  column6: {
    flex: 8,
  },
  column7: {
    flex: 6,
  },
  column8: {
    flex: 6,
  },
  skipBtn: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#CCCCCC',
    marginHorizontal: 5
  },
  skipBtnText: {
    color: '#CCCCCC',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  checkBtnBlank: {
    padding: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#CCCCCC',
    marginHorizontal: 5
  },
  checkBtnBlankText: {
    color: '#AFAFAF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  checkBtnSuccess: {
    padding: 8,
    backgroundColor: '#58CC02',
    borderRadius: 10,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#58CC02',
    marginHorizontal: 5
  },
  checkBtnSuccessText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  textArea: {
    flex: 1,
    textAlignVertical: 'top',
    justifyContent: "flex-start",
    backgroundColor: 'white',
    borderWidth: 2,
    height: 200,
    padding: 10,
    borderRadius: 5,
    borderColor: '#CCCCCC'
  }
});

