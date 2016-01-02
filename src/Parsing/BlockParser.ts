import { ParseResult } from './ParseResult'
import { ParentNodeClosureStatus } from './ParentNodeClosureStatus'
import { InlineParser } from './InlineParser'
import { FailedParseResult } from './FailedParseResult'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'
import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'

export class BlockParser {
  public documentNode: DocumentNode;
   
  constructor(private text: string) {
    this.documentNode = new DocumentNode()
    
    const paragraphNode = new ParagraphNode();

    const parseResult = new InlineParser(text, paragraphNode, ParentNodeClosureStatus.Closed).result;
    if (!parseResult.success) {
      throw new Error("Unable to parse text")
    }
    
    if (parseResult.nodes.length) {
      paragraphNode.addChildren(parseResult.nodes)
      this.documentNode.addChild(paragraphNode);
    }
  }
}