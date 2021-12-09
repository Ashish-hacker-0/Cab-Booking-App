import React from 'react'
import { View, Text,Image } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import HomeScreen from './HomeScreen';
import PreviousRides from './PreviousRides';
import ScheduleRides from './ScheduleRides';
import Setting from './Setting';
import Privacy from './Privacy';
import TermsandCondition from './TermsandCondition';
import Support from './Support';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { logout } from '../slices/userSlice';

const Drawer = createDrawerNavigator();

const MainScreen = ({navigation}) => {

    const dispatch = useDispatch();

    const logOut = async() =>{
        AsyncStorage.removeItem('user_token');
        AsyncStorage.removeItem('user_type');
        
        await dispatch(logout(null));

        navigation.navigate('LoginScreen');

    }

    return (
        <Drawer.Navigator 
           screenOptions={
               {
                   headerBackground:()=>{
                      return( <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor:'#F6F6F6'}}>
                      <Image
                            style={{
                                height:90,
                                width:90,
                                resizeMode:'contain'
                            }}
                            source={{
                                uri:"https://www.nicepng.com/png/detail/299-2993067_taxi-service-in-jodhpur-cab-service-logo-png.png",
                            }}
                       />
                       </View>
                       )
                   },
                   headerStyle:{
                       backgroundColor:'#F6F6F6'
                   },
                   drawerActiveBackgroundColor:'#FEBF00',
                   drawerActiveTintColor:'white'
               }
           }
           initialRouteName={'Home'}
           drawerContent={(props)=>{
               return(
                <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props} />
                    <DrawerItem label="Logout" style={{backgroundColor:'red'}}  onPress={() => logOut()} />
                </DrawerContentScrollView>
               )
           }}
        >
            <Drawer.Screen name="Home" component={HomeScreen} options={{
                headerShadowVisible:false,
                headerTitleStyle:{
                    display:'none'
                }
            }} />
            <Drawer.Screen name="Your Past Rides" component={PreviousRides} options={{
                headerShadowVisible:false,
                headerTitleStyle:{
                    display:'none'
                }
            }} />
            <Drawer.Screen name="Your Scheduled Rides" component={ScheduleRides} options={{
                headerShadowVisible:false,
                headerTitleStyle:{
                    display:'none'
                }
            }} />
            <Drawer.Screen name="Setting" component={Setting} options={{
                headerShadowVisible:false,
                headerTitleStyle:{
                    display:'none'
                }
            }} />
            <Drawer.Screen name="Privacy Policy" component={Privacy} options={{
                headerShadowVisible:false,
                headerTitleStyle:{
                    display:'none'
                }
            }} />
            <Drawer.Screen name="Terms and Condition" component={TermsandCondition} options={{
                headerShadowVisible:false,
                headerTitleStyle:{
                    display:'none'
                }
            }} />
            <Drawer.Screen name="Support" component={Support} options={{
                headerShadowVisible:false,
                headerTitleStyle:{
                    display:'none'
                }
            }} />
        </Drawer.Navigator>
    )
}

export default MainScreen;
