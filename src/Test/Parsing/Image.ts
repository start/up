import { expect } from 'chai'
import * as Up from '../../Main'
import { expectEveryPermutationOfBracketsAroundContentAndUrl, insideDocumentAndParagraph } from './Helpers'


context('Bracketed (square bracketed or parenthesized) text starting with "image:" immediately followed by another instance of bracketed text', () => {
  it('produces an image node with the first bracketed text treated as the description and the second treated as the image URL', () => {
    expect(Up.parse('I would never stay here. [image: haunted house](http://example.com/hauntedhouse.svg) Would you?')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I would never stay here. '),
        new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Up.Text(' Would you?')
      ]))
  })
})


context('An image that is the only convention on its line is not placed inside a paragraph node.', () => {
  specify('Instead, it gets placed directly inside the node that would have contained paragraph', () => {
    expect(Up.parse('[image: haunted house](http://example.com/hauntedhouse.svg)')).to.deep.equal(
      new Up.Document([
        new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg')
      ]))
  })


  context('This also applies when that image', () => {
    specify('is surrounded by whitespace', () => {
      expect(Up.parse(' \t [image: haunted house](http://example.com/hauntedhouse.svg) \t ')).to.deep.equal(
        new Up.Document([
          new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg')
        ]))
    })

    specify('is linkified', () => {
      const markup =
        ' \t [image: haunted house] (http://example.com/hauntedhouse.svg) (hauntedhouse.com) \t '

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Link([
            new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg')
          ], 'https://hauntedhouse.com')
        ]))
    })

    specify('is the only convention within a link', () => {
      const markup =
        ' \t ([image: haunted house] [http://example.com/hauntedhouse.svg]) (hauntedhouse.com) \t '

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Link([
            new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg')
          ], 'https://hauntedhouse.com')
        ]))
    })
  })
})


describe("The brackets enclosing an image convention's description and URL", () => {
  it('can be different from each other (as long as each pair of brackets is matching)', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      url: 'http://example.com/ghosts.svg',
      toProduce: new Up.Document([
        new Up.Image('ghostly howling', 'http://example.com/ghosts.svg')
      ])
    })
  })
})


describe('The keyword "img"', () => {
  it('can be used instead of "image"', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      url: 'http://example.com/ghosts.svg',
      toProduce: new Up.Document([
        new Up.Image('ghostly howling', 'http://example.com/ghosts.svg')
      ])
    })
  })
})


context('When an image has whitespace before its bracketed URL, there are no additional restrictions on the URL.', () => {
  specify('The URL can contain whitespace', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'http://example.com/ghost meeting.svg',
      toProduce: new Up.Document([
        new Up.Image('ghostly howling', 'http://example.com/ghost meeting.svg')
      ])
    })
  })

  specify('The URL can start with whitespace', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: ' \t http://example.com/ghost meeting.svg',
      toProduce: new Up.Document([
        new Up.Image('ghostly howling', 'http://example.com/ghost meeting.svg')
      ])
    })
  })
})


context("When an otherwise-valid image convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('it does not produce an image node', () => {
    expect(Up.parse('[image: scary]( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[image: scary]')
        ]),
        new Up.Text('( \t tel:5555555555)')
      ]))
  })
})


describe('An image URL with no URL scheme', () => {
  it("is prefixed with the default URL scheme ('https://' unless changed via the 'defaultUrlScheme' setting)", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'example.com/ghosts.svg',
      toProduce: new Up.Document([
        new Up.Image('ghostly howling', 'https://example.com/ghosts.svg')
      ])
    })
  })
})


describe('An image URL starting with a slash', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithSlash" setting is blank)', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: '/howling.svg',
      toProduce: new Up.Document([
        new Up.Image('ghostly howling', '/howling.svg')
      ])
    })
  })
})


describe('An image URL starting with a hash mark ("#")', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithFragmentIdentifier" setting is blank)', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: '#howling.svg',
      toProduce: new Up.Document([
        new Up.Image('ghostly howling', '#howling.svg')
      ])
    })
  })
})


describe("An image convention's URL", () => {
  it('can contain spaces', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'http://example.com/scary ghosts.svg',
      toProduce: new Up.Document([
        new Up.Image('ghostly howling', 'http://example.com/scary ghosts.svg')
      ])
    })
  })

  it('does not need to have an extension', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'image: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'http://example.com/ghosts',
      toProduce: new Up.Document([
        new Up.Image('ghostly howling', 'http://example.com/ghosts')
      ])
    })
  })
})


describe('An image description enclosed in square brackets', () => {
  it('can contain matching square brackets', () => {
    expect(Up.parse('[image: haunted [house]](http://example.com/?state=NE)')).to.deep.equal(
      new Up.Document([
        new Up.Image('haunted [house]', 'http://example.com/?state=NE')
      ]))
  })

  it('can contain nested matching square brackets', () => {
    expect(Up.parse('[image: [haunted [house]]](http://example.com/?state=NE)')).to.deep.equal(
      new Up.Document([
        new Up.Image('[haunted [house]]', 'http://example.com/?state=NE')
      ]))
  })
})


describe('An image description enclosed in parentheses', () => {
  it('can contain matching parentheses', () => {
    expect(Up.parse('(image: ghosts eating (luggage))[http://example.com/?state=NE]')).to.deep.equal(
      new Up.Document([
        new Up.Image('ghosts eating (luggage)', 'http://example.com/?state=NE')
      ]))
  })

  it('can contain nested matching parentheses', () => {
    expect(Up.parse('(image: (ghosts (eating)) ((luggage)))[http://example.com/?state=NE]')).to.deep.equal(
      new Up.Document([
        new Up.Image('(ghosts (eating)) ((luggage))', 'http://example.com/?state=NE')
      ]))
  })
})


describe('An image URL (enclosed in square brackets)', () => {
  it('can contain matching square brackets', () => {
    expect(Up.parse('(image: ghosts eating luggage)[http://example.com/?state=[NE]]')).to.deep.equal(
      new Up.Document([
        new Up.Image('ghosts eating luggage', 'http://example.com/?state=[NE]')
      ]))
  })

  it('can contain nested matching square brackets', () => {
    expect(Up.parse('(image: ghosts eating luggage)[http://example.com/?[state=[NE]]]')).to.deep.equal(
      new Up.Document([
        new Up.Image('ghosts eating luggage', 'http://example.com/?[state=[NE]]')
      ]))
  })
})


describe('An image URL (enclosed in parentheses)', () => {
  it('can contain matching parentheses', () => {
    expect(Up.parse('[image: ghosts eating luggage](http://example.com/?state=(NE))')).to.deep.equal(
      new Up.Document([
        new Up.Image('ghosts eating luggage', 'http://example.com/?state=(NE)')
      ]))
  })

  it('can contain nested matching parentheses', () => {
    expect(Up.parse('[image: ghosts eating luggage](http://example.com/?(state=(NE)))')).to.deep.equal(
      new Up.Document([
        new Up.Image('ghosts eating luggage', 'http://example.com/?(state=(NE))')
      ]))
  })
})
