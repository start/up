import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { TextConsumer } from '../TextConsumer'

export interface InlineParser {
  (args: InlineParserArgs): boolean
}

export interface InlineParserArgs {
  text: string
  then: (resultNodes: InlineSyntaxNode[], lengthParsed: number) => void
  parentNodeTypes: RichInlineSyntaxNodeType[]
  endsWith?: string
  doesNotHave?: string
  onlyIf?: (consumer: TextConsumer) => boolean
}