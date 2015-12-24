import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'
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
    
    let i: number;
    
    function is(needle: string): boolean {
      return needle === text.substr(i, needle.length)
    }
    
    for (i = 0; i < text.length; i++) {
      
      let char = text[i]
      
      if (isNextCharEscaped) {
        this.workingText += text[i]
        isNextCharEscaped = false
        continue;
      }

      if (is('\\')) {
        isNextCharEscaped = true
        continue;
      }

      if (this.currentNode instanceof InlineCodeNode) {
        if (is('`')) {
          this.flushAndCloseCurrentNode()
          continue;
        }
      } else if (this.currentNode instanceof EmphasisNode) {
        if (is('*')) {
          this.flushAndCloseCurrentNode()
          continue;
        }
      } else {
        if (is('`')) {
          this.flushAndEnterNewChildNode(new InlineCodeNode())
          continue
        }
        if (is('*')) {
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

  private flushAndCloseCurrentNode() {
    this.flushWorkingText()
    this.currentNode = this.currentNode.parent
  }
}