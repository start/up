import { RichSandwichTracker } from './RichSandwichTracker'
import { TextConsumer } from '../TextConsumer'
import { Token } from './Token'

interface Args {
  consumer?: TextConsumer,
  tokens?: Token[],
  richSandwichTrackers?: RichSandwichTracker[]
}

export class TokenizerState {
  public consumer: TextConsumer
  public tokens: Token[]
  public richSandwichTrackers: RichSandwichTracker[]

  constructor(args?: Args) {
    if (!args) {
      return
    }

    this.consumer = args.consumer
    this.tokens = args.tokens
    this.richSandwichTrackers = args.richSandwichTrackers
  }

  clone(): TokenizerState {
    return new TokenizerState({
      consumer: this.consumer.clone(),
      tokens: this.tokens.slice(),
      richSandwichTrackers: this.richSandwichTrackers.map(tracker => tracker.clone())
    })
  }
}