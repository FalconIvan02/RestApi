import express, { json } from 'express'
import { randomUUID } from 'node:crypto'
import movies, { filter, find, push, findIndex, splice } from './movies.json'
const app = express()
import cors from 'cors'
import { validateMovie, validatePartialMovie } from './schemas/movies'

app.use(json())
app.use(cors())
app.disable('x-powered-by')

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to my page' })
})
// Todos los recursos que sean MOVIES se identifica con /movies
app.get('/movies', (req, res) => {
    const { genre } = req.query
    if (genre) {
        const filteredMovies = filter((movie) => movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()))
        return res.json(filteredMovies)
    }
    res.json(movies)
})

// Recuperar peliculas por ID
app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = find((movie) => movie.id === id)
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
        id: randomUUID(),
        ...result.data
    }

    //Esto no seria Rest, porque estamos guardando el estado en memoria
    push(newMovie)

    res.status(201).json(newMovie)
})

// Eliminar peliculas
app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = findIndex((movie) => movie.id === id)

    if (!movieIndex < 0) return res.status(404).json({ message: 'Movie not found' })

    splice(movieIndex, 1)

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
    const movieIndex = findIndex((movie) => movie.id === id)

    if (!movieIndex < 0) return res.status(404).json({ message: 'Movie not found' })

    const updatedMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updatedMovie

    return res.json(updatedMovie)
})
const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`)
})
