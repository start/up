export interface UpConfigSettings {
  documentName?: string
  
  defaultUrlScheme?: string
  baseForUrlsStartingWithSlash?: string
  baseForUrlsStartingWithFragmentIdentifier?: string

  i18n?: {
    idWordDelimiter?: string

    terms?: {
      image?: string
      audio?: string
      video?: string
      spoiler?: string
      toggleSpoiler?: string
      nsfw?: string
      toggleNsfw?: string
      nsfl?: string
      toggleNsfl?: string
      footnote?: string
      footnoteReference?: string
      
      [term: string]: string
    }
  }
}
