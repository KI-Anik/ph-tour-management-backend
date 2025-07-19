import  httpStatus  from 'http-status-codes';
import cors from 'cors';
import express, {Request, Response} from 'express';
// import { UserRoutes } from './app/modules/user/user.route';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middewars/globalErrorHandler';
import notFound from './app/middewars/notFound';
// import { envVars } from './app/config/env';

const app = express()

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
// app.use((err : any, req : Request, res : Response, next : NextFunction)=>{
//     res.status(400).json({
//         success: false,
//         message: `something went wrong ${err.message}, from global error`,
//         err,
//         stack : envVars.NODE_ENV === 'development' ? err.stack : null
//     })
// }) 
app.use(globalErrorHandler)

app.use(notFound)

export default app