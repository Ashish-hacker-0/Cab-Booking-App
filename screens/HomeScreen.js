import React, { useEffect, useState } from 'react'
import { View, Text,SafeAreaView, StyleSheet,StatusBar, Image } from 'react-native'
import NavOptions from '../components/NavOptions'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {GOOGLE_MAPS_APIKEY} from '@env';
import { setOrigin,setDestination } from '../slices/navSlice';
import { useDispatch } from 'react-redux';
import NavFovourites from '../components/NavFovourites';
import * as Location from 'expo-location';
// navigator.geolocation = require('expo-location');

import {installWebGeolocationPolyfill} from 'expo-location';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HomeScreen = () => {


    const [location,setLocation] = useState('');
    const [selectLoc,setSelectLoc] = useState(false);
    useEffect(() => {
        const getPermission =  async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {

                setErrorMsg('Permission to access location was denied');

                return;
                
            }
            Location.getCurrentPositionAsync({
                accuracy:Location.Accuracy.BestForNavigation
            })
            .then((respose)=>{
                Location.reverseGeocodeAsync({
                    latitude:respose.coords.latitude,
                    longitude:respose.coords.longitude
                })
                .then(async(res)=>{
                    console.log(res);
                    await setLocation(`${res[0].name}, ${res[0].district}, ${res[0].city}, ${res[0].region}, ${res[0].postalCode}`);
                    console.log(location);
                    dispatch(setOrigin({
                        location:{
                            lat:respose.coords.latitude,
                            lng:respose.coords.longitude
                        },
                        description:`${res[0].name}, ${res[0].district}, ${res[0].city}, ${res[0].region}, ${res[0].postalCode}`
                    }))
                });
            })
            
            

            //12274d0ede178551c259b9b75ada2cfc
            installWebGeolocationPolyfill();
            
            dispatch(setDestination(null));
        };

        getPermission();
      }, []);

    const dispatch = useDispatch();
    return (
        <SafeAreaView style={styles.container} >
        {selectLoc&&<View 
           style={{
               flex:1,
               zIndex:100,
               position:'absolute',
               width: '100%',
               height:'100%'
           }}
        >
        <GooglePlacesAutocomplete
            placeholder="Where from ?"
            fetchDetails={true}
            enablePoweredByContainer={false}
            query={{
                key:GOOGLE_MAPS_APIKEY,
                language:'en'
            }}
            minLength={2}
            onPress={(data,details=null)=>{
                console.log(data,details);
                dispatch(setOrigin({
                    location:details.geometry.location,
                    description:data.description
                }));
                setLocation(data.description);
                setSelectLoc(false);
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            styles={{
                    textInput:{
                        fontSize:18
                    },
                    container:{
                        position:'absolute',
                        width:'100%',
                        zIndex:10,
                        top:10
                    }
            }}
            
           
        />
        <View
           style={{
               backgroundColor:'black',
               opacity:0.5,
               flex:2
           }}
           onTouchEnd={()=>setSelectLoc(false)}
        >
        </View>
        </View>
        }<View style={{paddingHorizontal:10}}>
        <TouchableOpacity
            placeholder="Where from ?"
            style={{
                backgroundColor:'white',
                padding:10
            }}
           onPress={()=>setSelectLoc(true)}
        >
            <Text>{location}</Text>
        </TouchableOpacity>   
        


           <NavOptions/>
           <NavFovourites/>
           </View>
        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#F6F6F6',
        flex:1
    }
})