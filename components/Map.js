import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { selectDestination, selectOrigin,  setTravelTimeInformation } from '../slices/navSlice';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from '@env';
import {Icon} from 'react-native-elements';

const Map = () => {

    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const dispatch = useDispatch();
    const [originll,setOriginll] = useState({
        latitude: null, longitude: null
    });
    const [destinationll,setDestinationll] = useState({
        latitude: null, longitude: null
    })
    const mapRef = useRef(null);
    //26.1588117
    //85.8858789
    const cars = [
        {
            lat:26.1588117,
            lng:85.8858789
        },
        {
            lat:26.1575492,
            lng:85.8858843
        },
        {
            lat:26.1594024,
            lng:85.8858321
        },
        {
            lat:26.1557489,
            lng:85.8858329
        }
    ]

    useEffect(()=>{
        if(origin){
            console.log(origin);
            setOriginll({
                latitude: origin.location.lat, longitude: origin.location.lng
            })
        }

        if(destination){
            console.log(destination);
            setDestinationll({
                latitude: destination.location.lat, longitude: destination.location.lng
            })
        }
       if(!origin||!destination) return;
       console.log(origin,destination);
       mapRef.current.fitToSuppliedMarkers(['origin','destination'],{
           edgePadding:{top:50,right:50,bottom:50,left:50},
       });
    },[origin,destination])

    useEffect(() => {
        if(!origin||!destination) return;
        console.log(origin,destination);     
        const getTravelTime = async() => {
           const URL = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin.location.lat},${origin.location.lng}&destinations=${destination.location.lat},${destination.location.lng}&departure_time=now&key=l0p0p1yL3DKMddlPCM8PsPsh8tTMO`;
           fetch(URL)
           .then(res=>res.json())
           .then(data=>{
               console.log(data);
               dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
           })
        }

        getTravelTime();

    }, [origin,destination,GOOGLE_MAPS_APIKEY])

    return (
            <MapView
                ref={mapRef}
                style={{flex:1}}
                mapType="mutedStandard"
                initialRegion={{
                latitude: origin?.location.lat,
                longitude: origin?.location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
                }}
            >
            {originll.latitude&&destinationll.latitude&&(
                <MapViewDirections
                    origin={originll}
                    destination={destinationll}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={3}
                    strokeColor="black"
                />
            )}
            {cars.map((c,index)=>{
                return(
                    <Marker
                    key={index}
                    coordinate={{
                        latitude: c.lat,
                        longitude: c.lng
                    }}
               >
                        <Icon
                           name={'car'} type={'antdesign'}
                        />
                    </Marker>
                )
            })}
           {origin?.location&&(<Marker
               coordinate={{
                latitude: origin.location.lat,
                longitude: origin.location.lng
               }}
               title="Origin"
               description={origin.description}
               identifier="origin"
           />)}
           {destination?.location&&(<Marker
               coordinate={{
                latitude: destination.location.lat,
                longitude: destination.location.lng
               }}
               title="Destination"
               description={origin.description}
               identifier="destination"
           />)}
            </MapView>
    )
}

export default Map;