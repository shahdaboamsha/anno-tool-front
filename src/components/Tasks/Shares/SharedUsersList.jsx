import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import BlockIcon from "@mui/icons-material/Block";
import { IconButton, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as swals from "../../Public/Swals";
import ResponseMessage from "../../../utils/ResponsesMessage";
import SessionController from "../../../utils/SessionController";
axios.defaults.withCredentials = true;
export default function SharedUsersList({
  sharedUsers,
  taskId,
}) {
  const navigate = useNavigate();
  const [sharedWith, setSharedWith] = React.useState(sharedUsers);
  const [alertMsg, setAlertMsg] = React.useState({
    isError: false,
    message: null,
  });

  const removeUserFromAccess = async (user) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/tasks/${taskId}/collaborators/${user.user_id}`;

      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` } }
      axios.defaults.withCredentials = true;
      swals.removeUserFromShareSwal(url, config, user.name);


    } catch (error) {
      if (error.code == "ERR_NETWORK") {
        setAlertMsg({ isError: true, message: ResponseMessage.ERR_NETWORK_MSG });
      } else if (error.response.status === 401) {
        const refreshError = await SessionController.refreshToken();
        if (refreshError instanceof Error) {
          localStorage.removeItem("ACCESS_TOKEN");
          navigate("/signin", {
            state: { message: ResponseMessage.UN_AUTHORIZED_MSG },
          });
        } else {
          removeUserFromAccess(user);
        }
      } else {
        setAlertMsg({
          isError: true,
          message:
            ResponseMessage.INTERNAL_SERVER_ERROR_MSG
        });
      }
    }
  };

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {alertMsg.message && (
        <Alert severity={alertMsg.isError ? "error" : "success"}>
          {alertMsg.message}
        </Alert>
      )}
      {sharedWith.map((user, index) => (
        <React.Fragment key={user.email + index}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={user.name} src="/static/images/avatar/2.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={`${user.name} ${user.role === "owner" ? " (You)" : ""}`}
              secondary={user.email}
            />
            {user.role !== "owner" && (
              <IconButton onClick={() => removeUserFromAccess(user)}>
                <BlockIcon color="error" />
              </IconButton>
            )}
          </ListItem>
          {index !== sharedWith.length - 1 && (
            <Divider variant="inset" component="li" />
          )}
        </React.Fragment>
      ))}
    </List>
  );
}
