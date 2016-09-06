import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from './Helpers'
import { Image } from '../../SyntaxNodes/Image'
import { Link } from '../../SyntaxNodes/Link'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { PlainText } from '../../SyntaxNodes/PlainText'


context('Bracketed (square bracketed or parenthesized) text starting with "image:" immediately followed by another instance of bracketed text', () => {
  it('produces an image node with the first bracketed text treated as the description and the second treated as the image URL', () => {
    expect(Up.parseDocument('I would never stay here. [image: haunted house](http://example.com/hauntedhouse.svg) Would you?')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I would never stay here. '),
        new Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new PlainText(' Would you?')
      ]))
  })
})


context('An image that is the only convention on its line is not placed inside a paragraph node.', () => {
  specify('Instead, it gets placed directly inside the node that would have contained paragraph', () => {
    expect(Up.parseDocument('[image: haunted house](http://example.com/hauntedhouse.svg)')).to.deep.equal(
      new UpDocument([
        new Image('haunted house', 'http://example.com/hauntedhouse.svg')
      ]))
  })


  context('This also applies when that image', () => {
    specify('is surrounded by whitespace', () => {
      expect(Up.parseDocument(' \t [image: haunted house](http://example.com/hauntedhouse.svg) \t ')).to.deep.equal(
        new UpDocument([
          new Image('haunted house', 'http://example.com/hauntedhouse.svg')
        ]))
    })

    specify('is linkified', () => {
      const markup =
        ' \t [image: haunted house] (http://example.com/hauntedhouse.svg) (hauntedhouse.com) \t '

      expect(Up.parseDocument(markup)).to.deep.equal(
        new UpDocument([
          new Link([
            new Image('haunted house', 'http://example.com/hauntedhouse.svg'),
          ], 'https://hauntedhouse.com'),
        ]))
    })

    specify('is the only convention within a link', () => {
      const markup =
        ' \t ([image: haunted house] [http://example.com/hauntedhouse.svg]) (hauntedhouse.com) \t '

      expect(Up.parseDocument(markup)).to.deep.equal(
        new UpDocument([
          new Link([
            new Image('haunted house', 'http://example.com/hauntedhouse.svg'),
          ], 'https://hauntedhouse.com'),
        ]))
    })
  })
})


describe("The brackets enclosing an image convention's description and URL", () => {
  it("can be different from each other (as long as each pair of brackets is matching)", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      url: 'http://example.com/ghosts.svg',
      toProduce: new UpDocument([
        new Image('ghostly howling', 'http://example.com/ghosts.svg')
      ])
    })
  })
})


describe('The term "img"', () => {
  it('can be used instead of "image"', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      url: 'http://example.com/ghosts.svg',
      toProduce: new UpDocument([
        new Image('ghostly howling', 'http://example.com/ghosts.svg')
      ])
    })
  })
})


context("When an image has whitespace before its bracketed URL, there are no additional restrictions on the URL.", () => {
  specify("The URL can contain whitespace", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'http://example.com/ghost meeting.svg',
      toProduce: new UpDocument([
        new Image('ghostly howling', 'http://example.com/ghost meeting.svg')
      ])
    })
  })

  specify("The URL can start with whitespace", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: ' \t http://example.com/ghost meeting.svg',
      toProduce: new UpDocument([
        new Image('ghostly howling', 'http://example.com/ghost meeting.svg')
      ])
    })
  })
})


context("When an otherwise-valid image convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('it does not produce an image node', () => {
    expect(Up.parseDocument('[image: scary]( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('[image: scary]')
        ]),
        new PlainText('( \t tel:5555555555)')
      ]))
  })
})


describe('An image URL with no URL scheme', () => {
  it("is prefixed with the default URL scheme ('https://' unless changed via the 'defaultUrlScheme' config setting)", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'example.com/ghosts.svg',
      toProduce: new UpDocument([
        new Image('ghostly howling', 'https://example.com/ghosts.svg')
      ])
    })
  })
})


describe('An image URL starting with a slash', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithSlash" config setting is blank)', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: '/howling.svg',
      toProduce: new UpDocument([
        new Image('ghostly howling', '/howling.svg')
      ])
    })
  })
})


describe('An image URL starting with a hash mark ("#")', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithFragmentIdentifier" config setting is blank)', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: '#howling.svg',
      toProduce: new UpDocument([
        new Image('ghostly howling', '#howling.svg')
      ])
    })
  })
})


describe("An image convention's URL", () => {
  it("can contain spaces", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'http://example.com/scary ghosts.svg',
      toProduce: new UpDocument([
        new Image('ghostly howling', 'http://example.com/scary ghosts.svg')
      ])
    })
  })

  it("does not need to have an extension", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'http://example.com/ghosts',
      toProduce: new UpDocument([
        new Image('ghostly howling', 'http://example.com/ghosts')
      ])
    })
  })
})


describe('An image description (enclosed in square brackets)', () => {
  it('can contain matching square brackets', () => {
    expect(Up.parseDocument('[image: haunted [house]](http://example.com/?state=NE)')).to.deep.equal(
      new UpDocument([
        new Image('haunted [house]', 'http://example.com/?state=NE'),
      ]))
  })

  it('can contain nested matching square brackets', () => {
    expect(Up.parseDocument('[image: [haunted [house]]](http://example.com/?state=NE)')).to.deep.equal(
      new UpDocument([
        new Image('[haunted [house]]', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('An image description (enclosed by parentheses)', () => {
  it('can contain matching parenthes\es', () => {
    expect(Up.parseDocument('(image: ghosts eating (luggage))[http://example.com/?state=NE]')).to.deep.equal(
      new UpDocument([
        new Image('ghosts eating (luggage)', 'http://example.com/?state=NE'),
      ]))
  })

  it('can contain nested matching parentheses', () => {
    expect(Up.parseDocument('(image: (ghosts (eating)) ((luggage)))[http://example.com/?state=NE]')).to.deep.equal(
      new UpDocument([
        new Image('(ghosts (eating)) ((luggage))', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('An image URL (enclosed in square brackets)', () => {
  it('can contain matching square brackets', () => {
    expect(Up.parseDocument('(image: ghosts eating luggage)[http://example.com/?state=[NE]]')).to.deep.equal(
      new UpDocument([
        new Image('ghosts eating luggage', 'http://example.com/?state=[NE]'),
      ]))
  })

  it('can contain nested matching square brackets', () => {
    expect(Up.parseDocument('(image: ghosts eating luggage)[http://example.com/?[state=[NE]]]')).to.deep.equal(
      new UpDocument([
        new Image('ghosts eating luggage', 'http://example.com/?[state=[NE]]'),
      ]))
  })
})


describe('An image URL (enclosed in parentheses)', () => {
  it('can contain matching parentheses', () => {
    expect(Up.parseDocument('[image: ghosts eating luggage](http://example.com/?state=(NE))')).to.deep.equal(
      new UpDocument([
        new Image('ghosts eating luggage', 'http://example.com/?state=(NE)'),
      ]))
  })

  it('can contain nested matching parentheses', () => {
    expect(Up.parseDocument('[image: ghosts eating luggage](http://example.com/?(state=(NE)))')).to.deep.equal(
      new UpDocument([
        new Image('ghosts eating luggage', 'http://example.com/?(state=(NE))'),
      ]))
  })
})
