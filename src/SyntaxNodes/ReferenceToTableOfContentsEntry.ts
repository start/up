import { UpDocument } from './UpDocument'
import { InlineSyntaxNode } from './InlineSyntaxNode'


export class ReferenceToTableOfContentsEntry implements InlineSyntaxNode {
  constructor(
    public textSnippetFromEntry: string,
    public entry?: UpDocument.TableOfContents.Entry) { }

  // TODO
  text(): string {
    return ''
  }
}
