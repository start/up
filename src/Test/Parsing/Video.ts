import { expect } from 'chai'
import * as Up from '../../Main'
import { expectEveryPermutationOfBracketsAroundContentAndUrl, insideDocumentAndParagraph } from './Helpers'


context('Bracketed (square bracketed or parenthesized) text starting with "video:" immediately followed by another instance of bracketed text', () => {
  it('produces a video node with the first bracketed text treated as the description and the second treated as the URL', () => {
    expect(Up.parse('I would never stay in a house with this. [video: ghosts eating luggage](http://example.com/poltergeists.webm) Would you?')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I would never stay in a house with this. '),
        new Up.Video('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new Up.Text(' Would you?')
      ]))
  })
})


context('A video that is the only convention on its line is not placed inside a paragraph node.', () => {
  specify('Instead, it gets placed directly inside the node that would have contained paragraph', () => {
    expect(Up.parse('[video: ghosts eating luggage](http://example.com/poltergeists.webm)')).to.deep.equal(
      new Up.Document([
        new Up.Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })


  context('This also applies when that video', () => {
    specify('is surrounded by whitespace', () => {
      expect(Up.parse(' \t [video: ghosts eating luggage](http://example.com/poltergeists.webm) \t ')).to.deep.equal(
        new Up.Document([
          new Up.Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
        ]))
    })

    specify('is linkified', () => {
      const markup =
        ' \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm) (hauntedhouse.com) \t '

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Link([
            new Up.Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
          ], 'https://hauntedhouse.com')
        ]))
    })

    specify('is the only convention within a link', () => {
      const markup =
        ' \t ([video: ghosts eating luggage] [http://example.com/poltergeists.webm]) (hauntedhouse.com) \t '

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Link([
            new Up.Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
          ], 'https://hauntedhouse.com')
        ]))
    })
  })
})


describe("The brackets enclosing a video convention's description and URL", () => {
  it('can be different from each other (as long as each pair of brackets is matching)', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'video: ghostly howling',
      url: 'http://example.com/ghosts.webm',
      toProduce: new Up.Document([
        new Up.Video('ghostly howling', 'http://example.com/ghosts.webm')
      ])
    })
  })
})


describe('The keyword "vid"', () => {
  it('can be used instead of "video".', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'vid: ghostly howling',
      url: 'http://example.com/ghosts.webm',
      toProduce: new Up.Document([
        new Up.Video('ghostly howling', 'http://example.com/ghosts.webm')
      ])
    })
  })
})


context('When a video has whitespace before its bracketed URL, there are no additional restrictions on the URL.', () => {
  specify('The URL can contain whitespace', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'video: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'http://example.com/ghost meeting.svg',
      toProduce: new Up.Document([
        new Up.Video('ghostly howling', 'http://example.com/ghost meeting.svg')
      ])
    })
  })

  specify('The URL can start with whitespace', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'video: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: ' \t http://example.com/ghost meeting.svg',
      toProduce: new Up.Document([
        new Up.Video('ghostly howling', 'http://example.com/ghost meeting.svg')
      ])
    })
  })
})


context("When an otherwise-valid video's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('it does not produce a video node', () => {
    expect(Up.parse('[video: scary]( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[video: scary]')
        ]),
        new Up.Text('( \t tel:5555555555)')
      ]))
  })
})


describe('A video URL starting with a slash', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithSlash" setting is blank)', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'video: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: '/howling.webm',
      toProduce: new Up.Document([
        new Up.Video('ghostly howling', '/howling.webm')
      ])
    })
  })
})


describe('A video URL starting with a hash mark ("#")', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithFragmentIdentifier" setting is blank)', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'video: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: '#howling.webm',
      toProduce: new Up.Document([
        new Up.Video('ghostly howling', '#howling.webm')
      ])
    })
  })
})


