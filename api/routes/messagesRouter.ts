import express, { Router } from 'express';
import { Message } from '../types';
import fileDb from '../fileDb';
import crypto from 'crypto';
import { imagesUpload } from '../multer';

const router: Router = express.Router();

router.post('/', imagesUpload.single('image'), async (req, res) => {
    try {
        const { message: text, author } = req.body;

        if (!text || !author) {
            return res.status(400).json({ error: 'Author and message must be present in the request' });
        }

        const datetime = new Date().toISOString();
        const id = crypto.randomUUID();

        const newMessage: Message = {
            id,
            message: text,
            author,
            datetime,
            image: req.file ? req.file.filename : null,
        };

        await fileDb.saveMessage(newMessage);
        res.json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const queryDate = req.query.datetime as string;

        if (queryDate) {
            if (isNaN(new Date(queryDate).getDate())) {
                return res.status(400).json({ error: 'Invalid datetime format' });
            }

            const messages = await fileDb.getMessagesAfterDate(queryDate);
            res.json(messages);
        } else {
            const messages = await fileDb.getMessages();
            res.json(messages);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
