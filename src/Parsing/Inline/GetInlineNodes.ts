import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { TextConsumer } from '../TextConsumer'

enum TokenMeaning {
  Text,
  EmphasisStart,
  EmphasisEnd  
}


class Token {
  constructor(public meaning: TokenMeaning, public index: number, public value: string) { }
}


export function getInlineNodes(text: string): InlineSyntaxNode[] {
  return [new PlainTextNode(text)]
}


function tokenize(text: string): Token[] {
  const consumer = new TextConsumer(text)
  const tokens: Token[] = []
  
  return tokens
}


function parse(tokens: Token[]): InlineSyntaxNode[] {
  const nodes: InlineSyntaxNode[] = []
  
  return nodes
}
