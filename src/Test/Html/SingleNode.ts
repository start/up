import { expect } from 'chai'
import Up from '../../index'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../SyntaxNodes/InlineNsflNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../SyntaxNodes/NsflBlockNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'


describe('An empty document node', () => {
  it('does not produce any HTML on its own', () => {
    expect(Up.toHtml(new DocumentNode([]))).to.be.eql('')
  })
})


describe('A paragraph node', () => {
  it('produces a <p>', () => {
    const node = new ParagraphNode([new PlainTextNode('Nimble navigator')])
    expect(Up.toHtml(node)).to.be.eql('<p>Nimble navigator</p>')
  })
})


describe('An unordered list node', () => {
  it('produces an <ul> containing an <li> for each list item', () => {
    const node = new UnorderedListNode([
      new UnorderedListNode.Item([
        new ParagraphNode([
          new PlainTextNode('Tropical')
        ])
      ]),
      new UnorderedListNode.Item([
        new ParagraphNode([
          new PlainTextNode('Territories')
        ])
      ])
    ])
    expect(Up.toHtml(node)).to.be.eql('<ul><li><p>Tropical</p></li><li><p>Territories</p></li></ul>')
  })
})


describe('An ordered list node', () => {
  it('produces an <ol> containing an <li> for each list item', () => {
    const node = new OrderedListNode([
      new OrderedListNode.Item([
        new ParagraphNode([
          new PlainTextNode('Tropical')
        ])
      ]),
      new OrderedListNode.Item([
        new ParagraphNode([
          new PlainTextNode('Territories')
        ])
      ])
    ])
    expect(Up.toHtml(node)).to.be.eql('<ol><li><p>Tropical</p></li><li><p>Territories</p></li></ol>')
  })
})


context('When ordered list node contains an item with an explicit ordinal', () => {
  specify('the <li> for the appropriate list item is given a "value" attribute set to the appropriate ordinal', () => {
    const node = new OrderedListNode([
      new OrderedListNode.Item([
        new ParagraphNode([
          new PlainTextNode('Tropical')
        ])
      ]),
      new OrderedListNode.Item([
        new ParagraphNode([
          new PlainTextNode('Territories')
        ])
      ], 5)
    ])
    expect(Up.toHtml(node)).to.be.eql('<ol><li><p>Tropical</p></li><li value="5"><p>Territories</p></li></ol>')
  })
})


describe('An ordered list node with an explicit starting ordinal', () => {
  it('produces a ol element with an explicit starting ordinal, containing li elements for each list item', () => {
    const node = new OrderedListNode([
      new OrderedListNode.Item([
        new ParagraphNode([
          new PlainTextNode('Tropical')
        ])
      ], 3),
      new OrderedListNode.Item([
        new ParagraphNode([
          new PlainTextNode('Territories')
        ])
      ])
    ])
    expect(Up.toHtml(node)).to.be.eql('<ol start="3"><li value="3"><p>Tropical</p></li><li><p>Territories</p></li></ol>')
  })
})


describe('An ordered list node in descending order', () => {
  it('produces a ol element with the reversed attribute, containing li elements for each list item', () => {
    const node = new OrderedListNode([
      new OrderedListNode.Item([
        new ParagraphNode([
          new PlainTextNode('Tropical')
        ])
      ], 2),
      new OrderedListNode.Item([
        new ParagraphNode([
          new PlainTextNode('Territories')
        ])
      ], 1)
    ])
    expect(Up.toHtml(node)).to.be.eql(
      '<ol start="2" reversed><li value="2"><p>Tropical</p></li><li value="1"><p>Territories</p></li></ol>')
  })
})


