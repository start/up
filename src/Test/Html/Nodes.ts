/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'

import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../SyntaxNodes/UnorderedListItem'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionListItem } from '../../SyntaxNodes/DescriptionListItem'
import { DescriptionTerm } from '../../SyntaxNodes/DescriptionTerm'
import { Description } from '../../SyntaxNodes/Description'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { Line } from '../../SyntaxNodes/Line'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import * as Up from '../../index'

describe('An empty document node', () => {
  it('does not produce any HTML on its own', () => {
    expect(Up.htmlFromSyntaxNode(new DocumentNode())).to.be.eql('')
  })
})

describe('A paragraph node', () => {
  it('produces a p element', () => {
    const node = new ParagraphNode([new PlainTextNode('Nimble navigator')])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<p>Nimble navigator</p>')
  })
})

describe('An unordered list node', () => {
  it('produces a ul element containing li elements for each list item', () => {
    const node = new UnorderedListNode([
      new UnorderedListItem([
        new ParagraphNode([
          new PlainTextNode('Tropical')
        ])
      ]),
      new UnorderedListItem([
        new ParagraphNode([
          new PlainTextNode('Territories')
        ])
      ])
    ])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<ul><li><p>Tropical</p></li><li><p>Territories</p></li></ul>')
  })
})

describe('An ordered list node', () => {
  it('produces a ol element containing li elements for each list item', () => {
    const node = new OrderedListNode([
      new OrderedListItem([
        new ParagraphNode([
          new PlainTextNode('Tropical')
        ])
      ]),
      new OrderedListItem([
        new ParagraphNode([
          new PlainTextNode('Territories')
        ])
      ])
    ])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<ol><li><p>Tropical</p></li><li><p>Territories</p></li></ol>')
  })
})

describe('An ordered list node with an item with an explicit ordinal', () => {
  it('produces a ol element containing li elements, with an explicit ordinal for the appropriate li element', () => {
    const node = new OrderedListNode([
      new OrderedListItem([
        new ParagraphNode([
          new PlainTextNode('Tropical')
        ])
      ]),
      new OrderedListItem([
        new ParagraphNode([
          new PlainTextNode('Territories')
        ])
      ], 5)
    ])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<ol><li><p>Tropical</p></li><li value="5"><p>Territories</p></li></ol>')
  })
})

describe('An ordered list node with an explicit starting ordinal', () => {
  it('produces a ol element with an explicit starting ordinal, containing li elements for each list item', () => {
    const node = new OrderedListNode([
      new OrderedListItem([
        new ParagraphNode([
          new PlainTextNode('Tropical')
        ])
      ], 3),
      new OrderedListItem([
        new ParagraphNode([
          new PlainTextNode('Territories')
        ])
      ])
    ])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<ol start="3"><li value="3"><p>Tropical</p></li><li><p>Territories</p></li></ol>')
  })
})

describe('An ordered list node in descending order', () => {
  it('produces a ol element with the reversed attribute, containing li elements for each list item', () => {
    const node = new OrderedListNode([
      new OrderedListItem([
        new ParagraphNode([
          new PlainTextNode('Tropical')
        ])
      ], 2),
      new OrderedListItem([
        new ParagraphNode([
          new PlainTextNode('Territories')
        ])
      ], 1)
    ])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql(
      '<ol start="2" reversed><li value="2"><p>Tropical</p></li><li value="1"><p>Territories</p></li></ol>')
  })
})

describe('A description list', () => {
  it('produces a dl element containing dt elements for each term, and dd elements for each description', () => {
    const node = new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Bulbasaur')])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('A grass type Pokemon')
            ])
          ])),          
          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Confuse Ray')]),
            new DescriptionTerm([new PlainTextNode('Lick')]),
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('Ghost type moves')
            ])
          ]))
        ])
      ])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql(
      '<dl><dt>Bulbasaur</dt><dd><p>A grass type Pokemon</p></dd><dt>Confuse Ray</dt><dt>Lick</dt><dd><p>Ghost type moves</p></dd></dl>')
  })
})

