import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'

enum ParseMode {
  Literal,
  Normal
}

export function parse(text: string): DocumentNode {
  const documentNode = new DocumentNode

  let mode = ParseMode.Normal
  let i = 0
  let workingText = ''

  while (i < text.length) {
    let currentChar = text[i]

    if (mode == ParseMode.Literal) {
      workingText += currentChar

    } else if (mode == ParseMode.Normal) {
      if (currentChar == '\\') {
        mode = ParseMode.Literal
      } else {
        workingText += currentChar;
      }
    
    } else {
      throw 'Unrecognized parse mode'
    }

    i += 1;
  }

  if (workingText) {
    documentNode.children.push(new PlainTextNode(workingText))
  }

  return documentNode
}