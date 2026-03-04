import { useCallback, useState } from 'react'
import apiClient from '../../api/axios'

export default function useCustomer() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchCustomers = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await apiClient.get('/customers')
            setList(response.data)
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Failed to fetch customers')
        } finally {
            setLoading(false)
        }
    }, [])

    const addCustomer = useCallback(async (data) => {
        const id = 'CUST-' + String(Date.now()).slice(-4).padStart(4, '0')
        const response = await apiClient.post('/customers', { id, ...data })
        setList((prev) => [...prev, response.data])
        return response.data
    }, [])

    const editCustomer = useCallback(async (id, data) => {
        const response = await apiClient.put(`/customers/${id}`, data)
        setList((prev) => prev.map((c) => (c.id === id ? response.data : c)))
        return response.data
    }, [])

    const deleteCustomer = useCallback(async (id) => {
        await apiClient.delete(`/customers/${id}`)
        setList((prev) => prev.filter((c) => c.id !== id))
    }, [])

    return { list, loading, error, fetchCustomers, addCustomer, editCustomer, deleteCustomer }
}
