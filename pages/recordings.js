
import React from 'react'
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'

function Recordings() {
    // const audioPlayer = new Audio('path/to/audio/file.mp3');

    function playAudio() {
        // audioPlayer.play()
        console.log("audio playing");
    }
    return (
        <SafeAreaView style={styles.main}>
            <Text style={styles.heading}>My Journal</Text>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text>Record</Text>
                    <Text>Today</Text>
                </View>
                <View>
                    <Pressable onPress={playAudio}><Text>Play Sound</Text></Pressable>
                </View>
                <View>
                    <Pressable>
                        <Text>Delete</Text>
                    </Pressable>
                    <Pressable>
                        <Text>Update</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
    },
})

export default Recordings