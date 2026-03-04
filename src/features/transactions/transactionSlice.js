import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import apiClient from '../../api/axios'

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/transactions')
      return [...response.data].reverse()
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch transactions')
    }
  },
)

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (data, { rejectWithValue }) => {
    try {
      const id = 'TXN-' + String(Date.now()).slice(-4).padStart(4, '0')
      const response = await apiClient.post('/transactions', { id, ...data })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add transaction')
    }
  },
)

export const editTransaction = createAsyncThunk(
  'transactions/editTransaction',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/transactions/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update transaction')
    }
  },
)

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/transactions/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete transaction')
    }
  },
)

const initialState = {
  list: [],
  loading: false,
  error: null,
}

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchTransactions.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.list = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
    // add
    builder.addCase(addTransaction.fulfilled, (state, action) => {
      state.list.unshift(action.payload)
    })
    // edit
    builder.addCase(editTransaction.fulfilled, (state, action) => {
      const idx = state.list.findIndex((t) => t.id === action.payload.id)
      if (idx !== -1) state.list[idx] = action.payload
    })
    // delete
    builder.addCase(deleteTransaction.fulfilled, (state, action) => {
      state.list = state.list.filter((t) => t.id !== action.payload)
    })
  },
})

export default transactionSlice.reducer
