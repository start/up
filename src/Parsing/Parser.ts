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
  let currentNode = node
  let charIndex: number
  let countCharsConsumed: number;
  let workingText = ''
  let isNextCharEscaped = false

  for (charIndex = 0; charIndex < text.length; charIndex += countCharsConsumed) {
    let char = text[charIndex]
    
    // Until proven otherwise, we assume 1 character will be consumed
    countCharsConsumed = 1;

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
      if (!tryFlushAndExitCurrentNode('`')) {
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
  
  function isCurrentNode(SyntaxNodeType: SyntaxNodeType): boolean {
    return currentNode instanceof SyntaxNodeType
  }
  
  function currentText(needle: string): boolean {
    return needle === text.substr(charIndex, needle.length)
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
  
  function tryFlushAndEnterNewChildNode(needle: string, SyntaxNodeType: SyntaxNodeType) {
    if (currentText(needle)) {
      flushAndEnterNewChildNode(new SyntaxNodeType())
      countCharsConsumed = needle.length;
      return true;
    }
    return false;
  }
  
  function tryFlushAndExitCurrentNode(needle: string) {
    if (currentText(needle)) {
      flushAndCloseCurrentNode()
      countCharsConsumed = needle.length;
      return true;
    }
    return false;
  }

  function tryParseSandwich(bun: string, SandwichNodeType: SyntaxNodeType): boolean {
    if (!currentText(bun)) {
      return false
    }
    
    countCharsConsumed = bun.length;
    
    if (isCurrentNode(SandwichNodeType)) {
      flushAndCloseCurrentNode()
    } else {
      flushAndEnterNewChildNode(new SandwichNodeType())
    }
    
    return true
  }
}