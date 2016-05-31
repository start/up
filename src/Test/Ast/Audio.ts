import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOf } from './Helpers'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('Bracketed/parenthesized text starting with "audio:" followed by a bracketed/parenthesized URL', () => {
  it('produces an audio node with the description and URL', () => {
    expect(Up.toAst('I would never stay in a house with these sounds. [audio: ghostly howling](http://example.com/ghosts.ogg) Would you?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I would never stay in a house with these sounds. '),
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new PlainTextNode(' Would you?')
      ]))
  })
})


describe('Audio that is the only convention on its line', () => {
  it('is not placed inside a paragraph node, instead being placed directly inside the node that would have contained paragraph', () => {
    expect(Up.toAst('[audio: ghostly howling](http://example.com/ghosts.ogg)')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
      ]))
  })
})


describe('Audio produced by parentheses, square brackets, or curly brackets followed immediately by a parenthesized, a square bracketed, or a curly bracketed URL', () => {
  it('produces an audio node. The type of bracket surrounding the text can be different from the type of bracket surrounding the URL', () => {
    expectEveryCombinationOf({
      firstHalves: [
        '[audio: ghostly howling]',
        '(audio: ghostly howling)',
        '{audio: ghostly howling}'
      ],
      secondHalves: [
        '[http://example.com/ghosts.ogg]',
        '(http://example.com/ghosts.ogg)',
        '{http://example.com/ghosts.ogg}'
      ],
      toProduce: new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg')
      ])
    })
  })
})


describe('Audio with a relative URL containing spaces and no extension', () => {
  it('is parsed correctly', () => {
    expect(Up.toAst('[audio: ghostly howling](ghostly howling)')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'ghostly howling'),
      ]))
  })
})


describe('An audio description (enclosed in parentheses)', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('(audio: (ghostly) howling)[http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new AudioNode('(ghostly) howling', 'http://example.com/?state=NE'),
      ]))
  })
  
  it('can contain nested matching parentheses', () => {
    expect(Up.toAst('(audio: ((ghostly) howling))[http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new AudioNode('((ghostly) howling)', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('An audio description (enclosed in square brackets)', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('[audio: [ghostly] howling](http://example.com/?state=NE)')).to.be.eql(
      new DocumentNode([
        new AudioNode('[ghostly] howling', 'http://example.com/?state=NE'),
      ]))
  })
  
  it('can contain nested matching square brackets', () => {
    expect(Up.toAst('[audio: [[ghostly] howling]](http://example.com/?state=NE)')).to.be.eql(
      new DocumentNode([
        new AudioNode('[[ghostly] howling]', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('An audio description (enclosed in curly brackets)', () => {
  it('can contain matching curly brackets', () => {
    expect(Up.toAst('{audio: {ghostly} howling}(http://example.com/?state=NE)')).to.be.eql(
      new DocumentNode([
        new AudioNode('{ghostly} howling', 'http://example.com/?state=NE'),
      ]))
  })
  
  it('can contain nested matching curly brackets', () => {
    expect(Up.toAst('{audio: {{ghostly} howling}}(http://example.com/?state=NE)')).to.be.eql(
      new DocumentNode([
        new AudioNode('{{ghostly} howling}', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('An audio URL (enclosed in square brackets)', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('(audio: ghosts eating luggage)[http://example.com/?state=[NE]]')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghosts eating luggage', 'http://example.com/?state=[NE]'),
      ]))
  })
  
  it('can contain nested matching square brackets', () => {
    expect(Up.toAst('(audio: ghosts eating luggage](http://example.com/?[state=[NE]]]')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghosts eating luggage', 'http://example.com/?[state=[NE]]'),
      ]))
  })
})


describe('An audio URL (enclosed in parentheses)', () => {
  it('can contain matching parentheses', () => {
    expect(Up.toAst('[audio: ghosts eating luggage](http://example.com/?state=(NE))')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghosts eating luggage', 'http://example.com/?state=(NE)'),
      ]))
  })
  
  it('can contain nested matching parentheses', () => {
    expect(Up.toAst('[audio: ghosts eating luggage](http://example.com/?(state=(NE)))')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghosts eating luggage', 'http://example.com/?(state=[NE))'),
      ]))
  })
})


describe('An audio URL (enclosed in curly brackets)', () => {
  it('can contain matching curly braces', () => {
    expect(Up.toAst('[audio: ghosts eating luggage]{http://example.com/?state={NE}}')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghosts eating luggage', 'http://example.com/?state={NE}'),
      ]))
  })
  
  it('can contain nested matching curly braces', () => {
    expect(Up.toAst('[audio: ghosts eating luggage]{http://example.com/?{state={NE}}}')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghosts eating luggage', 'http://example.com/?{state={NE}}'),
      ]))
  })
})