describe('A description list', () => {
  it('produces a dl element containing dt elements for each term, and dd elements for each description', () => {
    const node =
      new DescriptionListNode([
        new DescriptionListNode.Item([
          new DescriptionListNode.Item.Term([new PlainTextNode('Bulbasaur')])
        ], new DescriptionListNode.Item.Description([
          new ParagraphNode([
            new PlainTextNode('A grass type Pokemon')
          ])
        ])),
        new DescriptionListNode.Item([
          new DescriptionListNode.Item.Term([new PlainTextNode('Confuse Ray')]),
          new DescriptionListNode.Item.Term([new PlainTextNode('Lick')]),
        ], new DescriptionListNode.Item.Description([
          new ParagraphNode([
            new PlainTextNode('Ghost type moves')
          ])
        ]))
      ])

    expect(Up.toHtml(node)).to.be.eql(
      '<dl>'
      + '<dt>Bulbasaur</dt>'
      + '<dd><p>A grass type Pokemon</p></dd>'
      + '<dt>Confuse Ray</dt>'
      + '<dt>Lick</dt>'
      + '<dd><p>Ghost type moves</p></dd>'
      + '</dl>')
  })
})


describe('A table', () => {
  it('produces a <table> containing a <caption> for its caption, a <thead> containing a <tr> containing a <th scope="col"> for each cell in its header, and <tr> for each row containing a <td> for each cell in that row', () => {
    const node =
      new TableNode(
        new TableNode.Header([
          new TableNode.Header.Cell([new PlainTextNode('Game')]),
          new TableNode.Header.Cell([new PlainTextNode('Release Date')])
        ]), [
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
            new TableNode.Row.Cell([new PlainTextNode('1995')])
          ]),
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
            new TableNode.Row.Cell([new PlainTextNode('1999')])
          ])
        ],
        new TableNode.Caption([
          new PlainTextNode('Games in the Chrono series')
        ]))

    expect(Up.toHtml(node)).to.be.eql(
      '<table>'
      + '<caption>Games in the Chrono series</caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Release Date</th></tr></thead>'
      + '<tr><td>Chrono Trigger</td><td>1995</td></tr>'
      + '<tr><td>Chrono Cross</td><td>1999</td></tr>'
      + '</table>')
  })
})


describe('A table without a caption or any rows', () => {
  it('produces a <table> that does not contain a <caption> or any <tr> outside of its <thead>', () => {
    const node =
      new TableNode(
        new TableNode.Header([
          new TableNode.Header.Cell([new PlainTextNode('Game')]),
          new TableNode.Header.Cell([new PlainTextNode('Release Date')])
        ]), [])

    expect(Up.toHtml(node)).to.be.eql(
      '<table>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Release Date</th></tr></thead>'
      + '</table>')
  })
})


context('When a table header has cells spanning multiple columns', () => {
  specify('the <th> for those header cells have a "colspan" attribute whose value is the number of columns spanned', () => {
    const node =
      new TableNode(
        new TableNode.Header([
          new TableNode.Header.Cell([new PlainTextNode('Game')], 5),
          new TableNode.Header.Cell([new PlainTextNode('Developer')], 3)
        ]), [])

    expect(Up.toHtml(node)).to.be.eql(
      '<table>'
      + '<thead><tr><th scope="col" colspan="5">Game</th><th scope="col" colspan="3">Developer</th></tr></thead>'
      + '</table>')
  })
})


