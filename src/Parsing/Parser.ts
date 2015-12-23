import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'

enum ParseMode {
  Literal,
  Normal
}

export function parse(text: string): DocumentNode {
  const documentNode = new DocumentNode
  let currentNode: SyntaxNode = documentNode
  let workingText = ''

  function addPlainTextNodeForWorkingText(): void {
    if (workingText) {
      currentNode.addChild(new PlainTextNode(workingText))
    }
    workingText = ''
  }

  function addChildAndMakeChildCurrentNode(child: SyntaxNode): void {
    currentNode.addChild(child)
    currentNode = child
  }

  let mode = ParseMode.Normal
  let i = -1

  while (true) {
    i += 1

    if (i === text.length) {
      break;
    }

    let currentChar = text[i]

    if (mode == ParseMode.Literal) {
      workingText += currentChar
      mode = ParseMode.Normal

    } else if (mode == ParseMode.Normal) {
      if (currentChar === '\\') {
        mode = ParseMode.Literal

      } else {
        if (currentNode instanceof EmphasisNode) {
          if (currentChar === '*') {
            addPlainTextNodeForWorkingText()
            currentNode = currentNode.parent
            continue;
          }

        } else {
          if (currentChar === '*') {
            addPlainTextNodeForWorkingText()
            addChildAndMakeChildCurrentNode(new EmphasisNode())
            continue;
          }
        }
        
        workingText += currentChar
      }

    } else {
      throw 'Unrecognized parse mode'
    }
  }

  addPlainTextNodeForWorkingText()

  return documentNode
}