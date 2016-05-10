export enum TokenizerState { 
  InlineCode,
  Footnote,
  Spoiler,
  Parenthesized,
  SquareBracketed,
  Link,
  LinkUrl,
  RevisionInsertion,
  RevisionDeletion,
  Audio,
  Image,
  Video,
  MediaUrl
}