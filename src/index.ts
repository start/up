import { BlockParser } from './Parsing/BlockParser'
import { DocumentNode } from './SyntaxNodes/DocumentNode'

export function ast(text: string): DocumentNode {
  return new BlockParser(text).documentNode;
}