import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { useSelector } from 'react-redux'
import { selectOrigin } from '../slices/navSlice'

const data = [
    {
        id:1,
        title:'Get A Ride',
        image:'https://links.papareact.com/3pn',
        screen:'MapScreen'
    },
    {
        id:2,
        title:'Order Food',
        image:'https://links.papareact.com/28w',
        screen:'EatsScreen'
    }
]

const NavOptions = () => {

    const navigation = useNavigation();
   const origin = useSelector(selectOrigin);
    return (
            <FlatList
                data={data}
                keyExtractor={(item)=>item.id.toString()}
                horizontal
                renderItem={({item})=>{
                   return(<TouchableOpacity 
                   onPress={()=>navigation.navigate(item.screen)}
                   style={styles.container} 
                   disabled={!origin}
                   >
                       <View style={{opacity:origin?1:0.5}} >
                           <Image
                               source={{
                                   uri:item.image
                               }}
                               style={{
                                   height:120,
                                   width:120,
                                   resizeMode:'contain'
                               }}

                           />
                           <Text style={styles.text} >{item.title}</Text>
                           <Icon 
                           style={styles.icon}
                               name="arrowright"
                               color="white"
                               type="antdesign"
                           />
                       </View>
                   </TouchableOpacity>)
                }}
            />
    )
}

export default NavOptions

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        padding:5,
        paddingLeft:15,
        paddingBottom:30,
        paddingTop:15,
        margin:10
    },
    text:{
       fontSize:16,
       fontWeight:'700',
       margin:10,
       marginLeft:0
    },
    icon:{
        backgroundColor:'black',
        borderRadius:20,
        padding:7,
        width:40,
        height:40
    }
})
