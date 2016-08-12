export interface UserProvidedTerms {
  audio?: string
  chart?: string
  footnote?: string
  footnoteReference?: string
  highlight?: string
  image?: string
  itemReferencedByTableOfContents?: string
  nsfl?: string
  nsfw?: string
  spoiler?: string
  table?: string
  tableOfContents?: string
  toggleNsfl?: string
  toggleNsfw?: string
  toggleSpoiler?: string
  video?: string

  [term: string]: string
}
