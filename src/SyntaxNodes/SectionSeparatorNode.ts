import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { FootnoteNode } from './FootnoteNode'
import { Sequence } from '../Sequence'


export class SectionSeparatorNode implements OutlineSyntaxNode {
  processFootnotesAndGetThoseThatAreStillBlockless(_: Sequence): FootnoteNode[] { return [] }

  OUTLINE_SYNTAX_NODE(): void { }
  protected SECTION_SEPARATOR_NODE(): void { }
}
