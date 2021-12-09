import React from 'react'
import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Demo = ({navigation}) => {
    return (
        <View>
            <TouchableOpacity
              style={{alignItems:'center',justifyContent:'center',height:'100%'}}
              onPress={()=>navigation.navigate('MainScreen')}
            ><Text>Home</Text></TouchableOpacity>
        </View>
    )
}

export default Demo
