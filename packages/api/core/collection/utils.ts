import * as R from 'ramda'
import type { Description } from '../../../types'
import type { MongoDocument } from '../../types'

export const normalizeProjection = <T>(
  projection: T,
  description: Pick<Description, 'properties'>
) => {
  if( !projection ) {
    return {}
  }

  const target = Array.isArray(projection)
    ? projection.map(prop => [prop, 1])
    : Object.entries(projection)

  return target.reduce((a, [key, value]) => {
    if( !description.properties[key] || description.properties[key].s$hidden ) {
      return a
    }

    return {
      ...a,
      [key]: value
    }
  }, {})
}

export const fill = <T extends MongoDocument>(
  item: T & Record<string, any>,
  description: Pick<Description, 'properties'>
) => {
  if( !item ) {
    return {}
  }

  const missing = Object.entries(description.properties).reduce((a: any, [key, value]) => {
    if( item[key] && !value.s$meta ) {
      return a
    }

    return {
      ...a,
      [key]: null
    }
  }, {})

  return Object.assign(missing, item)
}

export const prepareInsert = (
  payload: any,
  description: Pick<Description,
    'properties'
    | 'form'
    | 'writable'
    | 'owned'
    | 'defaults'
  >
) => {
  const {
    _id,
    created_at,
    updated_at,
    ...rest

  } = payload

  const forbidden = (key: string) => {
    return description.properties[key]?.readOnly
      || (description.writable && !description.writable.includes(key)
    )
  }
  const prepareUpdate = () => Object.entries(rest as Record<string, any>).reduce((a: any, [key, value]) => {
    if( forbidden(key) ) {
      return a
    }

    if(
      ( [undefined, null].includes(value) || R.isEmpty(value) )
        && !Array.isArray(value)
        && !(key in (description.defaults||{}))
    ) {
      a.$unset[key] = 1
      return a
    }

    a.$set[key] = value
    return a

  }, {
    $set: description.defaults || {},
    $unset: {}
  })

  const prepareCreate = () => Object.entries(rest as Record<string, any>).reduce((a: any, [key, value]) => {
    if( forbidden(key) || !value ) {
      return a
    }

    return {
      ...a,
      [key]: value
    }
  }, description.defaults || {})

  const what = typeof _id === 'string'
    ? prepareUpdate()
    : prepareCreate()

  Object.keys(what).forEach(k => {
    if( R.isEmpty(what[k]) ) {
      delete what[k]
    }
  })

  return what
}
