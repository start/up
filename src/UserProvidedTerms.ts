export type AppearsInMarkup = string[] | string
export type AppearsInOutput = string


export interface UserProvidedTerms {
  audio?: AppearsInMarkup
  chart?: AppearsInMarkup
  highlight?: AppearsInMarkup
  image?: AppearsInMarkup
  nsfl?: AppearsInMarkup
  nsfw?: AppearsInMarkup
  spoiler?: AppearsInMarkup
  table?: AppearsInMarkup
  video?: AppearsInMarkup

  footnote?: AppearsInOutput
  footnoteReference?: AppearsInOutput
  itemReferencedByTableOfContents?: AppearsInOutput
  tableOfContents?: AppearsInOutput
  toggleNsfl?: AppearsInOutput
  toggleNsfw?: AppearsInOutput
  toggleSpoiler?: AppearsInOutput
}
