import { expect } from 'chai'
import Up from '../../index'
import { Link } from '../../SyntaxNodes/Link'
import { Image } from '../../SyntaxNodes/Image'
import { Audio } from '../../SyntaxNodes/Audio'
import { Video } from '../../SyntaxNodes/Video'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { ExampleInput } from '../../SyntaxNodes/ExampleInput'
import { Stress } from '../../SyntaxNodes/Stress'
import { Italic } from '../../SyntaxNodes/Italic'
import { Bold } from '../../SyntaxNodes/Bold'
import { InlineCode } from '../../SyntaxNodes/InlineCode'
import { RevisionInsertion } from '../../SyntaxNodes/RevisionInsertion'
import { RevisionDeletion } from '../../SyntaxNodes/RevisionDeletion'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { Highlight } from '../../SyntaxNodes/Highlight'
import { InlineSpoiler } from '../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../SyntaxNodes/InlineNsfl'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../../SyntaxNodes/NsflBlock'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Blockquote } from '../../SyntaxNodes/Blockquote'
import { UnorderedList } from '../../SyntaxNodes/UnorderedList'
import { OrderedList } from '../../SyntaxNodes/OrderedList'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'
import { Table } from '../../SyntaxNodes/Table'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { Heading } from '../../SyntaxNodes/Heading'
import { CodeBlock } from '../../SyntaxNodes/CodeBlock'
import { OutlineSeparator } from '../../SyntaxNodes/OutlineSeparator'


describe('An empty document', () => {
  it('does not produce any HTML on its own', () => {
    expect(Up.toHtml(new UpDocument([]))).to.be.eql('')
  })
})


