import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectMessages, fetchMessages } from '../store/messagesSlice.ts';
import { Typography, List, ListItem, Avatar, CardMedia } from '@mui/material';

const MessageList: React.FC = () => {
    const messages = useSelector(selectMessages);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMessages());
    }, [dispatch]);

    return (
        <div sx={{ marginTop: 2 }}>
            <Typography variant="h5">Messages</Typography>
            <List>
                {messages.map((message) => (
                    <ListItem sx={{ display: 'flex', alignItems: 'flex-start' }} key={message.id}>
                        <Avatar sx={{ marginRight: 2 }} alt="Author Avatar">
                            {message.author.charAt(0)}
                        </Avatar>
                        <div>
                            <strong>{message.author || 'Anonymous'}:</strong> {message.message}
                        </div>
                        {message.image && (
                            <CardMedia
                                component="img"
                                alt="Message Image"
                                height="140"
                                src={message.image}
                                sx={{ marginLeft: 2 }}
                            />
                        )}
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default MessageList;