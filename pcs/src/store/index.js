import { configureStore } from '@reduxjs/toolkit';
import authReducer from 'store/authReducer';

export default configureStore({
  reducer: {
    auth: authReducer
  },
});
