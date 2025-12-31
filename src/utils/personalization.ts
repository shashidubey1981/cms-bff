import Personalize from '@contentstack/personalize-edge-sdk'
import { Request } from 'express'
import { Sdk } from '@contentstack/personalize-edge-sdk/dist/sdk'

/**
 * Initialize personalization SDK instance
 * @param projectUid - Contentstack Personalize project UID
 * @param req - Express request object for user context
 * @param userAttributes - Optional user attributes for personalization
 * @returns Initialized SDK instance
 */
export const initializePersonalizationSDK = async (
  projectUid: string,
  edgeUrl: string,
  req: Request,
  userAttributes?: Record<string, any>,
  anonymousUserId?: string
): Promise<Sdk> => {
  try {
    // Initialize the Personalize SDK with the incoming request
    const userId = anonymousUserId ? anonymousUserId : req.cookies['cs-personalize-user-uid']
    const liveAttributes = userAttributes ? userAttributes : {}
    Personalize.setEdgeApiUrl(edgeUrl)
    const personalizeSdk = await Personalize.init(projectUid, { userId, liveAttributes })

    // Set custom user attributes if provided
    // if (userAttributes && Object.keys(userAttributes).length > 0) {
    //   console.log('going to set user attributes', userAttributes)
    //   await personalizeSdk.set(userAttributes)
    // }

    return personalizeSdk
  } catch (error) {
    console.error('Error initializing Personalize SDK:', error)
    throw error
  }
}

/**
 * Get personalization SDK data for client
 * @param personalizeSdk - Initialized SDK instance
 * @returns Serializable SDK data
 */
export const getPersonalizationSDKData = (personalizeSdk: Sdk) => {
  try {
    const variantAliases = personalizeSdk.getVariantAliases() || []
    const experiences = personalizeSdk.getExperiences() || []

    return {
      variantAliases,
      experiences,
      variantIds: variantAliases.join(',')
    }
  } catch (error) {
    console.error('Error getting Personalize SDK data:', error)
    return {
      variantAliases: [],
      experiences: [],
      variantIds: ''
    }
  }
}

