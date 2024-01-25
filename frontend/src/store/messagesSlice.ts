import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store.ts';
import axiosApi from '../app/axiosApi.ts';

export interface Message {
    id: string;
    author: string;
    message: string;
    image?: string;
}

interface MessagesState {
    messages: Message[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: MessagesState = {
    messages: [],
    status: 'idle',
    error: null,
};

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async () => {
    const response = await axiosApi.get('/messages');
    return response.data as Message[];
});

export const sendMessage = createAsyncThunk('messages/sendMessage', async (newMessage: FormData) => {
    const response = await axiosApi.post<Message>('/messages', newMessage);
    return response.data;
});

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: {
        messages: JSON.parse(localStorage.getItem('messages') || '[]'),
        status: 'idle',
        error: null,
    } as MessagesState,
    reducers: {
        addMessageLocally: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
            localStorage.setItem('messages', JSON.stringify(state.messages));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload);
            });
    },
});

export const { addMessageLocally } = messagesSlice.actions;

export const selectMessages = (state: RootState) => state.messages.messages;
export const selectMessagesStatus = (state: RootState) => state.messages.status;
export const selectMessagesError = (state: RootState) => state.messages.error;

export default messagesSlice.reducer;
