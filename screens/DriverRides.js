import React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux';
import { selectRides } from '../slices/driverSlice';

const DriverRides = () => {

    const rides = useSelector(selectRides);


    return (
        <FlatList
        data={rides}
        keyExtractor={(item)=>item.id}
        renderItem={({item,index})=>{
            console.log(item);
            return(
                <TouchableOpacity key={item.id} style={{paddingTop:10,backgroundColor:'white',marginBottom:2,paddingHorizontal:10}} >
                    <View style={{flexDirection:'row',justifyContent:'space-between'}} ><Text style={{fontWeight:'700'}} >{item.date}</Text><Text style={{fontWeight:'700'}}>{item.time}</Text><Text style={{fontWeight:'700'}}>{item.status}</Text></View>
                    <Text style={{color:'gray'}} >Booking id - {item.id}</Text>
                    <View style={{flexDirection:'row',alignItems:'center'}} ><View style={{height:10,width:10,backgroundColor:'red',borderRadius:5,marginRight:5}} ></View><Text>{item.cname}</Text></View>
                    <View style={{height:10,borderLeftColor:'black',borderLeftWidth:3,marginLeft:4}} ></View>
                    <View style={{flexDirection:'row',alignItems:'center'}} ><View style={{height:10,width:10,backgroundColor:'green',borderRadius:5,marginRight:5}} ></View><Text>{item.dname}</Text></View>
                </TouchableOpacity>
            )
        }}
    />
    )
}

export default DriverRides;
