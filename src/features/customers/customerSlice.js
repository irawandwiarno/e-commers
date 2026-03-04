import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import apiClient from '../../api/axios'

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/customers')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch customers')
    }
  },
)

export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async (data, { rejectWithValue }) => {
    try {
      const id = 'CUST-' + String(Date.now()).slice(-4).padStart(4, '0')
      const response = await apiClient.post('/customers', { id, ...data })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add customer')
    }
  },
)

export const editCustomer = createAsyncThunk(
  'customers/editCustomer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/customers/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update customer')
    }
  },
)

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/customers/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete customer')
    }
  },
)

const initialState = {
  list: [],
  loading: false,
  error: null,
}

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchCustomers.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false
        state.list = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
    // add
    builder.addCase(addCustomer.fulfilled, (state, action) => {
      state.list.unshift(action.payload)
    })
    // edit
    builder.addCase(editCustomer.fulfilled, (state, action) => {
      const idx = state.list.findIndex((c) => c.id === action.payload.id)
      if (idx !== -1) state.list[idx] = action.payload
    })
    // delete
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.list = state.list.filter((c) => c.id !== action.payload)
    })
  },
})

export default customerSlice.reducer
