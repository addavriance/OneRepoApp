import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/mydb');

app.listen(3000, () => console.log('server on 3000'))
