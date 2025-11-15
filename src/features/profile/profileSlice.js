import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    details: null,
    client: null,
    token: null,
    loggedIn: false,
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.token = action.payload.token;
            state.client = action.payload.client;
            state.loggedIn = action.payload.loggedIn;
            state.details = action.payload.details;
        },
    },
});

export const { setProfile } = profileSlice.actions;

export const selectProfile = (state) => state.profile;

export default profileSlice.reducer;
