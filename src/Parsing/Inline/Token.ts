import { TextConsumer } from '../TextConsumer'

export enum TokenMeaning {
  PlainText,
  EmphasisStart,
  EmphasisEnd,
  StressStart,
  StressEnd,
  InlineCode,
  RevisionDeletionStart,
  RevisionDeletionEnd,
  RevisionInserionStart,
  RevisionInsertionEnd,
  SpoilerStart,
  SpoilerEnd,
  InlineAsideStart,
  InlineAsideEnd,
  LinkStart,
  LinkUrlAndLinkEnd,
  AudioStartAndAudioDescription,
  AudioUrlAndAudioEnd,
  ImageStartAndAudioDescription,
  ImageUrlAndAudioEnd,
  VideoStartAndAudioDescription,
  VideoUrlAndAudioEnd,
  PotentialRaisedVoiceStart,
  PotentialRaisedVoiceEnd,
  PotentialRaisedVoiceStartOrEnd
}

export class Token {
  public rawValue: string
  public consumerBefore: TextConsumer
  
  constructor(public meaning: TokenMeaning, valueOrConsumerBefore?: string|TextConsumer) {
    if (typeof valueOrConsumerBefore === 'string') {
      this.rawValue = valueOrConsumerBefore
    } else {
      this.consumerBefore = valueOrConsumerBefore
    }
  }
  
  value(): string {
    return this.rawValue.trim()
  }
  
  textIndex(): number {
    return this.consumerBefore.lengthConsumed()
  }
}
