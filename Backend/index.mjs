import express from 'express';
import { retrieveMap } from './utils.mjs';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes.mjs';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/', routes)

app.listen(5000, () => {
    retrieveMap();
    console.log('Server started on port 5000');
});