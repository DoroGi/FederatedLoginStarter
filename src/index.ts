import express from 'express'
import { urlencoded } from 'body-parser'

const app = express()
const port = 3000

app.get('/healthcheck', (req, res) => res.sendStatus(200))

app.get('/login', (req, res) => res.sendFile('page.html', {root: __dirname }))

app.post('/auth', urlencoded({extended:false}), (req,res) => {
    if (typeof req.body.username === 'string' && typeof req.body.password === 'string') {
        //call identity provider
        res.sendStatus(200)
    }
    else res.sendStatus(400)
})

app.listen(port, () => { console.log(`Listening on port ${port}`)})
