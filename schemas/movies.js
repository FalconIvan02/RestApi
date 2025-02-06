const z = require('zod')
const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required'
    }),
    genre: z.array(z.string(), {
        required_error: 'Movie genre is required.',
        invalid_type_error: 'Movie genre must be an array of strings'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    }),
    duration: z.number().int().positive().default(0)
})

function validateMovie(object) {
    return movieSchema.safeParse(object)
}

function validatePartialMovie(object) {
    return movieSchema.partial().safeParse(object)
}

module.exports = { validateMovie, validatePartialMovie }
