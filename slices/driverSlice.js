import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    BankAccount: null,
    BankIfsc: null,
    BankName: null,
    VehicleModel: null,
    VehicleName: null,
    VehicleRegNumber: null,
    VehicleType: null,
    _id: null,
    email: null,
    name: null,
    phone: null,
    rides: [],
    totalearn:0,
    withdraw:0,
    wallet:0
}

export const driverSlice = createSlice({
    name:'driver',
    initialState,
    reducers:{
        setDriver:(state,action) => {
            state.BankAccount=action.payload.BankAccount,
            state.BankIfsc= action.payload.BankIfsc,
            state.BankName= action.payload.BankName,
            state.VehicleModel= action.payload.VehicleModel,
            state.VehicleName= action.payload.VehicleName,
            state.VehicleRegNumber= action.payload.VehicleRegNumber,
            state.VehicleType= action.payload.VehicleRegNumber,
            state._id= action.payload._id,
            state.email= action.payload.email,
            state.name= action.payload.name,
            state.phone= action.payload.phone,
            state.rides= action.payload.rides,
            state.totalearn = action.payload.totalearn,
            state.withdraw = action.payload.withdraw,
            state.wallet = action.payload.wallet
        },
        setRides:(state,action) => {
            const prevrides= state.rides;
            prevrides.push(action.payload);
            
            state.rides=prevrides;
        },
        logout: (state,action) => {
            state=initialState;
        }
    }
});

export const {setDriver,setRides,logout} = driverSlice.actions;

export const selectDriver = (state) =>state.driverReducer;
export const selectRides = (state) =>state.driverReducer.rides;

export default driverSlice.reducer;