import { expect } from 'chai'
import * as Up from '../../Main'


const IGNORED_FIELD: string = null!

describe('An empty document', () => {
  it('does not produce any HTML on its own', () => {
    expect(Up.render(new Up.Document([]))).to.equal('')
  })
})


describe('A paragraph node', () => {
  it('renders a <p> element', () => {
    const document = new Up.Document([
      new Up.Paragraph([new Up.Text('Nimble navigator')])
    ])

    expect(Up.render(document)).to.equal('<p>Nimble navigator</p>')
  })
})


describe('A bulleted list node', () => {
  it('renders an <ul> element containing an <li> element for each list item', () => {
    const document = new Up.Document([
      new Up.BulletedList([
        new Up.BulletedList.Item([
          new Up.Paragraph([
            new Up.Text('Tropical')
          ])
        ]),
        new Up.BulletedList.Item([
          new Up.Paragraph([
            new Up.Text('Territories')
          ])
        ])
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<ul>'
      + '<li><p>Tropical</p></li>'
      + '<li><p>Territories</p></li>'
      + '</ul>')
  })
})


describe('A numbered list node', () => {
  it('renders an <ol> element containing an <li> element for each list item', () => {
    const document = new Up.Document([
      new Up.NumberedList([
        new Up.NumberedList.Item([
          new Up.Paragraph([
            new Up.Text('Tropical')
          ])
        ]),
        new Up.NumberedList.Item([
          new Up.Paragraph([
            new Up.Text('Territories')
          ])
        ])
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<ol>'
      + '<li><p>Tropical</p></li>'
      + '<li><p>Territories</p></li>'
      + '</ol>')
  })
})


context('When a numbered list node contains an item with an explicit ordinal', () => {
  specify('the <li> element for the appropriate list item is given a "value" attribute set to the appropriate ordinal', () => {
    const document = new Up.Document([
      new Up.NumberedList([
        new Up.NumberedList.Item([
          new Up.Paragraph([
            new Up.Text('Tropical')
          ])
        ]),
        new Up.NumberedList.Item([
          new Up.Paragraph([
            new Up.Text('Territories')
          ])
        ], { ordinal: 5 })
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<ol>'
      + '<li><p>Tropical</p></li>'
      + '<li value="5"><p>Territories</p></li>'
      + '</ol>')
  })
})


context('When a numbered list node has an explicit starting ordinal', () => {
  specify('the <ol> element is given a "start" attribute set to the appropriate starting ordinal', () => {
    const document = new Up.Document([
      new Up.NumberedList([
        new Up.NumberedList.Item([
          new Up.Paragraph([
            new Up.Text('Tropical')
          ])
        ], { ordinal: 3 }),
        new Up.NumberedList.Item([
          new Up.Paragraph([
            new Up.Text('Territories')
          ])
        ])
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<ol start="3">'
      + '<li value="3"><p>Tropical</p></li>'
      + '<li><p>Territories</p></li>'
      + '</ol>')
  })
})


describe('When a numbered list node is in descending order', () => {
  specify('the <ol> element is given the "reversed" attribute', () => {
    const document = new Up.Document([
      new Up.NumberedList([
        new Up.NumberedList.Item([
          new Up.Paragraph([
            new Up.Text('Tropical')
          ])
        ], { ordinal: 0 }),
        new Up.NumberedList.Item([
          new Up.Paragraph([
            new Up.Text('Territories')
          ])
        ], { ordinal: -1 })
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<ol reversed start="0">'
      + '<li value="0"><p>Tropical</p></li>'
      + '<li value="-1"><p>Territories</p></li>'
      + '</ol>')
  })
})


describe('A description list', () => {
  it('renders a <dl> element containing a <dt> element for each subject, and a <dd> element for each description', () => {
    const document = new Up.Document([
      new Up.DescriptionList([
        new Up.DescriptionList.Item([
          new Up.DescriptionList.Item.Subject([new Up.Text('Bulbasaur')])
        ], new Up.DescriptionList.Item.Description([
          new Up.Paragraph([
            new Up.Text('A grass type Pokemon')
          ])
        ])),
        new Up.DescriptionList.Item([
          new Up.DescriptionList.Item.Subject([new Up.Text('Confuse Ray')]),
          new Up.DescriptionList.Item.Subject([new Up.Text('Lick')])
        ], new Up.DescriptionList.Item.Description([
          new Up.Paragraph([
            new Up.Text('Ghost type moves')
          ])
        ]))
      ])
    ])

    expect(Up.render(document)).to.equal(
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
  it('renders a <table> element containing a <caption> element for its caption, a <thead> element containing a <tr> element containing a <th scope="col"> for each cell in its header, and <tr> for each row containing a <td> element for each cell in that row', () => {
    const document = new Up.Document([
      new Up.Table(
        new Up.Table.Header([
          new Up.Table.Header.Cell([new Up.Text('Game')]),
          new Up.Table.Header.Cell([new Up.Text('Developer')])
        ]), [
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('Final Fantasy')]),
            new Up.Table.Row.Cell([new Up.Text('Square')])
          ]),
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('Super Mario Kart')]),
            new Up.Table.Row.Cell([new Up.Text('Nintendo')])
          ])
        ],
        new Up.Table.Caption([new Up.Text('Influential Games')]))
    ])

    expect(Up.render(document)).to.equal(
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
    const document = new Up.Document([
      new Up.Table(
        new Up.Table.Header([
          new Up.Table.Header.Cell([new Up.Text('Game')]),
          new Up.Table.Header.Cell([new Up.Text('Release Date')])
        ]), [
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
            new Up.Table.Row.Cell([new Up.Text('1995')])
          ]),
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
            new Up.Table.Row.Cell([new Up.Text('1999')])
          ])
        ],
        new Up.Table.Caption([new Up.Text('Games in the Chrono series')]))
    ])

    expect(Up.render(document)).to.equal(
      '<table>'
      + '<caption>Games in the Chrono series</caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Release Date</th></tr></thead>'
      + '<tr><td>Chrono Trigger</td><td class="up-numeric">1995</td></tr>'
      + '<tr><td>Chrono Cross</td><td class="up-numeric">1999</td></tr>'
      + '</table>')
  })
})


describe('A table without a caption or any rows', () => {
  it('renders a <table> element that does not contain a <caption> element or any <tr> outside of its <thead>', () => {
    const document = new Up.Document([
      new Up.Table(
        new Up.Table.Header([
          new Up.Table.Header.Cell([new Up.Text('Game')]),
          new Up.Table.Header.Cell([new Up.Text('Release Date')])
        ]), [])
    ])

    expect(Up.render(document)).to.equal(
      '<table>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Release Date</th></tr></thead>'
      + '</table>')
  })
})


context('When a table header has cells spanning multiple columns', () => {
  specify('the <th> element for those header cells have a "colspan" attribute whose value is the number of columns spanned', () => {
    const document = new Up.Document([
      new Up.Table(
        new Up.Table.Header([
          new Up.Table.Header.Cell([new Up.Text('Game')], 5),
          new Up.Table.Header.Cell([new Up.Text('Developer')], 3)
        ]), [])
    ])

    expect(Up.render(document)).to.equal(
      '<table>'
      + '<thead><tr><th colspan="5" scope="col">Game</th><th colspan="3" scope="col">Developer</th></tr></thead>'
      + '</table>')
  })
})


context('When a table has rows with cells spanning multiple columns', () => {
  specify('the <td> elements for those row cells have a "colspan" attribute whose value is the number of columns spanned', () => {
    const document = new Up.Document([
      new Up.Table(
        new Up.Table.Header([
          new Up.Table.Header.Cell([new Up.Text('Aerobic Exercise')]),
          new Up.Table.Header.Cell([new Up.Text('Anaerobic Exercise')]),
          new Up.Table.Header.Cell([new Up.Text('Cooldown')]),
          new Up.Table.Header.Cell([new Up.Text('Date')])
        ]), [
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('Jogged on track')]),
            new Up.Table.Row.Cell([new Up.Text('Swam laps')], 2),
            new Up.Table.Row.Cell([new Up.Text('March 11, 2018')])
          ]),
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('Ran in neighborhood')], 3),
            new Up.Table.Row.Cell([new Up.Text('March 12, 2018')])
          ])
        ])
    ])

    expect(Up.render(document)).to.equal(
      '<table>'
      + '<thead><tr><th scope="col">Aerobic Exercise</th><th scope="col">Anaerobic Exercise</th><th scope="col">Cooldown</th><th scope="col">Date</th></tr></thead>'
      + '<tr><td>Jogged on track</td><td colspan="2">Swam laps</td><td>March 11, 2018</td></tr>'
      + '<tr><td colspan="3">Ran in neighborhood</td><td>March 12, 2018</td></tr>'
      + '</table>')
  })
})