context('When a table row has cells spanning multiple columns', () => {
  specify('the <td>s for those row cells have a "colspan" attribute whose value is the number of columns spanned', () => {
    const node =
      new TableNode(
        new TableNode.Header([
          new TableNode.Header.Cell([new PlainTextNode('Aerobic Exercise')]),
          new TableNode.Header.Cell([new PlainTextNode('Anaerobic Exercise')]),
          new TableNode.Header.Cell([new PlainTextNode('Cooldown')]),
          new TableNode.Header.Cell([new PlainTextNode('Date')])
        ]), [
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('Jogged on track')]),
            new TableNode.Row.Cell([new PlainTextNode('Swam laps')], 2),
            new TableNode.Row.Cell([new PlainTextNode('March 11, 2018')])
          ]),
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('Ran in neighborhood')], 3),
            new TableNode.Row.Cell([new PlainTextNode('March 12, 2018')])
          ])
        ])

    expect(Up.toHtml(node)).to.be.eql(
      '<table>'
      + '<thead><tr><th scope="col">Aerobic Exercise</th><th scope="col">Anaerobic Exercise</th><th scope="col">Cooldown</th><th scope="col">Date</th></tr></thead>'
      + '<tr><td>Jogged on track</td><td colspan="2">Swam laps</td><td>March 11, 2018</td></tr>'
      + '<tr><td colspan="3">Ran in neighborhood</td><td>March 12, 2018</td></tr>'
      + '</table>')
  })
})


describe('A line block node', () => {
  it('produces a div element with an "up-lines" class, containing a div element for each line', () => {
    const node = new LineBlockNode([
      new LineBlockNode.Line([
        new PlainTextNode('Hollow')
      ]),
      new LineBlockNode.Line([
        new PlainTextNode('Fangs')
      ])
    ])
    expect(Up.toHtml(node)).to.be.eql('<div class="up-lines"><div>Hollow</div><div>Fangs</div></div>')
  })
})


describe('A code block node', () => {
  it('produces a pre element containing a code element', () => {
    const node = new CodeBlockNode('color = Color.Green')
    expect(Up.toHtml(node)).to.be.eql('<pre><code>color = Color.Green</code></pre>')
  })
})


describe('A blockquote node', () => {
  it('produces a blockquote element', () => {
    const node = new BlockquoteNode([
      new ParagraphNode([
        new PlainTextNode('Centipede')
      ])
    ])
    expect(Up.toHtml(node)).to.be.eql('<blockquote><p>Centipede</p></blockquote>')
  })
})


describe('A level 1 heading node', () => {
  it('produces an h1 element', () => {
    const node = new HeadingNode([new PlainTextNode('Bulbasaur')], 1)
    expect(Up.toHtml(node)).to.be.eql('<h1>Bulbasaur</h1>')
  })
})


describe('A level 2 heading node', () => {
  it('produces an h2 element', () => {
    const node = new HeadingNode([new PlainTextNode('Ivysaur')], 2)
    expect(Up.toHtml(node)).to.be.eql('<h2>Ivysaur</h2>')
  })
})


describe('A level 3 heading node', () => {
  it('produces an h3 element', () => {
    const node = new HeadingNode([new PlainTextNode('Venusaur')], 3)
    expect(Up.toHtml(node)).to.be.eql('<h3>Venusaur</h3>')
  })
})


describe('A level 4 heading node', () => {
  it('produces an h4 element', () => {
    const node = new HeadingNode([new PlainTextNode('Charmander')], 4)
    expect(Up.toHtml(node)).to.be.eql('<h4>Charmander</h4>')
  })
})


describe('A level 5 heading node', () => {
  it('produces an h5 element', () => {
    const node = new HeadingNode([new PlainTextNode('Charmeleon')], 5)
    expect(Up.toHtml(node)).to.be.eql('<h5>Charmeleon</h5>')
  })
})


describe('A level 6 heading node', () => {
  it('produces an h6 element', () => {
    const node = new HeadingNode([new PlainTextNode('Charizard')], 6)
    expect(Up.toHtml(node)).to.be.eql('<h6>Charizard</h6>')
  })
})


describe('A level 7 heading node', () => {
  it('produces an h6 element', () => {
    const node = new HeadingNode([new PlainTextNode('Squirtle')], 7)
    expect(Up.toHtml(node)).to.be.eql('<h6>Squirtle</h6>')
  })
})


describe('A level 8 heading node', () => {
  it('produces an h6 element', () => {
    const node = new HeadingNode([new PlainTextNode('Wartortle')], 8)
    expect(Up.toHtml(node)).to.be.eql('<h6>Wartortle</h6>')
  })
})


