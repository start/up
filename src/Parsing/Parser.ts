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

  if (!tryParseInline(documentNode, text)) {
    throw "Unable to parse text"
  }

  return documentNode
}

function tryParseInline(
  intoNode: SyntaxNode,
  text: string,
  charIndex: number = 0,
  countCharsConsumed: number = 0
  ): boolean {
    
  let currentNode = intoNode
  let workingText = ''
  let isNextCharEscaped = false

  for (; charIndex < text.length; charIndex += countCharsConsumed) {
    
    if (currentNode === intoNode.parent) {
        return true;
    }
    
    let char = text[charIndex]
    
    // Until proven otherwise, we assume 1 character will be consumed
    countCharsConsumed = 1;

    if (isNextCharEscaped) {
      workingText += char
      isNextCharEscaped = false
      continue;
    }

    if (currentTextIs('\\')) {
      isNextCharEscaped = true
      continue;
    }

    if (parentIs(InlineCodeNode)) {
      if (!flushAndExitCurrentNodeIf('`')) {
        workingText += char
      }
      continue;
    }

    if (flushAndEnterNewChildNodeIf('`', InlineCodeNode)) {
      continue
    }

    if (parseSandwichIf('**', StressNode)) {
      continue;
    }

    if (parseSandwichIf('*', EmphasisNode)) {
      continue;
    }

    workingText += char
  }

  flushWorkingText()
  
  // If there are still some open nodes, that means we couldn't properly parse
  // the text.
  //
  // This should never happen on the top-level call to this function, but it will
  // happen if (for example) we start parsing an unmatched asterisk as though it
  // were the opening of an emphasis node.  
  return (currentNode === intoNode) && currentNode.valid()
  

  function parentIs(SyntaxNodeType: SyntaxNodeType): boolean {
    return currentNode instanceof SyntaxNodeType
  }

  function anyParentIs(SyntaxNodeType: SyntaxNodeType): boolean {
    return currentNode.parents().some(parent => parent instanceof SyntaxNodeType)
  }

  function currentTextIs(needle: string): boolean {
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

  function flushAndCloseCurrentNode(): void {
    flushWorkingText()
    currentNode = currentNode.parent
  }

  function flushAndEnterNewChildNodeIf(needle: string, SyntaxNodeType: SyntaxNodeType) {
    if (currentTextIs(needle)) {
      flushAndEnterNewChildNode(new SyntaxNodeType())
      countCharsConsumed = needle.length;
      return true;
    }
    return false;
  }

  function flushAndExitCurrentNodeIf(needle: string) {
    if (currentTextIs(needle)) {
      flushAndCloseCurrentNode()
      countCharsConsumed = needle.length;
      return true;
    }
    return false;
  }

  function parseSandwichIf(bun: string, SandwichNodeType: SyntaxNodeType): boolean {
    if (!currentTextIs(bun)) {
      return false
    }

    countCharsConsumed = bun.length;

    if (parentIs(SandwichNodeType)) {
      flushAndCloseCurrentNode()
      return true
    }
    
    // If we're indirectly nested inside a node of this type, we can't reognize this bun as its end.
    // That's because we'd be leaving the innermost nodes dangling.
    if (anyParentIs(SandwichNodeType)) {
      return false
    }

    flushAndEnterNewChildNode(new SandwichNodeType())
    return true
  }
}