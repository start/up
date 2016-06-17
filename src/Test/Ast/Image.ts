import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOfBrackets } from './Helpers'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('Bracketed (square bracketed, curly bracketed, or parenthesized) text starting with "image:" immediately followed by another instance of bracketed text', () => {
  it('produces an image node with the first bracketed text treated as the description and the second treated as the URL', () => {
    expect(Up.toAst('I would never stay here. [image: haunted house](http://example.com/hauntedhouse.svg) Would you?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I would never stay here. '),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new PlainTextNode(' Would you?')
      ]))
  })
})


describe('An image that is the only convention on its line', () => {
  it('is not placed inside a paragraph node, instead being placed directly inside the node that would have contained paragraph', () => {
    expect(Up.toAst('[image: haunted house](http://example.com/hauntedhouse.svg)')).to.be.eql(
      new DocumentNode([
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg')
      ]))
  })
})


describe("The brackets enclosing an image convention's description and URL", () => {
  it("can be different from each other (as long as each pair of brackets is matching)", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'image: ghostly howling',
      secondPartToWrapInBrackets: 'http://example.com/ghosts.svg',
      toProduce: new DocumentNode([
        new ImageNode('ghostly howling', 'http://example.com/ghosts.svg')
      ])
    })
  })
})


describe("An image convention", () => {
  it("can always have optional whitespace between its bracketed content and its bracketed URL", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'image: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: 'http://example.com/ghosts.svg',
      toProduce: new DocumentNode([
        new ImageNode('ghostly howling', 'http://example.com/ghosts.svg')
      ])
    })
  })
})


describe('An image URL with no URL scheme', () => {
  it("is prefixed with the default URL scheme ('https://' unless changed via the 'defaultUrlScheme' config setting)", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'image: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: 'example.com/ghosts.svg',
      toProduce: new DocumentNode([
        new ImageNode('ghostly howling', 'https://example.com/ghosts.svg')
      ])
    })
  })
})


describe('An image URL starting with a slash', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithSlash" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'image: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: '/howling.svg',
      toProduce: new DocumentNode([
        new ImageNode('ghostly howling', '/howling.svg')
      ])
    })
  })
})


describe('An image URL starting with a hash mark ("#")', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithFragmentIdentifier" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'image: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: '#howling.svg',
      toProduce: new DocumentNode([
        new ImageNode('ghostly howling', '#howling.svg')
      ])
    })
  })
})


describe("An image convention's URL", () => {
  it("can contain spaces", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'image: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: 'http://example.com/scary ghosts.svg',
      toProduce: new DocumentNode([
        new ImageNode('ghostly howling', 'http://example.com/scary ghosts.svg')
      ])
    })
  })

  it("does not need to have an extension", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'image: ghostly howling',
      partsToPutInBetween: [' ', '\t', '  \t '],
      secondPartToWrapInBrackets: 'http://example.com/ghosts',
      toProduce: new DocumentNode([
        new ImageNode('ghostly howling', 'http://example.com/ghosts')
      ])
    })
  })
})


describe('An image description (enclosed in square brackets)', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('[image: haunted [house]](http://example.com/?state=NE)')).to.be.eql(
      new DocumentNode([
        new ImageNode('haunted [house]', 'http://example.com/?state=NE'),
      ]))
  })
  
  it('can contain nested matching square brackets', () => {
    expect(Up.toAst('[image: [haunted [house]]](http://example.com/?state=NE)')).to.be.eql(
      new DocumentNode([
        new ImageNode('[haunted [house]]', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('An image description (enclosed by parentheses)', () => {
  it('can contain matching parenthes\es', () => {
    expect(Up.toAst('(image: ghosts eating (luggage))[http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new ImageNode('ghosts eating (luggage)', 'http://example.com/?state=NE'),
      ]))
  })

  it('can contain nested matching parentheses', () => {
    expect(Up.toAst('(image: (ghosts (eating)) ((luggage)))[http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new ImageNode('(ghosts (eating)) ((luggage))', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('An image description (enclosed by curly brackets)', () => {
  it('can contain matching curly brackets', () => {
    expect(Up.toAst('{image: ghosts eating {luggage}}[http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new ImageNode('ghosts eating {luggage}', 'http://example.com/?state=NE'),
      ]))
  })

  it('can contain nested matching curly brackets', () => {
    expect(Up.toAst('{image: {ghosts {eating}} {{luggage}}}[http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new ImageNode('{ghosts {eating}} {{luggage}}', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('An image URL (enclosed in square brackets)', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('(image: ghosts eating luggage)[http://example.com/?state=[NE]]')).to.be.eql(
      new DocumentNode([
        new ImageNode('ghosts eating luggage', 'http://example.com/?state=[NE]'),
      ]))
  })
  
  it('can contain nested matching square brackets', () => {
    expect(Up.toAst('(image: ghosts eating luggage)[http://example.com/?[state=[NE]]]')).to.be.eql(
      new DocumentNode([
        new ImageNode('ghosts eating luggage', 'http://example.com/?[state=[NE]]'),
      ]))
  })
})


describe('An image URL (enclosed in parentheses)', () => {
  it('can contain matching parentheses', () => {
    expect(Up.toAst('[image: ghosts eating luggage](http://example.com/?state=(NE))')).to.be.eql(
      new DocumentNode([
        new ImageNode('ghosts eating luggage', 'http://example.com/?state=(NE)'),
      ]))
  })
  
  it('can contain nested matching parentheses', () => {
    expect(Up.toAst('[image: ghosts eating luggage](http://example.com/?(state=(NE)))')).to.be.eql(
      new DocumentNode([
        new ImageNode('ghosts eating luggage', 'http://example.com/?(state=(NE))'),
      ]))
  })
})


describe('An image URL (enclosed in curly brackets)', () => {
  it('can contain matching curly brackets', () => {
    expect(Up.toAst('[image: ghosts eating luggage]{http://example.com/?state={NE}}')).to.be.eql(
      new DocumentNode([
        new ImageNode('ghosts eating luggage', 'http://example.com/?state={NE}'),
      ]))
  })
  
  it('can contain nested matching curly brackets', () => {
    expect(Up.toAst('[image: ghosts eating luggage]{http://example.com/?{state={NE}}}')).to.be.eql(
      new DocumentNode([
        new ImageNode('ghosts eating luggage', 'http://example.com/?{state={NE}}'),
      ]))
  })
})
