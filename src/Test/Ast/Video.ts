import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOfBrackets } from './Helpers'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('Bracketed (square bracketed, curly bracketed, or parenthesized) text starting with "video:" immediately followed by another instance of bracketed text', () => {
  it('produces a video node with the first bracketed text treated as the description and the second treated as the URL', () => {
    expect(Up.toAst('I would never stay in a house with this. [video: ghosts eating luggage](http://example.com/poltergeists.webm) Would you?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I would never stay in a house with this. '),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new PlainTextNode(' Would you?')
      ]))
  })
})


describe('A video that is the only convention on its line', () => {
  it('is not placed inside a paragraph node, instead being placed directly inside the node that would have contained paragraph', () => {
    expect(Up.toAst('[video: ghosts eating luggage](http://example.com/poltergeists.webm)')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe("The brackets enclosing a video convention's description and URL", () => {
  it("can be different from each other (as long as each pair of brackets is matching)", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'video: ghostly howling',
      secondPartToWrapInBrackets: 'http://example.com/ghosts.svg',
      toProduce: new DocumentNode([
        new VideoNode('ghostly howling', 'http://example.com/ghosts.svg')
      ])
    })
  })
})


describe("A video convention", () => {
  it("can always have optional whitespace between its bracketed content and its bracketed URL", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'video: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: 'http://example.com/ghosts.svg',
      toProduce: new DocumentNode([
        new VideoNode('ghostly howling', 'http://example.com/ghosts.svg')
      ])
    })
  })
})


describe('A video URL with no URL scheme', () => {
  it("is prefixed with the default URL scheme ('https://' unless changed via the 'defaultUrlScheme' config setting)", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'video: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: 'example.com/ghosts.svg',
      toProduce: new DocumentNode([
        new VideoNode('ghostly howling', 'https://example.com/ghosts.svg')
      ])
    })
  })
})


describe('A video URL starting with a slash', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithSlash" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'video: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: '/howling.svg',
      toProduce: new DocumentNode([
        new VideoNode('ghostly howling', '/howling.mp3')
      ])
    })
  })
})


describe('A video URL starting with a fragment identifier ("#")', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithFragmentIdentifier" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'video: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: '#howling.mp3',
      toProduce: new DocumentNode([
        new VideoNode('ghostly howling', '#howling.mp3')
      ])
    })
  })
})


describe("A video convention's URL", () => {
  it("can contain spaces", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'video: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: 'http://example.com/scary ghosts.svg',
      toProduce: new DocumentNode([
        new VideoNode('ghostly howling', 'http://example.com/scary ghosts.svg')
      ])
    })
  })
})


describe("A video convention's URL", () => {
  it("does not need to have an extension", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'video: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: 'http://example.com/ghosts',
      toProduce: new DocumentNode([
        new VideoNode('ghostly howling', 'http://example.com/ghosts')
      ])
    })
  })
})


describe('A video description produced by square brackets', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('[video: ghosts eating [luggage]](http://example.com/?state=NE)')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating [luggage]', 'http://example.com/?state=NE'),
      ]))
  })

  it('can contain nested matching square brackets', () => {
    expect(Up.toAst('[video: [ghosts [eating]] [[luggage]]](http://example.com/?state=NE)')).to.be.eql(
      new DocumentNode([
        new VideoNode('[ghosts [eating]] [[luggage]]', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('A video description (enclosed by parentheses)', () => {
  it('can contain matching parenthes\es', () => {
    expect(Up.toAst('(video: ghosts eating (luggage))[http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating (luggage)', 'http://example.com/?state=NE'),
      ]))
  })

  it('can contain nested matching parentheses', () => {
    expect(Up.toAst('(video: (ghosts (eating)) ((luggage)))[http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new VideoNode('(ghosts (eating)) ((luggage))', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('A video description (enclosed by curly brackets)', () => {
  it('can contain matching curly brackets', () => {
    expect(Up.toAst('{video: ghosts eating {luggage}}[http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating {luggage}', 'http://example.com/?state=NE'),
      ]))
  })

  it('can contain nested matching curly brackets', () => {
    expect(Up.toAst('{video: {ghosts {eating}} {{luggage}}}[http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new VideoNode('{ghosts {eating}} {{luggage}}', 'http://example.com/?state=NE'),
      ]))
  })
})


describe("A video URL (enclosed by square brackets)", () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('(video: ghosts eating luggage)[http://example.com/?state=[NE]]')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/?state=[NE]'),
      ]))
  })

  it('can contain nested matching square brackets', () => {
    expect(Up.toAst('(video: ghosts eating luggage)[http://example.com/?[state=[NE]]]')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/?[state=[NE]]'),
      ]))
  })
})


describe("A video URL (enclosed by parentheses)", () => {
  it('can contain matching parentheses', () => {
    expect(Up.toAst('[video: ghosts eating luggage](http://example.com/?state=(NE))')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/?state=(NE)'),
      ]))
  })

  it('can contain nested matching parentheses', () => {
    expect(Up.toAst('[video: ghosts eating luggage](http://example.com/?(state=(NE)))')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/?(state=(NE))'),
      ]))
  })
})


describe("A video URL (enclosed by square brackets)", () => {
  it('can contain matching curly brackets', () => {
    expect(Up.toAst('[video: ghosts eating luggage]{http://example.com/?state={NE}}')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/?state={NE}'),
      ]))
  })

  it('can contain nested matching curly brackets', () => {
    expect(Up.toAst('[video: ghosts eating luggage]{http://example.com/?{state={NE}}}')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/?{state={NE}}'),
      ]))
  })
})
