import { UpDocument } from './UpDocument'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Writer } from '../Writing/Writer'
import { isEqualIgnoringCapitalization, containsStringIgnoringCapitalization } from '../StringHelpers'


export class ReferenceToTableOfContentsEntry implements InlineSyntaxNode {
  constructor(
    public snippetFromEntry: string,
    public entry?: UpDocument.TableOfContents.Entry) { }

  text(): string {
    return (
      this.entry
        ? this.entry.text()
        : this.snippetFromEntry)
  }

  referenceMostAppropriateTableOfContentsEntry(tableOfContents: UpDocument.TableOfContents): void {
    // We'll use `snippetFromEntry` to associate this reference object with the most appropriate table
    // of contents entry.
    //
    // Here's our strategy:
    //
    // First, we'll try to associate this reference with the first entry whose text exactly equals
    // `snippetFromEntry`. We don't care about capitalization, but the text otherwise has to be an exact
    // match. 
    //
    // If there are no exact matches, then we'll try to associate this reference with the first entry
    // whose text *contains* snippetFromEntry`.
    //
    // If we still don't have a match after that, then we're out of luck.
    //
    // TODO: Continue searching using another algorithm (e.g. string distance).
    //
    // TODO: When searching, also include text of "outer" entries to help resolve ambiguities. "Outer"
    // entries are those that conceptually enclose a given an entry. For example, a level-3 heading is
    // enclosed by a level-2 and a level-1 heading.

    for (const entry of tableOfContents.entries) {
      const textOfEntry = entry.text()
      const { snippetFromEntry } = this

      if (isEqualIgnoringCapitalization(textOfEntry, snippetFromEntry)) {
        // We found a perfect match! We're done.
        this.entry = entry
        return
      }

      if (!this.entry) {
        if (containsStringIgnoringCapitalization({ haystack: textOfEntry, needle: snippetFromEntry })) {
          // We've found non-perfect match. We'll keep searching in case there's a perfect match
          // further in the table of contents.
          this.entry = entry
        }
      }
    }
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  write(writer: Writer): string {
    return writer.referenceToTableOfContentsEntry(this)
  }
}
