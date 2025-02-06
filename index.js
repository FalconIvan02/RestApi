const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const app = express()
const cors = require('cors')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

app.use(express.json())
app.use(cors())
app.disable('x-powered-by')

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to my page' })
})
// Todos los recursos que sean MOVIES se identifica con /movies
app.get('/movies', (req, res) => {
    const { genre } = req.query
    if (genre) {
        const filteredMovies = movies.filter((movie) =>
            movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
})

// Recuperar peliculas por ID
app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find((movie) => movie.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
})

// Crear peliculas
app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }

    //Esto no seria Rest, porque estamos guardando el estado en memoria
    movies.push(newMovie)

    res.status(201).json(newMovie)
})

// Eliminar peliculas
app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex((movie) => movie.id === id)

    if (!movieIndex < 0) return res.status(404).json({ message: 'Movie not found' })

    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted' })
})

// Actualizar peliculas
app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const movieIndex = movies.findIndex((movie) => movie.id === id)

    if (!movieIndex < 0) return res.status(404).json({ message: 'Movie not found' })

    const updatedMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updatedMovie

    return res.json(updatedMovie)
})
const PORT = process.env.PORT ?? 3000
module.exports = app
app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`)
})
