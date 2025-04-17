import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';

export default function TaskDetailsInformation({ task }) {

    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const [editIconVisibility, setEditIconVisibility] = useState('none')

    const handleEditIconVisibility = (display) => {
        if (isSmallScreen) {
            setEditIconVisibility('initial')
            return
        }
        setEditIconVisibility(display)

    }

    return (
        <div className="relative" onMouseEnter={(e) => handleEditIconVisibility('initial')} onMouseLeave={(e) => handleEditIconVisibility('none')}>
            <table className="table-fixed">
                <tbody>
                    <tr>
                        <th className="text-left p-2 font-semibold">Task ID</th>
                        <td className="p-2">{task.task_id}</td>
                    </tr>
                    <tr>
                        <th className="text-left p-2 font-semibold">Task name</th>
                        <td className="p-2">{task.task_name}</td>
                    </tr>
                    <tr>
                        <th className="text-left p-2 font-semibold">Annotation type</th>
                        <td className="p-2">{task.annotation_type}</td>
                    </tr>
                    <tr>
                        <th className="text-left p-2 font-semibold">Labels</th>
                        <td className="p-2">{task.labels.toLocaleString().split(';').join(" , ")}</td>
                    </tr>
                    <tr>
                        <th className="text-left p-2 font-semibold">Users Collaborators</th>
                        <td className="p-2">{task.collaborators.length}</td>
                    </tr>
                    <tr>
                        <th className="text-left p-2 font-semibold">Annotated Sentences </th>
                        <td className="p-2">{task.completed_by_user}</td>
                    </tr>
                </tbody>
            </table>

            <Tooltip title='Edit this task' >
                <IconButton  size='small' sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    display: isSmallScreen? 'initial' : editIconVisibility
                }}>
                    <EditRoundedIcon fontSize='small' />
                </IconButton>
            </Tooltip>

        </div>

    )
}
