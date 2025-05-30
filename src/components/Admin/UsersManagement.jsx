import BriefCard from "../Sidebar/BriefCard"
import { Person } from "@mui/icons-material"
import DataTable from "./DataTable"
import { Divider } from "@mui/material"
import * as services from '../../utils/services.module';
import axios from "axios";
import * as swals from '../Public/Swals'

import { useMemo } from "react";

const columns = [
    { field: 'user_id', headerName: 'ID', width: 70 },
    {
        field: 'userName',
        headerName: 'Full Name',
        description: 'Formatted by services.formatUserName',
        sortable: false,
        width: 300,
        valueGetter: (params, row) => services.formatUserName(row.userName),
    },
    {
        field: 'email',
        headerName: 'Email',
        type: 'number',
        width: 200,
    },
    {
        field: 'createdAt',
        headerName: 'Created At',
        width: 200,
    }
];



export default function UsersManagement({ users, notifyChanges }) {

    const deleteSelectedUsers = async (selected) => {

        /**  */
        if (selected.length === 0) return
        const body = { userIds: selected }

        await swals.confirmationSwal(
            'delete',
            `${import.meta.env.VITE_API_URL}/admin/deleteusers`,
            "Are you sure you want to delete selected users?",
            "Users deleted",
            "Error with deleting users. Try again",
            body,
            () => { },
            notifyChanges
        )
    }

    return (
        <div>
            <div className="p-5 flex justify-start gap-5 flex-wrap">
                <BriefCard title="Registered Users" description={users.length} icon={<Person sx={{ fontSize: '4rem' }} />} />
            </div>

            <DataTable
                rows={users}
                columns={columns}
                deleteSelected={deleteSelectedUsers}
                getRowId={(row) => row.user_id}
            />
        </div>
    )
}