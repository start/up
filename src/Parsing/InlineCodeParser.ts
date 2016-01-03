import { ParseResult } from './ParseResult'
import { ParentNodeClosureStatus } from './ParentNodeClosureStatus'
import { InlineSandwich } from './InlineSandwich'
import { SyntaxNodeType } from './SyntaxNodeType'
import { FailedParseResult } from './FailedParseResult'

import { TextConsumer } from './TextConsumption/TextConsumer'

import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'
import { RevisionInsertionNode } from '../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../SyntaxNodes/SpoilerNode'
import { LinkNode } from '../SyntaxNodes/LinkNode'

export function parseInlineCode(text: string, parentNode: SyntaxNode) {
  const textConsumer = new TextConsumer(text)
  const END_DELIMETER = '`'
  
  while (!textConsumer.hasExaminedAllText()) {
    if (textConsumer.isMatch(END_DELIMETER)) {
      const inlineCodeNode = new InlineCodeNode([
          new PlainTextNode(textConsumer.consumeSkippedTextAndDiscard(END_DELIMETER))
        ]);
        
      return new ParseResult([inlineCodeNode], textConsumer.countCharsConsumed, parentNode)
    }
  }
  
  return new FailedParseResult()
}