import { TextConsumer } from '../TextConsumer'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { getInlineNodes } from '../Inline/GetInlineNodes'
import { NON_BLANK, STREAK } from './Patterns'
import { parseInlineOnlyIfRegularParagraph } from './ParseInlineOnlyIfRegularParagraph'
import { OutlineParser, OutlineParserArgs, } from './OutlineParser'

const NON_BLANK_LINE_PATTERN = new RegExp(
  NON_BLANK
)

const STREAK_PATTERN = new RegExp(
  STREAK
)

// 2 or more consecutive non-blank lines are treated as... lines. Not paragraphs!
export function parseLineBlock(args: OutlineParserArgs): boolean {
  const consumer = new TextConsumer(args.text)
  const nonBlankLines: string[] = []
  
  // Collect all consecutive non-blank lines
  while (consumer.consumeLine({
    pattern: NON_BLANK_LINE_PATTERN,
    then: (line) => nonBlankLines.push(line)
  })) { }

  if (nonBlankLines.length < 2) {
    return false
  }
  
  
  // However, some of the blank lines might not be regular lines.
  //
  // For example:
  //
  // Roses are red
  // Violets are blue
  // =*=*=*=*=*=*=*=*
  // Anyway, poetry is pretty fun.
  //
  // The first two lines should be parsed as a line block, but the second two lines should not
  // be included.
  const lineNodes: LineNode[] = []
   
  for (const nonBlankLine of nonBlankLines) {
    const lineWouldOtherwiseBeARegularParagraph =
      parseInlineOnlyIfRegularParagraph({
        text: nonBlankLine,
        then: (inlineNodes) => lineNodes.push(new LineNode(inlineNodes))
      })
      
    if (!lineWouldOtherwiseBeARegularParagraph) {
      break
    }
  }
  
  if (lineNodes.length < 2) {
    return false
  }

  args.then([new LineBlockNode(lineNodes)], consumer.lengthConsumed())
  return true
}
