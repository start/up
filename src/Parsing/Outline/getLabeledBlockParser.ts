import { LineConsumer } from './LineConsumer'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { getOutlineNodes } from './getOutlineNodes'
import { getIndentedBlock } from './getIndentedBlock'
import { solelyAndIgnoringCapitalization, escapeForRegex, optional } from '../PatternHelpers'
import { OutlineParserArgs } from './OutlineParserArgs'


// A labaled block consists of a "label line" (a term followed by an optional colon) followed by
// an indented block.
//
// A labeled block can contain any outline convention, and its label's term is case-insensitive. 
export function getLabeledBlockParser(
  labelTerm: string,
  NodeType: new (children: OutlineSyntaxNode[]) => OutlineSyntaxNode
) {
  return function tryToParseLabeledBlock(args: OutlineParserArgs): boolean {
    const markupLineConsumer = new LineConsumer(args.markupLines)

    const labelLinePattern =
      solelyAndIgnoringCapitalization(
        escapeForRegex(labelTerm) + optional(':'))

    if (!markupLineConsumer.consume({ linePattern: labelLinePattern })) {
      return false
    }

    const contentLines: string[] = []

    getIndentedBlock({
      lines: markupLineConsumer.remaining(),
      then: (indentedLines, countLinesConsumed) => {
        contentLines.push(...indentedLines)
        markupLineConsumer.skipLines(countLinesConsumed)
      }
    })

    if (!contentLines.length) {
      return false
    }

    const children = getOutlineNodes({
      markupLines: contentLines,
      sourceLineNumber: args.sourceLineNumber + markupLineConsumer.countLinesConsumed,
      headingLeveler: args.headingLeveler,
      config: args.config
    })

    args.then([new NodeType(children)], markupLineConsumer.countLinesConsumed)
    return true
  }
}
