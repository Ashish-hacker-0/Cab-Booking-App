import React from 'react'
import { View, Text, Linking } from 'react-native'
import { Icon } from 'react-native-elements'

const Support = () => {
    return (
        <View style={{padding:10}} >
            <Text style={{fontWeight:'700',fontSize:20}} >For any query:</Text>
            <Text style={{alignItems:'center',fontSize:15}} >Call Us :- +91 9876543210 <Icon name={'call'} onPress={()=>Linking.openURL(`tel:+919308787662`)}  /> </Text>
            <Text>Or write to us at: email@gmail.com <Icon name={'email'} onPress={()=>Linking.openURL('mailto:support@example.com?subject=SendMail&body=Description')} /> </Text>
        </View>
    )
}

export default Support
