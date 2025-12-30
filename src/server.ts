import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import contentstackRoutes from './routes/contentstack.routes'

// Load environment variables
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: true, // Allow all origins (or specify your client origin)
  credentials: true // Allow cookies to be sent
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Contentstack BFF'
  })
})

// API Routes
app.use('/api', contentstackRoutes)

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Contentstack BFF API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      entries: '/api/entries/',
      entrybyurl: '/api/entrybyurl',
      personalizeSdk: '/api/personalize-sdk'
    }
  })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Route not found' 
  })
})

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/health`)
  console.log(`📚 API documentation: http://localhost:${PORT}/`)
})

export default app