describe('A paragraph node', () => {
  it('produces a <p> element', () => {
    const document = new UpDocument([
      new Paragraph([new PlainText('Nimble navigator')])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p>Nimble navigator</p>')
  })
})


describe('An unordered list node', () => {
  it('produces an <ul> element containing an <li> element for each list item', () => {
    const document = new UpDocument([
      new UnorderedList([
        new UnorderedList.Item([
          new Paragraph([
            new PlainText('Tropical')
          ])
        ]),
        new UnorderedList.Item([
          new Paragraph([
            new PlainText('Territories')
          ])
        ])
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<ul>'
      + '<li><p>Tropical</p></li>'
      + '<li><p>Territories</p></li>'
      + '</ul>')
  })
})


describe('An ordered list node', () => {
  it('produces an <ol> element containing an <li> element for each list item', () => {
    const document = new UpDocument([
      new OrderedList([
        new OrderedList.Item([
          new Paragraph([
            new PlainText('Tropical')
          ])
        ]),
        new OrderedList.Item([
          new Paragraph([
            new PlainText('Territories')
          ])
        ])
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<ol>'
      + '<li><p>Tropical</p></li>'
      + '<li><p>Territories</p></li>'
      + '</ol>')
  })
})


context('When an ordered list node contains an item with an explicit ordinal', () => {
  specify('the <li> element for the appropriate list item is given a "value" attribute set to the appropriate ordinal', () => {
    const document = new UpDocument([
      new OrderedList([
        new OrderedList.Item([
          new Paragraph([
            new PlainText('Tropical')
          ])
        ]),
        new OrderedList.Item([
          new Paragraph([
            new PlainText('Territories')
          ])
        ], 5)
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<ol>'
      + '<li><p>Tropical</p></li>'
      + '<li value="5"><p>Territories</p></li>'
      + '</ol>')
  })
})


context('When an ordered list node has an explicit starting ordinal', () => {
  specify('the <ol> element is given a "start" attribute set to the appropriate starting ordinal', () => {
    const document = new UpDocument([
      new OrderedList([
        new OrderedList.Item([
          new Paragraph([
            new PlainText('Tropical')
          ])
        ], 3),
        new OrderedList.Item([
          new Paragraph([
            new PlainText('Territories')
          ])
        ])
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<ol start="3">'
      + '<li value="3"><p>Tropical</p></li>'
      + '<li><p>Territories</p></li>'
      + '</ol>')
  })
})


describe('When an ordered list node is in descending order', () => {
  specify('the <ol> element is given the "reversed" attribute', () => {
    const document = new UpDocument([
      new OrderedList([
        new OrderedList.Item([
          new Paragraph([
            new PlainText('Tropical')
          ])
        ], 0),
        new OrderedList.Item([
          new Paragraph([
            new PlainText('Territories')
          ])
        ], -1)
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<ol reversed start="0">'
      + '<li value="0"><p>Tropical</p></li>'
      + '<li value="-1"><p>Territories</p></li>'
      + '</ol>')
  })
})


describe('A description list', () => {
  it('produces a <dl> element containing a <dt> element for each term, and a <dd> element for each description', () => {
    const document = new UpDocument([
      new DescriptionList([
        new DescriptionList.Item([
          new DescriptionList.Item.Term([new PlainText('Bulbasaur')])
        ], new DescriptionList.Item.Description([
          new Paragraph([
            new PlainText('A grass type Pokemon')
          ])
        ])),
        new DescriptionList.Item([
          new DescriptionList.Item.Term([new PlainText('Confuse Ray')]),
          new DescriptionList.Item.Term([new PlainText('Lick')]),
        ], new DescriptionList.Item.Description([
          new Paragraph([
            new PlainText('Ghost type moves')
          ])
        ]))
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
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
  it('produces a <table> element containing a <caption> element for its caption, a <thead> element containing a <tr> element containing a <th scope="col"> for each cell in its header, and <tr> for each row containing a <td> element for each cell in that row', () => {
    const document = new UpDocument([
      new Table(
        new Table.Header([
          new Table.Header.Cell([new PlainText('Game')]),
          new Table.Header.Cell([new PlainText('Developer')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('Final Fantasy')]),
            new Table.Row.Cell([new PlainText('Square')])
          ]),
          new Table.Row([
            new Table.Row.Cell([new PlainText('Super Mario Kart')]),
            new Table.Row.Cell([new PlainText('Nintendo')])
          ])
        ],
        new Table.Caption([new PlainText('Influential Games')]))
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<table>'
      + '<caption>Influential Games</caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
      + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
      + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
      + '</table>')
  })
})


context('When a table has rows with cells with numeric values', () => {
  specify('the <td> element produced for those cells have the "up-numeric" class', () => {
    const document = new UpDocument([
      new Table(
        new Table.Header([
          new Table.Header.Cell([new PlainText('Game')]),
          new Table.Header.Cell([new PlainText('Release Date')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('Chrono Trigger')]),
            new Table.Row.Cell([new PlainText('1995')])
          ]),
          new Table.Row([
            new Table.Row.Cell([new PlainText('Chrono Cross')]),
            new Table.Row.Cell([new PlainText('1999')])
          ])
        ],
        new Table.Caption([new PlainText('Games in the Chrono series')]))
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<table>'
      + '<caption>Games in the Chrono series</caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Release Date</th></tr></thead>'
      + '<tr><td>Chrono Trigger</td><td class="up-numeric">1995</td></tr>'
      + '<tr><td>Chrono Cross</td><td class="up-numeric">1999</td></tr>'
      + '</table>')
  })
})


describe('A table without a caption or any rows', () => {
  it('produces a <table> element that does not contain a <caption> element or any <tr> outside of its <thead>', () => {
    const document = new UpDocument([
      new Table(
        new Table.Header([
          new Table.Header.Cell([new PlainText('Game')]),
          new Table.Header.Cell([new PlainText('Release Date')])
        ]), [])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<table>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Release Date</th></tr></thead>'
      + '</table>')
  })
})


context('When a table header has cells spanning multiple columns', () => {
  specify('the <th> element for those header cells have a "colspan" attribute whose value is the number of columns spanned', () => {
    const document = new UpDocument([
      new Table(
        new Table.Header([
          new Table.Header.Cell([new PlainText('Game')], 5),
          new Table.Header.Cell([new PlainText('Developer')], 3)
        ]), [])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<table>'
      + '<thead><tr><th colspan="5" scope="col">Game</th><th colspan="3" scope="col">Developer</th></tr></thead>'
      + '</table>')
  })
})


context('When a table has rows with cells spanning multiple columns', () => {
  specify('the <td> elements for those row cells have a "colspan" attribute whose value is the number of columns spanned', () => {
    const document = new UpDocument([
      new Table(
        new Table.Header([
          new Table.Header.Cell([new PlainText('Aerobic Exercise')]),
          new Table.Header.Cell([new PlainText('Anaerobic Exercise')]),
          new Table.Header.Cell([new PlainText('Cooldown')]),
          new Table.Header.Cell([new PlainText('Date')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('Jogged on track')]),
            new Table.Row.Cell([new PlainText('Swam laps')], 2),
            new Table.Row.Cell([new PlainText('March 11, 2018')])
          ]),
          new Table.Row([
            new Table.Row.Cell([new PlainText('Ran in neighborhood')], 3),
            new Table.Row.Cell([new PlainText('March 12, 2018')])
          ])
        ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<table>'
      + '<thead><tr><th scope="col">Aerobic Exercise</th><th scope="col">Anaerobic Exercise</th><th scope="col">Cooldown</th><th scope="col">Date</th></tr></thead>'
      + '<tr><td>Jogged on track</td><td colspan="2">Swam laps</td><td>March 11, 2018</td></tr>'
      + '<tr><td colspan="3">Ran in neighborhood</td><td>March 12, 2018</td></tr>'
      + '</table>')
  })
})


context('When a table cell has a numeric value and spans multiple columns', () => {
  specify('the <td> element produced for that cell has the "up-numeric" class and has a "colspan" attribute whose value is the number of columns spanned', () => {
    const document = new UpDocument([
      new Table(
        new Table.Header([
          new Table.Header.Cell([new PlainText('Game')]),
          new Table.Header.Cell([new PlainText('Year Development Started')]),
          new Table.Header.Cell([new PlainText('Year Released')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('Final Fantasy II')]),
            new Table.Row.Cell([new PlainText('1989')], 2)
          ]),
          new Table.Row([
            new Table.Row.Cell([new PlainText('Chrono Trigger')]),
            new Table.Row.Cell([new PlainText('1993')]),
            new Table.Row.Cell([new PlainText('1995')])
          ])
        ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<table>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Year Development Started</th><th scope="col">Year Released</th></tr></thead>'
      + '<tr><td>Final Fantasy II</td><td class="up-numeric" colspan="2">1989</td></tr>'
      + '<tr><td>Chrono Trigger</td><td class="up-numeric">1993</td><td class="up-numeric">1995</td></tr>'
      + '</table>')
  })
})


context('A chart uses the same syntax node as a table. Unlike tables, however, each row of a chart has a header cell.', () => {
  specify('Each of those row header cells produces a <th scope="row"> at the beginning of the <tr> element produced by the row', () => {
    const document = new UpDocument([
      new Table(
        new Table.Header([
          new Table.Header.Cell([]),
          new Table.Header.Cell([new PlainText('1')]),
          new Table.Header.Cell([new PlainText('0')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('true')]),
            new Table.Row.Cell([new PlainText('false')]),
          ], new Table.Header.Cell([new PlainText('1')])),
          new Table.Row([
            new Table.Row.Cell([new PlainText('false')]),
            new Table.Row.Cell([new PlainText('false')])
          ], new Table.Header.Cell([new PlainText('0')]))
        ],
        new Table.Caption([new PlainText('AND operator logic')]))
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<table>'
      + '<caption>AND operator logic</caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
      + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>')
  })

  specify('When a row header cell spans multiple columns, the <th> element produced for that cell has a "colspan" attribute whose value is the number of columns spanned', () => {
    const document = new UpDocument([
      new Table(
        new Table.Header([
          new Table.Header.Cell([]),
          new Table.Header.Cell([new PlainText('Most Common Word')])
        ]), [
          new Table.Row([], new Table.Header.Cell([new PlainText('Monday')], 2)),
          new Table.Row([], new Table.Header.Cell([new PlainText('Tuesday')], 2)),
          new Table.Row([], new Table.Header.Cell([new PlainText('Wednesday')], 2)),
          new Table.Row([
            new Table.Row.Cell([new PlainText('Really')]),
          ], new Table.Header.Cell([new PlainText('Thursday')])),
          new Table.Row([], new Table.Header.Cell([new PlainText('Friday')], 2)),
        ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<table>'
      + '<thead><tr><th scope="col"></th><th scope="col">Most Common Word</th></tr></thead>'
      + '<tr><th colspan="2" scope="row">Monday</th></tr>'
      + '<tr><th colspan="2" scope="row">Tuesday</th></tr>'
      + '<tr><th colspan="2" scope="row">Wednesday</th></tr>'
      + '<tr><th scope="row">Thursday</th><td>Really</td></tr>'
      + '<tr><th colspan="2" scope="row">Friday</th></tr>'
      + '</table>')
  })
})


describe('A line block node', () => {
  it('produces a <div class="up-lines"> containing a <div role="alert"> element for each line', () => {
    const document = new UpDocument([
      new LineBlock([
        new LineBlock.Line([
          new PlainText('Hollow')
        ]),
        new LineBlock.Line([
          new PlainText('Fangs')
        ])
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<div class="up-lines">'
      + '<div>Hollow</div>'
      + '<div>Fangs</div>'
      + '</div>')
  })
})


describe('A code block node', () => {
  it('produces a <pre> element containing a <code> element containing the code', () => {
    const document = new UpDocument([
      new CodeBlock('color = Color.Green')
    ])

    expect(Up.toHtml(document)).to.be.eql('<pre><code>color = Color.Green</code></pre>')
  })
})


describe('A blockquote node', () => {
  it('produces a <blockquote> element', () => {
    const document = new UpDocument([
      new Blockquote([
        new Paragraph([
          new PlainText('Centipede')
        ])
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<blockquote><p>Centipede</p></blockquote>')
  })
})


describe('A level 1 heading node', () => {
  it('produces an <h1> element', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Bulbasaur')], 1)
    ])

    expect(Up.toHtml(document)).to.be.eql('<h1>Bulbasaur</h1>')
  })
})


describe('A level 2 heading node', () => {
  it('produces an <h2> element', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Ivysaur')], 2)
    ])

    expect(Up.toHtml(document)).to.be.eql('<h2>Ivysaur</h2>')
  })
})


describe('A level 3 heading node', () => {
  it('produces an <h3> element', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Venusaur')], 3)
    ])

    expect(Up.toHtml(document)).to.be.eql('<h3>Venusaur</h3>')
  })
})


describe('A level 4 heading node', () => {
  it('produces an <h4>', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Charmander')], 4)
    ])

    expect(Up.toHtml(document)).to.be.eql('<h4>Charmander</h4>')
  })
})


describe('A level 5 heading node', () => {
  it('produces an <h5> element', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Charmeleon')], 5)
    ])

    expect(Up.toHtml(document)).to.be.eql('<h5>Charmeleon</h5>')
  })
})


describe('A level 6 heading node', () => {
  it('produces an <h6> element', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Charizard')], 6)
    ])

    expect(Up.toHtml(document)).to.be.eql('<h6>Charizard</h6>')
  })
})


describe('A level 7 heading node', () => {
  it('produces an <h6> element', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Squirtle')], 7)
    ])

    expect(Up.toHtml(document)).to.be.eql('<h6>Squirtle</h6>')
  })
})


describe('A level 8 heading node', () => {
  it('produces an <h6> element', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Wartortle')], 8)
    ])

    expect(Up.toHtml(document)).to.be.eql('<h6>Wartortle</h6>')
  })
})


describe('A level 9 heading node', () => {
  it('produces an <h6> element', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Blastoise')], 9)
    ])

    expect(Up.toHtml(document)).to.be.eql('<h6>Blastoise</h6>')
  })
})


describe('An outline separator node', () => {
  it('produces an <hr> element', () => {
    const document = new UpDocument([
      new OutlineSeparator()
    ])

    expect(Up.toHtml(document)).to.be.eql('<hr>')
  })
})


describe('An emphasis node', () => {
  it('produces an <em> element', () => {
    const document = new UpDocument([
      new Paragraph([
        new Emphasis([new PlainText('Always')])
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><em>Always</em></p>')
  })
})


describe('A stress node', () => {
  it('produces a <strong> element', () => {
    const document = new UpDocument([
      new Paragraph([
        new Stress([new PlainText('Ness')])
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><strong>Ness</strong></p>')
  })
})


describe('An italic node', () => {
  it('produces an <i> element', () => {
    const document = new UpDocument([
      new Paragraph([
        new Italic([new PlainText('Ness')])
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><i>Ness</i></p>')
  })
})


describe('A bold node', () => {
  it('produces a <b> element', () => {
    const document = new UpDocument([
      new Paragraph([
        new Bold([new PlainText('Ness')])
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><b>Ness</b></p>')
  })
})


describe('An inline code node', () => {
  it('produces a <code> element', () => {
    const document = new UpDocument([
      new Paragraph([
        new InlineCode('then')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><code>then</code></p>')
  })
})


describe('An example input node', () => {
  it('produces a <kbd> element', () => {
    const document = new UpDocument([
      new Paragraph([
        new ExampleInput('esc')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><kbd>esc</kbd></p>')
  })
})


describe('A revision insertion node', () => {
  it('produces an <ins> element', () => {
    const document = new UpDocument([
      new Paragraph([
        new RevisionInsertion([new PlainText('Wario')])
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><ins>Wario</ins></p>')
  })
})


describe('A revision deletion node', () => {
  it('produces a <del> element', () => {
    const document = new UpDocument([
      new Paragraph([
        new RevisionDeletion([new PlainText('Koopa Troopa')])
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><del>Koopa Troopa</del></p>')
  })
})


describe('A normal parenthetical node', () => {
  it('produces a <small> element', () => {
    const document = new UpDocument([
      new Paragraph([
        new NormalParenthetical([new PlainText('(Koopa Troopa)')])
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><small>(Koopa Troopa)</small></p>')
  })
})


describe('A square parenthetical node', () => {
  it('produces a <small class="up-square-brackets"> element', () => {
    const document = new UpDocument([
      new Paragraph([
        new SquareParenthetical([new PlainText('[Koopa Troopa]')])
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><small class="up-square-brackets">[Koopa Troopa]</small></p>')
  })
})


describe('A link node', () => {
  it('produces an <a> element with its href attribute set to its URL', () => {
    const document = new UpDocument([
      new Paragraph([
        new Link([new PlainText('Google')], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><a href="https://google.com">Google</a></p>')
  })
})


describe('A footnote node', () => {
  it('produces a <sup class="up-footnote-reference"> (with an ID indicating its reference number) containing a link that contains the reference number and points to the footnote', () => {
    const document = new UpDocument([
      new Paragraph([
        new Footnote([], 3)
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<p>'
      + '<sup class="up-footnote-reference" id="up-footnote-reference-3">'
      + '<a href="#up-footnote-3">3</a>'
      + '</sup>'
      + '</p>')
  })
})


describe('A footnote block node', () => {
  it('produces a <dl class="up-footnotes">', () => {
    const document = new UpDocument([
      new FootnoteBlock([])
    ])

    expect(Up.toHtml(document)).to.be.eql('<dl class="up-footnotes"></dl>')
  })
})


describe("Each footnote in a footnote block", () => {
  it("produce a <dt> element with an ID indicating its reference number, containing a link that contains the reference number and points to the reference; and a <dd> element containing the footnote contents", () => {
    const document = new UpDocument([
      new FootnoteBlock([
        new Footnote([
          new PlainText("Arwings"),
        ], 2),
        new Footnote([
          new PlainText("Killer Bees"),
        ], 3),
      ])
    ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })
})


describe('An image node', () => {
  it('produces <img> with its "src" attribute set to its URL and its "alt" and "title" attributes set to its description', () => {
    const document = new UpDocument([
      new Image('haunted house', 'http://example.com/hauntedhouse.svg')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<img alt="haunted house" src="http://example.com/hauntedhouse.svg" title="haunted house">')
  })
})


describe('An audio node', () => {
  it('produces an <audio controls loop> with its "src" attribute set to its URL and its "title" attribute set to its description, containing a fallback link to the audio file', () => {
    const document = new UpDocument([
      new Audio('ghostly howling', 'http://example.com/ghosts.ogg')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<audio controls loop src="http://example.com/ghosts.ogg" title="ghostly howling">'
      + '<a href="http://example.com/ghosts.ogg">ghostly howling</a>'
      + '</audio>')
  })
})


describe('A video node', () => {
  it('produces a <video controls loop> with its "src" attribute set to its URL and its "title" attribute set to its description, containing a fallback link to the video file', () => {
    const document = new UpDocument([
      new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<video controls loop src="http://example.com/poltergeists.webm" title="ghosts eating luggage">'
      + '<a href="http://example.com/poltergeists.webm">ghosts eating luggage</a>'
      + '</video>')
  })
})


describe('A highlight node', () => {
  it('produces a <mark> element', () => {
    const document = new UpDocument([
      new Paragraph([
        new Highlight([new PlainText('45.9%')])
      ])
    ])

    const html =
      '<p>'
      + '<mark>45.9%</mark>'
      + '</p>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })
})


describe('An inline spoiler node', () => {
  it('produces an outer <span class="up-spoiler up-revealable">, containing a <label> (with the text "toggle spoiler"), an associated checkbox (with the "button" role), and a <span role="alert"> containing the spoiler contents', () => {
    const document = new UpDocument([
      new Paragraph([
        new InlineSpoiler([new PlainText('45.9%')])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<span role="alert">45.9%</span>'
      + '</span>'
      + '</p>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })
})


describe('An inline NSFW node', () => {
  it('produces an outer <span class="up-nsfw up-revealable">, containing a <label> (with the text "toggle NSFW"), an associated checkbox (with the "button" role), and a <span role="alert"> containing the NSFW contents', () => {
    const document = new UpDocument([
      new Paragraph([
        new InlineNsfw([new PlainText('naked Gary')])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">toggle NSFW</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<span role="alert">naked Gary</span>'
      + '</span>'
      + '</p>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })
})


describe('An inline NSFL node', () => {
  it('produces an outer <span class="up-nsfl up-revealable">, containing a <label> (with the text "toggle NSFL"), an associated checkbox (with the "button" role), and a <span role="alert"> containing the NSFL contents', () => {
    const document = new UpDocument([
      new Paragraph([
        new InlineNsfl([new PlainText('rotting Gary')])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">toggle NSFL</label>'
      + '<input id="up-nsfl-1" role="button" type="checkbox">'
      + '<span role="alert">rotting Gary</span>'
      + '</span>'
      + '</p>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })
})


describe('A spoiler block node', () => {
  it('produces the same HTML as an inline spoiler node, but with <div role="alert">s instead of <span role="alert">s', () => {
    const document = new UpDocument([
      new SpoilerBlock([
        new Paragraph([
          new PlainText('John Carmack is a decent programmer.')
        ])
      ])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>John Carmack is a decent programmer.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })
})


describe('A NSFW block node', () => {
  it('produces the same HTML as an inline NSFW node, but with <div role="alert">s instead of <span role="alert">s', () => {
    const document = new UpDocument([
      new NsfwBlock([
        new Paragraph([
          new PlainText('John Carmack is a decent programmer.')
        ])
      ])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">toggle NSFW</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>John Carmack is a decent programmer.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })
})


describe('A NSFL block node', () => {
  it('produces the same HTML as an inline NSFL node, but with <div role="alert">s instead of <span role="alert">s', () => {
    const document = new UpDocument([
      new NsflBlock([
        new Paragraph([
          new PlainText('John Carmack is a decent programmer.')
        ])
      ])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">toggle NSFL</label>'
      + '<input id="up-nsfl-1" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>John Carmack is a decent programmer.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })
})
