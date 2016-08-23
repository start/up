import { UpDocument } from './UpDocument'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Writer } from '../Writing/Writer'
import { isEqualIgnoringCapitalization, containsStringIgnoringCapitalization } from '../StringHelpers'


export class ReferenceToTableOfContentsEntry implements InlineSyntaxNode {
  constructor(
    public snippetFromEntry: string,
    public entry?: UpDocument.TableOfContents.Entry) { }

  referenceMostAppropriateTableOfContentsEntry(tableOfContents: UpDocument.TableOfContents): void {
    // We'll use `snippetFromEntry` to match this reference object with the most appropriate table of
    // contents entry.
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
      const textOfEntry = entry.searchableText()
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

  inlineText(): string {
    return (
      this.entry
        ? this.entry.searchableText()
        : this.snippetFromEntry)
  }

  // Our snippet is the only searchable text we expose.
  //
  // Right now, searchable text is only used for one thing: to determine whether a table of contents
  // entry matches the snippet of a reference.
  //
  // This is a confusing edge case, but:
  //
  // 1. If a table of contents entry (i.e. a heading) inexplicably contains a reference to another
  //    entry...
  //
  // 2. And if that reference's snippet contains only a word or two from the second entry...
  //
  // ... Then as far as searching is concerned, it could potentially be confusing if *all* of the text
  // from the second entry were considered part of the first entry. Searching for any partial text
  // within the second entry would always match the first entry instead. 
  //
  // I'm not sure what the best behavior is, and luckily, it'll probably never matter.   
  searchableText(): string {
    return this.snippetFromEntry
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  write(writer: Writer): string {
    return writer.referenceToTableOfContentsEntry(this)
  }
}
