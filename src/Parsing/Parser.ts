import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'

interface SyntaxNodeType { 
  new(): SyntaxNode
}

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
    let index: number;
    
    function currentText(needle: string): boolean {
      return needle === text.substr(index, needle.length)
    }
    
    const parseSandwich = (bun: string, SandwichNode: SyntaxNodeType): boolean => {
      if (currentText(bun)) {
        if (this.isCurrentNode(SandwichNode)) {
          this.flushAndCloseCurrentNode()
        } else {
          this.flushAndEnterNewChildNode(new SandwichNode())
        }
        const extraCharsToSkip = bun.length - 1
        index += extraCharsToSkip
        return true
      }
      return false
    }
    
    let isNextCharEscaped = false;
    
    for (index = 0; index < text.length; index++) {
      
      let char = text[index]
      
      if (isNextCharEscaped) {
        this.workingText += char
        isNextCharEscaped = false
        continue;
      }

      if (currentText('\\')) {
        isNextCharEscaped = true
        continue;
      }

      if (this.isCurrentNode(InlineCodeNode)) {
        if (currentText('`')) {
          this.flushAndCloseCurrentNode()
        } else {
          this.workingText += char
        }
        continue;
      }
      
      if (currentText('`')) {
        this.flushAndEnterNewChildNode(new InlineCodeNode())
        continue
      }
      
      if (parseSandwich('**', StressNode)) {
        continue;
      }
      
      if (parseSandwich('*', EmphasisNode)) {
        continue;
      }

      this.workingText += char
    }

    this.flushWorkingText()
  }
  
  private isCurrentNode(SyntaxNodeType: SyntaxNodeType): boolean {
    return this.currentNode instanceof SyntaxNodeType
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