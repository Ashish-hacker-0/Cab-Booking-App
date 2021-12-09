import React from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { selectScheduledrides } from '../slices/userSlice';

const ScheduleRides = () => {

    const rides = useSelector(selectScheduledrides);
    console.log(rides);

    return (

        <View style={{padding:5}} >
          {rides.map((r)=>{
              return(
                <View style={{padding:10,borderWidth:5,borderColor:'black'}}>
                <Text style={{fontWeight:'700',marginBottom:5}} >Schedule id - {r.id}</Text>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:5}} ><Text style={{fontWeight:'700'}}>Cab Type - {r.ctype}</Text><Text style={{fontWeight:'700'}}>Ride Type - {c.rtype}</Text></View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:5}}><Text style={{color:'gray',fontSize:12}} >PickUp Date - {c.date}</Text><Text style={{color:'gray',fontSize:12}}>Pick up time - {c.time} PM</Text></View>
                <View style={{flexDirection:'row',alignItems:'center'}} ><View style={{height:10,width:10,backgroundColor:'red',borderRadius:5,marginRight:5}} ></View><Text style={{color:'gray',fontSize:12}}>{c.source}</Text></View>
                <View style={{height:10,borderLeftColor:'black',borderLeftWidth:3,marginLeft:4}} ></View>
                <View style={{flexDirection:'row',alignItems:'center'}} ><View style={{height:10,width:10,backgroundColor:'green',borderRadius:5,marginRight:5,marginBottom:5}} ></View><Text style={{color:'gray',fontSize:12}}>{c.destination}</Text></View>
                 <Text style={{color:'gray',fontSize:14}}>Ride Status -<Text style={{color:'red'}} > {c.status} </Text></Text>
            </View>
              )
          })}
            
        </View>
    )
}

export default ScheduleRides
