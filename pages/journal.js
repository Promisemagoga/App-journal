import * as React from 'react'
import { Audio } from 'expo-av'
import { Button, Image, SafeAreaView, StyleSheet, View, Text, Pressable, TouchableOpacity } from 'react-native';
import { db, storage } from '../config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

function Jonurnal() {
  const [recording, setRecording] = React.useState();

  async function startRecording() {
    try {
      console.log('Request Submission');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Start recording');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });
      await recording.startAsync();
      setRecording(recording);
      console.log('Recording Started');
    } catch (error) {
      console.error('failed to start recording', error);
    }
  }


  //we are going to console.log the url of the audio , you can use it to play or store the recording
  async function stopRecording() {
    try {
      console.log('Stopping recording...');
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI()
      const fileName = `journal${new Date().getTime()}`;
      const recordPath = `recordings/${fileName}`
      const storageRef = ref(storage, recordPath)
      const uploadRecordings = uploadBytes(storageRef, uri).then(() => {
        getDownloadURL(storageRef).then(async (url) => {
          await addDoc(collection(db, "recordInfo"), {
            date: new Date(),
            recordingUrl: url,
            fileName: fileName
          })
        })
      })
      setRecording(undefined)
      console.log("Recording stopped and stored at", uri);

      playSound({uri})

    } catch (error) {
      console.log(error);
    }
  }

  const [sound, setSound] = React.useState(null);

  async function playSound({uri}) {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      { uri: uri}
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  const navigation = useNavigation();
 

  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.heading}>Record</Text>
      <Pressable style={styles.opacity} onPress={recording ? stopRecording : startRecording}>
        {/* <View style={styles.btn}>{recording ? 'Stop recording' : 'Start Recording'}</View> */}
        <View style={styles.btn}>{recording ? <Image source={require('../assets/pause.png')} style={styles.recIcon} /> : <Image source={require('../assets/play.png')} style={styles.recIcon} />}</View>
      </Pressable>
      <View style={styles.bottomNav}>
        <Pressable onPress={() => navigation.navigate('Recordings')}>
        <Image source={require('../assets/patient.png')} style={styles.img} />
        </Pressable>
      <Pressable>
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

  recording: {
    width: 200,
    height: 200
  },

  img: {
    width: 30,
    height: 30,
  },

  recIcon: {
    width: 100,
    height: 100,
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

  heading: {
    marginBottom: "auto",
    marginTop: 50,
    padding: 20,
    fontSize: 30,
    // fontWeight: 650
  },

  // btn: {
  //   backgroundColor: "red",
  //   width: 200,
  //   height: 200,
  //   borderRadius: "100%",
  //   alignItems: "center",
  //   justifyContent: "center"


  // },

  // opacity: {
  //   backgroundColor: "#F7C5C2",
  //   width: 250,
  //   height: 250,
  //   borderRadius: "100%",
  //   alignItems: "center",
  //   justifyContent: "center"
  // }

});

export default Jonurnal