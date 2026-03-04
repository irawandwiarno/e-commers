/**
 * @param {object}   props
 * @param {string}   props.label              - stat label
 * @param {string|number} props.value         - main stat value
 * @param {string}   [props.change]           - badge text, e.g. "+12%" or "Action required"
 * @param {"up"|"down"|"neutral"} [props.trend] - controls badge color
 */
export default function StatCard({ label, value, change, trend = 'neutral' }) {
    const badgeColor = {
        up: 'text-emerald-600 bg-emerald-100',
        down: 'text-red-600 bg-red-100',
        neutral: 'text-amber-600 bg-amber-100',
    }

    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-end justify-between gap-2">
                <h3 className="text-xl font-semibold text-slate-900 leading-none truncate">{value}</h3>
                {change && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${badgeColor[trend]}`}>
                        {change}
                    </span>
                )}
            </div>
        </div>
    )
}
