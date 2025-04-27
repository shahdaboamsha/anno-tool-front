import BriefCard from "../Sidebar/BriefCard"
import { Person } from "@mui/icons-material"
import DataTable from "./DataTable"
import { Divider } from "@mui/material"
import * as services from '../../utils/services.module';

import axios from "axios";

const columns = [
    { field: 'task_id', headerName: 'ID', width: 70 },
    {
        field: 'task_name',
        headerName: 'Task name',
        type: 'number',
        width: 90,
    },
    {
        field: 'createdAt',
        headerName: 'Created At',
        width: 150,
        valueGetter: (params, row) => services.formatDateToLong(row.createdAt),
    },
    {
        field: 'updatedAt',
        headerName: 'Updated At',
        width: 150,
        valueGetter: (params, row) => services.formatDateToLong(row.updatedAt),
    }, {
        field: 'annotation_type',
        headerName: 'Updated At',
        width: 150,
    },
    {
        field: 'labels',
        headerName: 'Labels',
        width: 200,
        valueGetter: (params, row) => services.capitailizeFirstLetterOfArray(row.labels),
    },
    {
        field: 'userName',
        headerName: 'User Name',
        with: 200,
        valueGetter: (params, row) => services.formatUserName(row.userName),
    },
    {
        field: 'created_by',
        headerName: 'User ID',
        with: 200,
    }
];

const rows = [
    { task_id: 2, task_name: 'My Task', annotation_type: 'Sentiment', labels: 'Positive; negative', createdAt: '12 Apr 2025', updatedAt: '17 April 2026', created_by: 18, userName: 'Shahd Mohammad' },
    { task_id: 1, task_name: 'My Task', annotation_type: 'Sentiment', labels: 'Positive; negative', createdAt: '12 Apr 2025', updatedAt: '17 April 2026', created_by: 20, userName: 'Shahd Mohammad' },
]


export default function TasksManagement({ tasks = null }) {

    const deleteSelectedUsers = async (selected) => {
        if (selected.length === 0) {
            return
        }

        try {
            const url = 'http://localhost:3000/admin/deleteTasks'
            const headers = `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`

            await axios.post(url, selected, { headers: headers })
            alertSwal("Deleted successfully", "", "success")
        } catch (error) {
            alertSwal("Oops", "Server error", "error")
        }

    }
    return (
        <div>
            <div className="p-5 flex justify-start gap-5 flex-wrap">
                <BriefCard title="Registered Users" description="25" icon={<Person sx={{ fontSize: '4rem' }} />} />
                <BriefCard title="Deleted Users" description="25" icon={<Person sx={{ fontSize: '4rem' }} />} />
            </div>

            <DataTable
                rows={rows}
                columns={columns}
                deleteSelected={deleteSelectedUsers}
                getRowId={(row) => row.task_id}
            />
        </div>
    )
}