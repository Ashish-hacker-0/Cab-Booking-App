import React from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { selectRides } from '../slices/userSlice'

const RideDetails = ({route}) => {

    console.log(route.params)

    const rides = useSelector(selectRides);

    let ride = rides.filter(r=>r.id===route.params.id);

    console.log(ride[0]);

    return (
        <View style={{padding:10}} >
            <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:5}} ><View><Text style={{color:'gray',fontSize:16}} >{ride[0].status==='confirmed'?'Riding With':ride[0].status}</Text><Text style={{fontSize:16}} >{ride[0].status=='Confirmed'?ride[0].driver:''}</Text></View><View><Text>{ride[0].date}</Text><Text>{ride[0].time}</Text></View></View>
            <View style={{flexDirection:'row',alignItems:'center'}} ><View style={{height:10,width:10,backgroundColor:'red',borderRadius:5,marginRight:5}} ></View><Text>{ride[0].cname}</Text></View>
            <View style={{height:10,borderLeftColor:'black',borderLeftWidth:3,marginLeft:4}} ></View>
            <View style={{flexDirection:'row',alignItems:'center'}} ><View style={{height:10,width:10,backgroundColor:'green',borderRadius:5,marginRight:5}} ></View><Text>{ride[0].dname}</Text></View>
        </View>
    )
}

export default RideDetails
