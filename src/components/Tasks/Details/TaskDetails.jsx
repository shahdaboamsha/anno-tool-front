import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Divider, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import CircularProgress from '../CircularProgress';
import QuickDialog from '../../Public/QuickDialog';
import EditTask from '../Edit/EditTask';
import { useMemo } from 'react';
import clsx from 'clsx';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver'
import { optionSwal, swalDialog } from '../../Public/Swals';

const capitailizeFirstLetterOfArray = (str) => {
    str = str.toLocaleString()
    const splittedStrAsArray = str.split(";")
    const newStr = splittedStrAsArray.map(label => label.charAt(0).toUpperCase() + label.toLowerCase().slice(1))
    return newStr.toLocaleString().split(",").join(", ")
}

export default function TaskDetails({ task, taskFiles }) {

    const { userData } = useOutletContext()

    const isCollab = task?.collaborators.find(collab => collab.email === userData.email)
    const [editDialogState, setEditDialogState] = useState(false)
    const setOpenState = () => setEditDialogState(!editDialogState)


    const exportFile = async (format = 'csv') => {
        try {
            const format = await optionSwal("Export annotation data", "Please select the format you want to export the final labels in", ['Excel', 'CSV'])
            
            if (!format) return
            const url = `${import.meta.env.VITE_API_URL}/assignsample/${task.task_id}/export-final-labels?format=${format}`;
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
            };

            const response = await axios.get(url, {
                headers,
                responseType: 'blob',
            });
            console.log(response)
            const blob = new Blob([response.data], {
                type:
                    format === 'excel'
                        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        : 'text/csv;charset=utf-8',
            });

            const filename = format === 'excel' ? 'final_labels.xlsx' : 'final_labels.csv';

            saveAs(blob, filename);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }
     const calculateDeadlineDate = (deadline) => {

        if (isNaN(deadline) || deadline === '') return ''

        const today = new Date()
        const newDate = new Date(today)
        newDate.setDate(today.getDate() + parseInt(deadline))

        const day = String(newDate.getDate()).padStart(2, '0')
        const month = String(newDate.getMonth() + 1).padStart(2, '0')
        const year = newDate.getFullYear()

        return `${day}/${month}/${year}`
    }
    return (
        <>
            {
                task != null &&
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
                                    <th className="text-left p-2 font-semibold">Deadline</th>
                                    <td className="p-2">{calculateDeadlineDate(task.deadline) || "-"}</td>
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
                                    <td className="p-2">{task.task_description || "-"}</td>
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
                                    <th className="text-left p-2 font-semibold">Annotated Sentences</th>
                                    <td className="p-2">{task.annotatedCount}</td>
                                </tr>
                                <tr>
                                    <th className="text-left p-2 font-semibold">Skipped Sentences</th>
                                    <td className="p-2">{task.skippedCount}</td>
                                </tr>
                                <tr>
                                    <th className="text-left p-2 font-semibold">Collaborators</th>
                                    <td className="p-2">{task.collaborators.length}</td>
                                </tr>
                                <tr>
                                    <th className="text-left p-2 font-semibold">Task Status</th>
                                    <td className={clsx("p-2", task.annotatedCount == task.total_sentences*0.1 ? 'text-green-600' : "text-red-600")}>{task.status}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className='flex justify-end'>
                            <Tooltip title="Download annotated sentences" arrow placement='top'>
                                <h1 className='text-[14px] mt-2 text-center text-blue-500 hover:text-blue-400 cursor-pointer text-underlined' onClick={exportFile}>Export</h1>
                            </Tooltip>
                        </div>
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

                    {!isCollab &&
                        <Tooltip title='Edit this task' >
                            <IconButton size='small' sx={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                            }} onClick={setOpenState}>
                                <EditRoundedIcon fontSize='small' />
                            </IconButton>
                        </Tooltip>
                    }

                    <QuickDialog
                        component={<EditTask initialData={task} />}
                        openState={editDialogState}
                        setOpenState={setOpenState}
                    />

                </div>
            }
        </>

    )
}
