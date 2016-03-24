import { TextConsumer } from '../TextConsumer'
import { Token } from './Token'

interface Args {
  consumer?: TextConsumer,
  tokens?: Token[],
}

export class TokenizerState {
  public consumer: TextConsumer
  public tokens: Token[]

  constructor(args?: Args) {
    if (!args) {
      return
    }

    this.consumer = args.consumer
    this.tokens = args.tokens
  }
  
  index(): number {
    return this.consumer.lengthConsumed()
  }

  clone(): TokenizerState {
    return new TokenizerState({
      consumer: this.consumer.clone(),
      tokens: this.tokens.slice()
    })
  }
}