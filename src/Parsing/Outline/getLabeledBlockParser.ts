import { LineConsumer } from './LineConsumer'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { getOutlineNodes } from './getOutlineNodes'
import { getIndentedBlock } from './getIndentedBlock'
import { outlineLabel } from '../PatternHelpers'
import { OutlineParserArgs } from './OutlineParserArgs'


// A labaled block consists of a "label line" (a line consisting solely of a term followed by a colon)
// followed by an indented block.
//
// A labeled block can contain any outline convention, and its label's term is case-insensitive. 
export function getLabeledBlockParser(
  labelTerm: string,
  NodeType: new (children: OutlineSyntaxNode[]) => OutlineSyntaxNode
) {
  return function tryToParseLabeledBlock(args: OutlineParserArgs): boolean {
    const lineConsumer = new LineConsumer(args.lines)

    if (!lineConsumer.consume({ linePattern: outlineLabel(labelTerm) })) {
      return false
    }

    const contentLines: string[] = []

    getIndentedBlock({
      lines: lineConsumer.getRemainingLines(),
      then: (indentedLines, countLinesConsumed) => {
        contentLines.push(...indentedLines)
        lineConsumer.skipLines(countLinesConsumed)
      }
    })

    if (!contentLines.length) {
      return false
    }

    const children = getOutlineNodes(contentLines, args.headingLeveler, args.config)

    args.then([new NodeType(children)], lineConsumer.countLinesConsumed)
    return true
  }
}
