import { parse } from './Parsing/Parser'
import { DocumentNode } from './SyntaxNodes/DocumentNode'

export function ast(text: string): DocumentNode {
  return parse(text);
}