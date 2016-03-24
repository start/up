import { TextConsumer } from '../TextConsumer'

export enum TokenMeaning {
  Text,
  EmphasisStart,
  EmphasisEnd,
  StressStart,
  StressEnd,
  InlineCode,
  RevisionDeletionStart,
  RevisionDeletionEnd,
  SpoilerStart,
  SpoilerEnd,
  InlineAsideStart,
  InlineAsideEnd
}

export class Token {
  public value: string
  public consumerBefore: TextConsumer
  constructor(public meaning: TokenMeaning, valueOrConsumerBefore?: string|TextConsumer) {
    if (typeof valueOrConsumerBefore === 'string') {
      this.value = valueOrConsumerBefore
    } else {
      this.consumerBefore = valueOrConsumerBefore
    }
  }
}