import 'dotenv/config'  

import express from 'express'

import mongoose from 'mongoose';

import cors from 'cors'
import bodyParser from 'body-parser'

import mainRouter from './routes/main.router.js'

import { Server } from 'socket.io';
import http from 'http'

startServer()

function startServer () {
    const app = express()
    const PORT = process.env.PORT
    
    async function main() {
        await mongoose.connect(process.env.MONGOOSE_URI)
    }

    app.use(bodyParser.json())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors({ origin: true | '*', credentials: true }))

    main()
     .then(() => {
        console.log("Connected to mongo database");
     })
     .catch((error) => {
        console.log('### MONGOOSE CONNECTION ERROR:')
        console.log(error);
     });
    
    app.get('/', (req, res) => res.send('Health check - Good'))
    
    //All Routes Shifted to ./main.router.js
    app.use('/api', mainRouter)

    let user = 'test'
    const httpServer = http.createServer(app)
    const io = new Server(httpServer, {cors: { origin: '*', methods: ['GET', 'POST'] }})
    
    io.on('connection', (socket) => {
        socket.on('joinRoom', (userId) => {
            user = userId
            console.log('==========')
            console.log(user)
            console.log('==========')
            socket.join(userId)
        })
    })

    const db = mongoose.connection

    db.once('open', async () => {
        console.log('CRUD operations active')
    })

    httpServer.listen(PORT, () => console.log(`App is listeing to port ${PORT}`))

   app.use((err, req, res, next) => {
        console.error(err);

        // Validation library errors (Zod, Joi, etc.)
        if (err.name === 'ZodError') {
            return res.status(400).json({
                success: false,
                message: err.issues[0].message
            });
        }

        // Mongo duplicate key error
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(409).json({
                success: false,
                message: `${field} already exists`
            });
        }

        // Cast / ObjectId errors
        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }

        // Everything else
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    });
}


