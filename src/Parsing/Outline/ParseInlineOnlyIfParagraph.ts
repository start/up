import { TextConsumer } from '../TextConsumer'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { getOutlineNodes } from './GetOutlineNodes'
import { NON_BLANK } from './Patterns'
import { OutlineParser, OutlineParserArgs, } from './OutlineParser'

interface ParseInlineOnlyIfParagraphArgs {
  text: string,
  then: OnSuccess
}

interface OnSuccess {
  (resultNodes: SyntaxNode[]): void
}

const NON_BLANK_PATTERN = new RegExp(
  NON_BLANK
)

// `parseInlineOnlyIfParagraph` only succeeds if the text would otherwise be parsed as a regular
// paragraph.
//
// The following three inputs would fail: 
//
// 1) Buy milk
//
// =-=-=-=-=-=
//
// * Drink milk
export function parseInlineOnlyIfParagraph(args: ParseInlineOnlyIfParagraphArgs): boolean {
  const outlineNodeFromContent = getOutlineNodes(args.text)[0]

  if (outlineNodeFromContent instanceof ParagraphNode) {
    args.then(outlineNodeFromContent.children)
    return true
  }

  return false
}
