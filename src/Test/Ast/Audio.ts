import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOf, expectEveryCombinationOfBrackets } from './Helpers'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('Bracketed (square bracketed, curly bracketed, or parenthesized) text starting with "audio:" immediately followed by another instance of bracketed text', () => {
  it('produces an audio node with the description and URL', () => {
    expect(Up.toAst('I would never stay in a house with these sounds. [audio: ghostly howling](http://example.com/ghosts.ogg) Would you?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I would never stay in a house with these sounds. '),
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new PlainTextNode(' Would you?')
      ]))
  })
})


describe('An audio convention that is the only convention on its line', () => {
  it('is not placed inside a paragraph node, instead being placed directly inside the node that would have contained paragraph', () => {
    expect(Up.toAst('[audio: ghostly howling](http://example.com/ghosts.ogg)')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
      ]))
  })
})


describe('Bracketed text starting with "audio:" immediately followed by another instance of bracketed text', () => {
  it("produces an audio node. The type of bracket enclosing the description can be different from the type of bracket enclosing the URL", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'audio: ghostly howling',
      secondPartToWrapInBrackets: 'http://example.com/ghosts.ogg',
      toProduce: new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg')
      ])
    })
  })
})


describe('Bracketed text starting with "audio:" immediately followed by another instance of bracketed text with no URL scheme', () => {
  it("produces an audio node with its URL prefixed with the default URL scheme ('https://' unless changed via the 'defaultUrlScheme' config setting)", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'audio: ghostly howling',
      secondPartToWrapInBrackets: 'example.com/ghosts.ogg',
      toProduce: new DocumentNode([
        new AudioNode('ghostly howling', 'https://example.com/ghosts.ogg')
      ])
    })
  })
})


describe('Bracketed text starting with "audio:" immediately followed by another instance of bracketed text starting with a slash', () => {
  it('produces an audio node whose URL has no added prefix by default (because the default "baseForUrlsStartingWithSlash" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'audio: ghostly howling',
      secondPartToWrapInBrackets: '/some-song.mp3',
      toProduce: new DocumentNode([
        new AudioNode('ghostly howling', '/some-song.mp3')
      ])
    })
  })
})


describe('Bracketed text starting with "audio:" immediately followed by another instance of bracketed text starting with a fragment identifier ("#")', () => {
  it('produces an audio node whose URL has no added prefix by default (because the default "baseForUrlsStartingWithFragmentIdentifier" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'audio: ghostly howling',
      secondPartToWrapInBrackets: '#some-song.mp3',
      toProduce: new DocumentNode([
        new AudioNode('ghostly howling', '#some-song.mp3')
      ])
    })
  })
})


describe('An audio description (enclosed in parentheses)', () => {
  it('can contain matching parentheses', () => {
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
    expect(Up.toAst('(audio: ghosts eating luggage)[http://example.com/?[state=[NE]]]')).to.be.eql(
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
        new AudioNode('ghosts eating luggage', 'http://example.com/?(state=(NE))'),
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
