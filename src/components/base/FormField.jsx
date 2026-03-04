import { forwardRef } from 'react'

const FormField = forwardRef(function FormField(
    { id, label, type = 'text', placeholder, value, onChange, error, required = false },
    ref
) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-medium text-slate-700">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
                ref={ref}
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    error ? 'border-red-400 focus:ring-red-400' : 'border-slate-200'
                }`}
            />
            {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        </div>
    )
})

export default FormField
