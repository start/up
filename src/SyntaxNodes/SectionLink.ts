import { Document } from './Document'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'
import { isEqualIgnoringCapitalization, containsStringIgnoringCapitalization } from '../StringHelpers'


// A section link is essentially a reference to an item referenced by the table of contents.
export class SectionLink implements InlineSyntaxNode {
  constructor(
    public sectionTitleSnippet: string,
    public entry?: Document.TableOfContents.Entry) { }

  referenceMostAppropriateTableOfContentsEntry(tableOfContents: Document.TableOfContents): void {
    // We'll use `sectionTitleSnippet` to try to match this section link with the most appropriate
    // item referenced by the table of contents.
    //
    // Here's our strategy:
    //
    // First, we'll try to associate this section link with the first entry whose text exactly
    // equals `sectionTitleSnippet`. We don't care about capitalization, but the text otherwise has
    // to be an exact match. 
    //
    // If there are no exact matches, then we'll try to associate this section link with the first
    // entry whose text contains `sectionTitleSnippet`.
    //
    // If we still don't have a match after that, then we're out of luck. We give up.
    //
    // TODO: Continue searching using another algorithm (e.g. string distance).
    //
    // TODO: When searching, also include text of "outer" entries to help resolve ambiguities.
    // "Outer" entries are those that conceptually enclose a given an entry. For example, a level-3
    // heading is enclosed by a level-2 and a level-1 heading.

    for (const entry of tableOfContents.entries) {
      const textOfEntry = entry.searchableText()
      const { sectionTitleSnippet } = this

      if (isEqualIgnoringCapitalization(textOfEntry, sectionTitleSnippet) && this.canMatch(entry)) {
        // We found a perfect match! We're done.
        this.entry = entry
        return
      }

      if (!this.entry) {
        if (
          containsStringIgnoringCapitalization({ haystack: textOfEntry, needle: sectionTitleSnippet })
          && this.canMatch(entry)
        ) {
          // We've found non-perfect match. We'll keep searching in case there's a perfect match
          // further in the table of contents.
          this.entry = entry
        }
      }
    }
  }

  textAppearingInline(): string {
    return (
      this.entry
        ? this.entry.searchableText()
        : this.sectionTitleSnippet)
  }
  
  // Right now, searchable text is only used for one thing: to determine whether a given table of
  // contents entry (i.e. a heading) contains the `sectionTitleSnippet` of a section link.
  //
  // Therefore, this method will only be called if a heading were to inexplicably contain this
  // syntax node.
  //
  // Why do we expose only `sectionTitleSnippet` as searchable? Why not instead expose our entry's 
  // searchable text? Because if a heading *were* to contain this syntax node, we don't want that
  // heading to be "matchable" using text from the heading this syntax node is referencing.
  searchableText(): string {
    return this.sectionTitleSnippet
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.sectionLink(this)
  }

  private canMatch(entry: Document.TableOfContents.Entry): boolean {
    // Right now, we have only one rule: We will not match an entry if it contains this syntax node.
    return (entry.inlineDescendants().indexOf(this) === -1)
  }
}
