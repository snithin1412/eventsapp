import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import eventsReducer from './eventSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        events: eventsReducer
    }
})