context('When a table cell has a numeric value and spans multiple columns', () => {
  specify('the <td> element produced for that cell has the "up-numeric" class and has a "colspan" attribute whose value is the number of columns spanned', () => {
    const document = new Up.Document([
      new Up.Table(
        new Up.Table.Header([
          new Up.Table.Header.Cell([new Up.Text('Game')]),
          new Up.Table.Header.Cell([new Up.Text('Year Development Started')]),
          new Up.Table.Header.Cell([new Up.Text('Year Released')])
        ]), [
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('Final Fantasy II')]),
            new Up.Table.Row.Cell([new Up.Text('1989')], 2)
          ]),
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
            new Up.Table.Row.Cell([new Up.Text('1993')]),
            new Up.Table.Row.Cell([new Up.Text('1995')])
          ])
        ])
    ])

    expect(Up.render(document)).to.equal(
      '<table>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Year Development Started</th><th scope="col">Year Released</th></tr></thead>'
      + '<tr><td>Final Fantasy II</td><td class="up-numeric" colspan="2">1989</td></tr>'
      + '<tr><td>Chrono Trigger</td><td class="up-numeric">1993</td><td class="up-numeric">1995</td></tr>'
      + '</table>')
  })
})


context('When a table has a header column', () => {
  specify('each of those header column cells renders a <th scope="row"> at the beginning of the <tr> element of the cell', () => {
    const document = new Up.Document([
      new Up.Table(
        new Up.Table.Header([
          new Up.Table.Header.Cell([]),
          new Up.Table.Header.Cell([new Up.Text('Developer')])
        ]), [
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('Square')])
          ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('Nintendo')])
          ], new Up.Table.Header.Cell([new Up.Text('Super Mario Kart')]))
        ],
        new Up.Table.Caption([new Up.Text('Influential Games')]))
    ])

    expect(Up.render(document)).to.equal(
      '<table>'
      + '<caption>Influential Games</caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">Developer</th></tr></thead>'
      + '<tr><th scope="row">Final Fantasy</th><td>Square</td></tr>'
      + '<tr><th scope="row">Super Mario Kart</th><td>Nintendo</td></tr>'
      + '</table>')
  })
})


