export interface UpConfigSettings {
  createTableOfContents?: boolean

  documentName?: string

  defaultUrlScheme?: string
  baseForUrlsStartingWithSlash?: string
  baseForUrlsStartingWithHashMark?: string

  writeUnsafeContent?: boolean

  i18n?: {
    wordDelimiterForGeneratedIds?: string

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
      partOfDocumentReferencedByTableOfContents?: string

      [term: string]: string
    }
  }
}
