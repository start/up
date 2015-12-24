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
  
  let currentNode = node;
  let index: number;

  function currentText(needle: string): boolean {
    return needle === text.substr(index, needle.length)
  }
  
  let workingText = '';
  
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
  
  function tryFlushAndEnterNewChildNode(needle: string, SyntaxNodeType: SyntaxNodeType) {
    if (currentText(needle)) {
      flushAndEnterNewChildNode(new SyntaxNodeType())
      return true;
    }
    return false;
  }
  
  function tryFlushAndCloseCurrentNode(needle: string) {
    if (currentText(needle)) {
      flushAndCloseCurrentNode()
      return true;
    }
    return false;
  }

  function tryParseSandwich(bun: string, SandwichNodeType: SyntaxNodeType): boolean {
    if (currentText(bun)) {
      if (isCurrentNode(SandwichNodeType)) {
        flushAndCloseCurrentNode()
      } else {
        flushAndEnterNewChildNode(new SandwichNodeType())
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
      if (!tryFlushAndCloseCurrentNode('`')) {
        workingText += char
      }
      continue;
    }

    if (tryFlushAndEnterNewChildNode('`', InlineCodeNode)) {
      continue
    }

    if (tryParseSandwich('**', StressNode)) {
      continue;
    }

    if (tryParseSandwich('*', EmphasisNode)) {
      continue;
    }

    workingText += char
  }

  flushWorkingText()
}