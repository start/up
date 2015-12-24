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
  let currentNode = node;
  let charIndex: number;
  let workingText = '';
  
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
    if (!currentText(bun)) {
      return false
    }
    
    // If the length of the "bun" is greater than 1, we need to skip ahead that extra length
    // here. The parser will only skip ahead by 1 character on its own. 
    const extraCharsToSkip = bun.length - 1
    charIndex += extraCharsToSkip
    
    if (isCurrentNode(SandwichNodeType)) {
      flushAndCloseCurrentNode()
    } else {
      flushAndEnterNewChildNode(new SandwichNodeType())
    }
    
    return true
  }

  let isNextCharEscaped = false;

  for (charIndex = 0; charIndex < text.length; charIndex++) {
    let char = text[charIndex]

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