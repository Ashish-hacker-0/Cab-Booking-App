
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {Provider, useDispatch} from 'react-redux';
import { store } from './store';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './screens/MapScreen';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import DriverScreen from './screens/DriverScreen';
import 'react-native-gesture-handler';
import Demo from './screens/Demo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from './slices/userSlice';
import { setDriver } from './slices/driverSlice';

const Stack = createStackNavigator();

function Main() {
    const [screen,setScreen] = useState(false);
    // const [token,setToken] = useState(null);
  
    const [initial,setInitial] = useState('');
    
    const dispatch = useDispatch(store);
  
    useEffect(()=>{
      console.log(screen);
      const fetchuser = async ()=>{
          let token = null;
        await AsyncStorage.getItem('user_token')
        .then(res=>{
          token=res;
        });
        await AsyncStorage.getItem('user_type')
        .then(async(res)=>{
            if(token){
              console.log(res);
              if(res==='Rider'){
                await fetch(`http://192.168.227.135:8001/user/${token}`)
                      .then(res=>res.json())
                      .then(async (data)=>{
                        console.log('Main',data)

                        await dispatch(setUser(data));
                      });
                    await  setInitial('MainScreen');
              }
              if(res==='Driver'){
                await fetch(`http://192.168.227.135:8001/driver/${token}`)
                      .then(res=>res.json())
                      .then(async (data)=>{
                        console.log('Main',data)
                        await dispatch(setDriver(data));
                      });
                    await  setInitial('DriverScreen');
              }
            }else{
                setInitial('LoginScreen');
            }
        })
      }
     fetchuser();
  
    },[]);


    return (
      <NavigationContainer>
      
      {initial!=''&&<Stack.Navigator
        initialRouteName={initial}
        screenOptions={{
          animationEnabled:true
        }}
      >
        <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              headerShown:false
            }}
          />
        <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options={{
              headerShown:false
            }}
          />
        
          
        <Stack.Screen
            name="DriverScreen"
            component={DriverScreen}
            options={{
              headerShown:false
            }}
          />
          
        <Stack.Screen
            name="MapScreen"
            component={MapScreen}
            options={{
              headerShown:false
            }}
          />
        </Stack.Navigator>}
      </NavigationContainer>
  
  
    );
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default Main
