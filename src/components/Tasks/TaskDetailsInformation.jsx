import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Divider, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';
import CircularProgress from '../CircularProgress';
import { Button } from '@mui/material';
import QuickDialog from '../Dialog';
import EditTask from './EditTask';
import { useMemo } from 'react';


const capitailizeFirstLetterOfArray = (str) => {

    str = str.toLocaleString()
    const splittedStrAsArray = str.split(";")
    const newStr = splittedStrAsArray.map(label => label.charAt(0).toUpperCase() + label.toLowerCase().slice(1))
    return newStr.toLocaleString()
}


export default function TaskDetailsInformation({ task }) {

    task = useMemo(() => task, [])
    const [editDialogState, setEditDialogState] = useState(false)
    const setOpenState = () => setEditDialogState(!editDialogState)


    return (
        <div className='relative'>
            <div>
                <h1 className="text-[20px] font-medium p-2 w-full">About This Task</h1>
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
                            <th className="text-left p-2 font-semibold">Description</th>
                            <td className="p-2">{task.task_description}</td>
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
            </div>
            <Divider />
            <div>
                <h1 className="text-[20px] font-medium p-2">Progress</h1>
                <div className="flex gap-10 flex-wrap justify-center">
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

            </div>

            <Tooltip title='Edit this task' >
                <IconButton size='small' sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                }} onClick={setOpenState}>
                    <EditRoundedIcon fontSize='small' />
                </IconButton>
            </Tooltip>

            <QuickDialog
                component={<EditTask initialData={task} />}
                openState={editDialogState}
                setOpenState={setOpenState}
            />

        </div>

    )
}
