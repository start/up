import { RichSandwichTracker } from './RichSandwichTracker'
import { TextConsumer } from '../TextConsumer'
import { Token } from './Token'

interface Args {
    consumer?: TextConsumer,
     tokens?: Token[],
     sandwichTrackers?: RichSandwichTracker[]
}

export class TokenizerState {
  public consumer: TextConsumer
    public tokens: Token[]
    public sandwichTrackers: RichSandwichTracker[]
    
  constructor(args?: Args) {
    if (!args) {
      return
    }
    
    this.consumer = args.consumer
    this.tokens = args.tokens
    this.sandwichTrackers = args.sandwichTrackers
  }
  
  clone(): TokenizerState {
    return new TokenizerState({
      consumer: this.consumer.clone(),
      tokens: this.tokens.slice(),
      sandwichTrackers: this.sandwichTrackers.map(tracker => tracker.clone())
    })
  }
}