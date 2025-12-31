import { Router, Request, Response } from 'express'
import { getEntries, getEntryByUrl } from '../contentstack'
import { initializePersonalizationSDK, getPersonalizationSDKData } from '../utils/personalization'
import { getOrCreateAnonId } from '../utils/anonimus'

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
      console.log('local is missing', locale)
      return res.status(400).json({ 
        error: 'Missing required parameter: locale' 
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
          error: 'Invalid filterQuery JSON format' 
        })
      }
    }

    const entries = await getEntries(
      contentTypeUid as string,
      locale as string,
      referenceFields as string[],
      jsonRtePaths as string[],
      query,
      undefined, // personalizationSDK - can be extended later
      limitNum
    )

    res.json({
      success: true,
      data: entries,
      count: entries?.length || 0
    })
  } catch (error: any) {
    console.error('Error fetching entries:', error)
    if (error === '404 | Not found' || error?.message?.includes('404')) {
      return res.status(404).json({ 
        error: 'Entries not found' 
      })
    }
    res.status(500).json({ 
      error: 'Internal server error',
      message: error?.message || 'Failed to fetch entries'
    })
  }
})

/**
 * GET /api/entry/:contentTypeUid
 * Fetch a single entry by URL
 * 
 * Query parameters:
 * - locale: string (required)
 * - entryUrl: string (required)
 * - referenceFieldPath: string[] (comma-separated, optional)
 * - jsonRtePath: string[] (comma-separated, optional)
 */
router.get('/entrybyurl', async (req: Request, res: Response) => {
  try {
    const { contentTypeUid, locale, entryUrl, referenceFieldPath, jsonRtePath } = req.query
    if (!locale || typeof locale !== 'string') {
      return res.status(400).json({ 
        error: 'Missing required parameter: locale' 
      })
    }

    if (!entryUrl || typeof entryUrl !== 'string') {
      return res.status(400).json({ 
        error: 'Missing required parameter: entryUrl' 
      })
    }

    const referenceFields = referenceFieldPath 
      ? (referenceFieldPath as string).split(',').map(f => f.trim())
      : []
    
    const jsonRtePaths = jsonRtePath 
      ? (jsonRtePath as string).split(',').map(p => p.trim())
      : []

    const entry = await getEntryByUrl(
      contentTypeUid as string,
      locale as string,
      entryUrl as string,
      referenceFields as string[],
      jsonRtePaths,
      undefined // personalizationSDK - can be extended later
    )

    res.json({
      success: true,
      data: entry
    })
  } catch (error: any) {
    console.error('Error fetching entry:', error)
    if (error === '404 | Not found' || error?.message?.includes('404')) {
      return res.status(404).json({ 
        error: 'Entry not found' 
      })
    }
    res.status(500).json({ 
      error: 'Internal server error',
      message: error?.message || 'Failed to fetch entry'
    })
  }
})

/**
 * GET /api/personalize-sdk
 * Initialize and return personalization SDK instance for MFE
 * 
 * Query parameters:
 * - projectUid: string (required) - Contentstack Personalize project UID
 * - userAttributes: JSON string (optional) - User attributes for personalization
 */
router.get('/personalize-sdk', async (req: Request, res: Response) => {
  try {
    console.log('req cookies', req.cookies)
    const { category, subcategory } = req.query
    const projectUid = process.env.CONTENTSTACK_PERSONALIZE_PROJECT_UID as string
    const edgeUrl = process.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL as string
    // Parse user attributes if provided
    let parsedUserAttributes: Record<string, any> | undefined
    if (category && subcategory) {
      try {
        parsedUserAttributes = {
          category,
          subcategory
        }
        console.log('parsedUserAttributes', parsedUserAttributes)
      } catch (e) {
        return res.status(400).json({ 
          error: 'Invalid userAttributes JSON format' 
        })
      }
    }
    const anonymousUserId = getOrCreateAnonId(req, res)
    console.log('anonymousUserId', anonymousUserId)
    // Initialize the personalization SDK
    const personalizeSdk = await initializePersonalizationSDK(
      projectUid,
      edgeUrl,
      req,
      parsedUserAttributes,
      anonymousUserId
    )
    
    // Get serializable SDK data
    const sdkData = getPersonalizationSDKData(personalizeSdk)
    console.log('sdkData', sdkData)
    
    // Get or create anonymous user ID (this also sets a cookie)
    
    // Set additional cookie with personalization data for client application
    
    const isProduction = process.env.NODE_ENV === 'production'
    res.cookie('cs-personalize-user-uid', anonymousUserId, {
      httpOnly: false,        // Allow JS to read it
      secure: isProduction,   // Secure in production (false for localhost)
      sameSite: isProduction ? 'lax' : 'lax', // Use 'lax' for both - works for same-origin and top-level navigation
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    })
    
    // Return the initialized SDK instance data
    // Note: The SDK instance itself cannot be serialized to JSON,
    // so we return all the serializable data that the client needs
    res.json({
      success: true,
      projectUid,
      edgeUrl,
      userId: anonymousUserId,
      attributes: parsedUserAttributes ?? {}
    })
  } catch (error: any) {
    console.error('Error initializing personalization SDK:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error?.message || 'Failed to initialize personalization SDK'
    })
  }
})

export default router

