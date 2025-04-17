import { useEffect } from "react"

export default function RadioButtonGroup({ labels = [], handleLabelSelection }) {


    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    return (
        <div className="w-full mt-5">
            <h1 className="text-[16px]">Select label:</h1>
            {
                labels.map((label, index) => (
                    <div key={index + 10} className="flex items-center ps-4 border border-gray-200 rounded-sm mt-2">
                        <input
                            key={index + 1}
                            id={index}
                            type="radio"
                            value=""
                            onChange={() => handleLabelSelection(label)}
                            name='label'
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                        />
                        <label
                            htmlFor="bordered-radio-1"
                            className="w-full py-4 ms-2 text-sm"
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
