import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode'
import { TextConsumer } from '../TextConsumer'

export interface InlineParser {
  (args: InlineParserArgs): boolean
}

export interface InlineParserArgs {
  text: string
  then: (resultNodes: SyntaxNode[], lengthParsed: number) => void
  parentNode?: RichSyntaxNode
  endsWith?: string
  doesNotHave?: string
  onlyIf?: (consumer: TextConsumer) => boolean
}