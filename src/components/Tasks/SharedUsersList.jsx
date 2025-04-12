import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import BlockIcon from '@mui/icons-material/Block';
import { IconButton } from '@mui/material';


export default function SharedUsersList({sharedUsers}) {

    const removeUserFromAccess = (email) => {
        alert(email);
    };

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {sharedUsers.map((user, index) => (
                <React.Fragment key={user.email}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={user.userName} src="/static/images/avatar/2.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                            primary={user.userName}
                            secondary={user.email}
                        />
                        <IconButton onClick={() => removeUserFromAccess(user.email)}>
                            <BlockIcon color="error" />
                        </IconButton>
                    </ListItem>
                    {index !== sharedUsers.length - 1 && (
                        <Divider variant="inset" component="li" />
                    )}
                </React.Fragment>
            ))}
        </List>
    );
}
