import { UserProvidedTerms } from './UserProvidedTerms'


export interface UserProvidedSettings {
  createTableOfContents?: boolean
  createSourceMap?: boolean
  writeUnsafeContent?: boolean
  documentName?: string
  defaultUrlScheme?: string
  baseForUrlsStartingWithSlash?: string
  baseForUrlsStartingWithHashMark?: string

  terms?: UserProvidedTerms
}
