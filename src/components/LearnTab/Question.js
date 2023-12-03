import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { ProgressBar } from 'react-native-paper';
import { GET_SINGLE_USER } from '../../graphql/query';
import { useLazyQuery, useMutation, } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddUserReport, AllQuestions, FetchQuestionsByChapterId } from '../../graphql/mutations';
import { StyleSheet, Text, View, Image, TouchableHighlight, Button, TextInput, FlatList, TouchableOpacity, ScrollView, Keyboard } from 'react-native';

export default function Question({ navigation, route }) {
    const [questionNO, setQuestionNO] = useState(0);
    const [newDataKey, setNewDataKey] = useState('');
    const [userAnswer, setUserAnswer] = useState("");
    const [allQuestions, setAllQuestions] = useState('');
    const [Add_User_Report] = useMutation(AddUserReport);
    const [newDataValue, setNewDataValue] = useState('');
    const [checkAnswer, setCheckAnswer] = useState(false);
    const [lastQuestion, setLastQuestion] = useState(false);
    const [questionLength, setQuestionLength] = useState('');
    const [gettingSingleUser] = useLazyQuery(GET_SINGLE_USER);
    const [replacedQuestion, setReplacedQuestion] = useState('');
    const [progressBarLength, setProgressBarLength] = useState('');
    const [Fetch_Questions_By_Chapter_Id] = useMutation(FetchQuestionsByChapterId);

    useEffect(async () => {
        const chapterId = await AsyncStorage.getItem('chapterId')
        await Fetch_Questions_By_Chapter_Id({
            variables: {
                "gettingChapterId": chapterId
            },
        })
            .then(res => {
                setQuestionLength(res.data.findQuestionByChapterId.length)
            })
            .catch(err => Toast.show(err))
    }, []);

    async function fetchingQuestions(quesNo) {
        const chapterId = await AsyncStorage.getItem('chapterId')
        await Fetch_Questions_By_Chapter_Id({
            variables: {
                "gettingChapterId": chapterId
            },
        })
            .then(async (res) => {
                setAllQuestions(res.data.findQuestionByChapterId[quesNo])
                setProgressBarLength(questionNO / questionLength)
            })
            .catch(error => {
                Toast.show(error?.message);
            });
    }

    useEffect(() => {
        if (route.params === undefined) {
            fetchingQuestions(0)
            setQuestionNO(0)
            setLastQuestion(questionLength)
            setProgressBarLength(0)
        } else {
            const { questionNOParams } = route.params;
            fetchingQuestions(questionNOParams)
            setQuestionNO(Number(questionNOParams))
            setProgressBarLength(questionNO / questionLength)
        }
    })

    function replaceBlanks(questionVar, userAnswerVar) {
        const replaceData = questionVar.replace("__________", userAnswerVar);
        setReplacedQuestion(replaceData)
    }

    function sufflingMatchingList() {
        setNewDataKey([
            { key: `${allQuestions.Option1.key}`, disabledStatus: `${allQuestions.Option1.disabledStatus}` },
            { key: `${allQuestions.Option2.key}`, disabledStatus: `${allQuestions.Option2.disabledStatus}` },
            { key: `${allQuestions.Option3.key}`, disabledStatus: `${allQuestions.Option3.disabledStatus}` },
            { key: `${allQuestions.Option4.key}`, disabledStatus: `${allQuestions.Option4.disabledStatus}` },
        ].sort(() => Math.random() - 0.5))

        setNewDataValue([
            { value: `${allQuestions.Option1.value}` },
            { value: `${allQuestions.Option2.value}` },
            { value: `${allQuestions.Option3.value}` },
            { value: `${allQuestions.Option4.value}` },
        ].sort(() => Math.random() - 0.5))
    }

    async function fetchingUserId() {
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

    async function addCompleteStatus() {
        const chapterId = await AsyncStorage.getItem('chapterId')
        const mobileNumber = await AsyncStorage.getItem('mobileNumber')
        await gettingSingleUser({
            variables: {
                "mobileNumber": mobileNumber
            }
        })
            .then(async res => {
                await Add_User_Report({
                    variables: {
                        "addUsersReportArgs": {
                            "userReportChapterId": Number(chapterId),
                            "userReportUserId": Number(res.data.user.id)
                        }
                    },
                })
                    .then(res => {
                        navigation.navigate('Learn', { chapterId: Number(chapterId) })
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => Toast.show(err))

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
                    <ProgressBar progress={progressBarLength} color={'#58CC02'} style={{ height: 18, borderRadius: 10 }} />
                </View>
            </View>
            <Text style={styles.mainHeading}>{allQuestions.mainHeading}</Text>


            {(`${allQuestions.IsQuestionInMatchingFormate}` !== "true") ?
                <>
                    {(`${allQuestions.IsQuestionInFillUpsFormate}` !== "true") ?
                        <>
                            {(`${allQuestions.IsQuestionInImageFormate}` !== "true") ?
                                <View>
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
                                            <Text style={styles.quesStyle}>{allQuestions.Question}</Text>
                                        </View>
                                    </View>
                                </View>
                                :
                                <View style={{ alignItems: 'center' }}>
                                    <Image
                                        style={{ width: 200, height: 220, resizeMode: "contain" }}
                                        source={{
                                            uri: `${allQuestions.Question}`,
                                        }}
                                    />
                                </View>
                            }

                            <View style={{ marginTop: -23 }}></View>
                            {(`${allQuestions.IsQuestionInMCQsFormate}` === "true") ?
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
                        <ScrollView>
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: 200, height: 220, resizeMode: "contain" }}
                                    source={{
                                        uri: 'https://duoplanet.com/wp-content/uploads/2022/04/Duolingo-Eddy-1-640x1024.png',
                                    }}
                                />
                            </View>
                            {replacedQuestion === "" ?
                                <Text style={[styles.quesStyle, { borderBottomLeftRadius: 20, width: '100%', marginLeft: -1 }]}>{allQuestions.Question}</Text>
                                :
                                <Text style={[styles.quesStyle, { borderBottomLeftRadius: 20, width: '100%', marginLeft: -1 }]}>{replacedQuestion}</Text>
                            }
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
                                {userAnswer !== `${allQuestions.Option1}` ?
                                    <Text style={styles.optionsStyle} onPress={() => (replaceBlanks(`${allQuestions.Question}`, `${allQuestions.Option1}`), setUserAnswer(`${allQuestions.Option1}`))}>{allQuestions.Option1}</Text>
                                    :
                                    <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => (replaceBlanks(`${allQuestions.Question}`, '__________'), setUserAnswer('__________'))}>{allQuestions.Option1}</Text>
                                }
                                {userAnswer !== `${allQuestions.Option2}` ?
                                    <Text style={styles.optionsStyle} onPress={() => (replaceBlanks(`${allQuestions.Question}`, `${allQuestions.Option2}`), setUserAnswer(`${allQuestions.Option2}`))}>{allQuestions.Option2}</Text>
                                    :
                                    <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => (replaceBlanks(`${allQuestions.Question}`, '__________'), setUserAnswer('__________'))}>{allQuestions.Option2}</Text>
                                }
                                {userAnswer !== `${allQuestions.Option3}` ?
                                    <Text style={styles.optionsStyle} onPress={() => (replaceBlanks(`${allQuestions.Question}`, `${allQuestions.Option3}`), setUserAnswer(`${allQuestions.Option3}`))}>{allQuestions.Option3}</Text>
                                    :
                                    <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => (replaceBlanks(`${allQuestions.Question}`, '__________'), setUserAnswer('__________'))}>{allQuestions.Option3}</Text>
                                }
                                {userAnswer !== `${allQuestions.Option4}` ?
                                    <Text style={styles.optionsStyle} onPress={() => (replaceBlanks(`${allQuestions.Question}`, `${allQuestions.Option4}`), setUserAnswer(`${allQuestions.Option4}`))}>{allQuestions.Option4}</Text>
                                    :
                                    <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => (replaceBlanks(`${allQuestions.Question}`, '__________'), setUserAnswer('__________'))}>{allQuestions.Option4}</Text>
                                }
                            </View>
                        </ScrollView>
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

            <ScrollView>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15, marginBottom: 40 }}>

                    {(`${allQuestions.IsOptionInImageFormate}` === "true") ?
                        <>
                            {userAnswer !== `${allQuestions.Option1}` ?
                                <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#CCCCCC', borderBottomColor: '#CCCCCC' }]} onTouchStart={() => setUserAnswer(`${allQuestions.Option1}`)}>
                                    <Image
                                        style={{ width: 132, height: 110, resizeMode: "contain" }}
                                        source={{
                                            uri: `${allQuestions.Option1}`,
                                        }}
                                    />
                                </View>
                                :
                                <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#58CC02', borderBottomColor: '#58CC02' }]} onTouchStart={() => setUserAnswer(`${allQuestions.Option1}`)}>
                                    <Image
                                        style={{ width: 132, height: 110, resizeMode: "contain" }}
                                        source={{
                                            uri: `${allQuestions.Option1}`,
                                        }}
                                    />
                                </View>
                            }
                            {userAnswer !== `${allQuestions.Option2}` ?
                                <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#CCCCCC', borderBottomColor: '#CCCCCC' }]} onTouchStart={() => setUserAnswer(`${allQuestions.Option2}`)}>
                                    <Image
                                        style={{ width: 132, height: 110, resizeMode: "contain" }}
                                        source={{
                                            uri: `${allQuestions.Option2}`,
                                        }}
                                    />
                                </View>
                                :
                                <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#58CC02', borderBottomColor: '#58CC02' }]} onTouchStart={() => setUserAnswer(`${allQuestions.Option2}`)}>
                                    <Image
                                        style={{ width: 132, height: 110, resizeMode: "contain" }}
                                        source={{
                                            uri: `${allQuestions.Option2}`,
                                        }}
                                    />
                                </View>
                            }
                            {userAnswer !== `${allQuestions.Option3}` ?
                                <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#CCCCCC', borderBottomColor: '#CCCCCC' }]} onTouchStart={() => setUserAnswer(`${allQuestions.Option3}`)}>
                                    <Image
                                        style={{ width: 132, height: 110, resizeMode: "contain" }}
                                        source={{
                                            uri: `${allQuestions.Option3}`,
                                        }}
                                    />
                                </View>
                                :
                                <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#58CC02', borderBottomColor: '#58CC02' }]} onTouchStart={() => setUserAnswer(`${allQuestions.Option3}`)}>
                                    <Image
                                        style={{ width: 132, height: 110, resizeMode: "contain" }}
                                        source={{
                                            uri: `${allQuestions.Option3}`,
                                        }}
                                    />
                                </View>
                            }
                            {userAnswer !== `${allQuestions.Option4}` ?
                                <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#CCCCCC', borderBottomColor: '#CCCCCC' }]} onTouchStart={() => setUserAnswer(`${allQuestions.Option4}`)}>
                                    <Image
                                        style={{ width: 132, height: 110, resizeMode: "contain" }}
                                        source={{
                                            uri: `${allQuestions.Option4}`,
                                        }}
                                    />
                                </View>
                                :
                                <View style={[styles.optionsStyle, { borderWidth: 5, borderBottomWidth: 5, borderColor: '#58CC02', borderBottomColor: '#58CC02' }]} onTouchStart={() => setUserAnswer(`${allQuestions.Option4}`)}>
                                    <Image
                                        style={{ width: 132, height: 110, resizeMode: "contain" }}
                                        source={{
                                            uri: `${allQuestions.Option4}`,
                                        }}
                                    />
                                </View>
                            }
                        </>
                        :
                        <></>
                    }
                    {(`${allQuestions.IsQuestionInMCQsFormate}` === "true") ?
                        <>
                            {userAnswer !== `${allQuestions.Option1}` ?
                                <Text style={styles.optionsStyle} onPress={() => setUserAnswer(`${allQuestions.Option1}`)}>{allQuestions.Option1}</Text>
                                :
                                <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => setUserAnswer(`${allQuestions.Option1}`)}>{allQuestions.Option1}</Text>
                            }
                            {userAnswer !== `${allQuestions.Option2}` ?
                                <Text style={styles.optionsStyle} onPress={() => setUserAnswer(`${allQuestions.Option2}`)}>{allQuestions.Option2}</Text>
                                :
                                <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => setUserAnswer(`${allQuestions.Option2}`)}>{allQuestions.Option2}</Text>
                            }
                            {userAnswer !== `${allQuestions.Option3}` ?
                                <Text style={styles.optionsStyle} onPress={() => setUserAnswer(`${allQuestions.Option3}`)}>{allQuestions.Option3}</Text>
                                :
                                <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => setUserAnswer(`${allQuestions.Option3}`)}>{allQuestions.Option3}</Text>
                            }
                            {userAnswer !== `${allQuestions.Option4}` ?
                                <Text style={styles.optionsStyle} onPress={() => setUserAnswer(`${allQuestions.Option4}`)}>{allQuestions.Option4}</Text>
                                :
                                <Text style={[styles.optionsStyle, { backgroundColor: '#c7c3c3', color: '#c7c3c3' }]} onPress={() => setUserAnswer(`${allQuestions.Option4}`)}>{allQuestions.Option4}</Text>
                            }
                        </>
                        :
                        <></>
                    }
                    {(`${allQuestions.IsQuestionInInputFormate}` === "true") ?
                        <TextInput style={styles.textArea}
                            placeholder="Type Something Here!"
                            multiline={true}
                            onChangeText={(text) => setUserAnswer(text.toUpperCase())}
                            value={userAnswer}
                        />
                        :
                        <></>
                    }
                </View>
            </ScrollView>

            <View style={styles.bottomView}>
                {
                    checkAnswer ?
                        <>
                            {userAnswer === `${allQuestions.correctAns}` ?
                                <View style={{ backgroundColor: '#84e67e', padding: 10, borderRadius: 10 }}>
                                    <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 5 }}> You are correct!</Text>
                                    {(lastQuestion === (questionNO + 1)) ?
                                        <Button onPress={() => (setUserAnswer(""), setCheckAnswer(false), addCompleteStatus())} title="Move To Chapters" color="#3e9139" />
                                        :
                                        <Button onPress={() => (setUserAnswer(""), setCheckAnswer(false), navigation.navigate("Question", { questionNOParams: `${Number(questionNO + 1)}` }))} title="Continue" color="#3e9139" />
                                    }
                                </View>
                                :
                                <View style={{ backgroundColor: '#e69975', padding: 10, borderRadius: 10 }}>
                                    <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 5 }}> You are Wrong!</Text>
                                    {(lastQuestion === (questionNO + 1)) ?
                                        <Button onPress={() => (setUserAnswer(""), setCheckAnswer(false), addCompleteStatus())} title="Move To Chapters" color="#BB2D3B" />
                                        :
                                        <Button onPress={() => (setUserAnswer(""), setCheckAnswer(false), navigation.navigate("Question", { questionNOParams: `${Number(questionNO + 1)}` }))} title="Okay, Continue" color="#BB2D3B" />
                                    }
                                </View>
                            }
                        </>
                        :
                        <View style={styles.row}>
                            <View style={styles.column5}>
                                {(lastQuestion === (questionNO + 1)) ?
                                    <TouchableHighlight style={styles.skipBtn} onPress={() => (setUserAnswer(""), setCheckAnswer(false), addCompleteStatus())}>
                                        <Text style={styles.skipBtnText}>SKIP</Text>
                                    </TouchableHighlight>
                                    :
                                    <TouchableHighlight style={styles.skipBtn} onPress={() => (setUserAnswer(""), setCheckAnswer(false), navigation.navigate("Question", { questionNOParams: `${Number(questionNO + 1)}` }))}>
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
        paddingBottom: 10,
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
        height: 100,
        padding: 10,
        borderRadius: 5,
        borderColor: '#CCCCCC'
    }
});
