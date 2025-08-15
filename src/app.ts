import cors from 'cors';
import express, {Request, Response} from 'express';
// import { UserRoutes } from './app/modules/user/user.route';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middewars/globalErrorHandler';
import notFound from './app/middewars/notFound';
import cookieParser from 'cookie-parser';

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(cors())
// app.use('/api/v1/user', UserRoutes)

//create routes folder for better code reading
app.use('/api/v1', router)

app.get('/', async (req : Request, res : Response)=>{
    res.status(200).json({
        message : 'welcome to ph tour managment server'
    })
})

// global error handler --> moved middleware folder for code organization

app.use(globalErrorHandler)

app.use(notFound)

export default app