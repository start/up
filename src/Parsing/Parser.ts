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
  NeedsToBeClosed
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
  let parentFailedToParse = false;
  let resultNodes: SyntaxNode[] = [];
  let workingText = ''
  let isNextCharEscaped = false
  let charIndex = 0

  for (charIndex = initialCharIndex; charIndex < text.length; charIndex += 1) {
    if (isParentClosed || parentFailedToParse) {
      break;
    }
    
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

    if (parseIfCurrentTextIs('`', InlineCodeNode)) {
      continue
    }
    
    if (isCurrentText('***') && !areAnyDistantAncestorsEither([EmphasisNode, StressNode])) {
      // TODO
    }

    if (handleSandwichIfCurrentTextIs('**', StressNode)) {
      continue;
    }

    if (handleSandwichIfCurrentTextIs('*', EmphasisNode)) {
      continue;
    }

    workingText += char
  }
  
  if (parentFailedToParse || parentNodeStatus === NodeStatus.NeedsToBeClosed) {
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
  
  function isParentEither(syntaxNodeTypes: SyntaxNodeType[]): boolean {
    return isNodeEither(parentNode, syntaxNodeTypes)
  }
  
  function isNodeEither(node: SyntaxNode, syntaxNodeTypes: SyntaxNodeType[]): boolean {
    return syntaxNodeTypes.some(SyntaxNodeType => node instanceof SyntaxNodeType)
  }

  function areAnyDistantAncestors(SyntaxNodeType: SyntaxNodeType): boolean {
    return parentNode.parents().some(ancestor => ancestor instanceof SyntaxNodeType)
  }
  
  function areAnyDistantAncestorsEither(syntaxNodeTypes: SyntaxNodeType[]): boolean {
    return parentNode.parents().some(ancestor => isNodeEither(ancestor, syntaxNodeTypes))
  }

  function isCurrentText(needle: string): boolean {
    return needle === text.substr(charIndex, needle.length)
  }
  
  function advanceCountExtraCharsConsumed(countCharsConsumed: number): void {
    charIndex += countCharsConsumed - 1
  }

  function flushWorkingText(): void {
    if (workingText) {
      resultNodes.push(new PlainTextNode(workingText))
    }
    workingText = ''
  }
  
  function tryParse(ParentSyntaxNodeType: SyntaxNodeType, countCharsToSkip: number): boolean {
    const potentialNode = new ParentSyntaxNodeType();
    potentialNode.parent = parentNode
    
    const startIndex = charIndex + countCharsToSkip
    const parseResult =
      parseInline(potentialNode, text, startIndex, NodeStatus.NeedsToBeClosed);
    
    if (parseResult.success()) {
        flushWorkingText()
        potentialNode.addChildren(parseResult.nodes)
        resultNodes.push(potentialNode)
        advanceCountExtraCharsConsumed(countCharsToSkip + parseResult.countCharsConsumed)
        return true
    }
    
    return false
  }

  function closeParent(): void {
    flushWorkingText()
    parentNodeStatus = NodeStatus.Okay
    isParentClosed = true
  }

  function parseIfCurrentTextIs(needle: string, SyntaxNodeType: SyntaxNodeType): boolean {
    return isCurrentText(needle) && tryParse(SyntaxNodeType, needle.length)
  }

  function closeParentIfCurrentTextIs(needle: string) {
    if (isCurrentText(needle)) {
      closeParent()
      advanceCountExtraCharsConsumed(needle.length);
      return true;
    }
    
    return false;
  }

  function handleSandwichIfCurrentTextIs(bun: string, SandwichNodeType: SyntaxNodeType): boolean {
    if (!isCurrentText(bun)) {
      return false
    }

    if (isParent(SandwichNodeType)) {
      closeParent()
      advanceCountExtraCharsConsumed(bun.length)
      return true
    }
    
    // If we're indirectly nested inside a node of this type, we can't reognize this bun as its end,
    // just yet, because we'd be leaving the innermost nodes dangling. So we fail the current node,
    // which lets the parser try again (likely interpreting the opening of the dangling node as plain
    // text.
    if (areAnyDistantAncestors(SandwichNodeType)) {
      parentFailedToParse = true;
      return false
    }

    if (tryParse(SandwichNodeType, bun.length)) {
      return true
    }
    
    return false
  }
}