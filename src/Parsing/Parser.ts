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
  private index: number;
  private mode: ParseMode;
  private workingText: string;

  private initialize(documentNode: DocumentNode): void {
    this.currentNode = documentNode
    this.mode = ParseMode.Normal
    this.index = -1
    this.workingText = ''
  }

  parse(text: string): DocumentNode {
    const documentNode = new DocumentNode()    
    this.initialize(documentNode);

    while (true) {
      this.index += 1

      if (this.index === text.length) {
        break;
      }

      let currentChar = text[this.index]

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
              this.currentNode = this.currentNode.parent
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
}