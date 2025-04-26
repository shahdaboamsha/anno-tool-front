import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { Delete } from '@mui/icons-material';

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable({ rows, columns, deleteSelected }) {

    const [selectedRecords, setSelectedRecords] = useState([])

    const handleSelect = (event) => {
        setSelectedRecords(Array.from(event.ids))
    }

    return (
        <div className='flex flex-col items-end gap-3 w-full'>
            <div>
                <Button variant='contained' color='error'
                    onClick={() => deleteSelected(selectedRecords)}
                    sx={{ textTransform: 'none' }}
                    endIcon={< Delete />}
                >Delete selected records
                </Button>
            </div>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.user_id}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    sx={{ border: 0 }}
                    onRowSelectionModelChange={handleSelect}
                />
            </Paper>
        </div>
    );
}
