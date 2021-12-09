import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image, StyleSheet, Alert, FlatList } from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import OTPTextView from 'react-native-otp-textinput';
import { LoadingIndicator } from 'react-native-expo-fancy-alerts';
import RNPickerSelect from 'react-native-picker-select';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import * as ImagePicker from 'expo-image-picker';
import firebase from '../firebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/userSlice';
import { setDriver } from '../slices/driverSlice';
const querystring = require('query-string');

const LoginScreen = ({navigation,route}) => {
    
    const [otp,setOtp] = useState(false);
    const [mobile,setMobile] = useState('');
    const [iotp,setIotp] = useState('');
    const [loading,setLoading] = useState(false);
    const [login,setLogin] = useState(true);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [rmobile,setRmobile] = useState('');
    const [rotp,setRotp] = useState(false);
    const [type,setType] = useState('');
    const [image, setImage] = useState(null);
    const [rtype,setRtype] = useState('');
    const [vtype,setVtype] = useState('');
    const [vname,setVname] = useState('');
    const [vmodel,setVmodel] = useState('');
    const [vreg,setVreg]  = useState('');
    const [bname,setBname] = useState('');
    const [bifsc,setBifsc] = useState('');
    const [baccount,setBaccount] = useState('');
    const recaptchaVerifier = useRef(null);
    const [verificationId,setVerificationId] = React.useState("");
    const [invi,setInvi] = useState(false);
    const [eff,setEff] =useState(true);
    const dispatch = useDispatch();

    useEffect(()=>{
        const intervalId = setTimeout(() => {  //assign interval to a variable to clear it.
          if(eff){
            setInvi(true);
            setEff(false);
            console.log('running');
          }
        }, 5000)

       return () => clearInterval(intervalId);
    },[]);

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
    const otpHandler = async() => {
        setLoading(true);
        if(mobile.length!==10||mobile.includes('-')||mobile.includes(',')||mobile.includes('.')){
             Alert.alert(
                 " Invalid Number",
                 'Please Check the Number You have Entered!',
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
             )
             setLoading(false);
        }else{
            if(type==''||type==null){
                Alert.alert(
                    " Login Type",
                    'Please select a login type!',
                    [
                       { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                )
            }else{
                if(type=="Rider"){
                    await fetch(`http://192.168.227.135:8001/iuser/${mobile}`)
                    .then(async (res)=>{
                        console.log(res.status);
                        if(res.status==400){
                            Alert.alert(
                                "Not Registered",
                                'This Number is not registered with Us!',
                               [
                                   { text: "OK", onPress: () => console.log("OK Pressed") }
                               ]
                            )
                        }else{
                            setIotp(true);
                            const phoneProvider = new firebase.auth.PhoneAuthProvider();
                            const verificationId = await phoneProvider.verifyPhoneNumber(
                                `+91${mobile}`,
                                // @ts-ignore
                                recaptchaVerifier.current
                            );
                            setVerificationId(verificationId);
                            console.log('vid',verificationId);
                            setOtp(true);
                            setIotp(false);
                        }
                        
                    })
                    .catch(err=>{
                        console.log('err');
                    })                    
                }else{
                    await fetch(`http://192.168.227.135:8001/idriver/${mobile}`)
                    .then(async (res)=>{
                        console.log(res.status);
                        if(res.status==400){
                            Alert.alert(
                                "Not Registered",
                                'This Number is not registered with Us!',
                               [
                                   { text: "OK", onPress: () => console.log("OK Pressed") }
                               ]
                            )
                        }else{
                            setIotp(true);
                            const phoneProvider = new firebase.auth.PhoneAuthProvider();
                            const verificationId = await phoneProvider.verifyPhoneNumber(
                                `+91${mobile}`,
                                // @ts-ignore
                                recaptchaVerifier.current
                            );
                            setVerificationId(verificationId);
                            console.log('vid',verificationId);
                            setOtp(true);
                            setIotp(false);
                        }
                        
                    })
                    .catch(err=>{
                        console.log('err');
                    })                
                }
                
            }
          setInvi(false);
           setLoading(false);
        }
    }
    const OtpSubmit = async () => {
        if(type=='Rider'){
            setLoading(true);
            const credential = await firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                iotp
            );
            try{
            await firebase
                .auth()
                .signInWithCredential(credential)
                .then(async (res)=>{
                    try{
                        await fetch(`http://192.168.227.135:8001/user/${mobile}`)
                        .then(res=>res.json())
                        .then(async (data)=>{
                            console.log(data)
                            await dispatch(setUser(data));
        
                        });
                        console.log(mobile);
                        AsyncStorage.setItem("user_token",mobile);
                        AsyncStorage.setItem("user_type",'Rider');
                        setMobile('');
                        setIotp('');
                      
                        navigation.navigate('MainScreen');
                    }catch(e){
                        console.log('e',e);
                            setError(e.message);
                    }
                
                })
                .catch((err)=>{
                    if(err){
                        Alert.alert(
                            "Invalid Otp",
                            'Please enter the valid OTP!',
                           [
                               { text: "OK", onPress: () => console.log("OK Pressed") }
                           ]
                        )
                    }
                });
                }
                catch(e){
                    Alert.alert(
                        "Invalid Otp",
                        'Please enter the valid OTP!',
                       [
                           { text: "OK", onPress: () => console.log("OK Pressed") }
                       ]
                    )
                }
            setLoading(false);
        }else{
            setLoading(true);
            const credential = await firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                iotp
            );
            try{
            await firebase
                .auth()
                .signInWithCredential(credential)
                .then(async (res)=>{
                    try{
                        await fetch(`http://192.168.227.135:8001/driver/${mobile}`)
                        .then(res=>res.json())
                        .then(async (data)=>{
                           console.log(data)
                        // await dispatch({type:'LOGIN',user:data});
                            await  dispatch(setDriver(data));
                        });
                        console.log(mobile);
                        AsyncStorage.setItem("user_token",mobile);
                        AsyncStorage.setItem("user_type","Driver");
                        setMobile('');
                        setIotp('');
                        navigation.navigate("DriverScreen");
                    }catch(e){
                        console.log('e',e);
                            setError(e.message);
                    }
                
                })
                .catch((err)=>{
                    if(err){
                        Alert.alert(
                            "Invalid Otp",
                            'Please enter the valid OTP!',
                           [
                               { text: "OK", onPress: () => console.log("OK Pressed") }
                           ]
                        )
                    }
                });
                }
                catch(e){
                    Alert.alert(
                        "Invalid Otp",
                        'Please enter the valid OTP!',
                       [
                           { text: "OK", onPress: () => console.log("OK Pressed") }
                       ]
                    )
                }
            setLoading(false);
            navigation.navigate('DriverScreen');
        }
        
    }
    
    const rotpHandler = async () => {
        setLoading(true);
        console.log('RotpHandler');
        console.log(rtype);
        if(rmobile.length!==10||rmobile.includes('-')||rmobile.includes(',')||rmobile.includes('.')){
            Alert.alert(
                " Invalid Number",
                'Please Check the Number You have Entered!',
               [
                   { text: "OK", onPress: () => console.log("OK Pressed") }
               ]
            )
            setLoading(false);
        }else{
           if(name==''){
            Alert.alert(
                " Empty Name",
                'Please enter your Name!',
               [
                   { text: "OK", onPress: () => console.log("OK Pressed") }
               ]
            )
            setLoading(false);
           }else{
              if(!email.includes('@')){
                Alert.alert(
                    " Invalid Email",
                    'Please enter a valid Email!',
                   [
                       { text: "OK", onPress: () => console.log("OK Pressed") }
                   ]
                )
                setLoading(false);
              }else{
                  console.log(rtype);
                if(rtype==="Rider"){
                    await fetch(`http://192.168.227.135:8001/iuser/${rmobile}`)
                    .then(async (res)=>{
                        console.log(res.status);
                        if(res.status!=400){
                            Alert.alert(
                                "Already Registered",
                                'This Number is already registered with Us!',
                               [
                                   { text: "OK", onPress: () => setLogin(true) }
                               ]
                            )
                        }else{
                            setIotp(true);
                            const phoneProvider = new firebase.auth.PhoneAuthProvider();
                            const verificationId = await phoneProvider.verifyPhoneNumber(
                                `+91${rmobile}`,
                                // @ts-ignore
                                recaptchaVerifier.current
                            );
                            setVerificationId(verificationId);
                            console.log('vid',verificationId);
                            setRotp(true);
                            setIotp(false);
                        }
                        
                    })
                    .catch(async(err)=>{
                        console.log('err',err);
                        setIotp(true);
                        const phoneProvider = new firebase.auth.PhoneAuthProvider();
                        const verificationId = await phoneProvider.verifyPhoneNumber(
                            `+91${rmobile}`,
                            // @ts-ignore
                            recaptchaVerifier.current
                        );
                        setVerificationId(verificationId);
                        console.log('vid',verificationId);
                        setRotp(true);
                        setIotp(false);
                    })                    
                }else{
                    await fetch(`http://192.168.227.135:8001/idriver/${rmobile}`)
                    .then(async (res)=>{
                        console.log(res.status);
                        if(res.status!=400){
                            Alert.alert(
                                "Already Registered",
                                'This Number is already registered with Us!',
                               [
                                   { text: "OK", onPress: () => setLogin(true) }
                               ]
                            )
                        }else{
                            setIotp(true);
                            const phoneProvider = new firebase.auth.PhoneAuthProvider();
                            const verificationId = await phoneProvider.verifyPhoneNumber(
                                `+91${rmobile}`,
                                // @ts-ignore
                                recaptchaVerifier.current
                            );
                            setVerificationId(verificationId);
                            console.log('vid',verificationId);
                            setRotp(true);
                            setIotp(false);
                        } 
                    })
                    .catch(err=>{
                        console.log('err');
                    })                
                }
               
              }
           }
        }
        setInvi(false);

        setLoading(false);
    }
   
    const getMimeType = (ext) => {
        // mime type mapping for few of the sample file types
        switch (ext) {
          case 'pdf': return 'application/pdf';
          case 'jpg': return 'image/jpeg';
          case 'jpeg': return 'image/jpeg';
          case 'png': return 'image/png';
        }
      }
    const rotpSubmit = async () => {
        if(rtype==='Rider'){
            setLoading(true);
            const credential = await firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                iotp
            );
            try{
            await firebase
                .auth()
                .signInWithCredential(credential)
                .then(async (res)=>{
                        await fetch(`http://192.168.227.135:8001/newuser`,{
                            method:'post',
                            headers:{
                                'Content-Type' : 'application/x-www-form-urlencoded'
                            },
                            body:querystring.stringify({
                                name:name,
                                email:email,
                                phone:rmobile
                            })
                        })
                        .then(async(response) => {
                            await dispatch(setUser(response));
                        })
                        .catch(err => {
                                console.log(err)
                        }); 
                        console.log(rmobile);
                        await AsyncStorage.setItem("user_token",rmobile);
                        await AsyncStorage.setItem("user_type","Rider");
                        setRmobile('');
                        setIotp('');
                        navigation.navigate('MainScreen');
                        return;
                })
                .catch((err)=>{
                    if(err){
                        console.log(err);
                        Alert.alert(
                            "Invalid Otp",
                            'Please enter the valid OTP!',
                           [
                               { text: "OK", onPress: () => console.log("OK Pressed") }
                           ]
                        )
                    }
                });
                }
                catch(e){
                    console.log(e);
                    Alert.alert(
                        "Invalid Otp",
                        'Please enter the valid OTP!',
                       [
                           { text: "OK", onPress: () => console.log("OK Pressed") }
                       ]
                    )
                }
            setLoading(false);
        }else{
            setLoading(true);
            const credential = await firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                iotp
            );
            try{
            await firebase
                .auth()
                .signInWithCredential(credential)
                .then(async (res)=>{
                    try{
                        let formData = new FormData();
                        formData.append("image", {
                            name:rmobile+'.jpg',
                            uri:image,
                            type:'image/jpg'
                        });
                        formData.append('name',name);
                        formData.append('email',email);
                        formData.append('phone',rmobile);
                        formData.append('vtype',vtype);
                        formData.append('vname',vname);
                        formData.append('vmodel',vmodel);
                        formData.append('regn',vreg);
                        formData.append('bname',bname);
                        formData.append('ifsc',bifsc);
                        formData.append('accountn',baccount);

                        await fetch(`http://192.168.227.135:8001/newrider`,{
                            method: "POST",
                            body: formData,
                            mode: 'cors',
                            headers: {
                              Accept: "application/json",
                              "Content-Type": "multipart/form-data",
                            },
                        })
                        .then(res=>res.json())
                        .then(async (data)=>{
                            console.log(data)
                            dispatch(setDriver(data));
        
                        });
                        console.log(rmobile);
                        await AsyncStorage.setItem("user_token",rmobile);
                        await AsyncStorage.setItem("user_type","Driver");
                        setRmobile('');
                        setIotp('');
                        navigation.navigate('DriverScreen');
                        return;
                    }catch(e){
                        console.log('e',e);
                            setError(e.message);
                    }
                })
                .catch((err)=>{
                    if(err){
                        Alert.alert(
                            "Invalid Otp",
                            'Please enter the valid OTP!',
                           [
                               { text: "OK", onPress: () => console.log("OK Pressed") }
                           ]
                        )
                    }
                });
                }
                catch(e){
                    Alert.alert(
                        "Invalid Otp",
                        'Please enter the valid OTP!',
                       [
                           { text: "OK", onPress: () => console.log("OK Pressed") }
                       ]
                    )
                }
            setLoading(false);
            // navigation.navigate('DriverScreen');
        }
    }
    return (
        <View style={{
            flex:1,
            paddingTop:20,
            backgroundColor:'#F6F6F6',

        }}>
       
        <LoadingIndicator
            visible={loading}
        />
         <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebase.app().options}
            attemptInvisibleVerification={invi}
        />
         <View 
               style={{
                   flex:1,
                   alignItems:'center',
                   justifyContent:'center'
               }}
            >
              <Image
                style={{
                    height:300,
                    width:300,
                    resizeMode:'contain'
                }}
                  source={{
                    uri:"https://www.nicepng.com/png/detail/299-2993067_taxi-service-in-jodhpur-cab-service-logo-png.png",
                  }}
              />
            </View>
            <View
              style={{
                  flex:rtype=='Driver'?6:1,
                  backgroundColor:'white'
              }}
            >
             <View
               style={{
                   flexDirection:'row',
                   justifyContent:'center'
               }}
            >
                <TouchableOpacity
                    style={{
                        paddingHorizontal:50,
                        paddingVertical:10,
                        borderRightColor:'black',
                        borderRightWidth:3,
                        flex:1,
                        borderBottomWidth:3,
                        borderBottomColor:'black',
                        backgroundColor:login?'#FEBF00':'white',
                    }}
                    onPress={()=>setLogin(true)}
                >
                    <Text style={{color:login?'white':'black'}} >LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        paddingHorizontal:50,
                        paddingVertical:10,
                        borderBottomWidth:3,
                        borderBottomColor:'black',
                        backgroundColor:!login?'#FEBF00':'white',
                    }}
                    onPress={()=>setLogin(false)}
                >
                    <Text style={{color:login?'black':'white'}}>REGISTER</Text>
                </TouchableOpacity>
             </View>
           {login&&!otp&&<View
            style={{
                padding:30,
                flex:1
            }}
            >
            <View
            style={{
                flex:1
            }}>
            <Text>Enter Your Registered Mobile No.</Text>
            <View
            style={{
                flexDirection:'row',
                alignItems:'center',
                borderBottomColor:'black',
                borderBottomWidth:3,
                marginTop:10
                
            }} >
            <Text style={{fontSize:20,paddingHorizontal:10}}
             >+91</Text>
            <TextInput
                style={{
                    fontSize: 20,
                    flex:1,
                    borderLeftWidth:2,
                    borderLeftColor:'black',
                    paddingHorizontal:10
                }}
                value={mobile}
                onChangeText={setMobile}
                keyboardType="decimal-pad"
                
            />
            </View>
            <Text style={{marginTop:10}} >Login as : </Text>
            <RNPickerSelect
                onValueChange={(value) => setType(value)}
                items={[
                    { label: 'Rider', value: 'Rider', color:'black'},
                    { label: 'Driver', value: 'Driver', color:'black' }
                ]}
                value={type}
                style={{
                    viewContainer:{
                      marginTop:10
                    },
                    inputAndroid:{
                        color:'black'
                    }
                }}
            />
                </View>
                <TouchableOpacity
                style={{
                    width:'100%',
                    backgroundColor:'black',
                    alignItems:'center',
                    padding:10
                }}
                onPress={()=>otpHandler()}
                >
                <Text 
                    style={{
                        color:'white',
                        fontSize:18
                    }}
                >SEND OTP</Text>
            </TouchableOpacity>
            </View>}
             {login&&otp&&<View
                style={{
                   padding:30,
                   flex:1
               }}
             >
             <View style={{flex:1}}>
             <Text>Please Enter the OTP sent to +91 {mobile}</Text>
             <TouchableOpacity
                onPress={()=>{
                    setInvi(true);
                    setOtp(false);
                    }}
             >
                <Text
                 style={{
                    borderBottomWidth:1,
                    borderBottomColor:'red',
                    alignSelf:'center',
                    color:'red'

                }}
                >Change Number?</Text>
             </TouchableOpacity>
             <OTPTextView
                handleTextChange={(e) => {setIotp(e)}}
                containerStyle={styles.textInputContainer}
                textInputStyle={styles.roundedTextInput}
                inputCount={6}   
                tintColor='#FEBF00'

             />
        </View>
        <TouchableOpacity
            style={{
                width:'100%',
                backgroundColor:'black',
                alignItems:'center',
                padding:10
            }}
            onPress={()=>OtpSubmit()}
        >
            <Text
                style={{
                    color:'white',
                    fontSize:18
                }}
            >VERIFY OTP</Text>
        </TouchableOpacity>
                 
        </View>}
            {!login&&!rotp&&<View
            style={{
                padding:30,
                flex:1
            }}
            >
            <View
            style={{
                flex:1
            }}>
            <Text>Enter The Details to Register</Text>
            <ScrollView style={{marginBottom:10}}>
            <TextInput
                placeholder='Full Name'
                style={{
                    alignItems:'center',
                    borderBottomColor:'black',
                    borderBottomWidth:3,
                    fontSize: 18,
                    marginTop:20,
                    paddingHorizontal:10
                }}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                placeholder='Email address'
                style={{
                    alignItems:'center',
                    borderBottomColor:'black',
                    borderBottomWidth:3,
                    fontSize: 18,
                    marginTop:20,
                    paddingHorizontal:10
                }}
                value={email}
                onChangeText={setEmail}
            />
            <View
            style={{
                flexDirection:'row',
                alignItems:'center',
                borderBottomColor:'black',
                borderBottomWidth:3,
                marginTop:20   
            }} >
            <Text style={{fontSize:20,paddingHorizontal:10}}
             >+91</Text>
            <TextInput
                style={{
                    fontSize: 20,
                    flex:1,
                    borderLeftWidth:2,
                    borderLeftColor:'black',
                    paddingHorizontal:10
                }}
                value={rmobile}
                onChangeText={setRmobile}
                keyboardType="decimal-pad"
                
            />
            </View>
            <Text style={{marginTop:10}} >Register as : </Text>
            <RNPickerSelect
                onValueChange={(value) => setRtype(value)}
                items={[
                    { label: 'Rider', value: 'Rider', color:'black'},
                    { label: 'Driver', value: 'Driver', color:'black' }
                ]}
                value={rtype}
                style={{
                    viewContainer:{
                      marginTop:10
                    },
                    inputAndroid:{
                        color:'black'
                    }
                }}
            />
            {rtype=='Driver'&&<Text>Vehicle Type</Text>}
            {rtype=='Driver'&&<RNPickerSelect
                onValueChange={(value) => setVtype(value)}
                items={[
                    { label: 'CAR', value: 'CAR', color:'black'},
                    { label: 'XUV-CAR', value: 'XUV-CAR', color:'black' },
                    { label: 'SCORPIO', value: 'SCORPIO', color:'black' },
                    { label: 'AUTO', value: 'AUTO', color:'black' },
                    { label: 'BIKE', value: 'BIKE', color:'black' }
                ]}
                value={vtype}
                style={{
                    viewContainer:{
                      marginTop:10
                    },
                    inputAndroid:{
                        color:'black'
                    }
                }}
            />}

            {rtype=='Driver'&&<TextInput
                placeholder='Vehicle Name'
                style={{
                    alignItems:'center',
                    borderBottomColor:'black',
                    borderBottomWidth:3,
                    fontSize: 18,
                    marginTop:20,
                    paddingHorizontal:10
                }}
                value={vname}
                onChangeText={setVname}
            />}
            {rtype=='Driver'&&<TextInput
                placeholder='Vehicle Model No.'
                style={{
                    alignItems:'center',
                    borderBottomColor:'black',
                    borderBottomWidth:3,
                    fontSize: 18,
                    marginTop:20,
                    paddingHorizontal:10
                }}
                value={vmodel}
                onChangeText={setVmodel}
            />}
            {rtype=='Driver'&&<TextInput
                placeholder='Vehice Registration Number'
                style={{
                    alignItems:'center',
                    borderBottomColor:'black',
                    borderBottomWidth:3,
                    fontSize: 18,
                    marginTop:20,
                    paddingHorizontal:10
                }}
                value={vreg}
                onChangeText={setVreg}
            />}
            {rtype=='Driver'&&<TextInput
                placeholder='Bank Name'
                style={{
                    alignItems:'center',
                    borderBottomColor:'black',
                    borderBottomWidth:3,
                    fontSize: 18,
                    marginTop:20,
                    paddingHorizontal:10
                }}
                value={bname}
                onChangeText={setBname}
            />}
            {rtype=='Driver'&&<TextInput
                placeholder='Bank code / IFSC Code'
                style={{
                    alignItems:'center',
                    borderBottomColor:'black',
                    borderBottomWidth:3,
                    fontSize: 18,
                    marginTop:20,
                    paddingHorizontal:10
                }}
                value={bifsc}
                onChangeText={setBifsc}
            />}
            {rtype=='Driver'&&<TextInput
                placeholder='Bank Account Number'
                style={{
                    alignItems:'center',
                    borderBottomColor:'black',
                    borderBottomWidth:3,
                    fontSize: 18,
                    marginTop:20,
                    paddingHorizontal:10
                }}
                value={baccount}
                onChangeText={setBaccount}
            />}
            {rtype=='Driver'&&<View style={{marginTop:5}} >
                <Text>Upload your Driving license</Text>
                <View style={{flexDirection:'row',flex:1,padding:10,alignItems:'center'}} >
                    <Icon name={'photo'} size={50}  style={{flex:1,fontSize:50}} onPress={()=>pickImage()}  /> 
                    <Text> Max Size 2MB </Text>
                </View>
            </View>}
            </ScrollView>
                </View>
                <TouchableOpacity
                style={{
                    width:'100%',
                    backgroundColor:'black',
                    alignItems:'center',
                    padding:10
                }}
                onPress={()=>rotpHandler()}
                >
                <Text 
                    style={{
                        color:'white',
                        fontSize:18
                    }}
                >SEND OTP</Text>
            </TouchableOpacity>
            </View>}{
                !login&&rotp&&<View
                style={{
                   padding:30,
                   flex:1
               }}
             >
             <View style={{flex:1}}>
             <Text>Please Enter the OTP sent to +91 {rmobile}</Text>
             <TouchableOpacity
                onPress={()=>{
                    setInvi(true);
                    setOtp(false);
                    }}
             >
                 <Text
                 style={{
                    borderBottomWidth:1,
                    borderBottomColor:'red',
                    alignSelf:'center',
                    color:'red'

                }}
                >Change Number?</Text>
             </TouchableOpacity>
             <OTPTextView
                handleTextChange={(e) => {setIotp(e)}}
                containerStyle={styles.textInputContainer}
                textInputStyle={styles.roundedTextInput}
                inputCount={6}   
                tintColor='#FEBF00'

             />
        </View>
        <TouchableOpacity
            style={{
                width:'100%',
                backgroundColor:'black',
                alignItems:'center',
                padding:10
            }}
            onPress={()=>rotpSubmit()}
        >
            <Text
                style={{
                    color:'white',
                    fontSize:18
                }}
            >VERIFY OTP</Text>
        </TouchableOpacity>
                 
        </View> }
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    textInputContainer: {
     marginTop:20
    },
    roundedTextInput: {
      borderRadius: 10,
      borderWidth: 2,
      fontSize:15,
      padding:5,
      width:40,
      height:40
    },
  });

export default LoginScreen;
