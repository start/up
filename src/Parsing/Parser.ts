import { ParseResult } from './ParseResult'
import { ParentNodeClosureType } from './ParentNodeClosureType'
import { InlineParser } from './InlineParser'
import { FailedParseResult } from './FailedParseResult'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'

interface SyntaxNodeType {
  new (): SyntaxNode
}

export class Parser {
  public documentNode: DocumentNode;
   
  constructor(private text: string) {
    this.documentNode = new DocumentNode()

    const parseResult = new InlineParser(text, this.documentNode, ParentNodeClosureType.ClosesItself).result;
    if (!parseResult.success) {
      throw new Error("Unable to parse text")
    }

    this.documentNode.addChildren(parseResult.nodes)
  }
}