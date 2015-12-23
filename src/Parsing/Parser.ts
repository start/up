import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'

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

    for (let currentChar of text) {

      if (isNextCharEscaped) {
        this.workingText += currentChar
        isNextCharEscaped = false
        continue;
      }

      if (currentChar === '\\') {
        isNextCharEscaped = true
        continue;
      }

      if (this.currentNode instanceof EmphasisNode) {
        if (currentChar === '*') {
          this.flushWorkingText()
          this.exitCurrentNode()
          continue;
        }
      } else {
        if (currentChar === '*') {
          this.flushWorkingText()
          this.enterNewChildNode(new EmphasisNode())
          continue;
        }
      }

      this.workingText += currentChar
    }

    this.flushWorkingText()
  }

  private flushWorkingText(): void {
    if (this.workingText) {
      this.currentNode.addChild(new PlainTextNode(this.workingText))
    }
    this.workingText = ''
  }

  private enterNewChildNode(child: SyntaxNode): void {
    this.currentNode.addChild(child)
    this.currentNode = child
  }

  private exitCurrentNode() {
    this.currentNode = this.currentNode.parent
  }
}