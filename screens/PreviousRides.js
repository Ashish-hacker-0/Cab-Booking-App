import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AllRides from './AllRides';
import RideDetails from './RideDetails';

const PreviousRides = () => {

    const Stack = createStackNavigator();
    
   
    return (
        <Stack.Navigator
          screenOptions={{
              headerShown:false
          }}
        >
            <Stack.Screen name="AllRides" component={AllRides} />
            <Stack.Screen name="RideDetails" component={RideDetails} />
        </Stack.Navigator>
    )
}

export default PreviousRides
