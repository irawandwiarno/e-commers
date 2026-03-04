import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Edit, Trash2 } from 'lucide-react'
import Pagination from '../base/Pagination'
import ConfirmDialog from '../base/ConfirmDialog'
import { deleteTransaction } from '../../features/transactions/transactionSlice'
import initials from '../../helpers/initialiseName'

// ─── helpers ────────────────────────────────────────────────────────────────

const planColor = {
    Pro:        'bg-purple-100 text-purple-700',
    Basic:      'bg-blue-100 text-blue-700',
    Business:   'bg-orange-100 text-orange-700',
    Enterprise: 'bg-indigo-100 text-indigo-700',
    Medium:     'bg-cyan-100 text-cyan-700',
}

const paymentColor = {
    Paid:   { dot: 'bg-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
    Unpaid: { dot: 'bg-red-600',     badge: 'bg-red-100 text-red-700' },
}


function daysUntilExpiry(expiryDate) {
    if (!expiryDate) return null
    const diff = (new Date(expiryDate) - Date.now()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 10 ? Math.ceil(diff) : null
}

const PAGE_SIZE = 10

// ─── component ───────────────────────────────────────────────────────────────

export default function TransactionTable({ search = '', subStatus = 'all', payFilter = 'all', onEdit }) {
    const dispatch = useDispatch()
    const { list, loading, error } = useSelector((state) => state.transactions)
    const [page, setPage]           = useState(1)
    const [deletingTxn, setDeleting] = useState(null)

    const filtered = list.filter((t) => {
        const q = search.toLowerCase()
        const matchSearch =
            t.customer?.toLowerCase().includes(q) ||
            t.plan?.toLowerCase().includes(q) ||
            String(t.id).toLowerCase().includes(q)
        const matchSub = subStatus === 'all' || t.plan === subStatus
        const matchPay = payFilter === 'all' || t.paymentStatus === payFilter
        return matchSearch && matchSub && matchPay
    })

    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const handleConfirmDelete = () => {
        dispatch(deleteTransaction(deletingTxn.id))
        setDeleting(null)
    }

    if (loading) return <p className="p-6 text-sm text-slate-500">Loading...</p>
    if (error)   return <p className="p-6 text-sm text-red-500">{String(error)}</p>

    if (filtered.length === 0) {
        return (
            <p className="p-6 text-sm text-slate-400">
                {search || subStatus !== 'all' || payFilter !== 'all'
                    ? 'No results for the current filter.'
                    : 'No transactions found.'}
            </p>
        )
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Customer Name</th>
                            <th className="px-6 py-4">Selected Plan</th>
                            <th className="px-6 py-4">Expiration Date</th>
                            <th className="px-6 py-4">Payment Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {paged.map((row, rowIdx) => (
                            <tr key={row.id ?? rowIdx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                            {initials(row.customer)}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900">{row.customer || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-sm ${planColor[row.plan] || 'bg-slate-100 text-slate-600'}`}>
                                        {row.plan || 'Unknown'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {(() => {
                                        const days = row.subscriptionStatus === 'Active' ? daysUntilExpiry(row.expiryDate) : null
                                        if (days !== null) {
                                            return (
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-amber-700">{row.expiryDate}</span>
                                                    <span className="text-[10px] font-medium text-amber-600 uppercase tracking-tighter">
                                                        {days === 0 ? 'Expires today' : `${days} day${days > 1 ? 's' : ''} left`}
                                                    </span>
                                                </div>
                                            )
                                        }
                                        return <span className="text-sm text-slate-600">{row.expiryDate || 'Unknown'}</span>
                                    })()}
                                </td>
                                <td className="px-6 py-4">
                                    {(() => {
                                        const c = paymentColor[row.paymentStatus] || { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600' }
                                        return (
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semi rounded-sm ${c.badge}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                                                {row.paymentStatus || 'Unknown'}
                                            </span>
                                        )
                                    })()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(row)}
                                            title="Edit"
                                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleting(row)}
                                            title="Delete"
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                total={filtered.length}
                page={page}
                pageSize={PAGE_SIZE}
                onChange={setPage}
            />

            <ConfirmDialog
                open={Boolean(deletingTxn)}
                title="Delete Transaction"
                message={`Delete transaction for "${deletingTxn?.customer}"? This cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleting(null)}
            />
        </>
    )
}
