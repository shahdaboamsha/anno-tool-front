import BriefCard from "../Sidebar/BriefCard"
import DataTable from "./DataTable"
import * as services from '../../utils/services.module';
import { useOutletContext } from "react-router-dom";
import { useMemo } from "react";
import * as swals from '../Public/Swals'
import { Assignment } from "@mui/icons-material";
const columns = [
    { field: 'task_id', headerName: 'ID', width: 70 },
    {
        field: 'task_name',
        headerName: 'Task name',
        type: 'number',
        width: 300,
    },
    {
        field: 'annotation_type',
        headerName: 'Updated At',
        width: 150,
    },
    {
        field: 'labels',
        headerName: 'Labels',
        width: 250,
        valueGetter: (params, row) => services.capitailizeFirstLetterOfArray(row.labels),
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 150,
    },
    {
        field: 'created_by',
        headerName: 'User ID',
        with: 70,
    },
    {
        field: 'createdAt',
        headerName: 'Created At',
        width: 150,
        valueGetter: (params, row) => services.formatDateToLong(row.createdAt),
    }
];

export default function TasksManagement({ tasks, notifyChanges }) {

    const { userData } = useOutletContext()

    tasks = useMemo(() => {
        return tasks.map(task => {
            if (task.Owner.email === userData.email){
                return {
                    ...task,
                    created_by: task.created_by + " (You)"
                }
            }
            return task
        })
    }, [userData.email, tasks])
    const deleteSelectedUsers = async (selected) => {
            if (selected.length === 0) return
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` },
                data: { taskIds: selected }
            }
            const url = 'http://localhost:3000/admin/deletetasks'
        
            swals.deleteTaskssSwal(url, config, notifyChanges)
    
        }
    return (
        <div>
            <div className="p-5 flex justify-start gap-5 flex-wrap">
                <BriefCard title="Total Tasks" description={tasks.length} icon={<Assignment sx={{ fontSize: '4rem' }} />} />
                <BriefCard title="Completed Tasks" description={tasks.filter(task => task.status != 'in-progress').length} icon={<Assignment sx={{ fontSize: '4rem' }} />} />
            </div>

            <DataTable
                rows={tasks}
                columns={columns}
                deleteSelected={deleteSelectedUsers}
                getRowId={(row) => row.task_id}
                
            />
        </div>
    )
}