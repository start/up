import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Link } from '../../SyntaxNodes/Link'
import { Image } from '../../SyntaxNodes/Image'
import { Audio } from '../../SyntaxNodes/Audio'
import { Video } from '../../SyntaxNodes/Video'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../../SyntaxNodes/NsflBlock'
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


context('When an outline syntax node has a source line number, its outermost element is given an "data-up-source-line" attribute whose value is the line number. This is true for:', () => {
  specify('Paragraphs', () => {
    const document = new UpDocument([
      new Paragraph([new PlainText('Nimble navigator')], 5)
    ])

    expect(Up.toHtml(document)).to.be.eql('<p data-up-source-line="5">Nimble navigator</p>')
  })

  specify('Unordered list', () => {
    const document = new UpDocument([
      new UnorderedList([
        new UnorderedList.Item([
          new Paragraph([
            new PlainText('Tropical')
          ], 3)
        ]),
        new UnorderedList.Item([
          new Paragraph([
            new PlainText('Territories')
          ], 4)
        ])
      ], 3)
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<ul data-up-source-line="3">'
      + '<li><p data-up-source-line="3">Tropical</p></li>'
      + '<li><p data-up-source-line="4">Territories</p></li>'
      + '</ul>')
  })

  specify('Ordered lists without start ordinals', () => {
    const document = new UpDocument([
      new OrderedList([
        new OrderedList.Item([
          new Paragraph([
            new PlainText('Tropical')
          ], 1)
        ]),
        new OrderedList.Item([
          new Paragraph([
            new PlainText('Territories')
          ], 3)
        ])
      ], 1)
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<ol data-up-source-line="1">'
      + '<li><p data-up-source-line="1">Tropical</p></li>'
      + '<li><p data-up-source-line="3">Territories</p></li>'
      + '</ol>')
  })

  specify('Ordered lists with start ordinals', () => {
    const document = new UpDocument([
      new OrderedList([
        new OrderedList.Item([
          new Paragraph([
            new PlainText('Tropical')
          ], 1)
        ], 3),
        new OrderedList.Item([
          new Paragraph([
            new PlainText('Territories')
          ], 3)
        ])
      ], 1)
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<ol data-up-source-line="1" start="3">'
      + '<li value="3"><p data-up-source-line="1">Tropical</p></li>'
      + '<li><p data-up-source-line="3">Territories</p></li>'
      + '</ol>')
  })

  specify('Reversed ordered lists with start ordinals', () => {
    const document = new UpDocument([
      new OrderedList([
        new OrderedList.Item([
          new Paragraph([
            new PlainText('Tropical')
          ], 1)
        ], 2),
        new OrderedList.Item([
          new Paragraph([
            new PlainText('Territories')
          ], 2)
        ], 1)
      ], 1)
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<ol data-up-source-line="1" reversed start="2">'
      + '<li value="2"><p data-up-source-line="1">Tropical</p></li>'
      + '<li value="1"><p data-up-source-line="2">Territories</p></li>'
      + '</ol>')
  })

  specify('Description lists', () => {
    const document = new UpDocument([
      new DescriptionList([
        new DescriptionList.Item([
          new DescriptionList.Item.Term([new PlainText('Bulbasaur')])
        ], new DescriptionList.Item.Description([
          new Paragraph([
            new PlainText('A grass type Pokemon')
          ], 3)
        ])),
        new DescriptionList.Item([
          new DescriptionList.Item.Term([new PlainText('Confuse Ray')]),
          new DescriptionList.Item.Term([new PlainText('Lick')]),
        ], new DescriptionList.Item.Description([
          new Paragraph([
            new PlainText('Ghost type moves')
          ], 6)
        ]))
      ], 2)
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<dl data-up-source-line="2">'
      + '<dt>Bulbasaur</dt>'
      + '<dd><p data-up-source-line="3">A grass type Pokemon</p></dd>'
      + '<dt>Confuse Ray</dt>'
      + '<dt>Lick</dt>'
      + '<dd><p data-up-source-line="6">Ghost type moves</p></dd>'
      + '</dl>')
  })

  specify('Tables', () => {
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
        new Table.Caption([
          new PlainText('Influential Games')
        ]), 1)
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<table data-up-source-line="1">'
      + '<caption>Influential Games</caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
      + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
      + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
      + '</table>')
  })

  specify('Charts', () => {
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
        new Table.Caption([
          new PlainText('AND operator logic')
        ]), 3)
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<table data-up-source-line="3">'
      + '<caption>AND operator logic</caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
      + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>')
  })

  specify('Line blocks', () => {
    const document = new UpDocument([
      new LineBlock([
        new LineBlock.Line([
          new PlainText('Hollow')
        ]),
        new LineBlock.Line([
          new PlainText('Fangs')
        ])
      ], 4)
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<div class="up-lines" data-up-source-line="4">'
      + '<div>Hollow</div>'
      + '<div>Fangs</div>'
      + '</div>')
  })


  specify('Code blocks', () => {
    const document = new UpDocument([
      new CodeBlock('color = Color.Green', 3)
    ])

    expect(Up.toHtml(document)).to.be.eql('<pre data-up-source-line="3"><code>color = Color.Green</code></pre>')
  })

  specify('Blockquotes', () => {
    const document = new UpDocument([
      new Blockquote([
        new Paragraph([
          new PlainText('Centipede')
        ], 1)
      ], 1)
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<blockquote data-up-source-line="1">'
      + '<p data-up-source-line="1">Centipede</p>'
      + '</blockquote>')
  })


  specify('Level 1 headings', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Bulbasaur')], { level: 1, sourceLineNumber: 3 })
    ])

    expect(Up.toHtml(document)).to.be.eql('<h1 data-up-source-line="3">Bulbasaur</h1>')
  })

  specify('Level 2 headings', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Bulbasaur')], { level: 2, sourceLineNumber: 1 })
    ])

    expect(Up.toHtml(document)).to.be.eql('<h2 data-up-source-line="1">Bulbasaur</h2>')
  })

  specify('Level 3 headings', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Bulbasaur')], { level: 3, sourceLineNumber: 3 })
    ])

    expect(Up.toHtml(document)).to.be.eql('<h3 data-up-source-line="3">Bulbasaur</h3>')
  })

  specify('Level 4  headings', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Bulbasaur')], { level: 4, sourceLineNumber: 1 })
    ])

    expect(Up.toHtml(document)).to.be.eql('<h4 data-up-source-line="1">Bulbasaur</h4>')
  })
  specify('Level 5 headings', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Bulbasaur')], { level: 5, sourceLineNumber: 3 })
    ])

    expect(Up.toHtml(document)).to.be.eql('<h5 data-up-source-line="3">Bulbasaur</h5>')
  })

  specify('Level 6 headings', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Bulbasaur')], { level: 6, sourceLineNumber: 1 })
    ])

    expect(Up.toHtml(document)).to.be.eql('<h6 data-up-source-line="1">Bulbasaur</h6>')
  })

  specify('Level 10 headings', () => {
    const document = new UpDocument([
      new Heading([new PlainText('Bulbasaur')], { level: 10, sourceLineNumber: 2 })
    ])

    expect(Up.toHtml(document)).to.be.eql('<h6 data-up-source-line="2">Bulbasaur</h6>')
  })

  specify('Section separators', () => {
    const document = new UpDocument([
      new OutlineSeparator(2)
    ])

    expect(Up.toHtml(document)).to.be.eql('<hr data-up-source-line="2">')
  })

  specify('Spoiler blocks', () => {
    const document = new UpDocument([
      new SpoilerBlock([
        new Paragraph([
          new PlainText('John Carmack is a decent programmer.')
        ], 3)
      ], 2)
    ])

    const html =
      '<div class="up-spoiler up-revealable" data-up-source-line="2">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p data-up-source-line="3">John Carmack is a decent programmer.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })

  specify('NSFW blocks', () => {
    const document = new UpDocument([
      new NsfwBlock([
        new Paragraph([
          new PlainText('John Carmack is a decent programmer.')
        ], 2)
      ], 1)
    ])

    const html =
      '<div class="up-nsfw up-revealable" data-up-source-line="1">'
      + '<label for="up-nsfw-1">toggle NSFW</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p data-up-source-line="2">John Carmack is a decent programmer.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })

  specify('NSFL blocks', () => {
    const document = new UpDocument([
      new NsflBlock([
        new Paragraph([
          new PlainText('John Carmack is a decent programmer.')
        ], 4)
      ], 2)
    ])

    const html =
      '<div class="up-nsfl up-revealable" data-up-source-line="2">'
      + '<label for="up-nsfl-1">toggle NSFL</label>'
      + '<input id="up-nsfl-1" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p data-up-source-line="4">John Carmack is a decent programmer.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })

  specify('Images', () => {
    const document = new UpDocument([
      new Image('haunted house', 'http://example.com/hauntedhouse.svg', 2)
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<img alt="haunted house" data-up-source-line="2" src="http://example.com/hauntedhouse.svg" title="haunted house">')
  })


  specify('Audio nodes', () => {
    const document = new UpDocument([
      new Audio('ghostly howling', 'http://example.com/ghosts.ogg', 3)
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<audio controls data-up-source-line="3" loop src="http://example.com/ghosts.ogg" title="ghostly howling">'
      + '<a href="http://example.com/ghosts.ogg">ghostly howling</a>'
      + '</audio>')
  })

  specify('Videos', () => {
    const document = new UpDocument([
      new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm', 5)
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<video controls data-up-source-line="5" loop src="http://example.com/poltergeists.webm" title="ghosts eating luggage">'
      + '<a href="http://example.com/poltergeists.webm">ghosts eating luggage</a>'
      + '</video>')
  })

  specify('Links (containing outlined media conventions)', () => {
    const document = new UpDocument([
      new Link([
        new Image('haunted house', 'http://example.com/hauntedhouse.svg')
      ], 'https://example.com/gallery', 2)
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<a data-up-source-line="2" href="https://example.com/gallery">'
      + '<img alt="haunted house" src="http://example.com/hauntedhouse.svg" title="haunted house">'
      + '</a>')
  })
})
