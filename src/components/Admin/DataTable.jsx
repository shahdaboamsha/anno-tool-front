import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import { Button, Divider } from '@mui/material';
import { Delete } from '@mui/icons-material';

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable({ rows, columns, deleteSelected, getRowId }) {

    const [selectedRecords, setSelectedRecords] = useState([])

    const handleSelect = (event) => {
        setSelectedRecords(Array.from(event.ids))
    }

    return (
        <div className='flex flex-col gap-3'>
            <Divider />
            <div className='p-3'>
                <Button variant='contained' color='error'
                    onClick={() => deleteSelected(selectedRecords)}
                    sx={{ textTransform: 'none' }}
                    endIcon={< Delete />}
                    disabled={selectedRecords.length === 0}
                >Delete selected records
                </Button>
            </div>

            <Paper sx={{ height: 400 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    density='standard'
                    getRowId={getRowId}
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
