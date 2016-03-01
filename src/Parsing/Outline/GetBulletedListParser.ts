import { TextConsumer } from '../TextConsumer'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItemNode } from '../../SyntaxNodes/OrderedListItemNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { getOutlineNodes } from './GetOutlineNodes'
import { optional, startsWith, either, INLINE_WHITESPACE_CHAR, BLANK, INDENT, INTEGER } from './Patterns'
import { last } from '../CollectionHelpers'
import { OutlineParser, OutlineParserArgs, } from './OutlineParser'


const BLANK_LINE_PATTERN = new RegExp(
  BLANK
)

const INDENTED_PATTERN = new RegExp(
  startsWith(INDENT)
)