describe('A line block node with line nodes', () => {
  it('produces no outer element and a div element for each node', () => {
    const node = new LineBlockNode([
      new Line([
        new PlainTextNode('Hollow')
      ]),
      new Line([
        new PlainTextNode('Fangs')
      ])
    ])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<div>Hollow</div><div>Fangs</div>')
  })
})

describe('A code block node', () => {
  it('produces a pre element containing a code element', () => {
    const node = new CodeBlockNode('color = Color.Green')
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<pre><code>color = Color.Green</code></pre>')
  })
})

describe('A blockquote node', () => {
  it('produces a blockquote element', () => {
    const node = new BlockquoteNode([
      new ParagraphNode([
        new PlainTextNode('Centipede')
      ])
    ])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<blockquote><p>Centipede</p></blockquote>')
  })
})

describe('A level 1 heading node', () => {
  it('produces an h1 element', () => {
    const node = new HeadingNode([new PlainTextNode('Bulbasaur')], 1)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h1>Bulbasaur</h1>')
  })
})

describe('A level 2 heading node', () => {
  it('produces an h2 element', () => {
    const node = new HeadingNode([new PlainTextNode('Ivysaur')], 2)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h2>Ivysaur</h2>')
  })
})

describe('A level 3 heading node', () => {
  it('produces an h3 element', () => {
    const node = new HeadingNode([new PlainTextNode('Venusaur')], 3)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h3>Venusaur</h3>')
  })
})

describe('A level 4 heading node', () => {
  it('produces an h4 element', () => {
    const node = new HeadingNode([new PlainTextNode('Charmander')], 4)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h4>Charmander</h4>')
  })
})

describe('A level 5 heading node', () => {
  it('produces an h5 element', () => {
    const node = new HeadingNode([new PlainTextNode('Charmeleon')], 5)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h5>Charmeleon</h5>')
  })
})

describe('A level 6 heading node', () => {
  it('produces an h6 element', () => {
    const node = new HeadingNode([new PlainTextNode('Charizard')], 6)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h6>Charizard</h6>')
  })
})

describe('A level 7 heading node', () => {
  it('produces an h6 element', () => {
    const node = new HeadingNode([new PlainTextNode('Squirtle')], 7)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h6>Squirtle</h6>')
  })
})

describe('A level 8 heading node', () => {
  it('produces an h6 element', () => {
    const node = new HeadingNode([new PlainTextNode('Wartortle')], 8)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h6>Wartortle</h6>')
  })
})

describe('A level 9 heading node', () => {
  it('produces an h6 element', () => {
    const node = new HeadingNode([new PlainTextNode('Blastoise')], 9)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h6>Blastoise</h6>')
  })
})

describe('An emphasis node', () => {
  it('produces an em element', () => {
    const node = new EmphasisNode([new PlainTextNode('Always')])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<em>Always</em>')
  })
})

describe('A stress node', () => {
  it('produces a strong element', () => {
    const node = new StressNode([new PlainTextNode('Ness')])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<strong>Ness</strong>')
  })
})

describe('A revision insertion node', () => {
  it('produces an ins element', () => {
    const node = new RevisionInsertionNode([new PlainTextNode('Wario')])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<ins>Wario</ins>')
  })
})

describe('A revision deletion node', () => {
  it('produces a del element', () => {
    const node = new RevisionDeletionNode([new PlainTextNode('Koopa Tropa')])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<del>Koopa Tropa</del>')
  })
})

describe('An inline aside node', () => {
  it('produces a small element', () => {
    const node = new InlineAsideNode([new PlainTextNode('Probably')])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<small>Probably</small>')
  })
})

describe('A link node', () => {
  it('produces an a (anchor) element with an href attribute', () => {
    const node = new LinkNode([new PlainTextNode('Google')], 'https://google.com')
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<a href="https://google.com">Google</a>')
  })
})

describe('A spoiler node', () => {
  it('produces a span element with an empty data-spoiler attribute', () => {
    const node = new SpoilerNode([new PlainTextNode('45.9%')])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<span data-spoiler>45.9%</span>')
  })
})

describe('A plain text node', () => {
  it('produces text, not an html element', () => {
    const node = new PlainTextNode('Kokiri Forest')
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('Kokiri Forest')
  })
})