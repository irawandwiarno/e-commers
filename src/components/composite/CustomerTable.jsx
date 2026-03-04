import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Edit, Trash2 } from 'lucide-react'
import Pagination from '../base/Pagination'
import ConfirmDialog from '../base/ConfirmDialog'
import { deleteCustomer } from '../../features/customers/customerSlice'
import initials from '../../helpers/initialiseName'

const PAGE_SIZE = 10

export default function CustomerTable({ search = '', onEdit }) {
    const dispatch = useDispatch()
    const { list, loading, error } = useSelector((state) => state.customers)
    const [page, setPage]                   = useState(1)
    const [deletingCustomer, setDeleting]   = useState(null)

    const filtered = list.filter((c) => {
        const q = search.toLowerCase()
        return (
            c.name?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q) ||
            String(c.id)?.toLowerCase().includes(q)
        )
    })

    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const handleConfirmDelete = () => {
        dispatch(deleteCustomer(deletingCustomer.id))
        setDeleting(null)
    }

    if (loading) return <p className="p-6 text-sm text-slate-500">Loading customers...</p>
    if (error)   return <p className="p-6 text-sm text-red-500">{String(error)}</p>

    if (filtered.length === 0) {
        return (
            <p className="p-6 text-sm text-slate-400">
                {search ? `No results for "${search}"` : 'No customers found.'}
            </p>
        )
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Contact Details</th>
                            <th className="px-6 py-4">Join Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {paged.map((customer) => (
                            <tr key={customer.id || customer.email} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                            {initials(customer.name)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{customer.name || 'Unnamed'}</p>
                                            <p className="text-xs text-slate-400">ID: {customer.id || '-'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-slate-700">{customer.phone || '-'}</p>
                                    <p className="text-xs text-slate-400">{customer.email || '-'}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {customer.joinDate || '-'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(customer)}
                                            title="Edit"
                                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleting(customer)}
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
                open={Boolean(deletingCustomer)}
                title="Delete Customer"
                message={`Delete "${deletingCustomer?.name}"? This cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleting(null)}
            />
        </>
    )
}
