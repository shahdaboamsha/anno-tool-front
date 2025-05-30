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
import * as swals from "../../Public/Swals";
axios.defaults.withCredentials = true;


export default function SharedUsersList({ sharedUsers, taskId }) {

  const removeUserFromAccess = async (user) => {
    await swals.confirmationSwal(
      'delete',
      `${import.meta.env.VITE_API_URL}/tasks/${taskId}/collaborators/${user.user_id}`,
      `Are you sure you want to remove ${user.name} from access this task?`,
      'User removed',
      'Error with removing user. Try again',
      {},
      () => { },
    )
  }

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {sharedUsers.map((user, index) => (
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
          {index !== sharedUsers.length - 1 && (
            <Divider variant="inset" component="li" />
          )}
        </React.Fragment>
      ))}
    </List>
  );
}
