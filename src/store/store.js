import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../features/login/loginSlice'
import customerReducer from '../features/customers/customerSlice'
import transactionReducer from '../features/transactions/transactionSlice'

export const store = configureStore({
  reducer: {
    login: loginReducer,
    customers: customerReducer,
    transactions: transactionReducer,
  },
})
