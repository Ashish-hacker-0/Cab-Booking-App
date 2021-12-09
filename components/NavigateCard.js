import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {GOOGLE_MAPS_APIKEY} from '@env';
import { useDispatch, useSelector } from 'react-redux';
import { setDestination } from '../slices/navSlice';
import { useNavigation } from '@react-navigation/core';
import NavFovourites from './NavFovourites';
import { Icon } from 'react-native-elements';
import { selectRides } from '../slices/userSlice';

const NavigateCard = () => {

     const dispatch = useDispatch();
     const navigation = useNavigation();
     const rides = useSelector(selectRides);

     useEffect(()=>{
        const ride = rides.filter(r=>r.status==='Pending');

        console.log(ride,ride.length);

        if(ride.length!=0){
            navigation.navigate('RideOptionCard');
        }
    },[]);

    return (
        <View style={{flex:1,backgroundColor:'white'}} >
            <Text style={{textAlign:'center',paddingVertical:10,fontSize:20}} >Good Morning, Ashish</Text>
            <View style={{flex:1,borderTopWidth:1,borderTopColor:'lightgray'}} >
                <View style={{flex:1}} >
                   <GooglePlacesAutocomplete
                       placeholder="Where to?"
                       fetchDetails={true}
                       enablePoweredByContainer={false}
                       query={{
                           key:GOOGLE_MAPS_APIKEY,
                           language:'en'
                       }}
                       minLength={2}
                       onPress={(data,details=null)=>{
                           dispatch(setDestination({
                               location:details.geometry.location,
                               description:data.description
                           }));
                           navigation.navigate('RideOptionCard');
                       }}
                       nearbyPlacesAPI="GooglePlacesSearch"
                       debounce={400}
                       styles={styles}
                   />
                   <NavFovourites/>

                </View>
                
                <View
                  style={{flexDirection:'row',backgroundColor:'white',justifyContent:'space-evenly',paddingVertical:2,marginTop:'auto',borderTopWidth:1,borderTopColor:'lightgray'}}
                >
                    <TouchableOpacity
                       style={{flexDirection:'row',justifyContent:'space-between',backgroundColor:'black',paddingHorizontal:10,paddingVertical:7,borderRadius:26,alignItems:'center'}}
                       onPress={()=>navigation.navigate('RideOptionCard')}
                    >
                        <Icon
                            name="car"
                            type="font-awesome"
                            color="white"
                            sizes={16}
                        />
                        <Text style={{color:'white',textAlign:'center',paddingHorizontal:5}}>Rides</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                       style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,paddingVertical:7,borderRadius:26,alignItems:'center'}}
                    >
                        <Icon
                            name="fast-food-outline"
                            type="ionicon"
                            color="black"
                            sizes={16}
                        />
                        <Text style={{textAlign:'center',color:'black',paddingHorizontal:5}}>Eats</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default NavigateCard

const styles = StyleSheet.create({
    container:{
        backgroundColor:"white",
        paddingTop:20,
        flex:0,
    },
    textInput:{
        backgroundColor:'#dddddf',
        borderRadius:0,
        fontSize:18
    },
    textInputContainer:{
        paddingHorizontal:20,
        paddingBottom:0
    }
})
