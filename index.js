const express = require('express')
const app = express()
app.disable('x-powered-by')

app.use(express.json())
// app.use((req, res, next) => {
//     if (req.method !== 'POST') return next()
//     if (req.headers['content-type'] !== 'application/json') return next()

//     // Aca solo llegan request que son POST y que tienen el header content type application json
//     let body = ''

//     req.on('data', (chunk) => {
//         body += chunk.toString()
//     })

//     req.on('end', () => {
//         const data = JSON.parse(body)
//         data.timestamp = Date.now()
//         req.body = data
//         next()
//     })
// })

const PORT = process.env.PORT ?? 3000

app.get('/', (req, res) => {
    res.send('<h1>Bienvenido!</h1>')
})

app.post('/leon', (req, res) => {
    // req.body deberiamos guardar en la base de datos
    res.status(201).json(req.body)
})

app.use('*', (req, res) => {
    res.status(404).send('<h1>404 not found</h1>')
})

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`))
