import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOf, expectEveryCombinationOfBrackets } from './Helpers'
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


describe('Bracketed text starting with "image:" immediately followed by another instance of bracketed text', () => {
  it("produces an audio node. The type of bracket enclosing the description can be different from the type of bracket enclosing the URL", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'image: ghosts eating luggage',
      secondPartToWrapInBrackets: 'http://example.com/hauntedhouse.svg',
      toProduce: new DocumentNode([
        new ImageNode('ghosts eating luggage', 'http://example.com/hauntedhouse.svg')
      ])
    })
  })
})


describe('Bracketed text starting with "image:" immediately followed by another instance of bracketed text with no URL scheme', () => {
  it("produces an audio node with its URL prefixed with the default URL scheme ('https://' unless changed via the 'defaultUrlScheme' config setting)", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'image: ghosts eating luggage',
      secondPartToWrapInBrackets: 'example.com/hauntedhouse.ogg',
      toProduce: new DocumentNode([
        new ImageNode('ghosts eating luggage', 'https://example.com/hauntedhouse.ogg')
      ])
    })
  })
})


describe('Bracketed text starting with "image:" immediately followed by another instance of bracketed text starting with a slash', () => {
  it('produces an audio node whose URL has no added prefix by default (because the default "baseForUrlsStartingWithSlash" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'image: ghosts eating luggage',
      secondPartToWrapInBrackets: '/hauntedhouse.png',
      toProduce: new DocumentNode([
        new ImageNode('ghosts eating luggage', '/hauntedhouse.png')
      ])
    })
  })
})


describe('Bracketed text starting with "image:" immediately followed by another instance of bracketed text starting with a fragment identifier ("#")', () => {
  it('produces an audio node whose URL has no added prefix by default (because the default "baseForUrlsStartingWithFragmentIdentifier" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'image: ghosts eating luggage',
      secondPartToWrapInBrackets: '#hauntedhouse.png',
      toProduce: new DocumentNode([
        new ImageNode('ghosts eating luggage', '#hauntedhouse.png')
      ])
    })
  })
})


describe("An image convention's URL", () => {
  it("can contain spaces, assuming the bracketed URL directly follows the bracketed description", () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'image: ghosts eating luggage',
      secondPartToWrapInBrackets: 'http://example.com/scary ghosts.gif',
      toProduce: new DocumentNode([
        new ImageNode('ghosts eating luggage', 'http://example.com/scary ghosts.gif')
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
