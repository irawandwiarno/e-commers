import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import useUser from '../../hooks/useUser'
import FormField from '../base/FormField'

const PLAN_OPTIONS = [
    { label: 'Basic',      value: 'Basic',      amount: 150000 },
    { label: 'Pro',        value: 'Pro',        amount: 250000 },
    { label: 'Business',   value: 'Business',   amount: 490000 },
    { label: 'Enterprise', value: 'Enterprise', amount: 690000 },
]

function defaultExpiryDate() {
    const d = new Date()
    d.setMonth(d.getMonth() + 1)
    return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

const EMPTY_FORM = {
    customer:           '',
    plan:               'Basic',
    amount:             150000,
    expiryDate:         defaultExpiryDate(),
}

export default function TransactionModal({ open, onClose, onSubmit, initialData = null }) {
    const isEdit = Boolean(initialData)
    const [form, setForm]             = useState(EMPTY_FORM)
    const [saving, setSaving]         = useState(false)
    const [fieldError, setFieldError] = useState({})
    const [customerSelected, setCustomerSelected] = useState(false)
    const { suggestions, showSug, setShowSug, searchCustomers, clearSuggestions } = useUser()
    const firstInputRef = useRef(null)
    const sugBoxRef     = useRef(null)

    useEffect(() => {
        if (open) {
            if (isEdit) {
                // Convert stored "Mon DD, YYYY" back to YYYY-MM-DD for date input
                const toInputDate = (str) => {
                    if (!str) return defaultExpiryDate()
                    const d = new Date(str)
                    return isNaN(d) ? defaultExpiryDate() : d.toISOString().slice(0, 10)
                }
                setForm({
                    customer:      initialData.customer || '',
                    plan:          initialData.plan || 'Basic',
                    amount:        initialData.amount ?? 150000,
                    paymentStatus: initialData.paymentStatus || 'Unpaid',
                    expiryDate:    toInputDate(initialData.expiryDate),
                })
                setCustomerSelected(true)
            } else {
                setForm({ ...EMPTY_FORM, expiryDate: defaultExpiryDate() })
                setCustomerSelected(false)
            }
            setFieldError({})
            setSaving(false)
            clearSuggestions()
            setTimeout(() => firstInputRef.current?.focus(), 50)
        }
    }, [open])

    useEffect(() => {
        if (!open) return
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [open, onClose])

    // Close suggestions on outside click
    useEffect(() => {
        const handler = (e) => {
            if (sugBoxRef.current && !sugBoxRef.current.contains(e.target)) setShowSug(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleCustomerChange = (e) => {
        setForm((prev) => ({ ...prev, customer: e.target.value }))
        setCustomerSelected(false)
        searchCustomers(e.target.value)
    }

    const selectSuggestion = (name) => {
        setForm((prev) => ({ ...prev, customer: name }))
        setCustomerSelected(true)
        clearSuggestions()
    }

    const set = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }))

    const handlePlanChange = (e) => {
        const plan = PLAN_OPTIONS.find((p) => p.value === e.target.value)
        setForm((prev) => ({ ...prev, plan: e.target.value, amount: plan?.amount ?? prev.amount }))
    }

    const validate = () => {
        const errs = {}
        if (!form.customer.trim())
            errs.customer = 'Customer name is required'
        else if (!customerSelected)
            errs.customer = 'Please select a customer from the list'
        if (!form.expiryDate) errs.expiryDate = 'Expiry date is required'
        return errs
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setFieldError(errs); return }

        setSaving(true)
        try {
            // Format expiryDate from YYYY-MM-DD → "Mon DD, YYYY"
            const formatted = new Date(form.expiryDate + 'T00:00:00')
                .toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })

            await onSubmit({
                customer:           form.customer.trim(),
                plan:               form.plan,
                amount:             Number(form.amount),
                paymentStatus:      isEdit ? form.paymentStatus : 'Unpaid',
                subscriptionStatus: 'Active',
                expiryDate:         formatted,
                date:               new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            })
            onClose()
        } catch {
            // handled by hook / caller
        } finally {
            setSaving(false)
        }
    }

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">{isEdit ? 'Edit Subscription' : 'New Subscription'}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="px-6 py-5 space-y-4">

                        {/* Customer with autocomplete */}
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Customer Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative" ref={sugBoxRef}>
                                <input
                                    ref={firstInputRef}
                                    type="text"
                                    autoComplete="off"
                                    value={form.customer}
                                    onChange={handleCustomerChange}
                                    onFocus={() => suggestions.length > 0 && setShowSug(true)}
                                    placeholder="Type to search customer..."
                                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                        fieldError.customer ? 'border-red-400' : 'border-slate-200'
                                    }`}
                                />
                                {showSug && suggestions.length > 0 && (
                                    <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                                        {suggestions.map((c) => (
                                            <li
                                                key={c.id}
                                                onMouseDown={() => selectSuggestion(c.name)}
                                                className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                                            >
                                                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                                    {c.name?.[0]?.toUpperCase()}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-900 truncate">{c.name}</p>
                                                    <p className="text-xs text-slate-400 truncate">{c.email}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {fieldError.customer && <p className="text-xs text-red-500 mt-1">{fieldError.customer}</p>}
                        </div>

                        {/* Plan + Amount (read-only) */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-slate-700 mb-1">Plan</label>
                                <select
                                    value={form.plan}
                                    onChange={handlePlanChange}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {PLAN_OPTIONS.map((p) => (
                                        <option key={p.value} value={p.value}>
                                            {p.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-28">
                                <label className="block text-xs font-medium text-slate-700 mb-1">Amount (IDR)</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={form.amount}
                                    className="w-full border border-slate-100 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-default select-none"
                                />
                            </div>
                        </div>

                        {/* Expiry Date */}
                        <FormField
                            id="expiryDate"
                            label="Expiry Date"
                            type="date"
                            value={form.expiryDate}
                            onChange={set('expiryDate')}
                            error={fieldError.expiryDate}
                            required
                        />

                        {/* Payment Status — edit mode only */}
                        {isEdit && (
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Payment Status</label>
                                <select
                                    value={form.paymentStatus}
                                    onChange={set('paymentStatus')}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                </select>
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors disabled:opacity-60"
                        >
                            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Subscription'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
