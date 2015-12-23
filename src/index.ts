import { Parser } from './Parsing/Parser'
import { DocumentNode } from './SyntaxNodes/DocumentNode'

const parser = new Parser();

export function ast(text: string): DocumentNode {
  return parser.parse(text);
}