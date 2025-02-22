import { IMove } from 'dataforged'
import { RANKS } from '../constants'

interface ProgressBase {
  description: string
  rank: keyof typeof RANKS
  current: number
  completed: boolean
}

///////////////////////////////

interface AssetField {
  name: string
  value: string
}

export interface AssetAbility {
  name?: string
  enabled: boolean
  description: string
  hasClock: boolean
  clockMax: number
  clockTicks: number
}

interface AssetExclusiveOption {
  name: string
  selected: boolean
}

interface AssetCondition {
  name: string
  ticked: boolean
}

interface AssetDataSourceData {
  category: string
  description?: string
  requirement: string
  color: string
  fields: AssetField[]
  abilities: AssetAbility[]
  track: {
    enabled: boolean
    name: string
    current: number
    max: number
  }
  exclusiveOptions: AssetExclusiveOption[]
  conditions: AssetCondition[]
}

export interface AssetDataPropertiesData extends AssetDataSourceData {}

export interface AssetDataSource {
  type: 'asset'
  data: AssetDataSourceData
}

export interface AssetDataProperties {
  type: 'asset'
  data: AssetDataPropertiesData
}

///////////////////////////////

interface ProgressDataSourceData extends ProgressBase {
  subtype: string
  starred: boolean
  hasTrack: boolean
  hasClock: boolean
  clockTicks: number
  clockMax: number
}
export interface ProgressDataPropertiesData extends ProgressDataSourceData {}

export interface ProgressDataSource {
  type: 'progress'
  data: ProgressDataSourceData
}
export interface ProgressDataProperties {
  type: 'progress'
  data: ProgressDataPropertiesData
}

///////////////////////////////

interface Bond {
  name: string
  notes: string
}

interface BondsetDataSourceData {
  bonds: Bond[]
}
export interface BondsetDataPropertiesData extends BondsetDataSourceData {}

export interface BondsetDataSource {
  type: 'bondset'
  data: BondsetDataSourceData
}
export interface BondsetDataProperties {
  type: 'bondset'
  data: BondsetDataPropertiesData
}

///////////////////////////////

export interface FeatureOrDanger {
  low: number
  high: number
  description: string
}

export interface DelveThemeDataSourceData {
  summary: string
  description: string
  features: FeatureOrDanger[]
  dangers: FeatureOrDanger[]
}
export interface DelveThemeDataPropertiesData
  extends DelveThemeDataSourceData {}

export interface DelveThemeDataSource {
  type: 'delve-theme'
  data: DelveThemeDataSourceData
}
export interface DelveThemeDataProperties {
  type: 'delve-theme'
  data: DelveThemeDataPropertiesData
}
///////////////////////////////

interface DelveDomainDataSourceData {
  summary: string
  description: string
  features: FeatureOrDanger[]
  dangers: FeatureOrDanger[]
}
export interface DelveDomainDataPropertiesData
  extends DelveDomainDataSourceData {}

export interface DelveDomainDataSource {
  type: 'delve-domain'
  data: DelveDomainDataSourceData
}
export interface DelveDomainDataProperties {
  type: 'delve-domain'
  data: DelveDomainDataPropertiesData
}

///////////////////////////////

export interface SFMoveDataPropertiesData extends IMove {
  dfid: string
}

export interface SFMoveDataSource {
  type: 'sfmove'
  data: SFMoveDataPropertiesData
}
export interface SFMoveDataProperties {
  type: 'sfmove'
  data: SFMoveDataPropertiesData
}

///////////////////////////////

export type ItemDataSource =
  | AssetDataSource
  | ProgressDataSource
  | BondsetDataSource
  | SFMoveDataSource
  | DelveThemeDataSource
  | DelveDomainDataSource
export type ItemDataProperties =
  | AssetDataProperties
  | ProgressDataProperties
  | BondsetDataProperties
  | SFMoveDataProperties
  | DelveThemeDataProperties
  | DelveDomainDataProperties

declare global {
  interface SourceConfig {
    Item: ItemDataSource
  }

  interface DataConfig {
    Item: ItemDataProperties
  }
}
