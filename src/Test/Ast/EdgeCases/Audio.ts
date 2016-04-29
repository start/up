
import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


describe('Audio without a description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.toAst('[audio: -> http://example.com/ghosts.ogg]')).to.be.eql(
      new DocumentNode([
        new AudioNode('http://example.com/ghosts.ogg', 'http://example.com/ghosts.ogg'),
      ]))
  })
})


describe('Audio with a blank description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.toAst('[audio:    \t -> http://example.com/ghosts.ogg]')).to.be.eql(
      new DocumentNode([
        new AudioNode('http://example.com/ghosts.ogg', 'http://example.com/ghosts.ogg'),
      ]))
  })
})


describe('Audio with a blank URL', () => {
  it('is not included in the document', () => {
    expect(Up.toAst('[audio: ghostly howling -> \t   ]')).to.be.eql(
      new DocumentNode([]))
  })
})


describe('A paragraph directly followed by audio on its own line', () => {
  it('produces a pagraph node followed by an audio node, not a line block', () => {
    const text = `
Do not pour the spiders into your sister's cereal.
[audio: six seconds of screaming -> http://example.com/screaming.ogg]`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Do not pour the spiders into your sister's cereal.")
        ]),
        new AudioNode('six seconds of screaming', 'http://example.com/screaming.ogg'),
      ]))
  })
})


describe('An otherwise valid audio convention prematurely terminated by an unmatched closing bracket in its description', () => {
  it('is treated as plain text', () => {
    expect(Up.toAst('[audio: zzz] -> 8]')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('[audio: zzz] -> 8]'),
        ])
      ]))
  })
})
