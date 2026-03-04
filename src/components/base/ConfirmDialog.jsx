import { useEffect } from 'react'
import { TriangleAlert } from 'lucide-react'

/**
 * @param {object}   props
 * @param {boolean}  props.open        - show/hide dialog
 * @param {string}   [props.title]     - dialog title
 * @param {string}   [props.message]   - body text
 * @param {string}   [props.confirmLabel] - confirm button label (default "Delete")
 * @param {function} props.onConfirm   - called when user confirms
 * @param {function} props.onCancel    - called when user cancels or closes
 */
export default function ConfirmDialog({
    open,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmLabel = 'Delete',
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open) return
        const handler = (e) => { if (e.key === 'Escape') onCancel?.() }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [open, onCancel])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
            onClick={(e) => { if (e.target === e.currentTarget) onCancel?.() }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
                <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                        <TriangleAlert className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                        <p className="text-sm text-slate-500 mt-1">{message}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-6 pb-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
