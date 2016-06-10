export interface UpConfigSettings {
  documentName?: string
  
  defaultUrlScheme?: string
  baseForUrlsStartingWithSlash?: string

  i18n?: {
    idWordDelimiter?: string

    terms?: {
      image?: string
      audio?: string
      video?: string
      spoiler?: string
      toggleSpoiler?: string
      footnote?: string
      footnoteReference?: string
      
      [term: string]: string
    }
  }
}
