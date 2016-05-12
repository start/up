export enum TokenizerState { 
  InlineCode,
  Footnote,
  Spoiler,
  Parenthesized,
  SquareBracketed,
  ParenthesizedInsideUrl,
  SquareBracketedInsideUrl,
  Link,
  LinkUrl,
  RevisionInsertion,
  RevisionDeletion,
  Audio,
  Image,
  Video,
  MediaUrl,
  NakedUrl
}