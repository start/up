import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOfBrackets } from './Helpers'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'


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


describe('A video that is the only convention on its line is not placed inside a paragraph node.', () => {
  specify('Instead, it gets placed directly inside the node that would have contained paragraph', () => {
    expect(Up.toAst('[video: ghosts eating luggage](http://example.com/poltergeists.webm)')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })


  context('This also applies when that video', () => {
    specify('is surrounded by whitespace', () => {
      expect(Up.toAst(' \t [video: ghosts eating luggage](http://example.com/poltergeists.webm) \t ')).to.be.eql(
        new DocumentNode([
          new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
        ]))
    })

    specify('is linkified', () => {
      const text =
        ' \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm) (hauntedhouse.com) \t '

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new LinkNode([
            new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
          ], 'https://hauntedhouse.com'),
        ]))
    })

    specify('is the only convention within a link', () => {
      const text =
        ' \t {[video: ghosts eating luggage] (http://example.com/poltergeists.webm)} (hauntedhouse.com) \t '

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new LinkNode([
            new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
          ], 'https://hauntedhouse.com'),
        ]))
    })
  })
})


describe("The brackets enclosing a video convention's description and URL", () => {
  it("can be different from each other (as long as each pair of brackets is matching)", () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'video: ghostly howling',
      urlToWrapInBrackets: 'http://example.com/ghosts.webm',
      toProduce: new DocumentNode([
        new VideoNode('ghostly howling', 'http://example.com/ghosts.webm')
      ])
    })
  })
})


describe("A video convention", () => {
  it("can always have optional whitespace between its bracketed content and its bracketed URL", () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'video: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      urlToWrapInBrackets: 'http://example.com/ghosts.webm',
      toProduce: new DocumentNode([
        new VideoNode('ghostly howling', 'http://example.com/ghosts.webm')
      ])
    })
  })
})


describe('A video URL with no URL scheme', () => {
  it("is prefixed with the default URL scheme ('https://' unless changed via the 'defaultUrlScheme' config setting)", () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'video: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      urlToWrapInBrackets: 'example.com/ghosts.webm',
      toProduce: new DocumentNode([
        new VideoNode('ghostly howling', 'https://example.com/ghosts.webm')
      ])
    })
  })
})


describe('A video URL starting with a slash', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithSlash" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'video: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      urlToWrapInBrackets: '/howling.webm',
      toProduce: new DocumentNode([
        new VideoNode('ghostly howling', '/howling.webm')
      ])
    })
  })
})


describe('A video URL starting with a hash mark ("#")', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithFragmentIdentifier" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'video: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      urlToWrapInBrackets: '#howling.webm',
      toProduce: new DocumentNode([
        new VideoNode('ghostly howling', '#howling.webm')
      ])
    })
  })
})


describe("A video convention's URL", () => {
  it("can contain spaces", () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'video: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      urlToWrapInBrackets: 'http://example.com/scary ghosts.webm',
      toProduce: new DocumentNode([
        new VideoNode('ghostly howling', 'http://example.com/scary ghosts.webm')
      ])
    })
  })
  
  it("does not need to have an extension", () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'video: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      urlToWrapInBrackets: 'http://example.com/ghosts',
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
