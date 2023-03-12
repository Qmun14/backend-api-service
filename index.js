import express from "express";
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';
import SequelizeStore from 'connect-session-sequelize';
import UserRoute from './routes/UserRoute.js';
import ProductRoute from './routes/ProductRoute.js';
import AuthRoute from './routes/AuthRoute.js';
dotenv.config()

const URL = '/api/v1';

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

// (async () => {
//     await db.sync()
// })();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'welcome api ADMIN-DASHBOARD [{created_by : Qmun14}] for some running project!',
        version: '1.0.1'
    })
})

app.use(`${URL}`, UserRoute);
app.use(`${URL}`, ProductRoute);
app.use(`${URL}`, AuthRoute);

// store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running!');
});
