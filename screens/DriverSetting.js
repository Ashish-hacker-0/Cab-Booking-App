import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { selectDriver } from '../slices/driverSlice';

const DriverSetting = () => {

    const [image, setImage] = useState(null);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [phone,setPhone] = useState('');

    const [BankAccount,setBacc] = useState('');
    const [BankIfsc,setBifsc] = useState('');
    const [BankName,setBname] = useState('');

    const driver = useSelector(selectDriver);

    useEffect(()=>{
        console.log(driver);
       setName(driver.name);
       setEmail(driver.email);
       setPhone(driver.phone);
       setBacc(driver.BankAccount);
       setBifsc(driver.BankIfsc);
       setBname(driver.BankName);
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
        <View style={{alignItems:'center',padding:30,flex:1}} >
            <Image
                source={{ uri: !image?'https://www.w3schools.com/w3css/img_avatar3.png':image }}
                style={{
                    marginLeft: 10, width: 100, height: 100, borderRadius: 50
                }}
            />
        <Icon name={'edit'} containerStyle={styles.icon} onPress={()=>pickImage()}/>
        <ScrollView style={{flex:1,width:'100%',}} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} centerContent={true}>
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
        <TextInput
            placeholder="BANK NAME"
            style={{
                borderColor:'black',
                borderWidth:2,
                width:'90%',
                padding:5,
                marginTop:20
            }}
            
            value={BankName}
        />
        <TextInput
            placeholder="BANK IFSC CODE"
            style={{
                borderColor:'black',
                borderWidth:2,
                width:'90%',
                padding:5,
                marginTop:20
            }}
            
            value={BankIfsc}
        />
        <TextInput
            placeholder="BANK ACCOUNT NUMBER"
            keyboardType="decimal-pad"
            style={{
                borderColor:'black',
                borderWidth:2,
                width:'90%',
                padding:5,
                marginTop:20
            }}
            
            value={BankAccount.toString()}
        />
       
        </ScrollView>
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
});

export default DriverSetting
