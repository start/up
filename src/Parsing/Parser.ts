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
    
    let index: number;
    
    function current(needle: string): boolean {
      return needle === text.substr(index, needle.length)
    }
    
    for (index = 0; index < text.length; index++) {
      
      let char = text[index]
      
      if (isNextCharEscaped) {
        this.workingText += char
        isNextCharEscaped = false
        continue;
      }

      if (current('\\')) {
        isNextCharEscaped = true
        continue;
      }

      if (this.currentNode instanceof InlineCodeNode) {
        if (current('`')) {
          this.flushAndCloseCurrentNode()
        } else {
          this.workingText += char
        }
        continue;
      }
      
      if (current('`')) {
        this.flushAndEnterNewChildNode(new InlineCodeNode())
        continue
      }
      
      if (current('**')) {
        if (this.currentNode instanceof StressNode) {
          this.flushAndCloseCurrentNode()
        } else {
          this.flushAndEnterNewChildNode(new StressNode())
        }
        index += 1;
        continue;
      }
      
      if (current('*')) {
        if (this.currentNode instanceof EmphasisNode) {
          this.flushAndCloseCurrentNode()
        } else {
          this.flushAndEnterNewChildNode(new EmphasisNode())
        }
        continue;
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