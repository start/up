import { ConfigSettingsTerms } from './ConfigSettingsTerms'


export interface ConfigSettings {
  createTableOfContents?: boolean
  createSourceMap?: boolean

  writeUnsafeContent?: boolean

  documentName?: string

  defaultUrlScheme?: string
  baseForUrlsStartingWithSlash?: string
  baseForUrlsStartingWithHashMark?: string

  i18n?: {
    wordDelimiterForGeneratedIds?: string

    terms?: ConfigSettingsTerms
  }
}