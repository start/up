import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'


describe('A paragraph directly followed by audio on its own line', () => {
  it('produces a pagraph node followed by an audio node, not a line block', () => {
    const markup = `
Do not pour the spiders into your sister's cereal.
[audio: six seconds of screaming][http://example.com/screaming.ogg]`
    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Do not pour the spiders into your sister's cereal.")
        ]),
        new AudioNode('six seconds of screaming', 'http://example.com/screaming.ogg'),
      ]))
  })
})


describe('An otherwise-valid audio convention with mismatched brackets surrounding its description', () => {
  it('does not produce an audio node', () => {
    expect(Up.toAst('I like [audio: ghosts}(http://example.com/ghosts.ogg).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like [audio: ghosts}'),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com/ghosts.ogg')
          ], 'http://example.com/ghosts.ogg'),
          new PlainTextNode(')'),
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An otherwise-valid audio convention with mismatched brackets surrounding its URL', () => {
  it('does not produce an audio node', () => {
    expect(Up.toAst('I like [audio: ghosts][http://example.com/ghosts.ogg).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new SquareBracketedNode([
          new PlainTextNode('[audio: ghosts]')
        ]),
        new PlainTextNode('['),
        new LinkNode([
          new PlainTextNode('example.com/ghosts.ogg).')
        ], 'http://example.com/ghosts.ogg).'),
      ]))
  })
})


context('Unmatched opening parentheses in an audio description have no affect on', () => {
  specify('parentheses surounding the URL', () => {
    expect(Up.toAst('[audio: sad :( sad :( sounds](http://example.com/sad.ogg)')).to.be.eql(
      new DocumentNode([
        new AudioNode('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
      ]))
  })

  specify('parentheses that follow the convention', () => {
    expect(Up.toAst('([audio: sad :( sad :( sounds][http://example.com/sad.ogg])')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new ParenthesizedNode([
            new PlainTextNode('('),
            new AudioNode('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
            new PlainTextNode(')'),
          ])
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in an audio URL", () => {
  it('do not affect any markup that follows the link', () => {
    const markup = '(^[audio: West Virginia exit polling][https://example.com/a(normal(url])'

    const footnote = new FootnoteNode([
      new AudioNode('West Virginia exit polling', 'https://example.com/a(normal(url'),
    ], 1)

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          footnote
        ]),
        new FootnoteBlockNode([
          footnote
        ])
      ]))
  })
})
