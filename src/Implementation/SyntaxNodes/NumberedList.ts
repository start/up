import { concat } from '../CollectionHelpers'
import { Renderer } from '../Rendering/Renderer'
import { Heading } from './Heading'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'


export class NumberedList implements OutlineSyntaxNode {
  sourceLineNumber?: number

  constructor(
    public items: NumberedList.Item[],
    options?: { sourceLineNumber: number }
  ) {
    this.sourceLineNumber = options?.sourceLineNumber
  }

  start(): number | undefined {
    return this.items[0].ordinal
  }

  order(): NumberedList.Order {
    const [firstOrdinal, secondOrdinal] =
      this.items
        .filter(item => item.ordinal != null)
        .map(item => item.ordinal)

    const firstTwoOrdinalsAreDescending =
      firstOrdinal != null
      && secondOrdinal != null
      && firstOrdinal > secondOrdinal

    return firstTwoOrdinalsAreDescending
      ? 'desc'
      : 'asc'
  }

  descendantsToIncludeInTableOfContents(): Heading[] {
    return concat(
      this.items.map(item => item.descendantsToIncludeInTableOfContents()))
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return concat(
      this.items.map(item => item.inlineDescendants()))
  }

  render(renderer: Renderer): string {
    return renderer.numberedList(this)
  }
}


export namespace NumberedList {
  export class Item extends OutlineSyntaxNodeContainer {
    ordinal?: number

    constructor(
      public children: OutlineSyntaxNode[],
      options?: { ordinal?: number }
    ) {
      super(children)
      this.ordinal = options?.ordinal
    }

    protected readonly NUMBERED_LIST_ITEM = undefined
  }

  export type Order = 'asc' | 'desc'
}
