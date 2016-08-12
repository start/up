import { ProvidedTerms } from './ProvidedTerms'


export interface ConfigSettings {
  createTableOfContents?: boolean
  createSourceMap?: boolean

  writeUnsafeContent?: boolean

  documentName?: string

  defaultUrlScheme?: string
  baseForUrlsStartingWithSlash?: string
  baseForUrlsStartingWithHashMark?: string

  i18n?: {
    terms?: ProvidedTerms
  }
}
