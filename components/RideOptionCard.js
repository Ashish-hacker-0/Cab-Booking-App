import { useNavigation } from '@react-navigation/core';
import React, { Fragment, useEffect, useState } from 'react'
import { FlatList, Image, Linking, StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { selectDestination, selectOrigin, selectTravelTimeInformation } from '../slices/navSlice';
import { selectRides, selectUser, setRides, updateRide } from '../slices/userSlice';
import loader from '../assets/loader.gif';
import * as Location from 'expo-location';
const querystring = require('query-string');

const data = [
    {
        id:1,
        title:'UberX',
        multiplier:1,
        image:"http://links.papareact.com/3pn",
    },
    {
        id:2,
        title:'UberXL',
        multiplier:1.2,
        image:"http://links.papareact.com/5w8",
    },
    {
        id:3,
        title:'UberLUX',
        multiplier:1.75,
        image:"http://links.papareact.com/7pf",
    },
   
];

const SURGE_CHARGE_RATE = 12.5;

const RideOptionCard = () => {

    const navigation = useNavigation();
    const [selected,setSelected] = useState(null);
    const [payment,setPayment] = useState(false);
    const [searching,setSearching] = useState(false);
    const rides = useSelector(selectRides);
    const user = useSelector(selectUser);
    const [city,setCity] = useState('');
    const [ridea,setRidea] = useState(null);
    const [initride,setInitride] = useState(null);
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);


    useEffect(()=>{
        const ride = rides.filter(r=>r.status==='Pending');

        console.log(ride,ride.length);

        console.log('ride0',ride[0]);

        if(ride.length!=0){
            setInitride(ride[0]);
            setSearching(true);
        }

        

        Location.reverseGeocodeAsync({
            latitude:origin.location.lat,
            longitude:origin.location.lng
        })
        .then(res=>{
            setCity(res[0].subregion);
        });
        const intervalId = setInterval(async() => {
               rideStatus();
        },5000);
        return () => {
            clearInterval(intervalId);
        }

    },[]);

   
    

    const travelTimeInformation = useSelector(selectTravelTimeInformation);


    const dispatch = useDispatch();
    
    const rideStatus = async() => {

        const ride = await rides.filter(r=>r.status==='Pending');

        console.log(ride);

        if(ride.length!=0){
            await fetch(`http://192.168.227.135:8001/ride/${ride[0]._id}`)
            .then(res=>res.json())
            .then(data=>{
                console.log(data);
                if(data.status!='Pending'){
                    console.log(initride);
                    setInitride(null);
                    setRidea(data);
                }
            })
        }else{
            if(ridea){
                await fetch(`http://192.168.227.135:8001/ride/${ridea._id}`)
                .then(res=>res.json())
                .then(data=>{
                    console.log(data);
                    if(data.status=='Completed'){
                        setRidea(data);
                        dispatch(updateRide(data));
                        return;
                    }
                    if(data.status!=ridea.status){
                        setInitride(null);
                        setRidea(data);
                    }
                })
            }
        }
    }

    const makeRide = async() => {
        setPayment(false);
        console.log(selected,origin,destination);
 
        const date = new Date();
        const tdate = date.getDate()+'-'+Math.round(date.getMonth() + 1)+ '-' + date.getFullYear();
        const time = date.getHours()+':'+date.getMinutes()+":"+date.getSeconds();

        const initrid = {
            userId:user._id,
            clat:origin.location.lat,
            clong:origin.location.lng,
            cname:origin.description,
            dlat:destination.location.lat,
            dlong:destination.location.lng,
            dname:destination.description,
            name:user.name,
            userphone:user.phone,
            date:tdate,
            time:time,
            status:'Pending',
            id:'JBGA'+(Math.floor(Math.random()*90000) + 10000),
            distance:travelTimeInformation.distance.text,
            ttime:travelTimeInformation?.duration?.text,
            amount:(travelTimeInformation?.duration?.value*SURGE_CHARGE_RATE*selected.multiplier)/100,
            payment:'Pending',
            city:city
        };

        

        await dispatch(setRides(initrid));
        
        await fetch('http://192.168.227.135:8001/newride',{
            method:'post',
            headers:{
                'Content-Type' : 'application/x-www-form-urlencoded'
            },
            body:querystring.stringify(initrid)
        })
        .then(res=>res.json())
        .then(data=>setInitride(data))
        .catch(err=>console.log(err));

        setSearching(true);

    }

    return (
        <Fragment>
        {searching&&<View style={{backgroundColor:'#CEE3E2',flex:1,alignItems:'center',justifyContent:'center'}}>
        <Text>Please Wait...</Text>
            <Image
                source={loader}
                style={{height:'60%',width:'60%'}}
            />
            <Text>Finding a Driver</Text>
            <TouchableOpacity
                style={{backgroundColor:'#FEBF00',padding:10,margin:10,paddingHorizontal:15}}
                onPress={ async ()=>{
                    console.log(initride);
                    // initride[0].status = "cancelled";
                    await setInitride(null);
                    console.log(initride);
                    dispatch(updateRide({
                        ...initride,
                        status:'cancelled'
                    }));
                    await fetch(`http://192.168.227.135:8001/cancelride/${initride.id}`,{
                        method:'POST'
                    });
                    setSearching(false);
                    navigation.navigate('NavigateCard');
                }}
            >
                <Text  >CANCEL</Text>
            </TouchableOpacity>
        </View>}
        {payment&&<View style={{backgroundColor:'white',flex:1}}>
          <Text style={{textAlign:'center',paddingVertical:5,fontSize:18}}>Choose Payment Method - ₹{(travelTimeInformation?.duration?.value*SURGE_CHARGE_RATE*selected.multiplier)/100}</Text>
          <TouchableOpacity
            style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,backgroundColor:'white',borderColor:'black',borderWidth:3,margin:20,padding:10}}
          >
              <Text>Pay Now</Text>
              <Icon
                  name={'right'}
                  type={'antdesign'}
              />
             
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,backgroundColor:'white',borderColor:'black',borderWidth:3,margin:20,padding:10}}
            onPress={()=>makeRide()}
          >
              <Text>Pay Later</Text>
              <Icon
                  name={'right'}
                  type={'antdesign'}
              />
          </TouchableOpacity>
        </View>}
        {!payment&&!searching&&!ridea&&<View style={{backgroundColor:'white',flex:1}}>
           <View style={{flexDirection:'row',alignItems:'center',padding:10}}>
               <TouchableOpacity
                   onPress={()=>navigation.navigate('NavigateCard')}
               >
                   <Icon
                       name="chevron-left"
                       type="fontawesome"
                       color="black"
                   />
               </TouchableOpacity>
               <Text style={{textAlign:'center',paddingVertical:5,fontSize:18,flex:1}} >Select a Ride - {travelTimeInformation?.distance?.text} </Text>
           </View>
           <FlatList
               data={data}
               keyExtractor={(data)=>data.id.toString()}
               renderItem={({item:{id,title,multiplier,image},item})=>{
                   return(
                       <TouchableOpacity
                       style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,backgroundColor:selected?.id==id&&travelTimeInformation?.duration?'lightgray':'white'}}
                           onPress={()=>setSelected(item)}  
                        >
                          <Image
                              style={{
                                  width:100,
                                  height:100,
                                  resizeMode:'contain'
                              }}
                              source={{uri:image}}
                          />
                          <View  >
                              <Text style={{fontSize:20,fontWeight:'700'}} >{title}</Text>
                              <Text> {travelTimeInformation?.duration?.text} Travel Time</Text>
                          </View>
                          <Text style={{fontSize:19}} >
                          ₹ {
                                     (travelTimeInformation?.duration?.value*SURGE_CHARGE_RATE*multiplier)/100
                             }
                          </Text>
                       </TouchableOpacity>
                   )
               }}
           />
           <View>
                <TouchableOpacity 
                    disabled={!selected}
                    style={{backgroundColor:selected&&travelTimeInformation?.duration?'black':'lightgray',paddingVertical:10,margin:10}} 
                    onPress={()=>setPayment(true)}
                >
                    <Text style={{textAlign:'center',color:'white',fontSize:18}} >{travelTimeInformation?.duration&&`Choose ${selected?selected.title:'One'}`}{!travelTimeInformation?.duration&&`No Rides Available`}</Text>
                </TouchableOpacity>
           </View>
        </View>}
        {ridea&&
            <View style={{position:'absolute',bottom:10,alignSelf:'center',width:'100%',backgroundColor:'#CEE3E2',height:'100%'}}>
            <Image
                source={loader}
                style={{height:'60%',width:'60%',alignSelf:'center'}}
            />
            {<Text style={{alignSelf:'center',color:'white',fontSize:22,fontWeight:'700'}}>{ridea.status=='Assigned'&&`YOUR DRIVER IS ON THE WAY`}{ridea.status=='Started'&&`Happy Riding`}{ridea.status=='Completed'&&`Thanku for Your ride`}</Text>}
               <View style={{flexDirection:'row',width:'100%',justifyContent:'space-around',paddingVertical:20,alignItems:'center'}} >
                   <Text style={{fontWeight:'700',fontSize:18}} >Ashish Kumar</Text>
                   <TouchableOpacity
                      onPress={()=>Linking.openURL(`tel:+91${ridea.driverphone}`)}
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
               {ridea.status=="Completed"&&<TouchableOpacity
                  style={{backgroundColor:'#FEBF00',padding:10,alignItems:'center'}}
                  onPress={()=>{
                    setInitride(null);
                    setRidea(null);
                    navigation.navigate('NavigateCard');
                  }}
               >
                <Text style={{fontSize:18}}>CLOSE</Text>
               </TouchableOpacity>}
            </View>
        }
        </Fragment>
    )
}

export default RideOptionCard

const styles = StyleSheet.create({});
