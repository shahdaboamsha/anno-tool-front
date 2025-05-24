import clsx from "clsx";

export default function RadioButtonGroup({ labels = [], handleLabelSelection, checkedValue = null }) {


    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    return (
        <div className="w-full flex flex-row justify-items-center flex-wrap gap-2">

            {
                labels.map((label, index) => (
                    <div key={index + 10} className={clsx("grow flex items-center pl-2 border border-gray-200 rounded-sm")}>
                        <input
                            key={index + 1}
                            id={index}
                            type="radio"
                            value=""
                            onChange={() => handleLabelSelection(label)}
                            name='label'
                            className="w-4 text-blue-600 bg-gray-100 border-gray-300"
                            defaultChecked={label === checkedValue }
                        />
                        <label
                            htmlFor="bordered-radio-1"
                            className="w-full p-2 text-sm"
                            key={index + 6}
                            id={index + 2}
                        >
                            {capitalizeFirstLetter(label)}
                        </label>
                    </div>
                ))
            }

        </div>
    );
}
