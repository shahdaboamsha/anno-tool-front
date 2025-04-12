import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import clsx from "clsx";
import QuickDialog from "../Dialog";
import ShareTaskForm from "./ShareTaskForm"; // assuming you have it
import {Tooltip} from "@mui/material";

export default function AssignedTasks({ assignedTasks }) {

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showShareForm, setShowShareForm] = useState(false);

    const open = Boolean(anchorEl);

    const handleClick = (event, task) => {
        setAnchorEl(event.currentTarget);
        setSelectedTask(task);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openShareDialogForm = () => {
        setShowShareForm(true);
        setAnchorEl(null);
    };

    return (
        <div className="relative overflow-x-auto shadow-md bg-white mt-2">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-md text-black bg-gray-100 font-bold">
                    <tr>
                        <th scope="col" className="px-6 py-3">Task ID</th>
                        <th scope="col" className="px-6 py-3">Task name</th>
                        <th scope="col" className="px-6 py-3">Type</th>
                        <th scope="col" className="px-6 py-3">Progress</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                        <th scope="col" className="px-8 py-4">
                            <MoreVertIcon />
                        </th>
                    </tr>
                </thead>
                {
                    assignedTasks.length !== 0 &&
                    <tbody className="text-black">
                        {
                            assignedTasks.map((task, index) => (
                                <tr key={index} className={clsx(
                                    "bg-white border-gray-200 text-gray-500",
                                    index + 1 === assignedTasks.length ? "border-b" : ""
                                )}>
                                    <td className="px-6 py-4">{task.task_id}</td>
                                    <td className="px-6 py-4">{task.task_name}</td>
                                    <td className="px-6 py-3">{task.task_type}</td>
                                    <td className="px-6 py-3">{task.progress[0]}/{task.progress[1]}</td>
                                    <td className="px-6 py-3">$2999</td>
                                    <td className="px-6 py-3">
                                        <Tooltip title='Options'>
                                            <IconButton
                                                aria-label="more"
                                                onClick={(e) => handleClick(e, task)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                }
            </table>

            {/* Menu outside the loop */}
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: 80 * 4.5,
                            width: '20ch',
                        },
                    },
                }}
            >
                <MenuItem onClick={openShareDialogForm}>
                    <PersonAddAltIcon sx={{ mr: 2 }} /> Share {selectedTask?.task_name}
                </MenuItem>
            </Menu>

            {/* QuickDialog outside the loop */}
            <QuickDialog
                openState={showShareForm}
                setOpenState={setShowShareForm}
                component={<ShareTaskForm key={selectedTask?.task_name} taskName={selectedTask?.task_name} taskId={selectedTask?.task_id} nextState='OPEN' />}

            />
        </div>
    );
}