describe('When any table header cell has a numeric value, incuding those in the header column of a table,', () => {
  specify('the <th> produced for those cells has the "up-numerifc" class', () => {
    const document = new Up.Document([
      new Up.Table(
        new Up.Table.Header([
          new Up.Table.Header.Cell([]),
          new Up.Table.Header.Cell([new Up.Text('1')]),
          new Up.Table.Header.Cell([new Up.Text('0')])
        ]), [
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('true')]),
            new Up.Table.Row.Cell([new Up.Text('false')])
          ], new Up.Table.Header.Cell([new Up.Text('1')])),
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('false')]),
            new Up.Table.Row.Cell([new Up.Text('false')])
          ], new Up.Table.Header.Cell([new Up.Text('0')]))
        ],
        new Up.Table.Caption([new Up.Text('AND operator logic')]))
    ])

    expect(Up.render(document)).to.equal(
      '<table>'
      + '<caption>AND operator logic</caption>'
      + '<thead><tr><th scope="col"></th><th class="up-numeric" scope="col">1</th><th class="up-numeric" scope="col">0</th></tr></thead>'
      + '<tr><th class="up-numeric" scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th class="up-numeric" scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>')
  })
})


context('When a header column cell spans multiple columns', () => {
  specify('the <th> element produced for that cell has a "colspan" attribute whose value is the number of columns spanned', () => {
    const document = new Up.Document([
      new Up.Table(
        new Up.Table.Header([
          new Up.Table.Header.Cell([]),
          new Up.Table.Header.Cell([new Up.Text('Most Common Word')])
        ]), [
          new Up.Table.Row([], new Up.Table.Header.Cell([new Up.Text('Monday')], 2)),
          new Up.Table.Row([], new Up.Table.Header.Cell([new Up.Text('Tuesday')], 2)),
          new Up.Table.Row([], new Up.Table.Header.Cell([new Up.Text('Wednesday')], 2)),
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('Really')])
          ], new Up.Table.Header.Cell([new Up.Text('Thursday')])),
          new Up.Table.Row([], new Up.Table.Header.Cell([new Up.Text('Friday')], 2))
        ])
    ])

    expect(Up.render(document)).to.equal(
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


describe('When any table header cell has a numeric value and spans multiple columns, incuding those in the header column of a table,', () => {
  specify('the <th> produced for that cell has the "up-numeric" class and has a "colspan" attribute whose value is the number of columns spanned', () => {
    const document = new Up.Document([
      new Up.Table(
        new Up.Table.Header([
          new Up.Table.Header.Cell([]),
          new Up.Table.Header.Cell([new Up.Text('0.0')], 2)
        ]),
        [new Up.Table.Row([], new Up.Table.Header.Cell([new Up.Text('0.0')], 3))],
        new Up.Table.Caption([new Up.Text('A remarkably bad multiplication table')]))
    ])

    expect(Up.render(document)).to.equal(
      '<table>'
      + '<caption>A remarkably bad multiplication table</caption>'
      + '<thead><tr><th scope="col"></th><th class="up-numeric" colspan="2" scope="col">0.0</th></tr></thead>'
      + '<tr><th class="up-numeric" colspan="3" scope="row">0.0</th></tr>'
      + '</table>')
  })
})


describe('A line block node', () => {
  it('renders a <div class="up-lines"> containing a <div role="alert"> element for each line', () => {
    const document = new Up.Document([
      new Up.LineBlock([
        new Up.LineBlock.Line([
          new Up.Text('Hollow')
        ]),
        new Up.LineBlock.Line([
          new Up.Text('Fangs')
        ])
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<div class="up-lines">'
      + '<div>Hollow</div>'
      + '<div>Fangs</div>'
      + '</div>')
  })
})


describe('A code block node', () => {
  it('renders a <pre> element containing a <code> element containing the code', () => {
    const document = new Up.Document([
      new Up.CodeBlock('color = Color.Green')
    ])

    expect(Up.render(document)).to.equal('<pre><code>color = Color.Green</code></pre>')
  })
})


describe('A blockquote node', () => {
  it('renders a <blockquote> element', () => {
    const document = new Up.Document([
      new Up.Blockquote([
        new Up.Paragraph([
          new Up.Text('Centipede')
        ])
      ])
    ])

    expect(Up.render(document)).to.equal('<blockquote><p>Centipede</p></blockquote>')
  })
})


describe('A level 1 heading node', () => {
  it('renders an <h1> element', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Bulbasaur')], { level: 1, titleMarkup: IGNORED_FIELD })
    ])

    expect(Up.render(document)).to.equal('<h1>Bulbasaur</h1>')
  })
})


describe('A level 2 heading node', () => {
  it('renders an <h2> element', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Ivysaur')], { level: 2, titleMarkup: IGNORED_FIELD })
    ])

    expect(Up.render(document)).to.equal('<h2>Ivysaur</h2>')
  })
})


