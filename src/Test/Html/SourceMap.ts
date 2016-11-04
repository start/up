import { expect } from 'chai'
import * as Up from '../../Main'


context('When an outline syntax node has a source line number, its outermost element is given an "data-up-source-line" attribute whose value is the line number. This is true for:', () => {
  specify('Paragraphs', () => {
    const document = new Up.Document([
      new Up.Paragraph([new Up.Text('Nimble navigator')], { sourceLineNumber: 5 })
    ])

    expect(Up.render(document)).to.equal('<p data-up-source-line="5">Nimble navigator</p>')
  })

  specify('Unordered list', () => {
    const document = new Up.Document([
      new Up.UnorderedList([
        new Up.UnorderedList.Item([
          new Up.Paragraph([
            new Up.Text('Tropical')
          ], { sourceLineNumber: 3 })
        ]),
        new Up.UnorderedList.Item([
          new Up.Paragraph([
            new Up.Text('Territories')
          ], { sourceLineNumber: 4 })
        ])
      ], { sourceLineNumber: 3 })
    ])

    expect(Up.render(document)).to.equal(
      '<ul data-up-source-line="3">'
      + '<li><p data-up-source-line="3">Tropical</p></li>'
      + '<li><p data-up-source-line="4">Territories</p></li>'
      + '</ul>')
  })

  specify('Ordered lists without start ordinals', () => {
    const document = new Up.Document([
      new Up.OrderedList([
        new Up.OrderedList.Item([
          new Up.Paragraph([
            new Up.Text('Tropical')
          ], { sourceLineNumber: 1 })
        ]),
        new Up.OrderedList.Item([
          new Up.Paragraph([
            new Up.Text('Territories')
          ], { sourceLineNumber: 3 })
        ])
      ], { sourceLineNumber: 1 })
    ])

    expect(Up.render(document)).to.equal(
      '<ol data-up-source-line="1">'
      + '<li><p data-up-source-line="1">Tropical</p></li>'
      + '<li><p data-up-source-line="3">Territories</p></li>'
      + '</ol>')
  })

  specify('Ordered lists with start ordinals', () => {
    const document = new Up.Document([
      new Up.OrderedList([
        new Up.OrderedList.Item([
          new Up.Paragraph([
            new Up.Text('Tropical')
          ], { sourceLineNumber: 1 })
        ], { ordinal: 3 }),
        new Up.OrderedList.Item([
          new Up.Paragraph([
            new Up.Text('Territories')
          ], { sourceLineNumber: 3 })
        ])
      ], { sourceLineNumber: 1 })
    ])

    expect(Up.render(document)).to.equal(
      '<ol data-up-source-line="1" start="3">'
      + '<li value="3"><p data-up-source-line="1">Tropical</p></li>'
      + '<li><p data-up-source-line="3">Territories</p></li>'
      + '</ol>')
  })

  specify('Reversed ordered lists with start ordinals', () => {
    const document = new Up.Document([
      new Up.OrderedList([
        new Up.OrderedList.Item([
          new Up.Paragraph([
            new Up.Text('Tropical')
          ], { sourceLineNumber: 1 })
        ], { ordinal: 2 }),
        new Up.OrderedList.Item([
          new Up.Paragraph([
            new Up.Text('Territories')
          ], { sourceLineNumber: 2 })
        ], { ordinal: 1 })
      ], { sourceLineNumber: 1 })
    ])

    expect(Up.render(document)).to.equal(
      '<ol data-up-source-line="1" reversed start="2">'
      + '<li value="2"><p data-up-source-line="1">Tropical</p></li>'
      + '<li value="1"><p data-up-source-line="2">Territories</p></li>'
      + '</ol>')
  })

  specify('Description lists', () => {
    const document = new Up.Document([
      new Up.DescriptionList([
        new Up.DescriptionList.Item([
          new Up.DescriptionList.Item.Subject([new Up.Text('Bulbasaur')])
        ], new Up.DescriptionList.Item.Description([
          new Up.Paragraph([
            new Up.Text('A grass type Pokemon')
          ], { sourceLineNumber: 3 })
        ])),
        new Up.DescriptionList.Item([
          new Up.DescriptionList.Item.Subject([new Up.Text('Confuse Ray')]),
          new Up.DescriptionList.Item.Subject([new Up.Text('Lick')]),
        ], new Up.DescriptionList.Item.Description([
          new Up.Paragraph([
            new Up.Text('Ghost type moves')
          ], { sourceLineNumber: 6 })
        ]))
      ], { sourceLineNumber: 2 })
    ])

    expect(Up.render(document)).to.equal(
      '<dl data-up-source-line="2">'
      + '<dt>Bulbasaur</dt>'
      + '<dd><p data-up-source-line="3">A grass type Pokemon</p></dd>'
      + '<dt>Confuse Ray</dt>'
      + '<dt>Lick</dt>'
      + '<dd><p data-up-source-line="6">Ghost type moves</p></dd>'
      + '</dl>')
  })

  specify('Tables', () => {
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
        new Up.Table.Caption([
          new Up.Text('Influential Games')
        ]), { sourceLineNumber: 1 })
    ])

    expect(Up.render(document)).to.equal(
      '<table data-up-source-line="1">'
      + '<caption>Influential Games</caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
      + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
      + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
      + '</table>')
  })

  specify('Tables with a header column', () => {
    const document = new Up.Document([
      new Up.Table(
        new Up.Table.Header([
          new Up.Table.Header.Cell([]),
          new Up.Table.Header.Cell([new Up.Text('1')]),
          new Up.Table.Header.Cell([new Up.Text('0')])
        ]), [
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('true')]),
            new Up.Table.Row.Cell([new Up.Text('false')]),
          ], new Up.Table.Header.Cell([new Up.Text('1')])),
          new Up.Table.Row([
            new Up.Table.Row.Cell([new Up.Text('false')]),
            new Up.Table.Row.Cell([new Up.Text('false')])
          ], new Up.Table.Header.Cell([new Up.Text('0')]))
        ],
        new Up.Table.Caption([
          new Up.Text('AND operator logic')
        ]), { sourceLineNumber: 3 })
    ])

    expect(Up.render(document)).to.equal(
      '<table data-up-source-line="3">'
      + '<caption>AND operator logic</caption>'
      + '<thead><tr><th scope="col"></th><th class="up-numeric" scope="col">1</th><th class="up-numeric" scope="col">0</th></tr></thead>'
      + '<tr><th class="up-numeric" scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th class="up-numeric" scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>')
  })

  specify('Line blocks', () => {
    const document = new Up.Document([
      new Up.LineBlock([
        new Up.LineBlock.Line([
          new Up.Text('Hollow')
        ]),
        new Up.LineBlock.Line([
          new Up.Text('Fangs')
        ])
      ], { sourceLineNumber: 4 })
    ])

    expect(Up.render(document)).to.equal(
      '<div class="up-lines" data-up-source-line="4">'
      + '<div>Hollow</div>'
      + '<div>Fangs</div>'
      + '</div>')
  })


  specify('Code blocks', () => {
    const document = new Up.Document([
      new Up.CodeBlock('color = Color.Green', { sourceLineNumber: 3 })
    ])

    expect(Up.render(document)).to.equal('<pre data-up-source-line="3"><code>color = Color.Green</code></pre>')
  })

  specify('Blockquotes', () => {
    const document = new Up.Document([
      new Up.Blockquote([
        new Up.Paragraph([
          new Up.Text('Centipede')
        ], { sourceLineNumber: 1 })
      ], { sourceLineNumber: 1 })
    ])

    expect(Up.render(document)).to.equal(
      '<blockquote data-up-source-line="1">'
      + '<p data-up-source-line="1">Centipede</p>'
      + '</blockquote>')
  })

  const NOT_USED: string = null

  specify('Level 1 headings', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Bulbasaur')], {
        level: 1,
        titleMarkup: NOT_USED,
        sourceLineNumber: 3
      })
    ])

    expect(Up.render(document)).to.equal('<h1 data-up-source-line="3">Bulbasaur</h1>')
  })

  specify('Level 2 headings referenced by the table of contents', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Bulbasaur')], {
        level: 2,
        titleMarkup: NOT_USED,
        ordinalInTableOfContents: 1,
        sourceLineNumber: 1
      })
    ])

    expect(Up.render(document)).to.equal('<h2 data-up-source-line="1" id="up-topic-1">Bulbasaur</h2>')
  })

  specify('Level 3 headings', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Bulbasaur')], {
        level: 3,
        titleMarkup: NOT_USED,
        sourceLineNumber: 3
      })
    ])

    expect(Up.render(document)).to.equal('<h3 data-up-source-line="3">Bulbasaur</h3>')
  })

  specify('Level 4 headings', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Bulbasaur')], {
        level: 4,
        titleMarkup: NOT_USED,
        sourceLineNumber: 1
      })
    ])

    expect(Up.render(document)).to.equal('<h4 data-up-source-line="1">Bulbasaur</h4>')
  })
  specify('Level 5 headings referenced by the table of contents', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Bulbasaur')], {
        level: 5,
        titleMarkup: NOT_USED,
        ordinalInTableOfContents: 2,
        sourceLineNumber: 3
      })
    ])

    expect(Up.render(document)).to.equal('<h5 data-up-source-line="3" id="up-topic-2">Bulbasaur</h5>')
  })

  specify('Level 6 headings', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Bulbasaur')], {
        level: 6,
        titleMarkup: NOT_USED,
        sourceLineNumber: 1
      })
    ])

    expect(Up.render(document)).to.equal('<h6 data-up-source-line="1">Bulbasaur</h6>')
  })

  specify('Level 7 headings', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Bulbasaur')], {
        level: 7,
        titleMarkup: NOT_USED,
        sourceLineNumber: 5
      })
    ])

    expect(Up.render(document)).to.equal('<div aria-level="7" data-up-source-line="5" role="heading">Bulbasaur</div>')
  })

  specify('Level 8 headings referenced by the table of contents', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Bulbasaur')], {
        level: 8,
        titleMarkup: NOT_USED,
        ordinalInTableOfContents: 2,
        sourceLineNumber: 3
      })
    ])

    expect(Up.render(document)).to.equal('<div aria-level="8" data-up-source-line="3" id="up-topic-2" role="heading">Bulbasaur</div>')
  })

  specify('Level 9 headings', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Bulbasaur')], {
        level: 9,
        titleMarkup: NOT_USED,
        sourceLineNumber: 2
      })
    ])

    expect(Up.render(document)).to.equal('<div aria-level="9" data-up-source-line="2" role="heading">Bulbasaur</div>')
  })

  specify('Level 10 headings referenced by the table of contents', () => {
    const document = new Up.Document([
      new Up.Heading([new Up.Text('Bulbasaur')], {
        level: 10,
        titleMarkup: NOT_USED,
        ordinalInTableOfContents: 7,
        sourceLineNumber: 3
      })
    ])

    expect(Up.render(document)).to.equal('<div aria-level="10" data-up-source-line="3" id="up-topic-7" role="heading">Bulbasaur</div>')
  })

  specify('Thematic breaks', () => {
    const document = new Up.Document([
      new Up.ThematicBreak({ sourceLineNumber: 2 })
    ])

    expect(Up.render(document)).to.equal('<hr data-up-source-line="2">')
  })

  specify('Revealable blocks', () => {
    const document = new Up.Document([
      new Up.RevealableBlock([
        new Up.Paragraph([
          new Up.Text('John Carmack is a decent programmer.')
        ], { sourceLineNumber: 3 })
      ], { sourceLineNumber: 2 })
    ])

    const html =
      '<div class="up-revealable" data-up-source-line="2">'
      + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<div role="alert">'
      + '<p data-up-source-line="3">John Carmack is a decent programmer.</p>'
      + '</div>'
      + '</div>'

    expect(Up.render(document)).to.equal(html)
  })

  specify('Images', () => {
    const document = new Up.Document([
      new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg', { sourceLineNumber: 2 })
    ])

    expect(Up.render(document)).to.equal(
      '<img alt="haunted house" data-up-source-line="2" src="http://example.com/hauntedhouse.svg" title="haunted house">')
  })


  specify('Audio nodes', () => {
    const document = new Up.Document([
      new Up.Audio('ghostly howling', 'http://example.com/ghosts.ogg', { sourceLineNumber: 3 })
    ])

    expect(Up.render(document)).to.equal(
      '<audio controls data-up-source-line="3" src="http://example.com/ghosts.ogg" title="ghostly howling">'
      + '<a href="http://example.com/ghosts.ogg">ghostly howling</a>'
      + '</audio>')
  })

  specify('Videos', () => {
    const document = new Up.Document([
      new Up.Video('ghosts eating luggage', 'http://example.com/poltergeists.webm', { sourceLineNumber: 5 })
    ])

    expect(Up.render(document)).to.equal(
      '<video controls data-up-source-line="5" src="http://example.com/poltergeists.webm" title="ghosts eating luggage">'
      + '<a href="http://example.com/poltergeists.webm">ghosts eating luggage</a>'
      + '</video>')
  })

  specify('Links (containing outlined media conventions)', () => {
    const document = new Up.Document([
      new Up.Link([
        new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg')
      ], 'https://example.com/gallery', { sourceLineNumber: 2 })
    ])

    expect(Up.render(document)).to.equal(
      '<a data-up-source-line="2" href="https://example.com/gallery">'
      + '<img alt="haunted house" src="http://example.com/hauntedhouse.svg" title="haunted house">'
      + '</a>')
  })
})
