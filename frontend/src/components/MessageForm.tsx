import React, { useState } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FileInput from "./FileInput.tsx";
import { MessageMutation } from "../types";

interface MessageInputProps {
    onSendMessage: (message: string, author: string) => void;
}

const MessageForm: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [state, setState] = useState<MessageMutation>({
        id: '',
        message: '',
        author: '',
        image:  null,
    });

    const [message, setMessage] = useState('');
    const [author, setAuthor] = useState('');
    const [messageError, setMessageError] = useState<string>('');
    const [authorError, setAuthorError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            setMessageError('Message cannot be empty');
            return;
        } else {
            setMessageError('');
        }

        if (!author.trim()) {
            setAuthorError('Author cannot be empty');
            return;
        } else {
            setAuthorError('');
        }

        const formData = new FormData();
        formData.append('id', '');
        formData.append('message', message);
        formData.append('author', author);

        if (state.image) {
            formData.append('image', state.image);
        }

        onSendMessage(formData);
        setMessage('');
        setAuthor('');
        setState({ ...state, image: null });
    };

    const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files) {
            setState(prevState => ({
                ...prevState,
                [name]: files[0],
            }));
        }
    };

    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Send a Message
            </Typography>
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField
                        label="Message"
                        variant="outlined"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        error={Boolean(messageError)}
                        helperText={messageError}
                        InputProps={{
                            startAdornment: (
                                <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
                            ),
                        }}
                    />
                </div>
                <div>
                    <TextField
                        label="Author"
                        variant="outlined"
                        fullWidth
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        error={Boolean(authorError)}
                        helperText={authorError}
                        InputProps={{
                            startAdornment: (
                                <MailOutlineIcon fontSize="small" sx={{ mr: 1 }} />
                            ),
                        }}
                    />
                </div>

                <Grid sx={{ mt: 2 }} item xs>
                    <FileInput
                        onChange={fileInputChangeHandler}
                        name="image"
                        label="Message image"
                    />
                </Grid>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    sx={{ mt: 2 }}
                >
                    Send
                </Button>
            </form>
        </div>
    );
};

export default MessageForm;
