import { useCallback, useState } from 'react'
import apiClient from '../../api/axios'

export default function useTransaction() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchTransactions = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await apiClient.get('/transactions')
            setList([...response.data].reverse())
        } catch (err) {
            setError(
                err?.response?.data?.message || err.message || 'Failed to fetch transactions',
            )
        } finally {
            setLoading(false)
        }
    }, [])

    const addTransaction = useCallback(async (data) => {
        const id = 'TXN-' + String(Date.now()).slice(-4).padStart(4, '0')
        const response = await apiClient.post('/transactions', { id, ...data })
        setList((prev) => [response.data, ...prev])
        return response.data
    }, [])

    const editTransaction = useCallback(async (id, data) => {
        try {
            const response = await apiClient.put(`/transactions/${id}`, data)
            setList((prev) => prev.map((t) => (t.id === id ? response.data : t)))
            return response.data
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Failed to update transaction')
            throw err
        }
    }, [])

    const deleteTransaction = useCallback(async (id) => {
        try {
            await apiClient.delete(`/transactions/${id}`)
            setList((prev) => prev.filter((t) => t.id !== id))
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Failed to delete transaction')
        }
    }, [])

    return { list, loading, error, fetchTransactions, addTransaction, editTransaction, deleteTransaction };
}
