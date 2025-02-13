import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

export const moviesRouter = Router()

// Todos los recursos que sean MOVIES se identifica con /movies
moviesRouter.get('/', MovieController.getAll)

// Recuperar peliculas por ID
moviesRouter.get('/:id', MovieController.getById)

// Crear peliculas
moviesRouter.post('/', MovieController.create)
// Eliminar peliculas
moviesRouter.delete('/:id', MovieController.delete)

// Actualizar peliculas
moviesRouter.patch('/:id', MovieController.update)
