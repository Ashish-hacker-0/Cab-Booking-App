import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    name:null,
    phone:null,
    _id:null,
    email:null,
    fav:[],
    rides:[],
    scheduledRides:[],
    image:null
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser:(state,action) => {
            state.name=action.payload.name,
            state.phone=action.payload.phone,
            state._id=action.payload._id,
            state.email=action.payload.email,
            state.fav=action.payload.fav,
            state.rides=action.payload.rides
        },
        setRides:(state,action) => {
            const prevrides= state.rides;
            prevrides.push(action.payload);
            state.rides=prevrides;
        },
        setFav: (state,action) => {
            const prevfav = state.fav;
            fav.push(action.payload);
            state.fav=prevfav;
        },
        setScheduledrides:(state,action) => {
            const prevrides = state.scheduledRides;
            prevrides.push(action.payload);
            state.scheduledRides=prevrides;
        },
        updateRide: (state,action) => {
            let prevrides= state.rides;
            prevrides=prevrides.filter(r=>r.id!=action.payload.id);
            prevrides.push(action.payload);
            state.rides=prevrides;
        },
        logout: (state,action) => {
            state=initialState;
        }
    }
});

export const {setFav,setRides,setUser,setScheduledrides, updateRide,logout} = userSlice.actions;

export const selectUser = (state) =>state.userReducer;
export const selectRides = (state) =>state.userReducer.rides;
export const selectFav = (state) => state.userReducer.fav;
export const selectScheduledrides = (state) => state.userReducer.scheduledRides;

export default userSlice.reducer;