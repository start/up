import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'


describe('Bracketed text starting with "audio:" with a description pointing to a URL', () => {
  it('produces an audio node with the description and URL', () => {
    expect(Up.toAst('I would never stay in a house with these sounds. [audio: ghostly howling -> http://example.com/ghosts.ogg] Would you?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I would never stay in a house with these sounds. '),
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new PlainTextNode(' Would you?')
      ]))
  })
})


describe('Audio that is the only convention on its line', () => {
  it('is not placed inside a paragraph node, instead being placed directly inside the node that would have contained paragraph', () => {
    expect(Up.toAst('[audio: ghostly howling -> http://example.com/ghosts.ogg]')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
      ]))
  })
})


describe('Audio with a relative URL containing spaces and no extension', () => {
  it('is parsed correctly', () => {
    expect(Up.toAst('[audio: ghostly howling -> ghostly howling]')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'ghostly howling'),
      ]))
  })
})


describe('An audio description', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('[audio: [ghostly] howling -> http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new AudioNode('[ghostly] howling', 'http://example.com/?state=NE'),
      ]))
  })
  
  it('can contain nested matching square brackets', () => {
    expect(Up.toAst('[audio: [[ghostly] howling] -> http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new AudioNode('[[ghostly] howling]', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('An audio URL', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('[audio: ghostly howling -> http://example.com/?state=[NE]]')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/?state=[NE]'),
      ]))
  })
  
  it('can contain matching square brackets', () => {
    expect(Up.toAst('[audio: ghostly howling -> http://example.com/?[state=[NE]]]')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/?[state=[NE]]'),
      ]))
  })
})