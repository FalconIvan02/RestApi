import { object as _object, string, array, number } from 'zod'
const movieSchema = _object({
    title: string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required'
    }),
    genre: array(string(), {
        required_error: 'Movie genre is required.',
        invalid_type_error: 'Movie genre must be an array of strings'
    }),
    year: number().int().min(1900).max(2024),
    director: string(),
    rate: number().min(0).max(10).default(5),
    poster: string().url({
        message: 'Poster must be a valid URL'
    }),
    duration: number().int().positive().default(0)
})

function validateMovie(object) {
    return movieSchema.safeParse(object)
}

function validatePartialMovie(object) {
    return movieSchema.partial().safeParse(object)
}

export default { validateMovie, validatePartialMovie }
