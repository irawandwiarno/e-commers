

import { useCallback, useRef, useState } from 'react'
import apiClient from '../api/axios'

export default function useUser() {
    const [suggestions, setSuggestions] = useState([])
    const [showSug, setShowSug]         = useState(false)
    const debounceRef = useRef(null)

    const searchCustomers = useCallback((query) => {
        clearTimeout(debounceRef.current)
        if (!query.trim()) {
            setSuggestions([])
            setShowSug(false)
            return
        }
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await apiClient.get('/customers')
                const q = query.toLowerCase()
                const filtered = res.data
                    .filter((c) => c.name?.toLowerCase().includes(q))
                    .slice(0, 5)
                setSuggestions(filtered)
                setShowSug(filtered.length > 0)
            } catch {
                setSuggestions([])
                setShowSug(false)
            }
        }, 250)
    }, [])

    const clearSuggestions = useCallback(() => {
        setSuggestions([])
        setShowSug(false)
    }, [])

    return { suggestions, showSug, setShowSug, searchCustomers, clearSuggestions }
}