describe('A level 9 heading node', () => {
  it('produces an h6 element', () => {
    const node = new HeadingNode([new PlainTextNode('Blastoise')], 9)
    expect(Up.toHtml(node)).to.be.eql('<h6>Blastoise</h6>')
  })
})


describe('A section separator node', () => {
  it('produces an hr element', () => {
    const node = new SectionSeparatorNode()
    expect(Up.toHtml(node)).to.be.eql('<hr>')
  })
})


describe('An emphasis node', () => {
  it('produces an em element', () => {
    const node = new EmphasisNode([new PlainTextNode('Always')])
    expect(Up.toHtml(node)).to.be.eql('<em>Always</em>')
  })
})


describe('A stress node', () => {
  it('produces a strong element', () => {
    const node = new StressNode([new PlainTextNode('Ness')])
    expect(Up.toHtml(node)).to.be.eql('<strong>Ness</strong>')
  })
})


describe('An inline code node', () => {
  it('produces a code element', () => {
    const node = new InlineCodeNode('then')
    expect(Up.toHtml(node)).to.be.eql('<code>then</code>')
  })
})


describe('A revision insertion node', () => {
  it('produces an ins element', () => {
    const node = new RevisionInsertionNode([new PlainTextNode('Wario')])
    expect(Up.toHtml(node)).to.be.eql('<ins>Wario</ins>')
  })
})


describe('A revision deletion node', () => {
  it('produces a del element', () => {
    const node = new RevisionDeletionNode([new PlainTextNode('Koopa Tropa')])
    expect(Up.toHtml(node)).to.be.eql('<del>Koopa Tropa</del>')
  })
})


describe('A parenthesized node', () => {
  it('produces a span element with an "up-parenthesized" class', () => {
    const node = new ParenthesizedNode([new PlainTextNode('(Koopa Tropa)')])
    expect(Up.toHtml(node)).to.be.eql('<span class="up-parenthesized">(Koopa Tropa)</span>')
  })
})


describe('A square bracketed node', () => {
  it('produces a span element with an "up-square-bracketed" class', () => {
    const node = new SquareBracketedNode([new PlainTextNode('[Koopa Tropa]')])
    expect(Up.toHtml(node)).to.be.eql('<span class="up-square-bracketed">[Koopa Tropa]</span>')
  })
})


describe('An action node', () => {
  it('produces a span element with an "up-action" class', () => {
    const node = new ActionNode([new PlainTextNode('dies')])
    expect(Up.toHtml(node)).to.be.eql('<span class="up-action">dies</span>')
  })
})


describe('A link node', () => {
  it('produces an a (anchor) element with an href attribute', () => {
    const node = new LinkNode([new PlainTextNode('Google')], 'https://google.com')
    expect(Up.toHtml(node)).to.be.eql('<a href="https://google.com">Google</a>')
  })
})


describe('A footnote node', () => {
  it("produces a sup element (with an 'up-footnote-reference' class and an ID indicating its reference number) containing a link that contains the reference number and points to the footnote", () => {
    const node = new FootnoteNode([], 3)
    expect(Up.toHtml(node)).to.be.eql('<sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup>')
  })
})


describe('A footnote block node', () => {
  it("produces a dl element with an 'up-footnotes' class", () => {
    const node = new FootnoteBlockNode([])
    expect(Up.toHtml(node)).to.be.eql('<dl class="up-footnotes"></dl>')
  })
})


