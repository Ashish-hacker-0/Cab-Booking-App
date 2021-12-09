import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import { Image } from 'react-native-elements/dist/image/Image'
import * as ImagePicker from 'expo-image-picker';
import { TextInput } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { selectUser } from '../slices/userSlice';

const Setting = () => {
    const [image, setImage] = useState(null);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [phone,setPhone] = useState('');

    const user = useSelector(selectUser);

    useEffect(()=>{
        console.log(user);
       setName(user.name);
       setEmail(user.email);
       setPhone(user.phone);
    },[])

   

    const pickImage = async () => {
        
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          setImage(result.uri);
        }
      };
    return (
        <View style={{alignItems:'center',padding:30}} >
            <Image
                source={{ uri: !image?'https://www.w3schools.com/w3css/img_avatar3.png':image }}
                style={{
                    marginLeft: 10, width: 100, height: 100, borderRadius: 50
                }}
            />
        <Icon name={'edit'} containerStyle={styles.icon} onPress={()=>pickImage()}/>
        <TextInput
            placeholder="FULL NAME"
            style={{
                borderColor:'black',
                borderWidth:2,
                width:'90%',
                padding:5,
                marginTop:20
            }}
            value={name}
            onChangeText={setName}
        />
        <TextInput
            placeholder="EMAIL"
            style={{
                borderColor:'black',
                borderWidth:2,
                width:'90%',
                padding:5,
                marginTop:20
            }}
            value={email}
            onChangeText={setEmail}

        />
        <TextInput
            placeholder="MOBILE NUMBER"
            keyboardType="decimal-pad"
            style={{
                borderColor:'black',
                borderWidth:2,
                width:'90%',
                padding:5,
                marginTop:20
            }}
            
            value={phone.toString()}
        />
        <View style={{flexDirection:'row',justifyContent:'space-between',width:'90%',marginTop:20}} ><TouchableOpacity style={{backgroundColor:'#FEBF00',padding:10,paddingHorizontal:20}} ><Text style={{fontSize:17}} >SAVE</Text></TouchableOpacity><TouchableOpacity style={{backgroundColor:'black',padding:10,paddingHorizontal:20}}><Text style={{color:'#FEBF00',fontSize:17}} >CANCEL</Text></TouchableOpacity></View>
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
        backgroundColor: '#ccc',
        position: 'absolute',
        right: '40%',
        top:30
       }
})

export default Setting
