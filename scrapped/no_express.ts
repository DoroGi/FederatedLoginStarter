import { createServer, ServerResponse } from 'http'
import { readFile } from 'fs';

interface Credentials {
    username: string
    password: string
}

const parseCredentials = (stream: Uint8Array[]) =>
    Buffer.concat(stream).toString()

const sendLoginPage = (res: ServerResponse) => {
    readFile('src/page.html', (err, data) => {
        if (err) res.writeHead(404)
        else {
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(data)
        }
        res.end()
    })
}

const server = createServer((req, res) => {
    if (req.url === '/healthcheck')
        res.writeHead(200).end()
    else if (req.url === '/login') {
        if (req.method === 'GET') {
            sendLoginPage(res)
        }
        else res.writeHead(405).end()
    }
    else if (req.url === '/auth') {
        if (req.method === 'POST') {
            if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
                const chunks: Uint8Array[] = []
                req.on('data', chunk => chunks.push(chunk))
                req.on('end', () => {
                    try {
                        const creds = parseCredentials(chunks)
                        console.log(creds)
                        //call adfs
                        res.writeHead(200).end()
                    }
                    catch(e) {
                        console.log(e)
                        res.writeHead(400).end()
                    }
                })
            }
            else res.writeHead(415).end()
        }
        else res.writeHead(405).end()
    }
    else res.writeHead(404).end()
})

const port = 3000
server.listen(port, () => { console.log(`Listening on port ${port}`)})
