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
  EmphasisStartAndStressStart,
  EmphasisEndAndStressEnd
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
  
  textIndex(): number {
    return this.consumerBefore.lengthConsumed()
  }
}