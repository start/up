import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { LineConsumer } from './LineConsumer'
import { HeadingLeveler } from './HeadingLeveler'
import { UpConfig } from '../../UpConfig'


export interface OutlineParserArgs {
  consumer: LineConsumer
  headingLeveler: HeadingLeveler
  config: UpConfig
  then: (resultNodes: OutlineSyntaxNode[], lengthParsed: number) => void
}
