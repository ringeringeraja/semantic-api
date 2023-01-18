import { COLLECTION_PRESETS, STORE_EFFECTS, } from '../constants'
import type { ApiFunction } from '../../api/types'
import type { Model } from '../../api/database'
import type { Property } from './jsonschema'

export type CollectionPresets = typeof COLLECTION_PRESETS[number]

export type StoreEffect = keyof typeof STORE_EFFECTS
export type CollectionId = string

export type CollectionAction = Readonly<{
  name: string
  icon?: string
  ask?: boolean
  selection?: boolean
  effect?: StoreEffect

  // route namespace
  fetchItem?: boolean
  clearItem?: boolean
}>

export type CollectionActions = Record<string, null|CollectionAction>
export type MaybeCollectionAction = Omit<CollectionAction, 'effect'> & { effect?: string }
export type MaybeCollectionActions = Record<string, null|MaybeCollectionAction>

export type FormLayout = {
  span: number
  verticalSpacing: number
}

export type CollectionOptions = {
  queryPreset?: {
    filters?: Record<string, any>
    sort?: Record<string, any>
  }
}

export type LayoutName =
  'tabular'
  | 'grid'

export type LayoutOptions = {
  picture?: string
  title?: string
  description?: string
}

export type Layout = {
  name: LayoutName
  options?: LayoutOptions
}

export type Description = {
  $id: CollectionId
  title?: string
  categories?: Array<string>

  model?: Model<any>
  functions?: Record<string, ApiFunction<any, any>>

  alias?: string
  icon?: string
  options?: CollectionOptions

  indexes?: Array<string>

  // modifiers
  strict?: boolean // all properties are required
  owned?: boolean
  alwaysOwned?: boolean
  report?: boolean

  // takes an array of something
  route?: Array<string>
  presets?: Array<CollectionPresets>
  required?: Array<string>
  table?: Array<string>
  tableMeta?: Array<string>
  reportProperties?: Array<string>

  form?: Array<string>|Record<string, Array<string>>
  writable?: Array<string>
  filters?: Array<string|{
    property: string
    default: string
  }>

  layout?: Layout
  formLayout?: Record<string, Partial<FormLayout>>|object
  tableLayout?: Record<string, any>|object

  // actions
  actions?: CollectionActions
  individualActions?: CollectionActions

  searchable?: {
    picture?: string
    indexes: Array<string>
    actions?: Record<string, CollectionAction>
  }

  properties: Record<string, CollectionProperty>
}

export type MaybeDescription = Omit<Description,
  '$id'
  | 'name'
  | 'properties'
  | 'required'
  | 'form'
  | 'indexes'
  | 'presets'
  | 'actions'
  | 'individualActions'
> & {
  $id: string
  name?: string
  required?: ReadonlyArray<string>
  form?: ReadonlyArray<string>|Record<string, ReadonlyArray<string>>
  indexes?: ReadonlyArray<string>
  presets?: ReadonlyArray<string>
  properties?: Record<string, any>
  actions?: MaybeCollectionActions
  individualActions?: MaybeCollectionActions
}

export type CollectionProperty = Property
  & { [P in keyof CollectionPropertyAux as `s$${P}`]: CollectionPropertyAux[P] }

export type PropertyElement =
  'select'
  | 'checkbox'
  | 'radio'
  | 'textarea'

export type PropertyInputType =
  'text'
  | 'email'
  | 'password'
  | 'search'

type CollectionPropertyAux = {
  icon?: string
  element?: PropertyElement
  inputType?: PropertyInputType
  placeholder?: string
  hint?: string
  mask?: string
  translate?: boolean
  meta?: boolean
  form?: Array<string>

  noForm?: boolean
  unique?: boolean
  hidden?: boolean
  purge?: boolean

  /** @see SvFile */
  readonly accept?: Array<string>

  isReference?: boolean
  isFile?: boolean
  referencedCollection?: string
  preventPopulate?: boolean
  noId?: boolean

  array?: boolean
  limit?: number
  indexes?: Array<string>
  select?: Array<string>
  maxDepth?: number
  inline?: boolean
  inlineEditing?: boolean
}
