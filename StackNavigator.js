import React from 'react'
import { Text } from 'react-native'
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import Jonurnal from './pages/journal'
import Recordings from './pages/recordings'

const Stack = createNativeStackNavigator()
function StackNavigator() {
  return (
   <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Group>
        <Stack.Screen name='Home' component={Jonurnal}/>
        <Stack.Screen name='Recordings' component={Recordings}/>
    </Stack.Group>
   </Stack.Navigator>
  )
}

export default StackNavigator