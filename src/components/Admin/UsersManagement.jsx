import BriefCard from "../Sidebar/BriefCard"
import { Person } from "@mui/icons-material"
import DataTable from "./DataTable"
import { Divider } from "@mui/material"
import * as services from '../../utils/services.module';
import axios from "axios";

const columns = [
    { field: 'user_id', headerName: 'ID', width: 70 },
    {
        field: 'dateofbirth',
        headerName: 'Age',
        type: 'number',
        width: 90,
    },
    {
        field: 'userName',
        headerName: 'Full Name',
        description: 'Formatted by services.formatUserName',
        sortable: false,
        width: 200,
        valueGetter: (params, row) => services.formatUserName(row.userName),
    },
    {
        field: 'createdAt',
        headerName: 'Created At',
        width: 150,
    },
    {
        field: 'updatedAt',
        headerName: 'Updated At',
        width: 150,
    },
];

const rows = [
    { user_id: 1, userName: 'Ghassan Amous', dateofbirth: 35, is_deleted: 0, createdAt: '17 Nov 2025', updatedAt: '12 Apr 2025' },
    { user_id: 2, userName: 'Ghassan Amous', dateofbirth: 42, is_deleted: 0, createdAt: '17 Nov 2025', updatedAt: '12 Apr 2025' },
    { user_id: 3, userName: 'Ghassan Amous', dateofbirth: 45, is_deleted: 0, createdAt: '17 Nov 2025', updatedAt: '12 Apr 2025' },
    { user_id: 4, userName: 'Ghassan Amous', dateofbirth: 16, is_deleted: 0, createdAt: '17 Nov 2025', updatedAt: '12 Apr 2025' },
    { user_id: 5, userName: 'Ghassan Amous', dateofbirth: 13, is_deleted: 0, createdAt: '17 Nov 2025', updatedAt: '12 Apr 2025' },
    { user_id: 6, userName: 'Ghassan Amous', dateofbirth: 15, is_deleted: 0, createdAt: '17 Nov 2025', updatedAt: '12 Apr 2025' },
    { user_id: 7, userName: 'Ghassan Amous', dateofbirth: 44, is_deleted: 0, createdAt: '17 Nov 2025', updatedAt: '12 Apr 2025' },
    { user_id: 8, userName: 'Ghassan Amous', dateofbirth: 36, is_deleted: 0, createdAt: '17 Nov 2025', updatedAt: '12 Apr 2025' },
    { user_id: 9, userName: 'Ghassan Amous', dateofbirth: 65, is_deleted: 0, createdAt: '17 Nov 2025', updatedAt: '12 Apr 2025' },
]

export default function UsersManagement({ users = null }) {

    const deleteSelectedUsers = async (selected) => {
        if (selected.length === 0) {
            return
        }

        try {
            const url = 'http://localhost:3000/admin/deleteusers'
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
                getRowId={(row) => row.user_id}
            />
        </div>
    )
}