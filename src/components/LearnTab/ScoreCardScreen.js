import QuestionsDetails from './QuestionsDetails';
import { Button, StyleSheet, Text, View, Image, ScrollView } from 'react-native';

export default function ScoreCardScreen({ navigation, route }) {
    const { yourScore } = route.params;
    const { skipQuestion } = route.params;
    // const TotalQues = QuestionsDetails.length;
    const { TotalQues } = route.params;
    const wrongAnswer = (TotalQues - (yourScore + skipQuestion))
    return (
        <View style={styles.mainContainer}>
            <ScrollView>
                <Text style={styles.mainHeading}>Your Score: {yourScore}/{TotalQues}</Text>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        style={{ width: 180, height: 180, marginTop: 30, borderRadius: 20 }}
                        source={{
                            uri: 'https://static.vecteezy.com/system/resources/previews/001/942/619/original/gold-winner-celebration-banner-with-trophy-vector.jpg',
                        }}
                    />
                </View>
                <Text style={styles.Heading}>Total Question: {TotalQues}</Text>
                <Text style={styles.Heading}>Attempt Question: {TotalQues - skipQuestion}</Text>
                <Text style={styles.Heading}>Skipped Question: {skipQuestion}</Text>
                <Text style={styles.Heading}>Wrong Question: {wrongAnswer}</Text>
                <View style={styles.container}>
                    <Button onPress={() => navigation.navigate("Learn")} title="Move To Chapters" color="#308dfc" />
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
        paddingHorizontal: 30,
    },
    mainHeading: {
        padding: 10,
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: '#272425',
    },
    Heading: {
        fontSize: 22,
        textAlign: 'center',
        marginTop: 10
    },
});
