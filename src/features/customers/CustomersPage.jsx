import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import CustomerTable from '../../components/composite/CustomerTable'
import CustomerModal from '../../components/composite/CustomerModal'
import { fetchCustomers, addCustomer, editCustomer } from './customerSlice'
import { Plus } from 'lucide-react'

function CustomersPage() {
    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingCustomer, setEditing] = useState(null)

    const openAdd = () => { setEditing(null); setModalOpen(true) }
    const openEdit = (customer) => { setEditing(customer); setModalOpen(true) }
    const closeModal = () => { setModalOpen(false); setEditing(null) }

    const handleModalSubmit = (data) =>
        editingCustomer
            ? dispatch(editCustomer({ id: editingCustomer.id, data: { ...editingCustomer, ...data } }))
            : dispatch(addCustomer(data))

    useEffect(() => {
        dispatch(fetchCustomers())
    }, [dispatch])

    return (
        <div className="bg-slate-50 min-h-screen max-w-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Customer Database</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Manage, filter and audit your customer information.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={openAdd}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg text-sm transition-colors"
                        >
                            <Plus className="w-5 h-5" strokeWidth={2.5} />
                            Add Customer
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <input
                        type="text"
                        placeholder="Search by name, email, or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Table card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <CustomerTable search={search} onEdit={openEdit} />
                </div>
            </div>

            <CustomerModal
                open={modalOpen}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
                initialData={editingCustomer}
            />
        </div>
    )
}

export default CustomersPage
