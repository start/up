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

    terms?: {
      tableOfContents?: string
      itemReferencedByTableOfContents?: string
      table?: string
      chart?: string
      image?: string
      audio?: string
      video?: string
      highlight?: string
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
