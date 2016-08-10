import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../SyntaxNodes/NsflBlockNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { OutlineSeparatorNode } from '../../SyntaxNodes/OutlineSeparatorNode'


context('When an outline syntax node has a source line number, its outermost element is given an "data-up-source-line" attribute whose value is the line number. This is true for:', () => {
  specify('Paragraphs', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([new PlainTextNode('Nimble navigator')], 5)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p data-up-source-line="5">Nimble navigator</p>')
  })


  specify('Unordered list', () => {
    const documentNode = new DocumentNode([
      new UnorderedListNode([
        new UnorderedListNode.Item([
          new ParagraphNode([
            new PlainTextNode('Tropical')
          ], 3)
        ]),
        new UnorderedListNode.Item([
          new ParagraphNode([
            new PlainTextNode('Territories')
          ], 4)
        ])
      ], 3)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<ul data-up-source-line="3">'
      + '<li><p data-up-source-line="3">Tropical</p></li>'
      + '<li><p data-up-source-line="4">Territories</p></li>'
      + '</ul>')
  })


  specify('Ordered lists without start ordinals', () => {
    const documentNode = new DocumentNode([
      new OrderedListNode([
        new OrderedListNode.Item([
          new ParagraphNode([
            new PlainTextNode('Tropical')
          ], 1)
        ]),
        new OrderedListNode.Item([
          new ParagraphNode([
            new PlainTextNode('Territories')
          ])
        ], 3)
      ], 1)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<ol data-up-source-line="1">'
      + '<li><p data-up-source-line="1">Tropical</p></li>'
      + '<li><p data-up-source-line="3">Territories</p></li>'
      + '</ol>')
  })


  specify('Ordered lists with start ordinals', () => {
    const documentNode = new DocumentNode([
      new OrderedListNode([
        new OrderedListNode.Item([
          new ParagraphNode([
            new PlainTextNode('Tropical')
          ], 1)
        ], 3),
        new OrderedListNode.Item([
          new ParagraphNode([
            new PlainTextNode('Territories')
          ], 3)
        ])
      ], 1)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<ol start="3" data-up-source-line="1">'
      + '<li value="3"><p>Tropical</p></li>'
      + '<li><p>Territories</p></li>'
      + '</ol>')
  })


  specify('Reversed ordered lists with start ordinals', () => {
    const documentNode = new DocumentNode([
      new OrderedListNode([
        new OrderedListNode.Item([
          new ParagraphNode([
            new PlainTextNode('Tropical')
          ], 1)
        ], 2),
        new OrderedListNode.Item([
          new ParagraphNode([
            new PlainTextNode('Territories')
          ], 3)
        ], 1)
      ], 1)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<ol start="2" reversed data-up-source-line="3">'
      + '<li value="2"><p>Tropical</p></li>'
      + '<li value="1"><p>Territories</p></li>'
      + '</ol>')
  })


  specify('Description lists', () => {
    const documentNode = new DocumentNode([
      new DescriptionListNode([
        new DescriptionListNode.Item([
          new DescriptionListNode.Item.Term([new PlainTextNode('Bulbasaur')])
        ], new DescriptionListNode.Item.Description([
          new ParagraphNode([
            new PlainTextNode('A grass type Pokemon')
          ], 3)
        ])),
        new DescriptionListNode.Item([
          new DescriptionListNode.Item.Term([new PlainTextNode('Confuse Ray')]),
          new DescriptionListNode.Item.Term([new PlainTextNode('Lick')]),
        ], new DescriptionListNode.Item.Description([
          new ParagraphNode([
            new PlainTextNode('Ghost type moves')
          ], 6)
        ]))
      ], 2)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<dl data-up-source-line="2">'
      + '<dt>Bulbasaur</dt>'
      + '<dd><p data-up-source-line="3">A grass type Pokemon</p></dd>'
      + '<dt>Confuse Ray</dt>'
      + '<dt>Lick</dt>'
      + '<dd><p data-up-source-line="6">Ghost type moves</p></dd>'
      + '</dl>')
  })


  specify('Tables', () => {
    const documentNode = new DocumentNode([
      new TableNode(
        new TableNode.Header([
          new TableNode.Header.Cell([new PlainTextNode('Game')]),
          new TableNode.Header.Cell([new PlainTextNode('Developer')])
        ]), [
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')]),
            new TableNode.Row.Cell([new PlainTextNode('Square')])
          ]),
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('Super Mario Kart')]),
            new TableNode.Row.Cell([new PlainTextNode('Nintendo')])
          ])
        ],
        new TableNode.Caption([
          new PlainTextNode('Influential Games')
        ]), 1)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<table data-up-source-line="1">'
      + '<caption>Influential Games</caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
      + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
      + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
      + '</table>')
  })


  specify('Charts', () => {
    const documentNode = new DocumentNode([
      new TableNode(
        new TableNode.Header([
          new TableNode.Header.Cell([]),
          new TableNode.Header.Cell([new PlainTextNode('1')]),
          new TableNode.Header.Cell([new PlainTextNode('0')])
        ]), [
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('true')]),
            new TableNode.Row.Cell([new PlainTextNode('false')]),
          ], new TableNode.Header.Cell([new PlainTextNode('1')])),
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('false')]),
            new TableNode.Row.Cell([new PlainTextNode('false')])
          ], new TableNode.Header.Cell([new PlainTextNode('0')]))
        ],
        new TableNode.Caption([
          new PlainTextNode('AND operator logic')
        ]), 3)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<table data-up-source-line="3">'
      + '<caption>AND operator logic</caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
      + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>')
  })


  specify('Line blocks', () => {
    const documentNode = new DocumentNode([
      new LineBlockNode([
        new LineBlockNode.Line([
          new PlainTextNode('Hollow')
        ]),
        new LineBlockNode.Line([
          new PlainTextNode('Fangs')
        ])
      ], 4)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<div class="up-lines" data-up-source-line="4">'
      + '<div>Hollow</div>'
      + '<div>Fangs</div>'
      + '</div>')
  })


  specify('Code blocks', () => {
    const documentNode = new DocumentNode([
      new CodeBlockNode('color = Color.Green', 3)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<pre data-up-source-line="3"><code>color = Color.Green</code></pre>')
  })


  specify('Blockquotes', () => {
    const documentNOde = new DocumentNode([
      new BlockquoteNode([
        new ParagraphNode([
          new PlainTextNode('Centipede')
        ], 1)
      ], 1)
    ])

    expect(Up.toHtml(documentNOde)).to.be.eql(
      '<blockquote data-up-source-line="1">'
      + '<p data-up-source-line="1">Centipede</p>'
      + '</blockquote>')
  })


  specify('Level 1 headings', () => {
    const documentNode = new DocumentNode([
      new HeadingNode([new PlainTextNode('Bulbasaur')], 1, 3)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<h1 data-up-source-line="3">Bulbasaur</h1>')
  })

  specify('Level 2 headings', () => {
    const documentNode = new DocumentNode([
      new HeadingNode([new PlainTextNode('Bulbasaur')], 2, 1)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<h1 data-up-source-line="1">Bulbasaur</h1>')
  })

  specify('Level 3 headings', () => {
    const documentNode = new DocumentNode([
      new HeadingNode([new PlainTextNode('Bulbasaur')], 3, 3)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<h3 data-up-source-line="3">Bulbasaur</h1>')
  })

  specify('Level 4  headings', () => {
    const documentNode = new DocumentNode([
      new HeadingNode([new PlainTextNode('Bulbasaur')], 4, 1)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<h4 data-up-source-line="1">Bulbasaur</h1>')
  })
  specify('Level 5 headings', () => {
    const documentNode = new DocumentNode([
      new HeadingNode([new PlainTextNode('Bulbasaur')], 5, 3)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<h5 data-up-source-line="3">Bulbasaur</h1>')
  })

  specify('Level 6 headings', () => {
    const documentNode = new DocumentNode([
      new HeadingNode([new PlainTextNode('Bulbasaur')], 6, 1)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<h6 data-up-source-line="1">Bulbasaur</h1>')
  })

  specify('Level 10 headings', () => {
    const documentNode = new DocumentNode([
      new HeadingNode([new PlainTextNode('Bulbasaur')], 10, 2)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<h6 data-up-source-line="2">Bulbasaur</h1>')
  })


  specify('Section separators', () => {
    const documentNode = new DocumentNode([
      new OutlineSeparatorNode(2)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<hr data-up-source-line="2">')
  })


  specify('Images', () => {
    const documentNode = new DocumentNode([
      new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg', 2)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<img src="http://example.com/hauntedhouse.svg" alt="haunted house" title="haunted house" data-up-source-line="2">')
  })


  specify('Audio nodes', () => {
    const documentNode = new DocumentNode([
      new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg', 3)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<audio src="http://example.com/ghosts.ogg" title="ghostly howling" controls loop data-up-source-line="3">'
      + '<a href="http://example.com/ghosts.ogg">ghostly howling</a>'
      + '</audio>')
  })

  specify('Videos', () => {
    const documentNode = new DocumentNode([
      new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm', 5)
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<video src="http://example.com/poltergeists.webm" title="ghosts eating luggage" controls loop data-up-source-line="5">'
      + '<a href="http://example.com/poltergeists.webm">ghosts eating luggage</a>'
      + '</video>')
  })

  specify('Spoiler blocks', () => {
    const documentNode = new DocumentNode([
      new SpoilerBlockNode([
        new ParagraphNode([
          new PlainTextNode('John Carmack is a decent programmer.')
        ], 3)
      ], 2)
    ])

    const html =
      '<div class="up-spoiler up-revealable" data-up-source-line="2">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<div>'
      + '<p data-up-source-line="3">John Carmack is a decent programmer.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(documentNode)).to.be.eql(html)
  })

  specify('NSFW blocks', () => {
    const documentNode = new DocumentNode([
      new NsfwBlockNode([
        new ParagraphNode([
          new PlainTextNode('John Carmack is a decent programmer.')
        ], 2)
      ], 1)
    ])

    const html =
      '<div class="up-nsfw up-revealable" data-up-source-line="1">'
      + '<label for="up-nsfw-1">toggle NSFW</label>'
      + '<input id="up-nsfw-1" type="checkbox">'
      + '<div>'
      + '<p data-up-source-line="2">John Carmack is a decent programmer.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(documentNode)).to.be.eql(html)
  })

  specify('NSFL blocks', () => {
    const documentNode = new DocumentNode([
      new NsflBlockNode([
        new ParagraphNode([
          new PlainTextNode('John Carmack is a decent programmer.')
        ], 4)
      ], 2)
    ])

    const html =
      '<div class="up-nsfl up-revealable" data-up-source-line="2">'
      + '<label for="up-nsfl-1">toggle NSFL</label>'
      + '<input id="up-nsfl-1" type="checkbox">'
      + '<div>'
      + '<p data-up-source-line="4">John Carmack is a decent programmer.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(documentNode)).to.be.eql(html)
  })
})
