import type { ApiContext, ApiContextWithAC, MongoDocument } from '../../types'
import { getResourceAsset } from '../assets'
import { useAccessControl } from '../accessControl/use'
import useFunctions from './functions'

export const useCollection = <T extends MongoDocument>(collectionName: string, _context: ApiContext|null = null) => {
  const context = _context || {} as ApiContext

  const description = getResourceAsset(collectionName, 'description')
  const originalCollectionName = description.alias || collectionName

  const model = getResourceAsset(originalCollectionName, 'model')

  if( !description ) {
    throw new Error(
      `description of ${collectionName} not found`
    )
  }

  const acFunctions = useAccessControl(description, context)
  const contextWithAC: ApiContextWithAC = {
    ...context,
    resourceName: collectionName,
    acFunctions
  }

  const functions = useFunctions<T>(
    model,
    description,
    contextWithAC
  )

  return {
    ...functions,
    model
  }
}
