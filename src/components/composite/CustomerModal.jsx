import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import FormField from '../base/FormField'

const EMPTY_FORM = { name: '', email: '', phone: '' }

/**
 * @param {object}   props
 * @param {boolean}  props.open         - controls visibility
 * @param {function} props.onClose      - called when modal should close
 * @param {function} props.onSubmit     - called with form data object; should return a Promise
 * @param {object}   [props.initialData] - customer object to pre-fill (edit mode)
 */
export default function CustomerModal({ open, onClose, onSubmit, initialData = null }) {
    const isEdit = Boolean(initialData)
    const [form, setForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)
    const [fieldError, setFieldError] = useState({})
    const firstInputRef = useRef(null)

    // Reset / pre-fill form when modal opens
    useEffect(() => {
        if (open) {
            setForm(
                isEdit
                    ? { name: initialData.name || '', email: initialData.email || '', phone: initialData.phone || '' }
                    : EMPTY_FORM
            )
            setFieldError({})
            setSaving(false)
            setTimeout(() => firstInputRef.current?.focus(), 50)
        }
    }, [open])

    // Close on Escape key
    useEffect(() => {
        if (!open) return
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [open, onClose])

    const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

    const validate = () => {
        const errs = {}
        if (!form.name.trim())  errs.name  = 'Name is required'
        if (!form.email.trim()) errs.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
        return errs
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setFieldError(errs); return }

        setSaving(true)
        try {
            const payload = {
                name:  form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
            }
            if (!isEdit) {
                payload.joinDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
            }
            await onSubmit(payload)
            onClose()
        } catch {
            // error handled by parent / hook
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
                        <h2 className="text-base font-semibold text-slate-900">{isEdit ? 'Edit Customer' : 'Add Customer'}</h2>
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
                        <FormField
                            ref={firstInputRef}
                            id="name"
                            label="Full Name"
                            placeholder="e.g. John Doe"
                            value={form.name}
                            onChange={set('name')}
                            error={fieldError.name}
                            required
                        />
                        <FormField
                            id="email"
                            label="Email Address"
                            type="email"
                            placeholder="e.g. john@example.com"
                            value={form.email}
                            onChange={set('email')}
                            error={fieldError.email}
                            required
                        />
                        <FormField
                            id="phone"
                            label="Phone Number"
                            type="tel"
                            placeholder="e.g. +1 (555) 000-1111"
                            value={form.phone}
                            onChange={set('phone')}
                        />
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
                            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Customer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
