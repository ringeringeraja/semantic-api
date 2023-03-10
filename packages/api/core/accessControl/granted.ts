import type { FunctionPath, ApiContext, Role } from '../../types'
import { deepMerge } from '../../../common'
import baseRoles from './baseRoles'

const internalIsGranted = (
  functionPath: FunctionPath,
  context: ApiContext,
  baseRole?: Role
) => {
  const [resourceName, functionName] = functionPath.split('@')

  const userRoles: Array<string> = context.token?.user?.roles || ['guest']
  return userRoles.some((roleName) => {
    const currentRole = Object.assign({}, baseRole)
    deepMerge(currentRole, context.accessControl.roles?.[roleName]||{})

    if( !currentRole ) {
      return false
    }

    const subject = currentRole?.capabilities?.[resourceName]
    if( subject?.blacklist?.includes(functionName) ) {
      return false
    }

    const allowedInToken = !context.token.allowed_functions || (
      context.token.allowed_functions.includes(functionPath)
    )

    return allowedInToken
      && (!currentRole.forbidEverything || subject?.functions?.includes(functionName))
      && (
        currentRole?.grantEverything
        || subject?.grantEverything
        || subject?.functions?.includes(functionName)
      )
  })
}

export const isGranted = (
  functionPath: FunctionPath,
  context: ApiContext
) => {
  const baseRole = context.token?.user?._id
    ? baseRoles.authenticated
    : baseRoles.unauthenticated

  return internalIsGranted(functionPath, context, baseRole)
}
