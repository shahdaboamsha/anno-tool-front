import clsx from "clsx"
export default function AssignedTasks({ assignedTasks }) {

    return (
        <div className="relative overflow-x-auto shadow-md bg-white mt-2">
            
            <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-md  text-black bg-gray-100 font-bold" >
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Task name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Type
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Progress
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Actions
                        </th>
                    </tr>
                </thead>
                {
                    assignedTasks.lenth != 0 &&

                    <tbody className="text-black">

                        {
                            assignedTasks.map((task, index) => (
                                <tr className={clsx("bg-white border-gray-200 text-gray-500", index + 1 === assignedTasks.length ? "border-b" : "")}>
                                    <td scope="row" className="px-6 py-4">
                                        {task.task_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {task.task_type}
                                    </td>
                                    <td className="px-6 py-4">
                                        {task.progress[0]}/{task.progress[1]}
                                    </td>
                                    <td className="px-6 py-4">
                                        $2999
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                }

            </table>
        </div>


    )
}