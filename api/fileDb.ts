import { promises as fs } from 'fs';
import path from 'path';
import { Message } from './types';
import crypto from 'crypto';

const messagesFilePath: string = './messages/messages.json';
const imagesFolderPath: string = './messages/images/';

async function initializeMessagesFile() {
    try {
        await fs.access(messagesFilePath);
    } catch (error) {
        await fs.writeFile(messagesFilePath, '[]', 'utf-8');
    }
}

async function initializeImagesFolder() {
    try {
        await fs.access(imagesFolderPath);
    } catch (error) {
        await fs.mkdir(imagesFolderPath);
    }
}

initializeMessagesFile();
initializeImagesFolder();

const fileDb = {
    async init() {
        await initializeMessagesFile();
        await initializeImagesFolder();
    },

    async saveMessage(message: Message): Promise<void> {
        await initializeMessagesFile();

        const { message: msg, datetime, id, author, image } = message || {};

        const messageId = id || crypto.randomUUID();
        const messageAuthor = author || 'Default Author';

        const messagesContent = await fs.readFile(messagesFilePath, 'utf-8');
        const messages = JSON.parse(messagesContent) as Message[];

        messages.push({ id: messageId, message: msg, datetime, author: messageAuthor, image });

        await fs.writeFile(messagesFilePath, JSON.stringify(messages), 'utf-8');
    },

    async getMessages(): Promise<Message[]> {
        const messagesContent = await fs.readFile(messagesFilePath, 'utf-8');
        const messages = JSON.parse(messagesContent) as Message[];

        return messages.slice(0, 30);
    },

    async getMessagesAfterDate(queryDate: string): Promise<Message[]> {
        const date = new Date(queryDate);

        if (isNaN(date.getDate())) {
            throw new Error('Invalid datetime format');
        }

        const messagesContent = await fs.readFile(messagesFilePath, 'utf-8');
        const messages = JSON.parse(messagesContent) as Message[];

        return messages.filter((message) => new Date(message.datetime) > date).slice(0, 30);
    },

    async deleteImage(imageName: string): Promise<void> {
        const imagePath = path.join(imagesFolderPath, imageName);
        await fs.unlink(imagePath);
    },
};

export default fileDb;
