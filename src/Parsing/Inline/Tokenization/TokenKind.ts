export enum TokenKind {
  ActionEnd = 1,
  ActionStart,
  AudioStartAndDescription,
  Code,
  EmphasisEnd,
  EmphasisStart,
  FootnoteEnd,
  FootnoteStart,
  HighlightEnd,
  HighlightStart,
  ImageStartAndDescription,
  LinkEndAndUrl,
  LinkStart,
  MediaEndAndUrl,
  NakedUrlAfterScheme,
  NakedUrlScheme,
  NsflEnd,
  NsflStart,
  NsfwEnd,
  NsfwStart,
  ParenthesizedEnd,
  ParenthesizedStart,
  PlainText,
  PotentialRaisedVoiceEnd,
  PotentialRaisedVoiceStart,
  PotentialRaisedVoiceStartOrEnd,
  RevisionDeletionEnd,
  RevisionDeletionStart,
  RevisionInsertionEnd,
  RevisionInsertionStart,
  SpoilerEnd,
  SpoilerStart,
  SquareBracketedEnd,
  SquareBracketedStart,
  StressEnd,
  StressStart,
  VideoStartAndDescription
}
