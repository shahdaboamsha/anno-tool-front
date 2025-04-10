import AssignedTasks from "./Tasks/AssignedTasks"
import { Typography } from "@mui/material"

const assignedTasks = [
    {
        task_name: 'task_01',
        task_type: 'Sentimentic',
        progress: [50, 100]
    },
    {
        task_name: 'task_02',
        task_type: 'Scarcasm',
        progress: [64, 89]
    }
]
export default function UserTasks() {
    return (
        <div className="p-1 ml-5">
            <h1 className="text text-[18px] mt-5">My Tasks</h1>
            <AssignedTasks assignedTasks={assignedTasks} />

        </div>
    )
}