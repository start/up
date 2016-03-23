import { SandwichTracker } from './SandwichTracker'
import { TextConsumer } from '../TextConsumer'
import { Token } from './Token'

interface Args {
    consumer?: TextConsumer,
     tokens?: Token[],
     isInlineCode?: boolean,
     sandwichTrackers?: SandwichTracker[]
}

export class TokenizerState {
  public consumer: TextConsumer
    public tokens: Token[]
    public isInlineCode: boolean
    public sandwichTrackers: SandwichTracker[]
    
  constructor(args?: Args) {
    if (!args) {
      return
    }
    
    this.consumer = args.consumer
    this.tokens = args.tokens
    this.isInlineCode = args.isInlineCode
    this.sandwichTrackers = args.sandwichTrackers
  }
  
  clone(): TokenizerState {
    return new TokenizerState({
      consumer: this.consumer.clone(),
      tokens: this.tokens.slice(),
      isInlineCode: this.isInlineCode,
      sandwichTrackers: this.sandwichTrackers.map(tracker => tracker.clone())
    })
  }
}