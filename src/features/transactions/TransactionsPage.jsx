import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import StatCard from '../../components/base/StatCard'
import ButtonGroup from '../../components/composite/ButtonGroup'
import TransactionTable from '../../components/composite/TransactionTable'
import TransactionModal from '../../components/composite/TransactionModal'
import formatCurrency from '../../helpers/formatCurrency'
import { ChevronDown, Plus } from 'lucide-react'
import { fetchTransactions, addTransaction, editTransaction } from './transactionSlice'

function daysUntilExpiry(expiryDate) {
    if (!expiryDate) return null
    const diff = (new Date(expiryDate) - Date.now()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 10 ? Math.ceil(diff) : null
}

const PLAN_OPTIONS = [
    { label: 'All Plans', value: 'all' },
    { label: 'Basic', value: 'Basic' },
    { label: 'Pro', value: 'Pro' },
    { label: 'Business', value: 'Business' },
    { label: 'Enterprise', value: 'Enterprise' },
]

const PAYMENT_OPTIONS = [
    { label: 'Status: All', value: 'all' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Unpaid', value: 'Unpaid' },
]

function TransactionsPage() {
    const dispatch = useDispatch()
    const list = useSelector((state) => state.transactions.list)
    const [search, setSearch] = useState('')
    const [subStatus, setSubStatus] = useState('all')
    const [payFilter, setPayFilter] = useState('all')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingTxn, setEditingTxn] = useState(null)

    const openEdit = (row) => { setEditingTxn(row); setModalOpen(true) }
    const closeModal = () => { setModalOpen(false); setEditingTxn(null) }

    const handleSubmit = (data) =>
        editingTxn
            ? dispatch(editTransaction({ id: editingTxn.id, data: { ...editingTxn, ...data } }))
            : dispatch(addTransaction(data))

    useEffect(() => {
        dispatch(fetchTransactions())
    }, [dispatch])

    // Stats use full list from Redux
    const activeCount = list.filter((t) => t.subscriptionStatus === 'Active').length
    const unpaidCount = list.filter((t) => t.paymentStatus === 'Unpaid').length
    const monthlyRevenue = list.filter((t) => t.paymentStatus === 'Paid').reduce((s, t) => s + (Number(t.amount) || 0), 0)
    const expiringSoon = list.filter((t) => t.subscriptionStatus === 'Active' && daysUntilExpiry(t.expiryDate) !== null).length

    return (
        <div className="bg-slate-50 min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto w-full space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    <StatCard label="Unpaid Dues" value={unpaidCount} change="-2.1%" trend="down" />
                    <StatCard label="Monthly Revenue" value={formatCurrency(monthlyRevenue)} change="+12%" trend="up" />
                    <StatCard label="Expiring Soon" value={expiringSoon} change="Action required" trend="neutral" />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <ButtonGroup
                            options={PLAN_OPTIONS}
                            value={subStatus}
                            onChange={setSubStatus}
                        />
                        <div className="relative">
                            <select
                                value={payFilter}
                                onChange={(e) => setPayFilter(e.target.value)}
                                className="appearance-none bg-white border border-slate-200 pl-4 pr-9 py-2 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                            >
                                {PAYMENT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search subscriptions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white shadow-sm w-56"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => { setEditingTxn(null); setModalOpen(true) }}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-primary/20 shrink-0"
                    >
                        <Plus className="w-5 h-5" strokeWidth={2.5} />
                        New Subscription
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <TransactionTable
                        search={search}
                        subStatus={subStatus}
                        payFilter={payFilter}
                        onEdit={openEdit}
                    />
                </div>

            </div>
            <TransactionModal
                open={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                initialData={editingTxn}
            />
        </div>
    )
}

export default TransactionsPage
