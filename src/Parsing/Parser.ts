import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'

export function parse(text: string): DocumentNode {
  const documentNode = new DocumentNode
  
  let i = 0;
  let workingText = '';
  
  while (i < text.length) {
    let currentChar = text[i]
    
    switch (currentChar) {
      case '\\':
        if (1 + i === text.length) {
          break;
        }
        
        i += 1;
        workingText += text[i]
        break;
        
      default:
        workingText += currentChar;
    }
    
    i += 1;
  }
  
  if (workingText) {
    documentNode.children.push(new PlainTextNode(workingText))
  }
  
  return documentNode
}