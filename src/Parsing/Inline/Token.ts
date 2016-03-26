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
  RevisionInserionStart,
  RevisionInsertionEnd,
  SpoilerStart,
  SpoilerEnd,
  InlineAsideStart,
  InlineAsideEnd,
  LinkStart,
  LinkUrlAndEnd
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
  
  index(): number {
    return this.consumerBefore.lengthConsumed()
  }
}