export default function SelectOpt({ features, onChangeFeature, initialValue = features[0] }) {
    return (
        <select
            className="block w-[40%] lg:w-2/5 md:w-auto py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700"
            value={initialValue}
            onChange={onChangeFeature}
        >
            {features.map((feature) => {
                return (
                    <option key={feature} value={feature} className="text-gray-900">
                        {feature}
                    </option>
                );
            })}
        </select>
    );
}
