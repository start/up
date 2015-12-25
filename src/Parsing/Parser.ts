import { ParseResult } from './ParseResult'
import { FailedParseResult } from './FailedParseResult'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'

interface SyntaxNodeType {
  new (): SyntaxNode
}

enum NodeStatus {
  Okay,
  Dangling
}

export function parse(text: string): DocumentNode {
  const documentNode = new DocumentNode()

  const parseResult = parseInline(documentNode, text) 
  if (!parseResult.success) {
    throw "Unable to parse text"
  }

  documentNode.addChildren(parseResult.nodes)
  return documentNode
}

function parseInline(
  parentNode: SyntaxNode,
  text: string,
  initialCharIndex = 0,
  parentNodeStatus = NodeStatus.Okay
  ): ParseResult {
    
  let isParentClosed = false
  let resultNodes: SyntaxNode[] = [];
  let workingText = ''
  let isNextCharEscaped = false
  let charIndex = 0

  for (charIndex = initialCharIndex; !isParentClosed && charIndex < text.length; charIndex += 1) {
    let char = text[charIndex]

    if (isNextCharEscaped) {
      workingText += char
      isNextCharEscaped = false
      continue;
    }

    if (isCurrentText('\\')) {
      isNextCharEscaped = true
      continue;
    }

    if (isParent(InlineCodeNode)) {
      if (!closeParentIfCurrentTextIs('`')) {
        workingText += char
      }
      continue;
    }

    if (parseIf('`', InlineCodeNode)) {
      continue
    }

    if (handleSandwich('**', StressNode)) {
      continue;
    }

    if (handleSandwich('*', EmphasisNode)) {
      continue;
    }

    workingText += char
  }
  
  if (parentNodeStatus == NodeStatus.Dangling) {
    return new FailedParseResult();
  }

  flushWorkingText()
  return new ParseResult(resultNodes, charIndex - initialCharIndex)
  
  
  // The functions below are essentially member functions. I should probably create a
  // parser class, but it's currently a function because there's only one entry point
  // and exit point.
  
  function isParent(SyntaxNodeType: SyntaxNodeType): boolean {
    return parentNode instanceof SyntaxNodeType
  }

  function isAnyAncestor(SyntaxNodeType: SyntaxNodeType): boolean {
    return
      isParent(SyntaxNodeType)
      || parentNode.parents().some(parent => parent instanceof SyntaxNodeType)
  }

  function isCurrentText(needle: string): boolean {
    return needle === text.substr(charIndex, needle.length)
  }
  
  function advanceExtraCountCharsConsumed(countCharsConsumed: number): void {
    charIndex += countCharsConsumed - 1
  }

  function flushWorkingText(): void {
    if (workingText) {
      resultNodes.push(new PlainTextNode(workingText))
    }
    workingText = ''
  }
  
  function parse(SyntaxNodeType: SyntaxNodeType, countCharsToSkip: number): boolean {
    const potentialNode = new SyntaxNodeType();
    potentialNode.parent = parentNode
    
    const parseResult = parseInline(
      potentialNode,
      text,
      charIndex + countCharsToSkip,
      NodeStatus.Dangling);
    
    if (parseResult.success()) {
        flushWorkingText()
        potentialNode.addChildren(parseResult.nodes)
        resultNodes.push(potentialNode)
        advanceExtraCountCharsConsumed(countCharsToSkip + parseResult.countCharsConsumed)
        return true
    }
    
    return false
  }

  function closeParent(): void {
    flushWorkingText()
    parentNodeStatus = NodeStatus.Okay
    isParentClosed = true
  }

  function parseIf(needle: string, SyntaxNodeType: SyntaxNodeType): boolean {
    return isCurrentText(needle) && parse(SyntaxNodeType, needle.length)
  }

  function closeParentIfCurrentTextIs(needle: string) {
    if (isCurrentText(needle)) {
      closeParent()
      advanceExtraCountCharsConsumed(needle.length);
      return true;
    }
    
    return false;
  }

  function handleSandwich(bun: string, SandwichNodeType: SyntaxNodeType): boolean {
    if (!isCurrentText(bun)) {
      return false
    }

    if (isParent(SandwichNodeType)) {
      closeParent()
      return true
    }
    
    // If we're indirectly nested inside a node of this type, we can't reognize this bun as its end.
    // That's because we'd be leaving the innermost nodes dangling.
    if (isAnyAncestor(SandwichNodeType)) {
      return false
    }

    if (parse(SandwichNodeType, bun.length)) {
      return true
    }
    
    return false
  }
}