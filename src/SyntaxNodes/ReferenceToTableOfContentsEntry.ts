import { UpDocument } from './UpDocument'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { patternIgnoringCapitalizationAndContaining, escapeForRegex } from '../Parsing/PatternHelpers'


export class ReferenceToTableOfContentsEntry implements InlineSyntaxNode {
  constructor(
    public entryTextSnippet: string,
    public entry?: UpDocument.TableOfContents.Entry) { }

  // TODO
  text(): string {
    return ''
  }

  // If a reference has no matching entry, then this entry 
  hasNoMatchingEntry(): boolean {
    return this.entry == null
  }

  referenceMostAppropriateTableOfContentsEntry(entries: UpDocument.TableOfContents.Entry[]): void {
    // We'll try to match our `entryTextSnippet` with the text of an entry. To be clear, the "text" of an
    // entry refers to the actual text content of the entry. For example, if an entry was originally
    // produced by the following markup:
    // 
    //    Why documents should consist *solely* of `<font>` elements
    //    ----------------------------------------------------------
    //
    // ... Then the entry's' text would be:
    //
    //    Why documents should consist solely of <font> elements
    //
    //
    // We'll match with the first entry whose text exactly equals `entryTextSnippet`. We don't care about
    // capitalization, but the text otherwise has to be an exact match. 
    //
    // If there are no exact matches,
    // then we'll match the first entry whose text *contains* `entryTextSnippet`.
    //
    // If we still don't have a match after that, then we're out of luck.
    //
    // TODO: Consider measuring string distance. 

    for (const entry of entries) {
      const textOfEntry = entry.text()

      if (textOfEntry === this.entryTextSnippet) {
        // We found a perfect match! We're done.
        this.entry = entry
        return
      }

      if (!this.entry) {
        const CONTAINS_SNIPPET_PATTERN =
          patternIgnoringCapitalizationAndContaining(escapeForRegex(this.entryTextSnippet))

        if (CONTAINS_SNIPPET_PATTERN.test(textOfEntry)) {
          this.entry = entry
        }
      }
    }
  }
}
