import path from 'path'

// Since it updates itself, but runs from dist, go up one directory
export const LOCATION = path.join(process.cwd(), '..')
