import { Document } from './Document'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'
import { isEqualIgnoringCapitalization, containsStringIgnoringCapitalization } from '../StringHelpers'
import { getTextAppearingInline } from './getTextAppearingInline'


// A section link is essentially a reference to a table of contents entry.
export class SectionLink implements InlineSyntaxNode {
  constructor(
    public markupSnippetFromSectionTitle: string,
    public entry?: Document.TableOfContents.Entry) { }

  referenceMostAppropriateTableOfContentsEntry(tableOfContents: Document.TableOfContents): void {
    // We'll use try to match our `markupSnippetFromSectionTitle` with the `titleMarkup` of the
    // most appropriate table of contents entry.
    //
    // Here's our strategy:
    //
    // First, we'll try to associate this section link with the first entry whose `titleMarkup`
    // exactly equals `markupSnippetFromSectionTitle`. We don't care about capitalization, but the
    // two otherwise have to be an exact match. 
    //
    // If there are no exact matches, then we'll try to associate this section link with the first
    // entry whose `titleMarkup` contains `markupSnippetFromSectionTitle`.
    //
    // If we still don't have a match after that, then we're out of luck. We give up.
    //
    // TODO: Continue searching using another algorithm (e.g. string distance).
    //
    // TODO: When multiple entries match `markupSnippetFromSectionTitle`, consider preferring the
    // entry representing the heading closest to this section link.

    // As a rule, section links with empty snippets are never matched to a table of contents entry.
    if (!this.markupSnippetFromSectionTitle) {
      return
    }

    for (const entry of tableOfContents.entries) {
      const { titleMarkup } = entry
      const { markupSnippetFromSectionTitle } = this

      if (isEqualIgnoringCapitalization(titleMarkup, markupSnippetFromSectionTitle) && this.canMatch(entry)) {
        // We found a perfect match! We're done.
        this.entry = entry
        return
      }

      if (!this.entry) {
        if (
          containsStringIgnoringCapitalization({ haystack: titleMarkup, needle: markupSnippetFromSectionTitle })
          && this.canMatch(entry)
        ) {
          // We've found a non-perfect match. We'll keep searching in case there's a perfect match
          // further in the table of contents.
          this.entry = entry
        }
      }
    }
  }

  textAppearingInline(): string {
    return (
      this.entry
        ? getTextAppearingInline(this.entry.children)
        : this.markupSnippetFromSectionTitle)
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.sectionLink(this)
  }

  private canMatch(entry: Document.TableOfContents.Entry): boolean {
    // We won't match an entry if it contains this section link.
    return (entry.children.indexOf(this) === -1)
  }
}
