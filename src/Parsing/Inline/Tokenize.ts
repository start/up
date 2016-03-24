import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { RichSandwich } from './RichSandwich'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { applyBackslashEscaping } from '../TextHelpers'
import { STRESS, EMPHASIS, REVISION_DELETION, SPOILER, INLINE_ASIDE } from './RichSandwiches'


const RICH_SANDWICHES = [
  STRESS, EMPHASIS, REVISION_DELETION, SPOILER, INLINE_ASIDE
]
  
export function tokenize(text: string): Token[] {
  
  const consumer = new TextConsumer(text)
  const  tokens: Token[] = []
  

  MainTokenizerLoop:
  while (!consumer.done()) {

    // Inline code
    if (consumer.consume({
      from: '`', upTo: '`', then: (rawText) => {
        const code = applyBackslashEscaping(rawText)
        tokens.push(new Token(TokenMeaning.InlineCode, code))
      }
    })) {
      continue
    }
    
    // TODO: Don't do this for every single character
    const consumerBeforeToken = consumer.clone()

    for (const sandwich of RICH_SANDWICHES) {
      if (hasAnyOpen(sandwich, tokens) && consumer.consumeIfMatches(sandwich.end)) {
        tokens.push(new Token(sandwich.meaningEnd))
        continue MainTokenizerLoop
      }
       
      if (consumer.consumeIfMatches(sandwich.start)) {
        tokens.push(new Token(sandwich.meaningStart, consumerBeforeToken))
        continue MainTokenizerLoop
      }
    }

    tokens.push(new Token(TokenMeaning.Text, consumer.escapedCurrentChar()))
    consumer.moveNext()
  }

  return mergeConsecutiveTextTokens(tokens)
}


function mergeConsecutiveTextTokens(tokens: Token[]): Token[] {
  const resultTokens: Token[] = []

  for (const token of tokens) {
    const lastToken = last(resultTokens)

    if (lastToken && (lastToken.meaning === TokenMeaning.Text) && (token.meaning === TokenMeaning.Text)) {
      lastToken.value += token.value
    } else {
      resultTokens.push(token)
    }
  }

  return resultTokens
}

function hasAnyOpen(sandwich: RichSandwich, tokens: Token[]): boolean {
  let countOpen = 0
  
  // We can safely assume the tokens are in order. We don't need to worry about an end token
  // appearing before a start token.
  for (const token of tokens) {
    const meaning = token.meaning
    
    if (meaning === sandwich.meaningStart) {
      countOpen += 1
    } else if (meaning === sandwich.meaningEnd) {
      countOpen -= 1
    }
  }
  
  return countOpen > 0
}