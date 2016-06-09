import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { FootnoteBlockInserter } from './FootnoteBlockInserter'


export class DocumentNode {
  constructor(public children: OutlineSyntaxNode[] = []) { }
  
  insertFootnoteBlocks(): void {
    new FootnoteBlockInserter(this)
  }
  
  private DOCUMENT: any = null
}
