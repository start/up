import { Parser } from './Parsing/Parser'
import { DocumentNode } from './SyntaxNodes/DocumentNode'

export function ast(text: string): DocumentNode {
  return new Parser().parse(text);
}