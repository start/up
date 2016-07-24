import { Sequence } from '../Sequence'
import { FootnoteNode } from './FootnoteNode'


export interface OutlineSyntaxNode {
  processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence: Sequence): FootnoteNode[]

  OUTLINE_SYNTAX_NODE(): void
}
