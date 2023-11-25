import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GettingChapterById } from '../../graphql/mutations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, StyleSheet, Text, View, ScrollView } from 'react-native';

export default function DescriptionScreen({ navigation, route }) {
    const { chapterId } = route.params;
    const [chapterDetail, setChapterDetail] = useState('');
    const [gettingAllChapterFromQuery] = useMutation(GettingChapterById);

    useEffect(() => {
        gettingAllChapterFromQuery({
            variables: {
                "gettingId": chapterId
            },
        })
            .then(res => {
                setChapterDetail(res.data.findChapterById)
            })
            .catch(err => Toast.show(err))
    }, []);

    return (
        <View style={styles.mainContainer}>
            <ScrollView>
                <Text style={styles.mainHeading}>Topic: {chapterDetail.chapterName}</Text>
                <View style={styles.container}>
                    <Button onPress={() => (AsyncStorage.setItem("chapterId", chapterId), navigation.navigate("Question"))} title="Start Quiz" color="#308dfc" />
                    <ScrollView style={{ marginTop: 10 }}>
                        <Text style={styles.topicDescription}>{chapterDetail.chapterDescription}</Text>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 10,
    },
    mainHeading: {
        padding: 10,
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: '#272425',
        textDecorationLine: 'underline',
    },
    topicDescription: {
        fontSize: 18,
        marginBottom: 50
    }
});

