export interface Message {
    id: string;
    message: string;
    author: string;
}

export interface MessageMutation {
    id: string;
    message: string;
    author: string;
    image: File | null;
}