export default function TaskDetailsInformation({ task }) {

    return (
        <div className=" shadow-md text-[14px] m-3">
            <table className="w-full table-fixed border-collapse">
                <tbody>
                    <tr className="border-b">
                        <th className="text-left p-2 font-semibold bg-gray-100">Task ID</th>
                        <td className="p-2">{task.task_id}</td>
                    </tr>
                    <tr className="border-b ">
                        <th className="text-left p-2 font-semibold bg-gray-100">Task name</th>
                        <td className="p-2">{task.task_name}</td>
                    </tr>
                    <tr className="border-b">
                        <th className="text-left p-2 font-semibold bg-gray-100">Annotation type</th>
                        <td className="p-2">{task.annotation_type}</td>
                    </tr>
                    <tr className="border-b">
                        <th className="text-left p-2 font-semibold bg-gray-100">Labels</th>
                        <td className="p-2">{task.labels.toLocaleString().split(';').join(" , ")}</td>
                    </tr>
                    <tr className="border-b">
                        <th className="text-left p-2 font-semibold bg-gray-100">Users Collaborators</th>
                        <td className="p-2">{task.collaborators.length}</td>
                    </tr>
                    <tr>
                        <th className="text-left p-2 font-semibold bg-gray-100">Completed by</th>
                        <td className="p-2">{task.completed_by_user} user</td>
                    </tr>
                </tbody>
            </table>
        </div>

    )
}