describe('A level 3 heading node', () => {
  it('renders an <h3> element', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Venusaur')], { level: 3, titleMarkup: IGNORED_FIELD })
    ])

    expect(Up.render(document)).to.equal('<h3>Venusaur</h3>')
  })
})


describe('A level 4 heading node', () => {
  it('renders an <h4> element', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Charmander')], { level: 4, titleMarkup: IGNORED_FIELD })
    ])

    expect(Up.render(document)).to.equal('<h4>Charmander</h4>')
  })
})


describe('A level 5 heading node', () => {
  it('renders an <h5> element', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Charmeleon')], { level: 5, titleMarkup: IGNORED_FIELD })
    ])

    expect(Up.render(document)).to.equal('<h5>Charmeleon</h5>')
  })
})


describe('A level 6 heading node', () => {
  it('renders an <h6> element', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Charizard')], { level: 6, titleMarkup: IGNORED_FIELD })
    ])

    expect(Up.render(document)).to.equal('<h6>Charizard</h6>')
  })
})


context('Headings with levels 7 and up render as <div role="heading"> elements with an "aria-level" attribute equal to their level:', () => {
  specify('Level 7', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Squirtle')], { level: 7, titleMarkup: IGNORED_FIELD })
    ])

    expect(Up.render(document)).to.equal('<div aria-level="7" role="heading">Squirtle</div>')
  })

  specify('Level 8', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Squirtle')], { level: 8, titleMarkup: IGNORED_FIELD })
    ])

    expect(Up.render(document)).to.equal('<div aria-level="8" role="heading">Squirtle</div>')
  })

  specify('Level 9', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Squirtle')], { level: 9, titleMarkup: IGNORED_FIELD })
    ])

    expect(Up.render(document)).to.equal('<div aria-level="9" role="heading">Squirtle</div>')
  })

  specify('Level 10', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Squirtle')], { level: 10, titleMarkup: IGNORED_FIELD })
    ])

    expect(Up.render(document)).to.equal('<div aria-level="10" role="heading">Squirtle</div>')
  })
})


