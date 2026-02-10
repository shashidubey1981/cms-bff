import { Router, Request, Response } from 'express'
import { getEntries } from '../contentstack'

const router = Router()

/**
 * GET /api/entries/:contentTypeUid
 * Fetch all entries from a specific content type
 * 
 * Query parameters:
 * - locale: string (required)
 * - referenceFieldPath: string[] (comma-separated, optional)
 * - jsonRtePath: string[] (comma-separated, optional)
 * - limit: number (optional)
 * - queryOperator: 'or' (optional)
 * - filterQuery: JSON string (optional)
 */
router.get('/entries', async (req: Request, res: Response) => {
  try {
    const { contentTypeUid, locale, referenceFieldPath, jsonRtePath, limit, queryOperator, filterQuery } = req.query
    
    if (!locale || typeof locale !== 'string') {
      return res.status(400).json({ 
        message: 'Missing required parameter: locale' 
      })
    }

    if (!contentTypeUid || typeof contentTypeUid !== 'string') {
      return res.status(400).json({ 
        message: 'Missing required parameter: contentTypeUid' 
      })
    }

    const referenceFields = referenceFieldPath 
      ? (referenceFieldPath as string).split(',').map(f => f.trim())
      : []
    
    const jsonRtePaths = jsonRtePath 
      ? (jsonRtePath as string).split(',').map(p => p.trim())
      : []

    const limitNum = limit ? parseInt(limit as string, 10) : 0

    let query: { queryOperator?: string; filterQuery?: any } = {}
    if (queryOperator) {
      query.queryOperator = queryOperator as string
    }
    if (filterQuery) {
      try {
        query.filterQuery = JSON.parse(filterQuery as string)
      } catch (e) {
        return res.status(400).json({ 
          message: 'Invalid filterQuery JSON format' 
        })
      }
    }

    const entries = await getEntries(
      contentTypeUid as string,
      locale as string)

    res.json({
      success: true,
      data: entries,
      count: entries?.length || 0
    })
  } catch (error: any) {
    console.error('Error fetching entries:', error)
    if (error === '404 | Not found' || error?.message?.includes('404')) {
      return res.status(404).json({ 
        message: 'Entries not found' 
      })
    }
    res.status(500).json({ 
      error: 'Internal server error',
      message: error?.message || 'Failed to fetch entries'
    })
  }
})


export default router

