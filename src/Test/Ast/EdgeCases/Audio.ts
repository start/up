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


describe('Audio without a description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.toAst('[audio:][http://example.com/ghosts.ogg]')).to.be.eql(
      new DocumentNode([
        new AudioNode('http://example.com/ghosts.ogg', 'http://example.com/ghosts.ogg'),
      ]))
  })
})


describe('Audio with a blank description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.toAst('[audio:    \t][http://example.com/ghosts.ogg]')).to.be.eql(
      new DocumentNode([
        new AudioNode('http://example.com/ghosts.ogg', 'http://example.com/ghosts.ogg'),
      ]))
  })
})


describe('Audio with a blank URL', () => {
  it('is not included in the document', () => {
    expect(Up.toAst('[audio: ghostly howling][\t   ]')).to.be.eql(
      new DocumentNode([]))
  })
})


describe('A paragraph directly followed by audio on its own line', () => {
  it('produces a pagraph node followed by an audio node, not a line block', () => {
    const text = `
Do not pour the spiders into your sister's cereal.
[audio: six seconds of screaming][http://example.com/screaming.ogg]`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Do not pour the spiders into your sister's cereal.")
        ]),
        new AudioNode('six seconds of screaming', 'http://example.com/screaming.ogg'),
      ]))
  })
})


describe('An otherwise valid audio convention with a space between its bracketed description and its bracketed URL', () => {
  it('is treated as plain text', () => {
    expect(Up.toAst('[audio: zzz] [-_-]')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new SquareBracketedNode([
            new PlainTextNode('[audio: zzz]')
          ]),
          new PlainTextNode(' '),
          new SquareBracketedNode([
            new PlainTextNode('[-_-]')
          ]),
        ])
      ]))
  })
})


describe('An otherwise valid audio convention with mismatched brackets surrounding its description', () => {
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


describe('An otherwise valid audio convention with mismatched brackets surrounding its URL', () => {
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


describe("Unmatched opening parentheses in an audio URL", () => {
  it('do not affect any text that follows the link', () => {
    const text = '(([audio: West Virginia exit polling][https://example.com/a(normal(url]))'

    const footnote = new FootnoteNode([
      new AudioNode('West Virginia exit polling', 'https://example.com/a(normal(url'),
    ], 1)

    expect(Up.toAst(text)).to.be.eql(
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
