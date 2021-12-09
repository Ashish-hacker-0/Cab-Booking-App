import { createSlice } from "@reduxjs/toolkit"

const initialState= {
    origin:null,
    destination:null,
    travelTimeInformation:null
}

export const navSlice = createSlice({
    name:'nav',
    initialState,
    reducers: {
        setOrigin: (state,action) => {
               state.origin = action.payload;
        },
        setDestination: (state,action) =>{
            state.destination = action.payload;
        },
        setTravelTimeInformation: (state,action) => {
            state.travelTimeInformation = action.payload;
        }
    }
});

export const {setOrigin,setDestination,setTravelTimeInformation} = navSlice.actions;

export const selectOrigin = (state) => state.navReducer.origin;
export const selectDestination = (state) => state.navReducer.destination;
export const selectTravelTimeInformation = (state) => state.navReducer.travelTimeInformation;

export default navSlice.reducer;