describe('A thematic break node', () => {
  it('renders an <hr> element', () => {
    const document = new Up.Document([
      new Up.ThematicBreak()
    ])

    expect(Up.render(document)).to.equal('<hr>')
  })
})


describe('An emphasis node', () => {
  it('renders an <em> element', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Emphasis([new Up.Text('Always')])
      ])
    ])

    expect(Up.render(document)).to.equal('<p><em>Always</em></p>')
  })
})


describe('A stress node', () => {
  it('renders a <strong> element', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Stress([new Up.Text('Ness')])
      ])
    ])

    expect(Up.render(document)).to.equal('<p><strong>Ness</strong></p>')
  })
})


describe('An italics node', () => {
  it('renders an <i> element', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Italic([new Up.Text('Ness')])
      ])
    ])

    expect(Up.render(document)).to.equal('<p><i>Ness</i></p>')
  })
})


describe('A bold node', () => {
  it('renders a <b> element', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Bold([new Up.Text('Ness')])
      ])
    ])

    expect(Up.render(document)).to.equal('<p><b>Ness</b></p>')
  })
})


describe('An inline code node', () => {
  it('renders a <code class="up-inline-code"> element', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineCode('then')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><code class="up-inline-code">then</code></p>')
  })
})


describe('An example user input node', () => {
  it('renders a <kbd> element', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.ExampleUserInput('esc')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><kbd>esc</kbd></p>')
  })
})


describe('A normal parenthetical node', () => {
  it('renders a <small class="up-parentheses"> element', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.NormalParenthetical([new Up.Text('(Koopa Troopa)')])
      ])
    ])

    expect(Up.render(document)).to.equal('<p><small class="up-parentheses">(Koopa Troopa)</small></p>')
  })
})


describe('A square parenthetical node', () => {
  it('renders a <small class="up-square-brackets"> element', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.SquareParenthetical([new Up.Text('[Koopa Troopa]')])
      ])
    ])

    expect(Up.render(document)).to.equal('<p><small class="up-square-brackets">[Koopa Troopa]</small></p>')
  })
})


describe('A link node', () => {
  it('renders an <a> element with its href attribute set to its URL', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([new Up.Text('Google')], 'https://google.com')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><a href="https://google.com">Google</a></p>')
  })
})


describe('A section link node that is not associated with a table of contents entry', () => {
  it('renders an <i> element containing its snippet', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.SectionLink('When I became ruler of the world')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><i>When I became ruler of the world</i></p>')
  })
})


