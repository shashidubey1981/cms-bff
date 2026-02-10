import _ from 'lodash'
import { EmbeddedItem } from '@contentstack/utils/dist/types/Models/embedded-object'
import { getStack } from './config'
import { pageEntryReferenceIncludes } from './utils/pageReference'

/**
  *
  * fetches all the entries from specific content-type
  * @param {* content-type uid} contentTypeUid
  * @param {* locale} locale
  * @param {* reference field name} referenceFieldPath
  * @param {* Json RTE path} jsonRtePath
  * @param {* containedInQuery} query
  *
  */
export const getEntries = async <T>(contentTypeUid: string, locale: string) => {
    try {    
        let result: { entries: T[] } | null = null
        const Stack = getStack()
        if(!Stack) {
            throw new Error('===== No stack initialization found====== \n check environment variables: \
            CONTENTSTACK_API_KEY, CONTENTSTACK_DELIVERY_TOKEN, CONTENTSTACK_PREVIEW_TOKEN, CONTENTSTACK_PREVIEW_HOST, CONTENTSTACK_ENVIRONMENT')
        }
        const entryQuery = Stack.contentType(contentTypeUid)
            .entry()
            .locale(locale)
            .includeFallback()
            .includeEmbeddedItems()
            .includeReference(pageEntryReferenceIncludes as string[])
            .query()
            

        if (entryQuery) {
            result = await entryQuery
                .addParams({'include_metadata': 'true'})
                .addParams({'include_applied_variants': 'true'})
                .find() as { entries: T[] }

            const data = result?.entries as EmbeddedItem[]

            if (data && _.isEmpty(data?.[0])) {
                throw '404 | Not found'
            }

            return data
        }
    }
    catch (error) {
        console.error('🚀 ~ getEntries ~ error:', error)
        throw error
    }
}

