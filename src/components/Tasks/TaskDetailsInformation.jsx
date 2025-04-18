import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Divider, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';
import CircularProgress from '../CircularProgress';
import {Button} from '@mui/material';


const capitailizeFirstLetterOfArray = (str) => {

    str = str.toLocaleString()
    const splittedStrAsArray = str.split(";")
    const newStr = splittedStrAsArray.map(label => label.charAt(0).toUpperCase() + label.toLowerCase().slice(1))
    return newStr.toLocaleString()
}


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
        <div>
            <div className="relative flex flex-wrap" onMouseEnter={(e) => handleEditIconVisibility('initial')} onMouseLeave={(e) => handleEditIconVisibility('none')}>

                <table className="table-fixed">

                    <tbody>
                        <tr><td className="text-[20px] font-medium p-2 w-full">About This Task</td></tr>
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
                            <td className="p-2">{task.labels && capitailizeFirstLetterOfArray(task.labels)}</td>
                        </tr>

                        <tr>
                            <th className="text-left p-2 font-semibold">Total number of sentences</th>
                            <td className="p-2">{task.total_sentences}</td>
                        </tr>
                        <tr>
                            <th className="text-left p-2 font-semibold">Collaborators</th>
                            <td className="p-2">{task.collaborators.length}</td>
                        </tr>

                    </tbody>
                </table>
                <div className="progress flex flex-wrap justify-center items-center gap-5 m-auto ">
                    <h1 className="text-[20px] font-medium p-2 w-full">Progress</h1>
                    <div className="annotated p-3 flex justify-center items-center gap-3 shadowed flex-col w-50" style={{
                        borderRadius: 0,
                        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                    }}>
                        <h1 className='text-[20px] font-semibold'>Annotated</h1>
                        <CircularProgress progress={task.annotatedCount} total={task.total_sentences} label="Annotated" />
                    </div>
                    <div className="annotated p-3 flex justify-center items-center gap-3 shadowed flex-col w-50" style={{
                        borderRadius: 0,
                        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                    }}>
                        <h1 className='text-[20px] font-semibold'>Skipped</h1>
                        <CircularProgress progress={task.skippedCount} total={task.total_sentences} label="Skipped" />
                    </div>
                </div>

                <Tooltip title='Edit this task' >
                    <IconButton size='small' sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        display: isSmallScreen ? 'initial' : editIconVisibility
                    }}>
                        <EditRoundedIcon fontSize='small' />
                    </IconButton>
                </Tooltip>

            </div>
        </div>

    )
}