describe("A video convention's URL", () => {
  it('can contain spaces', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'video: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'http://example.com/scary ghosts.webm',
      toProduce: new Up.Document([
        new Up.Video('ghostly howling', 'http://example.com/scary ghosts.webm')
      ])
    })
  })

  it('does not need to have an extension', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'video: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'http://example.com/ghosts',
      toProduce: new Up.Document([
        new Up.Video('ghostly howling', 'http://example.com/ghosts')
      ])
    })
  })
})


describe('A video description produced by square brackets', () => {
  it('can contain matching square brackets', () => {
    expect(Up.parse('[video: ghosts eating [luggage]](http://example.com/?state=NE)')).to.deep.equal(
      new Up.Document([
        new Up.Video('ghosts eating [luggage]', 'http://example.com/?state=NE')
      ]))
  })

  it('can contain nested matching square brackets', () => {
    expect(Up.parse('[video: [ghosts [eating]] [[luggage]]](http://example.com/?state=NE)')).to.deep.equal(
      new Up.Document([
        new Up.Video('[ghosts [eating]] [[luggage]]', 'http://example.com/?state=NE')
      ]))
  })
})


describe('A video description (enclosed by parentheses)', () => {
  it('can contain matching parentheses', () => {
    expect(Up.parse('(video: ghosts eating (luggage))[http://example.com/?state=NE]')).to.deep.equal(
      new Up.Document([
        new Up.Video('ghosts eating (luggage)', 'http://example.com/?state=NE')
      ]))
  })

  it('can contain nested matching parentheses', () => {
    expect(Up.parse('(video: (ghosts (eating)) ((luggage)))[http://example.com/?state=NE]')).to.deep.equal(
      new Up.Document([
        new Up.Video('(ghosts (eating)) ((luggage))', 'http://example.com/?state=NE')
      ]))
  })
})


describe('A video URL (enclosed by square brackets)', () => {
  it('can contain matching square brackets', () => {
    expect(Up.parse('(video: ghosts eating luggage)[http://example.com/?state=[NE]]')).to.deep.equal(
      new Up.Document([
        new Up.Video('ghosts eating luggage', 'http://example.com/?state=[NE]')
      ]))
  })

  it('can contain nested matching square brackets', () => {
    expect(Up.parse('(video: ghosts eating luggage)[http://example.com/?[state=[NE]]]')).to.deep.equal(
      new Up.Document([
        new Up.Video('ghosts eating luggage', 'http://example.com/?[state=[NE]]')
      ]))
  })
})


describe('A video URL (enclosed by parentheses)', () => {
  it('can contain matching parentheses', () => {
    expect(Up.parse('[video: ghosts eating luggage](http://example.com/?state=(NE))')).to.deep.equal(
      new Up.Document([
        new Up.Video('ghosts eating luggage', 'http://example.com/?state=(NE)')
      ]))
  })

  it('can contain nested matching parentheses', () => {
    expect(Up.parse('[video: ghosts eating luggage](http://example.com/?(state=(NE)))')).to.deep.equal(
      new Up.Document([
        new Up.Video('ghosts eating luggage', 'http://example.com/?(state=(NE))')
      ]))
  })
})


context('Video descriptions are evaluated for typographical conventions:', () => {
  specify('En dashes', () => {
    expect(Up.parse('[video: ghosts--eating luggage] (http://example.com/poltergeists.svg)')).to.deep.equal(
      new Up.Document([
        new Up.Video('ghosts–eating luggage', 'http://example.com/poltergeists.svg')
      ]))
  })

  specify('Em dashes', () => {
    expect(Up.parse('[video: ghosts---eating luggage] (http://example.com/poltergeists.svg)')).to.deep.equal(
      new Up.Document([
        new Up.Video('ghosts—eating luggage', 'http://example.com/poltergeists.svg')
      ]))
  })

  specify('Plus-minus signs', () => {
    expect(Up.parse('[video: ghosts eating luggage 10 pieces of luggage +-9] (http://example.com/poltergeists.svg)')).to.deep.equal(
      new Up.Document([
        new Up.Video('ghosts eating luggage 10 pieces of luggage ±9', 'http://example.com/poltergeists.svg')
      ]))
  })
})
