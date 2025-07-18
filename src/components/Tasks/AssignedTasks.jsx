import { useState } from "react";
import { IconButton, Menu, MenuItem, Tooltip, Alert } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import clsx from "clsx";
import QuickDialog from "../Public/QuickDialog";
import ShareTaskForm from "./Shares/ShareTaskForm";
import { useNavigate } from "react-router-dom";
import * as swals from "../Public/Swals";
import SessionController from "../../utils/SessionController";
import ResponseMessage from "../../utils/ResponsesMessage";

export default function AssignedTasks({ assignedTasks = [], state, notifyChanges }) {

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showShareForm, setShowShareForm] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ isError: false, message: null });

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
  }

  const deleteTask = async () => {

    await swals.confirmationSwal(
      'delete',
      `${import.meta.env.VITE_API_URL}/tasks/${selectedTask.task_id}`,
      `Are you sure you want to Delete "${selectedTask.task_name}" task?`,
      'Task deleted',
      'Error with deleting task. Try again',
      {},
      notifyChanges,
    )

  }

  return (
    <div className="relative overflow-x-auto shadow-md bg-white mt-2">
      {alertMsg.message && (
        <Alert sx={{ m: 1 }} severity={alertMsg.isError ? "error" : "success"}>
          {alertMsg.message}
        </Alert>
      )}

      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-md text-black bg-gray-100 font-bold">
          <tr>
            <th scope="col" className="px-6 py-3">
              Task ID
            </th>
            <th scope="col" className="px-6 py-3">
              Task name
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Progress
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>

            <th scope="col" className="px-8 py-4">
              <MoreVertIcon />
            </th>
          </tr>
        </thead>
        {assignedTasks.length !== 0 && (
          <tbody className="text-black">
            {assignedTasks.map((task, index) => (
              <tr
                key={index}
                className={clsx(
                  "bg-white border-gray-200 text-gray-500",
                  index + 1 === assignedTasks.length ? "border-b" : ""
                )}
              >
                <td className="px-6 py-4">{task.task_id}</td>
                <td className="px-6 py-4">{task.task_name}</td>
                <td className="px-6 py-3">{task.annotation_type}</td>
                <td className="px-6 py-3">
                  {task.status.total_classified}/{task.status.total_sentences}
                </td>
                <td className="px-6 py-3">
                  <Tooltip title="View task">
                    <button
                      className="text-[14px] text-blue-500 hover:text-blue-700 mr-1 cursor-pointer"
                      onClick={() =>
                        navigate(`../viewtask?task_id=${task.task_id}`)
                      }
                    >
                      View
                    </button>
                  </Tooltip>
                  <Tooltip title="Annotate">
                    <button
                      className="text-[14px] text-blue-500 hover:text-blue-700 ml-1 cursor-pointer"
                      onClick={() =>
                        navigate(`../viewtask?task_id=${task.task_id}`, {
                          state: { openDialog: true },
                        })
                      }
                    >
                      Annotate
                    </button>
                  </Tooltip>
                </td>
                <td className="px-6 py-3">
                  <Tooltip title="Options">
                    <IconButton
                      disabled={task.created_by}
                      aria-label="more"
                      onClick={(e) => handleClick(e, task)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>

      {assignedTasks.length == 0 && state == null ? (
        <div className="mt-2 p-2 flex shadow flex-row justify-start align-center items-start text-center">
          <h1 className="text text-[14px] mt-1">
            No tasks assigned yet.{" "}
            <a
              className="text-[14px] text-blue-500 hover:text-blue-700"
              href="new"
            >
              Create new task
            </a>
          </h1>
        </div>
      ) : (
        ""
      )}

      {state ? (
        <div className="mt-2 p-2 flex shadow flex-row justify-start align-center items-start text-center">
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {state}
          </Alert>
        </div>
      ) : (
        ""
      )}

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
              width: "20ch",
            },
          },
        }}
      >
        <MenuItem onClick={openShareDialogForm}>
          <PersonAddAltIcon sx={{ mr: 1 }} fontSize="small" />{" "}
          <h1 className="text text-[14px] mt-1">Share</h1>
        </MenuItem>
        <MenuItem onClick={deleteTask}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />{" "}
          <h1 className="text text-[14px] mt-1">Delete</h1>
        </MenuItem>
      </Menu>

      {/* QuickDialog outside the loop */}
      <QuickDialog
        openState={showShareForm}
        setOpenState={setShowShareForm}
        component={
          <ShareTaskForm
            key={selectedTask?.task_name}
            taskName={selectedTask?.task_name}
            taskId={selectedTask?.task_id}
            nextState="OPEN"
          />
        }
      />
    </div>
  );
}
