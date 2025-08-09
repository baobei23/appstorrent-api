import dotenv from 'dotenv';

dotenv.config();

import express, { Application, Request, Response } from 'express';
import routes from '@/routes';

const app: Application = express();

app.use(routes);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Appstorrent  API Scraper',
        data: {
            URL: process.env.URL,
        },
    });
});

export default app;
