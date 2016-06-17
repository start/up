import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOfBrackets } from './Helpers'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('Bracketed (square bracketed, curly bracketed, or parenthesized) text starting with "audio:" immediately followed by another instance of bracketed text', () => {
  it('produces an audio node with the first bracketed text treated as the description and the second treated as the URL', () => {
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


describe("The brackets enclosing an audio convention's description and URL", () => {
  it("can be different from each other (as long as each pair of brackets is matching)", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'audio: ghostly howling',
      secondPartToWrapInBrackets: 'http://example.com/ghosts.ogg',
      toProduce: new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg')
      ])
    })
  })
})


describe("An audio convention", () => {
  it("can always have optional whitespace between its bracketed content and its bracketed URL", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'audio: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: 'http://example.com/ghosts.ogg',
      toProduce: new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg')
      ])
    })
  })
})


describe('An audio URL with no URL scheme', () => {
  it("is prefixed with the default URL scheme ('https://' unless changed via the 'defaultUrlScheme' config setting)", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'audio: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: 'example.com/ghosts.ogg',
      toProduce: new DocumentNode([
        new AudioNode('ghostly howling', 'https://example.com/ghosts.ogg')
      ])
    })
  })
})


describe('An audio URL starting with a slash', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithSlash" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'audio: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: '/some-song.mp3',
      toProduce: new DocumentNode([
        new AudioNode('ghostly howling', '/some-song.mp3')
      ])
    })
  })
})


describe('An audio URL starting with a fragment identifier ("#")', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithFragmentIdentifier" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'audio: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: '#some-song.mp3',
      toProduce: new DocumentNode([
        new AudioNode('ghostly howling', '#some-song.mp3')
      ])
    })
  })
})


describe("An audio convention's URL", () => {
  it("can contain spaces", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'audio: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: 'http://example.com/scary ghosts.ogg',
      toProduce: new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/scary ghosts.ogg')
      ])
    })
  })
})


describe("An audio convention's URL", () => {
  it("does not need to have an extension", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'audio: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: 'http://example.com/ghosts',
      toProduce: new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts')
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
