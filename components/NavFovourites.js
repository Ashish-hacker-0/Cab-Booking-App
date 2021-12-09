import React from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
const data = [
    {
        id:1,
        icon:"home",
        location:'Home',
        destination:"Shubhankarpur, Darbhanga, Bihar"
    },
    {
        id:2,
        icon:"briefcase",
        location:'Work',
        destination:'Rambagh, Darbhanga, Bihar'
    }
]

const NavFovourites = () => {
    return (
        <FlatList
            data={data}
            keyExtractor={(item)=>item.id.toString()}
            ItemSeparatorComponent={()=>{
                return(
                    <View
                        style={{backgroundColor:'lightgray',height:1}}
                    />
                )
            }}
            renderItem={({item:{icon,location,destination}})=>{
               return( 
                <TouchableOpacity
                   style={{flexDirection:'row',alignItems:'center',padding:10}}
                >
                       <Icon
                           style={{margin:4,height:30,width:30,borderRadius:15,backgroundColor:'gray',
                           padding:3,paddingTop:4}}
                           name={icon}
                           color="white"
                           type="ionicon"
                           size={18}

                       />
                       <View style={{paddingLeft:10}} >
                           <Text style={{fontWeight:'700',fontSize:16}} >{location}</Text>
                           <Text>{destination}</Text>
                       </View>
                    </TouchableOpacity>
                )
            }}
        />
    )
}

export default NavFovourites

const styles = StyleSheet.create({})
