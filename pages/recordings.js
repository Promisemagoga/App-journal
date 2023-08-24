
import { useNavigation } from '@react-navigation/native';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import * as React from 'react'
import { Pressable, SafeAreaView, StyleSheet, Text, View, Image, ScrollView, Modal, TextInput } from 'react-native'
import { db } from '../config/firebase';
import { Audio } from 'expo-av';


function Recordings() {
    const [savedRecording, setSavedRecordings] = React.useState("")

    // const audioPlayer = new Audio('path/to/audio/file.mp3');

    const [sound, setSound] = React.useState(null);


    React.useEffect(() => {
        getAudios()
    }, [])


    const getAudios = async () => {
        try {
            const querrySnapShot = await getDocs(collection(db, "recordInfo"));
            const data = querrySnapShot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setSavedRecordings(data)
        } catch (error) {
            console.log(error);
        }
    }

    const playSound = async (recordingUrl) => {
        try {
            const { sound } = await Audio.Sound.createAsync({ uri: recordingUrl });
            setSound(sound);
            await sound.playAsync();
        } catch (error) {
            console.log('Error playing sound', error);
        }
    };

    React.useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);



    console.log(savedRecording);

    const navigation = useNavigation();



    function deleteFunc(id) {
        const docRef = doc(db, 'recordInfo', id);
        deleteDoc(docRef)
            .then(() => {
                console.log('Document successfully deleted!');
            })
            .catch((error) => {
                console.error('Error removing document: ', error);
            })
    }


    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };


    


    return (
        <SafeAreaView style={styles.main}>
            <Text style={styles.heading}>My Journal</Text>
            <ScrollView style={styles.scroll}>
                <View style={styles.scrollCon}>
                    {savedRecording ? (
                        savedRecording.map((data) => (
                            <View style={styles.card} key={data.id}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.textColor}>{data.recName}</Text>
                                    <Text style={styles.textColor}>{data.date}</Text>
                                </View>
                                <View style={styles.cardBottom}>
                                    <View style={styles.rec}>
                                        <View>
                                            <Text>Your talking time</Text>
                                            <Text>{data.duration}</Text>
                                        </View>
                                        <Pressable onPress={() => playSound(data.recordingUrl)} style={styles.play}>
                                            <Text style={styles.textColor}>Play Sound</Text>
                                        </Pressable>
                                    </View>
                                    <View style={styles.crudBtn}>
                                        <Pressable style={styles.crudButton} onPress={() => deleteFunc(data.id)}>
                                            <Text style={styles.crudText}>Delete</Text>
                                        </Pressable>
                                        <Pressable style={styles.crudButton}>
                                            <Text style={styles.crudText} onPress={toggleModal} >Update</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text>No recordings found.</Text>
                    )}
                </View>
                <Modal visible={isModalVisible}>
                    <View>
                        <TextInput
                            placeholder="Enter heading..."
                            // onChangeText={handleTextChange}
                            style={styles.recordingHeading}
                        />
                        <Pressable>
                            <Text>Save Changes</Text>
                        </Pressable>
                    </View>
                </Modal>
            </ScrollView>
            <View style={styles.bottomNav}>
                <Pressable onPress={() => navigation.navigate('Recordings')}>
                    <Image source={require('../assets/patient.png')} style={styles.img} />
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Home')}>
                    <Image source={require('../assets/microphone.png')} style={styles.img} />
                </Pressable>
                <Pressable>
                    <Image source={require('../assets/contact.png')} style={styles.img} />
                </Pressable>
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
    scroll: {
        width: "100%",
        flex: 1
    },
    heading: {
        // marginBottom: "auto",
        marginTop: 50,
        padding: 20,
        fontSize: 30,
        // fontWeight: 650
    },

    card: {
        width: "80%",
        height: 250,
        marginTop: "auto",
        marginBottom: 20,
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        borderRadius: 10

    },

    cardHeader: {
        backgroundColor: "red",
        height: 100,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20
    },

    cardBottom: {
        marginBottom: "auto",
        height: 150,
        padding: 10,
    },

    textColor: {
        color: "#ffffff"
    },


    bottomNav: {
        marginTop: "auto",
        display: 'flex',
        flexDirection: "row",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        width: "100%",
        justifyContent: "space-between",
        padding: 20
    },

    img: {
        width: 30,
        height: 30,
    },

    crudBtn: {
        display: "flex",
        flexDirection: "row",
        marginLeft: "auto",
        marginTop: "auto",
        width: 130,
        justifyContent: "space-between",

    },

    play: {
        // marginTop: 30,
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "red",
        width: 100,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20

    },

    crudButton: {
        borderWidth: 1,
        borderColor: "red",
        padding: 5,
        borderRadius: 3


    },


    scrollCon: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    rec: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: 400

    },

    recordingHeading: {
        marginLeft: "auto",
        marginRight: "auto",
        
        marginTop: 50,
        borderBottomWidth: 1,
        width: 250,
        height: 30
    
      }
})

export default Recordings