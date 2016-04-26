import { InlineTextConsumer } from '../TextConsumer'

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
  FootnoteReferenceStart,
  FootnoteReferenceEnd,
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
  public value: string
  public consumerBefore: InlineTextConsumer
  
  constructor(public meaning: TokenMeaning, valueOrConsumerBefore?: string|InlineTextConsumer) {
    if (typeof valueOrConsumerBefore === 'string') {
      this.value = valueOrConsumerBefore
    } else {
      this.consumerBefore = valueOrConsumerBefore
    }
  }
  
  textIndex(): number {
    return this.consumerBefore.lengthConsumed()
  }
}
