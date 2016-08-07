export interface UpConfigSettings {
  createTableOfContents?: boolean

  documentName?: string

  defaultUrlScheme?: string
  baseForUrlsStartingWithSlash?: string
  baseForUrlsStartingWithHashMark?: string

  i18n?: {
    idWordDelimiter?: string

    terms?: {
      table?: string
      chart?: string
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
      tableOfContents?: string
      itemReferencedByTableOfContents?: string

      [term: string]: string
    }
  }
}
