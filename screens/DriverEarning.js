import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { selectDriver } from '../slices/driverSlice'

const DriverEarning = () => {

    const driver  = useSelector(selectDriver);

    console.log(driver);

    return (
        <View style={{padding:20}} >
            <Text style={{fontSize:20,fontWeight:'600'}} >Your Total Earning</Text>
            <Text style={{fontSize:30,fontWeight:'700'}} >Rs. {driver.totalearn.toFixed(2)}</Text>
            <View style={{flexDirection:'row',justifyContent:'space-between',borderTopWidth:2,borderBottomWidth:2,borderColor:'gray',paddingVertical:2}} >
                <Text style={{fontWeight:'700'}} >Withdrawal</Text>
                <Text>Rs. {driver.withdraw.toFixed(2)}</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:2,borderColor:'gray',paddingVertical:2}}>
                <Text style={{fontWeight:'700'}} >Trips</Text>
                <Text>{driver.rides.length}</Text>
            </View>
            <Text style={{fontWeight:'700',fontSize:16,marginTop:15}} >Balance: Rs.{driver.wallet.toFixed(2)}</Text>
            <TouchableOpacity
               style={{
                   backgroundColor:'black',
                   alignSelf:'flex-start',
                   paddingHorizontal:20,
                   paddingVertical:15,
                   borderRadius:25,
                   marginTop:15
               }}
            >
                <Text style={{color:'white',fontSize:18,fontWeight:'700'}} >Cash Out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default DriverEarning;
