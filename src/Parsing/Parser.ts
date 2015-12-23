import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'

enum ParseMode {
  Literal,
  Normal
}

export class Parser {
  private currentNode: SyntaxNode;
  private mode: ParseMode;
  private workingText: string;

  parse(text: string): DocumentNode {
    const documentNode = new DocumentNode()    
    
    this.currentNode = documentNode
    this.mode = ParseMode.Normal
    this.workingText = ''

    for (let currentChar of text) {
      if (this.mode == ParseMode.Literal) {
        this.workingText += currentChar
        this.mode = ParseMode.Normal

      } else if (this.mode == ParseMode.Normal) {
        if (currentChar === '\\') {
          this.mode = ParseMode.Literal

        } else {
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

      } else {
        throw 'Unrecognized parse mode'
      }
    }

    this.flushWorkingText()

    return documentNode
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