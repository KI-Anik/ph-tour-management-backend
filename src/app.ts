import express, {Request, Response} from 'express';

const app = express()

app.get('/', async (req : Request, res : Response)=>{
    res.status(200).json({
        message : 'welcome to ph tour managment server'
    })
})

export default app