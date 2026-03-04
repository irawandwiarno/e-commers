/**
 * Tab-style button group for filter/tab switching.
 *
 * @param {object}   props
 * @param {{ label: string, value: string }[]} props.options - list of options
 * @param {string}   props.value    - currently selected value
 * @param {function} props.onChange - called with the new value when an option is clicked
 */
export default function ButtonGroup({ options = [], value, onChange }) {
    return (
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm shrink-0">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange?.(opt.value)}
                    className={[
                        'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                        value === opt.value
                            ? 'bg-primary text-white'
                            : 'text-slate-600 hover:text-slate-900',
                    ].join(' ')}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    )
}
