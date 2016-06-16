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


describe('Bracketed text starting with "video:" immediately followed by another instance of bracketed text', () => {
  it("produces a video node. The type of bracket enclosing the description can be different from the type of bracket enclosing the URL", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'video: ghosts eating luggage',
      secondPartToWrapInBrackets: 'http://example.com/hauntedhouse.webm',
      toProduce: new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/hauntedhouse.webm')
      ])
    })
  })
})


describe('Bracketed text starting with "video:" immediately followed by another instance of bracketed text with no URL scheme', () => {
  it("produces a video node with its URL prefixed with the default URL scheme ('https://' unless changed via the 'defaultUrlScheme' config setting)", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'video: ghosts eating luggage',
      secondPartToWrapInBrackets: 'example.com/hauntedhouse.ogg',
      toProduce: new DocumentNode([
        new VideoNode('ghosts eating luggage', 'https://example.com/hauntedhouse.ogg')
      ])
    })
  })
})


describe('Bracketed text starting with "video:" immediately followed by another instance of bracketed text starting with a slash', () => {
  it('produces a video node whose URL has no added prefix by default (because the default "baseForUrlsStartingWithSlash" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'video: ghosts eating luggage',
      secondPartToWrapInBrackets: '/hauntedhouse.webm',
      toProduce: new DocumentNode([
        new VideoNode('ghosts eating luggage', '/hauntedhouse.webm')
      ])
    })
  })
})


describe('Bracketed text starting with "video:" immediately followed by another instance of bracketed text starting with a fragment identifier ("#")', () => {
  it('produces a video node whose URL has no added prefix by default (because the default "baseForUrlsStartingWithFragmentIdentifier" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'video: ghosts eating luggage',
      secondPartToWrapInBrackets: '#hauntedhouse.webm',
      toProduce: new DocumentNode([
        new VideoNode('ghosts eating luggage', '#hauntedhouse.webm')
      ])
    })
  })
})


describe("A video convention's URL", () => {
  it("can contain spaces, assuming the bracketed URL directly follows the bracketed description", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'video: ghosts eating luggage',
      secondPartToWrapInBrackets: 'http://example.com/scary ghosts.webm',
      toProduce: new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/scary ghosts.webm')
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
