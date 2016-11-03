import { Document } from './Document'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'
import { isEqualIgnoringCapitalization, containsStringIgnoringCapitalization } from '../StringHelpers'
import { getTextAppearingInline } from './getTextAppearingInline'


// A section link is essentially a reference to a table of contents entry.
export class SectionLink implements InlineSyntaxNode {
  constructor(
    public matchingMarkupSnippet: string,
    public entry?: Document.TableOfContents.Entry) { }

  referenceMostAppropriateTableOfContentsEntry(tableOfContents: Document.TableOfContents): void {
    // We'll use `matchingMarkupSnippet` to try to match this section link with the most appropriate
    // table of contents entry.
    //
    // Here's our strategy:
    //
    // First, we'll try to associate this section link with the first entry whose `searchableMarkup` exactly
    // equals `matchingMarkupSnippet`. We don't care about capitalization, but the two otherwise have
    // to be an exact match. 
    //
    // If there are no exact matches, then we'll try to associate this section link with the first
    // entry whose `searchableMarkup` contains `matchingMarkupSnippet`.
    //
    // If we still don't have a match after that, then we're out of luck. We give up.
    //
    // TODO: Continue searching using another algorithm (e.g. string distance).
    //
    // TODO: When searching, also include text of "outer" entries to help resolve ambiguities.
    // "Outer" entries are those that conceptually enclose a given an entry. For example, a level-3
    // heading is enclosed by a level-2 and a level-1 heading.

    // As a rule, section links with empty snippets are never matched to a table of contents entry.
    if (!this.matchingMarkupSnippet) {
      return
    }

    for (const entry of tableOfContents.entries) {
      const textOfEntry = entry.searchableMarkup
      const { matchingMarkupSnippet } = this

      if (isEqualIgnoringCapitalization(textOfEntry, matchingMarkupSnippet) && this.canMatch(entry)) {
        // We found a perfect match! We're done.
        this.entry = entry
        return
      }

      if (!this.entry) {
        if (
          containsStringIgnoringCapitalization({ haystack: textOfEntry, needle: matchingMarkupSnippet })
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
        ? getTextAppearingInline(this.entry.contentWithinTableOfContents())
        : this.matchingMarkupSnippet)
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
