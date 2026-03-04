/**
 * @param {object}  props
 * @param {number}  props.total      - total number of items
 * @param {number}  props.page       - current page (1-based)
 * @param {number}  [props.pageSize] - items per page (default 10)
 * @param {function} props.onChange  - called with new page number
 */
export default function Pagination({ total = 0, page = 1, pageSize = 10, onChange }) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    const from = total === 0 ? 0 : (page - 1) * pageSize + 1
    const to = Math.min(page * pageSize, total)

    // Build page number list — show at most 5 pages centered around current
    const getPages = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }
        let start = Math.max(1, page - 2)
        let end = Math.min(totalPages, page + 2)
        if (page <= 3) { start = 1; end = 5 }
        if (page >= totalPages - 2) { start = totalPages - 4; end = totalPages }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    const btnBase = 'px-3 py-1.5 text-xs rounded-lg border transition-colors'
    const btnDefault = `${btnBase} border-slate-200 text-slate-500 hover:bg-slate-50`
    const btnActive = `${btnBase} border-primary bg-primary text-white`
    const btnDisabled = `${btnBase} border-slate-200 text-slate-400 opacity-40 cursor-not-allowed`

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4 border-t border-slate-200">
            <p className="text-sm text-slate-400">
                {total === 0
                    ? 'No results'
                    : `Showing ${from} to ${to} of ${total} results`}
            </p>

            <div className="flex items-center gap-1">
                <button
                    className={page <= 1 ? btnDisabled : btnDefault}
                    disabled={page <= 1}
                    onClick={() => onChange?.(page - 1)}
                >
                    Previous
                </button>

                {getPages().map((p) => (
                    <button
                        key={p}
                        className={p === page ? btnActive : btnDefault}
                        onClick={() => onChange?.(p)}
                    >
                        {p}
                    </button>
                ))}

                <button
                    className={page >= totalPages ? btnDisabled : btnDefault}
                    disabled={page >= totalPages}
                    onClick={() => onChange?.(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    )
}
