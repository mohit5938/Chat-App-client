import { createSlice } from "@reduxjs/toolkit";
import { NEW_MESSAGE_ALERT } from '@/components/constants/event.js'
import { getOrSaveFromStorage } from '@/lib/feature.js';

// 🔹 Get data from localStorage
const storedAlerts = getOrSaveFromStorage({
  key: NEW_MESSAGE_ALERT,
  get: true,
});

// 🔹 Initial State
const initialState = {
  notificationCount: 0,
  newMessageAlert: storedAlerts || [], // ✅ IMPORTANT FIX
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: { 
      incrementNotification : (state ) => {
            state.notificationCount += 1;
      },
        resetNotificationCount : (state) => {
        state.notificationCount = 0;
      },
      setNewMessagesAlert: (state, action) => {
        const { chatId } = action.payload;

        const index = state.newMessageAlert.findIndex(
          (item) => item.chatId === chatId
        );

        if (index !== -1) {
          //  chat already exists → increase count
          state.newMessageAlert[index].count += 1;
        } else {
          //  new chat → add entry
          state.newMessageAlert.push({
            chatId,
            count: 1,
          });
        }
        getOrSaveFromStorage({
          key: NEW_MESSAGE_ALERT,
          value: state.newMessageAlert,
        });
      },

      removeNewMessageAlert : (state , action ) =>{
        const chatId = action.payload;
        state.newMessageAlert = state.newMessageAlert.filter(
          (item) => item.chatId !== chatId
        ); 
        getOrSaveFromStorage({
          key: NEW_MESSAGE_ALERT,
          value: state.newMessageAlert,
        });
      }
    },
});

export default chatSlice;
export const {
    incrementNotification,
    resetNotificationCount,
  setNewMessagesAlert,
  removeNewMessageAlert
} = chatSlice.actions;