import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Linking, AppState } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from "expo-task-manager";
import { Icon } from 'react-native-elements';
import {LoadingIndicator} from 'react-native-expo-fancy-alerts'
import { useSelector } from 'react-redux';
import { selectDriver, selectRides } from '../slices/driverSlice';
import MapViewDirections from 'react-native-maps-directions';
const LOCATION_TASK_NAME = "background-location-task";
const querystring = require('query-string');
import { GOOGLE_MAPS_APIKEY } from '@env';

const DriverHome = ({navigation}) => {

    const [lat,setLat] = useState(null);
    const [long,setLong] = useState(null);
    const mapRef = useRef(null);
    const [description,setDes] = useState('Bihar');
    const [Loading,setLoading] = useState(false);
    const [started,setStarted] = useState(false);
    const [newride,setNewRide] = useState(null);
    const [ridea,setRidea] = useState(null);
    const [rides,setRides] = useState(null);
    const [city,setCity] = useState('');
    const [complete,setComplete] = useState(false);
    const [originll,setOrigin] = useState(null);
    const [destinationll,setDestinationll] = useState(null);

    const driver = useSelector(selectDriver);
    const prevrides = useSelector(selectRides);
    const _getLocationAsync = async () => {
        // watchPositionAsync Return Lat & Long on Position Change
        const location = await Location.watchPositionAsync(
          {
            enableHighAccuracy: true,
            distanceInterval: 1,
            timeInterval: 10000,
            accuracy:Location.Accuracy.BestForNavigation
          },
          newLocation => {
            let { coords } = newLocation;
            let region = {
              latitude: coords.latitude,
              longitude: coords.longitude,
              latitudeDelta: 0.045,
              longitudeDelta: 0.045
            };
            setLong(region.longitude);
            setLat(region.latitude);
          },
          error => console.log(error)
        );
        return location;
    };

    const appState = useRef(AppState.currentState);

    useEffect(()=>{

       

        const intervalId = setInterval(async() => {  //assign interval to a variable to clear it.
            let { status } = await Location.requestBackgroundPermissionsAsync();
            if (status !== 'granted') {

                setErrorMsg('Permission to access location was denied');

                return;
            }else{
                if(driver){
                    _getLocationAsync();
                    setLoading(false);
                    if(started){
                        getNewRides();
                    }    
                }
            }
            
          }, 5000)
        
          AppState.addEventListener('change', _handleAppStateChange);

        return () => {
        AppState.removeEventListener('change', _handleAppStateChange);
        clearInterval(intervalId)
        };

    });

    useEffect(() => {
        const ride = prevrides.filter(p=>p.status!='Completed');
        if(ride.length!=0){
            stop();
            if(ride[0].status=='Pending'){
                setRidea(ride[0]);
            }else{
                setRides(ride[0]);
            }
        }
    }, []);

    const getNewRides = async ()=> {
        await fetch(`http://192.168.227.135:8001/newride/${city}`)
        .then(res=>res.json())
        .then(data=>{
            if(data.length>0){
                setNewRide(data[0]);
            }
        });
       
    }

    const _handleAppStateChange = (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground!');
        }else{
            if(started){
                stop();
                setStarted(false);
            }
             
        }
    
        appState.current = nextAppState;
    };

    const start = async() => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {

            return;
            
        }
       setLoading(true);
        await Location.getCurrentPositionAsync({
            accuracy:Location.Accuracy.BestForNavigation
        })
        .then(res=>{
           console.log(res);
           setLat(res.coords.latitude);
           setLong(res.coords.longitude);
           Location.reverseGeocodeAsync({
               latitude:res.coords.latitude,
               longitude:res.coords.longitude
           })
           .then(async(response)=>{
                console.log(response[0].subregion);
                setCity(response[0].subregion);
                await fetch('http://192.168.227.135:8001/active',{
                            method:'POST',
                            body:querystring.stringify({
                                    id:driver._id,
                                    lat:res.coords.latitude,
                                    long:res.coords.longitude,
                                    city:response[0].subregion
                                }),
                            headers:{
                                'Content-Type' : 'application/x-www-form-urlencoded'
                            },
                })
           })
       });
       
       setStarted(true);

       setLoading(false);
    }

    const stop = async () => {
        setLoading(true);

        await fetch(`http://192.168.227.135:8001/inactive/${driver._id}`,{
                            method:'POST',
                });

        setStarted(false);
 
        setLoading(false);
    }

    const acceptride = async() => {
        await fetch(`http://192.168.227.135:8001/assigndriver/${newride._id}`,{
            method:'POST',
            body:querystring.stringify({
                    driver:driver.name,
                    driverId:driver._id,
                    driverphone:driver.phone
                }),
            headers:{
                'Content-Type' : 'application/x-www-form-urlencoded'
            },
        })
        .then(res=>res.json())
        .then(async(data)=>{
            console.log(data);
            await setRidea(data);
            await setDestinationll({
                latitude:data.clat,
                longitude:data.clong,
            });
            await setOrigin({
                latitude:lat,
                longitude:long
            });
            await setNewRide(null);
            stop();
        });
    }

    const startbike = async() => {
        console.log('started');
        await fetch(`http://192.168.227.135:8001/startride/${ridea._id}`,{
            method:'POST',
        })
        .then(res=>res.json())
        .then(async(data)=>{
            console.log(data);
            await setDestinationll({
                latitude:data.dlat,
                longitude:data.dlong,
            });
            await setOrigin({
                latitude:data.clat,
                longitude:data.clong
            });
            setRides(data);
            setRidea(null);
        });
    }

    const completeride = async() => {
        await fetch(`http://192.168.227.135:8001/completeRide/${rides._id}`,{
            method:'POST',
        }).then(res=>res.json())
        .then(async(data)=>{
            console.log(data);
        });
        setComplete(true);
    }
    return (
        <View style={{flex:1}} >
             <LoadingIndicator
                 visible={Loading}
             />
            {!Loading&&<View style={{flex:1}} >
            <MapView
                ref={mapRef}
                style={{flex:1}}
                mapType="mutedStandard"
                initialRegion={{
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
                }}
            >
            {lat&&long&&<Marker
               coordinate={{
                latitude: lat,
                longitude: long
               }}
               title="Origin"
               description={description}
               identifier="origin"
            ><Icon name={'car'} type={'antdesign'} /></Marker>}
            {originll&&destinationll&&<MapViewDirections
                    origin={originll}
                    destination={destinationll}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={3}
                    strokeColor="black"
                />}
            </MapView>
            </View>}
            <TouchableOpacity style={{position:'absolute',top:10,height:60,width:100,backgroundColor:'white',borderRadius:50,alignItems:'center',justifyContent:'center'}}
               onPress={()=>navigation.navigate('Your Earning')}
            >
                <View style={{borderWidth:3,width:100,height:40,borderRadius:40,alignItems:'center',justifyContent:'center'}} >

                    <Text>Rs. {driver.wallet.toFixed(2)}</Text>
                </View>
            </TouchableOpacity>
            {!started&&<TouchableOpacity style={{position:'absolute',bottom:10,alignSelf:'center',height:100,width:100,backgroundColor:'#FEBF00',borderRadius:50,alignItems:'center',justifyContent:'center'}} onPress={()=>start()} >
                <View style={{borderWidth:3,width:80,height:80,borderRadius:40,alignItems:'center',justifyContent:'center'}} >
                    <Text>START</Text>
                </View>
            </TouchableOpacity>}
            {started&&<TouchableOpacity style={{position:'absolute',bottom:10,alignSelf:'center',height:100,width:100,backgroundColor:'red',borderRadius:50,alignItems:'center',justifyContent:'center'}} onPress={()=>stop()} >
                <View style={{borderWidth:3,width:80,height:80,borderRadius:40,alignItems:'center',justifyContent:'center'}} >
                    <Text>STOP</Text>
                </View>
            </TouchableOpacity>}
            {newride&&<View style={{height:'100%',width:'100%',position:'absolute',backgroundColor:'rgba(0, 0, 0, 0.35)',alignItems:'center',justifyContent:'center'}} >
                 <View style={{backgroundColor:'white',width:'80%',flexDirection:'row',padding:20}} >
                     <View style={{paddingVertical:20,padding:5}}>
                        <Text style={{fontWeight:'700'}} >
                            {newride.name}
                        </Text>
                        <Text>
                            {newride.distance}
                        </Text>
                        <Text>
                            {newride.ttime}
                        </Text>
                     </View>
                     <View style={{borderLeftColor:'black',borderLeftWidth:3,padding:20}} > 

                        <View style={{flexDirection:'row',alignItems:'center'}} ><View style={{height:10,width:10,backgroundColor:'red',borderRadius:5,marginRight:5}} ></View><Text>{newride.cname}</Text></View>
                        <View style={{height:10,borderLeftColor:'black',borderLeftWidth:3,marginLeft:4}} ></View>
                        <View style={{flexDirection:'row',alignItems:'center'}} ><View style={{height:10,width:10,backgroundColor:'green',borderRadius:5,marginRight:5}} ></View><Text>{newride.dname}</Text></View>
                     </View>
                 </View>
                 <View style={{backgroundColor:'white',flexDirection:'row',width:'80%',justifyContent:'space-between'}}>
                     <TouchableOpacity style={{alignItems:'center',flex:1,backgroundColor:'black',padding:15}} onPress={()=>setNewRide(null)} ><Text style={{color:'#FEBF00'}}  >CANCEL</Text></TouchableOpacity>

                     <TouchableOpacity style={{alignItems:'center',flex:1,backgroundColor:'#FEBF00',padding:15}} onPress={()=>acceptride()} ><Text>ACCEPT</Text></TouchableOpacity>
                 </View>
            </View>}
            {ridea&&<View style={{position:'absolute',bottom:10,alignSelf:'center',width:'100%',backgroundColor:'white'}}>
               <View style={{flexDirection:'row',width:'100%',justifyContent:'space-around',paddingVertical:20,alignItems:'center'}} >
                   <Text style={{fontWeight:'700',fontSize:18}} >{ridea.name}</Text>
                   <TouchableOpacity
                      onPress={()=>Linking.openURL(`tel:+91${ridea.userphone}`)}
                   >
                   <Icon
                       name={'call'}
                       
                       style={{
                           backgroundColor:'#FEBF00',
                           width:50,
                           height:50,
                           borderRadius:25,
                           alignItems:'center',
                           justifyContent:'center'
                       }}
                       
                   />
                   </TouchableOpacity>
               </View>
               <TouchableOpacity
                  style={{backgroundColor:'#FEBF00',padding:10,alignItems:'center'}}
                  onPress={()=>startbike()}
               >
                <Text style={{fontSize:18}}  >START BIKESHARE</Text>
               </TouchableOpacity>
            </View>}
            {rides&&<View style={{position:'absolute',bottom:10,alignSelf:'center',width:'100%',backgroundColor:'white'}}>
               <View style={{flexDirection:'row',width:'100%',justifyContent:'space-around',paddingVertical:20,alignItems:'center'}} >
                   <Text style={{fontWeight:'700',fontSize:18}} >Ashish Kumar</Text>
                   <TouchableOpacity
                      onPress={()=>Linking.openURL(`tel:+${rides.userphone}`)}
                   >
                   <Icon
                       name={'call'}
                       
                       style={{
                           backgroundColor:'#FEBF00',
                           width:50,
                           height:50,
                           borderRadius:25,
                           alignItems:'center',
                           justifyContent:'center'
                       }}
                       
                   />
                   </TouchableOpacity>
               </View>
               {!complete&&<TouchableOpacity
                  style={{backgroundColor:'red',padding:10,alignItems:'center'}}
                  onPress={()=>completeride()}
               >
                {rides.payment&&<Text style={{fontSize:18}}  >COMPLETE BIKESHARE</Text>}
                {!rides.payment&&<Text style={{fontSize:18}}>COLLECT Rs. 47</Text>}

               </TouchableOpacity>}
               {complete&&<TouchableOpacity
                  style={{backgroundColor:'red',padding:10,alignItems:'center'}}
                  onPress={()=>{
                      setRides(null)
                      setComplete(false);
                  }}
               >
                <Text style={{fontSize:18}}>CLOSE</Text>
               </TouchableOpacity>}
               
            </View>}

        </View>
    )
}



export default DriverHome
