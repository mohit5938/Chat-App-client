import { configureStore } from "@reduxjs/toolkit"
import authSlice from './reducers/auth';
import api from '../redux/api/api.js'
import miscSlice from './reducers/misc';
import chatSlice from './reducers/chat.js'
export const store = configureStore({
    reducer: {
        auth: authSlice,
        [miscSlice.name] : miscSlice.reducer,
        [chatSlice.name] : chatSlice.reducer,
        [api.reducerPath] : api.reducer,
    },
    middleware: (defaultMiddleware) => [...defaultMiddleware() ,
        api.middleware
    ],
})