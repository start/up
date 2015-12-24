import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'

interface SyntaxNodeType {
  new (): SyntaxNode
}

export function parse(text: string): DocumentNode {
  const documentNode = new DocumentNode()

  parseInlineInto(documentNode, text)

  return documentNode
}

function parseInlineInto(node: SyntaxNode, text: string): void {
  
  function isCurrentNode(SyntaxNodeType: SyntaxNodeType): boolean {
    return currentNode instanceof SyntaxNodeType
  }
  
  let workingText = '';
  let currentNode = node;
  let index: number;

  function currentText(needle: string): boolean {
    return needle === text.substr(index, needle.length)
  }
  
  function flushWorkingText(): void {
    if (workingText) {
      currentNode.addChild(new PlainTextNode(workingText))
    }
    workingText = ''
  }

  function flushAndEnterNewChildNode(child: SyntaxNode): void {
    flushWorkingText()
    currentNode.addChild(child)
    currentNode = child
  }

  function flushAndCloseCurrentNode() {
    flushWorkingText()
    currentNode = currentNode.parent
  }

  function parseSandwich(bun: string, SandwichNode: SyntaxNodeType): boolean {
    if (currentText(bun)) {
      if (isCurrentNode(SandwichNode)) {
        flushAndCloseCurrentNode()
      } else {
        flushAndEnterNewChildNode(new SandwichNode())
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
      workingText += char
      isNextCharEscaped = false
      continue;
    }

    if (currentText('\\')) {
      isNextCharEscaped = true
      continue;
    }

    if (isCurrentNode(InlineCodeNode)) {
      if (currentText('`')) {
        flushAndCloseCurrentNode()
      } else {
        workingText += char
      }
      continue;
    }

    if (currentText('`')) {
      flushAndEnterNewChildNode(new InlineCodeNode())
      continue
    }

    if (parseSandwich('**', StressNode)) {
      continue;
    }

    if (parseSandwich('*', EmphasisNode)) {
      continue;
    }

    workingText += char
  }

  flushWorkingText()
}