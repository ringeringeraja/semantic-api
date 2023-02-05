import type { ApiContext } from '../types'
import { getResourceFunction } from './assets'

export default async (context: Pick<ApiContext, 'descriptions' | 'apiConfig'>) => {
  return getResourceFunction('meta@describeAll', 'controllable')({ noSerialize: true }, context as ApiContext)
}