describe("Each footnote in a footnote block", () => {
  it("produce a dt element with an ID indicating its reference number (containing a link that contains the reference number and points to the reference) and a dd element containing the footnote contents", () => {
    const node =
      new FootnoteBlockNode([
        new FootnoteNode([
          new PlainTextNode("Arwings"),
        ], 2),
        new FootnoteNode([
          new PlainTextNode("Killer Bees"),
        ], 3),
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })
})


describe('An image node', () => {
  it('produces an img element with src and title attributes', () => {
    const node = new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg')
    expect(Up.toHtml(node)).to.be.eql('<img src="http://example.com/hauntedhouse.svg" alt="haunted house" title="haunted house">')
  })
})


describe('An audio node', () => {
  it('produces an audio element with src and title attributes, containing a fallback anchor element', () => {
    const node = new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg')
    expect(Up.toHtml(node)).to.be.eql(
      '<audio src="http://example.com/ghosts.ogg" title="ghostly howling" controls loop><a href="http://example.com/ghosts.ogg">ghostly howling</a></audio>')
  })
})


describe('A video node', () => {
  it('produces a video element with src and title attributes, containing a fallback anchor element', () => {
    const node = new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
    expect(Up.toHtml(node)).to.be.eql(
      '<video src="http://example.com/poltergeists.webm" title="ghosts eating luggage" controls loop><a href="http://example.com/poltergeists.webm">ghosts eating luggage</a></video>')
  })
})


describe('An inline spoiler node', () => {
  it('produces a span element (with "up-spoiler" and "up-revealable" classes), containing a label (with the text "toggle spoiler"), an associated checkbox, and a span element containing the spoiler contents', () => {
    const node = new InlineSpoilerNode([new PlainTextNode('45.9%')])

    const html =
      '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<span>45.9%</span>'
      + '</span>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })
})


describe('An NSFW node', () => {
  it('produces a span element (with "up-nsfw" and "up-revealable" classes), containing a label (with the text "toggle NSFW"), an associated checkbox, and a span element containing the NSFW contents', () => {
    const node = new InlineNsfwNode([new PlainTextNode('naked Gary')])

    const html =
      '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">toggle NSFW</label>'
      + '<input id="up-nsfw-1" type="checkbox">'
      + '<span>naked Gary</span>'
      + '</span>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })
})


describe('An inline NSFL node', () => {
  it('produces a span element (with "up-nsfl" and "up-revealable" classes), containing a label (with the text "toggle NSFL"), an associated checkbox, and a span element containing the NSFL contents', () => {
    const node = new InlineNsflNode([new PlainTextNode('rotting Gary')])

    const html =
      '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">toggle NSFL</label>'
      + '<input id="up-nsfl-1" type="checkbox">'
      + '<span>rotting Gary</span>'
      + '</span>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })
})


describe('A spoiler block node', () => {
  it('produces the same markup as an inline spoiler node, but with div elements instead of span elements', () => {
    const node = new SpoilerBlockNode([
      new ParagraphNode([
        new PlainTextNode('John Carmack is a decent programmer.')
      ])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<div>'
      + '<p>John Carmack is a decent programmer.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })
})


describe('A NSFW block node', () => {
  it('produces the same markup as an inline NSFW node, but with div elements instead of span elements', () => {
    const node = new NsfwBlockNode([
      new ParagraphNode([
        new PlainTextNode('John Carmack is a decent programmer.')
      ])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">toggle NSFW</label>'
      + '<input id="up-nsfw-1" type="checkbox">'
      + '<div>'
      + '<p>John Carmack is a decent programmer.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })
})


describe('A NSFL block node', () => {
  it('produces the same markup as an inline NSFL node, but with div elements instead of span elements', () => {
    const node = new NsflBlockNode([
      new ParagraphNode([
        new PlainTextNode('John Carmack is a decent programmer.')
      ])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">toggle NSFL</label>'
      + '<input id="up-nsfl-1" type="checkbox">'
      + '<div>'
      + '<p>John Carmack is a decent programmer.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })
})


describe('A plain text node', () => {
  it('produces text, not an html element', () => {
    const node = new PlainTextNode('Kokiri Forest')
    expect(Up.toHtml(node)).to.be.eql('Kokiri Forest')
  })
})