describe('A section link node that is associated with a table of contents entry', () => {
  it('renders a link to the entry in the document', () => {
    const heading = new Up.Heading([
      new Up.Text('Howdy there')
    ], { level: 1, titleMarkup: IGNORED_FIELD, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([
        new Up.Paragraph([new Up.SectionLink('howdy', heading)]),
        heading
      ], new Up.Document.TableOfContents([heading]))

    expect(Up.render(document)).to.equal(
      '<p><a href="#up-topic-1">Howdy there</a></p>'
      + '<h1 id="up-topic-1">Howdy there</h1>')
  })
})


describe('A footnote node', () => {
  it('renders a <sup class="up-footnote-reference"> (with an ID indicating its reference number) containing a link that contains the reference number and points to the footnote', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<p>'
      + '<sup class="up-footnote-reference" id="up-footnote-reference-3">'
      + '<a href="#up-footnote-3">3</a>'
      + '</sup>'
      + '</p>')
  })
})


describe('A footnote block node', () => {
  it('renders a <dl class="up-footnotes">', () => {
    const document = new Up.Document([
      new Up.FootnoteBlock([])
    ])

    expect(Up.render(document)).to.equal('<dl class="up-footnotes"></dl>')
  })
})


describe('Each footnote in a footnote block', () => {
  it('produce a <dt> element with an ID indicating its reference number, containing a link that contains the reference number and points to the reference; and a <dd> element containing the footnote contents', () => {
    const document = new Up.Document([
      new Up.FootnoteBlock([
        new Up.Footnote([
          new Up.Text('Arwings')
        ], { referenceNumber: 2 }),
        new Up.Footnote([
          new Up.Text('Killer Bees')
        ], { referenceNumber: 3 })
      ])
    ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(Up.render(document)).to.equal(html)
  })
})


describe('An image node', () => {
  it('produces <img> with its "src" attribute set to its URL and its "alt" and "title" attributes set to its description', () => {
    const document = new Up.Document([
      new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg')
    ])

    expect(Up.render(document)).to.equal(
      '<img alt="haunted house" src="http://example.com/hauntedhouse.svg" title="haunted house">')
  })
})


describe('An audio node', () => {
  it('renders an <audio controls loop> with its "src" attribute set to its URL and its "title" attribute set to its description, containing a fallback link to the audio file', () => {
    const document = new Up.Document([
      new Up.Audio('ghostly howling', 'http://example.com/ghosts.ogg')
    ])

    expect(Up.render(document)).to.equal(
      '<audio controls src="http://example.com/ghosts.ogg" title="ghostly howling">'
      + '<a href="http://example.com/ghosts.ogg">ghostly howling</a>'
      + '</audio>')
  })
})


describe('A video node', () => {
  it('renders a <video controls loop> with its "src" attribute set to its URL and its "title" attribute set to its description, containing a fallback link to the video file', () => {
    const document = new Up.Document([
      new Up.Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
    ])

    expect(Up.render(document)).to.equal(
      '<video controls src="http://example.com/poltergeists.webm" title="ghosts eating luggage">'
      + '<a href="http://example.com/poltergeists.webm">ghosts eating luggage</a>'
      + '</video>')
  })
})


describe('A highlight node', () => {
  it('renders a <mark> element', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Highlight([new Up.Text('45.9%')])
      ])
    ])

    const html =
      '<p>'
      + '<mark>45.9%</mark>'
      + '</p>'

    expect(Up.render(document)).to.equal(html)
  })
})


describe('An inline quote node', () => {
  it('renders a <q> element', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineQuote([
          new Up.Text('45.9%')
        ])
      ])
    ])

    const html =
      '<p>'
      + '<q>45.9%</q>'
      + '</p>'

    expect(Up.render(document)).to.equal(html)
  })
})


describe('An inline revealable node', () => {
  it('renders an outer <span class="up-revealable">, containing hide/reveal radio buttons and a <span role="alert"> containing the revealable content', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineRevealable([new Up.Text('45.9%')])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<span role="alert">45.9%</span>'
      + '</span>'
      + '</p>'

    expect(Up.render(document)).to.equal(html)
  })
})


describe('A revealable block node', () => {
  it('produces the same HTML as an inline revealable node, but uses <div>s instead of <span>s', () => {
    const document = new Up.Document([
      new Up.RevealableBlock([
        new Up.Paragraph([
          new Up.Text('John Carmack is a decent programmer.')
        ])
      ])
    ])

    const html =
      '<div class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<div role="alert">'
      + '<p>John Carmack is a decent programmer.</p>'
      + '</div>'
      + '</div>'

    expect(Up.render(document)).to.equal(html)
  })
})
