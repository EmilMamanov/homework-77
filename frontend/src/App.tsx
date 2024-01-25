import React from 'react';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';
import { useDispatch } from 'react-redux';
import { sendMessage } from './store/messagesSlice.ts';

const App: React.FC = () => {
    const dispatch = useDispatch();

    const onSendMessage = async (formData: FormData) => {
        try {
            const response = await dispatch(sendMessage(formData));
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <h1>Board</h1>
            <MessageList />
            <MessageForm onSendMessage={onSendMessage} />
        </div>
    );
};

export default App;
