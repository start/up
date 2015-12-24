import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'

export class Parser {
  private currentNode: SyntaxNode;
  private workingText: string;

  parse(text: string): DocumentNode {
    const documentNode = new DocumentNode()

    this.currentNode = documentNode
    this.workingText = ''

    this.parseInline(text)

    return documentNode
  }

  private parseInline(text: string) {
    let isNextCharEscaped = false;

    for (let char of text) {

      if (isNextCharEscaped) {
        this.workingText += char
        isNextCharEscaped = false
        continue;
      }

      if (char === '\\') {
        isNextCharEscaped = true
        continue;
      }

      if (this.currentNode instanceof InlineCodeNode) {
        if (char === '`') {
          this.flushAndExitCurrentNode()
          continue;
        }
      } else if (this.currentNode instanceof EmphasisNode) {
        if (char === '*') {
          this.flushAndExitCurrentNode()
          continue;
        }
      } else {
        if (char === '`') {
          this.flushAndEnterNewChildNode(new InlineCodeNode())
          continue
        }
        if (char === '*') {
          this.flushAndEnterNewChildNode(new EmphasisNode())
          continue;
        }
      }

      this.workingText += char
    }

    this.flushWorkingText()
  }

  private flushWorkingText(): void {
    if (this.workingText) {
      this.currentNode.addChild(new PlainTextNode(this.workingText))
    }
    this.workingText = ''
  }

  private flushAndEnterNewChildNode(child: SyntaxNode): void {
    this.flushWorkingText()
    this.currentNode.addChild(child)
    this.currentNode = child
  }

  private flushAndExitCurrentNode() {
    this.flushWorkingText()
    this.currentNode = this.currentNode.parent
  }
}