import React from 'react'
import {  StyleSheet, Text, View } from 'react-native'
import Map from '../components/Map';
import {createStackNavigator} from '@react-navigation/stack'
import NavigateCard from '../components/NavigateCard';
import RideOptionCard from '../components/RideOptionCard';
import * as Location from 'expo-location';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

const MapScreen = () => {

    const Stack = createStackNavigator();

    return (
        <View>
            <View style={{height:'50%'}} >
           
                <Map/>
               
            </View>
            <View style={{height:'50%'}}>
               <Stack.Navigator>
                   <Stack.Screen
                       name="NavigateCard"
                       component={NavigateCard}
                       options={{
                           headerShown:false
                       }}
                   />
                    <Stack.Screen
                       name="RideOptionCard"
                       component={RideOptionCard}
                       options={{
                           headerShown:false
                       }}
                   />
               </Stack.Navigator>
            </View>
        </View>
    )
}

export default MapScreen;

const styles = StyleSheet.create({})
