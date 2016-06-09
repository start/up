export interface UpConfigSettings {
  documentName?: string
  
  relativeUrlBase?: string

  i18n?: {
    idWordDelimiter?: string

    terms?: {
      image?: string
      audio?: string
      video?: string
      spoiler?: string
      footnote?: string
      footnoteReference?: string
      [term: string]: string
    }
  }
}
