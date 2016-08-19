import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from './Helpers'
import { Audio } from '../../SyntaxNodes/Audio'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { SquareParentheticalNode } from '../../SyntaxNodes/SquareParentheticalNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'


context('Bracketed (square bracketed or parenthesized) text starting with "audio:" immediately followed by another instance of bracketed text', () => {
  it('produces an audio node with the first bracketed text treated as the description and the second treated as the audio URL', () => {
    expect(Up.toDocument('I would never stay in a house with these sounds. [audio: ghostly howling](http://example.com/ghosts.ogg) Would you?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I would never stay in a house with these sounds. '),
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new PlainTextNode(' Would you?')
      ]))
  })
})


context('An audio convention that is the only convention on its line is not placed inside a paragraph node.', () => {
  specify('Instead, it gets placed directly inside the node that would have contained paragraph', () => {
    expect(Up.toDocument('[audio: ghostly howling](http://example.com/ghosts.ogg)')).to.be.eql(
      new UpDocument([
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg')
      ]))
  })


  context('This also applies when that audio convention', () => {
    specify('is surrounded by whitespace', () => {
      expect(Up.toDocument(' \t [audio: ghostly howling](http://example.com/ghosts.ogg) \t ')).to.be.eql(
        new UpDocument([
          new Audio('ghostly howling', 'http://example.com/ghosts.ogg')
        ]))
    })

    specify('is linkified', () => {
      const markup =
        ' \t [audio: ghostly howling] (http://example.com/ghosts.ogg) (hauntedhouse.com) \t '

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new LinkNode([
            new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
          ], 'https://hauntedhouse.com'),
        ]))
    })

    specify('is the only convention within a link', () => {
      const markup =
        ' \t ([audio: ghostly howling] [http://example.com/ghosts.ogg]) (hauntedhouse.com) \t '

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new LinkNode([
            new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
          ], 'https://hauntedhouse.com'),
        ]))
    })
  })
})


describe("The brackets enclosing an audio convention's description and URL", () => {
  it("can be different from each other (as long as each pair of brackets is matching)", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'audio: ghostly howling',
      url: 'http://example.com/ghosts.ogg',
      toProduce: new UpDocument([
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg')
      ])
    })
  })
})


context("When an audio convention has whitespace before its bracketed URL, there are no additional restrictions on the URL.", () => {
  specify("The URL can contain whitespace", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'audio: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'http://example.com/ghost sounds.ogg',
      toProduce: new UpDocument([
        new Audio('ghostly howling', 'http://example.com/ghost sounds.ogg')
      ])
    })
  })

  specify("The URL can start with whitespace", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'audio: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: ' \t http://example.com/ghost meeting.svg',
      toProduce: new UpDocument([
        new Audio('ghostly howling', 'http://example.com/ghost meeting.svg')
      ])
    })
  })
})


context("When an otherwise-valid audio convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('it does not produce an audio node', () => {
    expect(Up.toDocument('[audio: scary]( \t \\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareParentheticalNode([
          new PlainTextNode('[audio: scary]')
        ]),
        new PlainTextNode('( \t tel:5555555555)')
      ]))
  })
})


describe('An audio URL with no URL scheme', () => {
  it("is prefixed with the default URL scheme ('https://' unless changed via the 'defaultUrlScheme' config setting)", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'audio: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'example.com/ghosts.ogg',
      toProduce: new UpDocument([
        new Audio('ghostly howling', 'https://example.com/ghosts.ogg')
      ])
    })
  })
})


describe('An audio URL starting with a slash', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithSlash" config setting is blank)', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'audio: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: '/some-song.mp3',
      toProduce: new UpDocument([
        new Audio('ghostly howling', '/some-song.mp3')
      ])
    })
  })
})


describe('An audio URL starting with a hash mark ("#")', () => {
  it('has no added prefix by default (because the default "baseForUrlsStartingWithFragmentIdentifier" config setting is blank)', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'audio: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: '#some-song.mp3',
      toProduce: new UpDocument([
        new Audio('ghostly howling', '#some-song.mp3')
      ])
    })
  })
})


describe("An audio convention's URL", () => {
  it("can contain spaces", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'audio: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'http://example.com/scary ghosts.ogg',
      toProduce: new UpDocument([
        new Audio('ghostly howling', 'http://example.com/scary ghosts.ogg')
      ])
    })
  })

  it("does not need to have an extension", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'audio: ghostly howling',
      partsBetweenContentAndUrl: [' ', '\t', '  \t '],
      url: 'http://example.com/ghosts',
      toProduce: new UpDocument([
        new Audio('ghostly howling', 'http://example.com/ghosts')
      ])
    })
  })
})


describe('An audio description (enclosed in parentheses)', () => {
  it('can contain matching parentheses', () => {
    expect(Up.toDocument('(audio: (ghostly) howling)[http://example.com/?state=NE]')).to.be.eql(
      new UpDocument([
        new Audio('(ghostly) howling', 'http://example.com/?state=NE')
      ]))
  })

  it('can contain nested matching parentheses', () => {
    expect(Up.toDocument('(audio: ((ghostly) howling))[http://example.com/?state=NE]')).to.be.eql(
      new UpDocument([
        new Audio('((ghostly) howling)', 'http://example.com/?state=NE')
      ]))
  })
})


describe('An audio description (enclosed in square brackets)', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toDocument('[audio: [ghostly] howling](http://example.com/?state=NE)')).to.be.eql(
      new UpDocument([
        new Audio('[ghostly] howling', 'http://example.com/?state=NE')
      ]))
  })

  it('can contain nested matching square brackets', () => {
    expect(Up.toDocument('[audio: [[ghostly] howling]](http://example.com/?state=NE)')).to.be.eql(
      new UpDocument([
        new Audio('[[ghostly] howling]', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('An audio URL (enclosed in square brackets)', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toDocument('(audio: ghosts eating luggage)[http://example.com/?state=[NE]]')).to.be.eql(
      new UpDocument([
        new Audio('ghosts eating luggage', 'http://example.com/?state=[NE]')
      ]))
  })

  it('can contain nested matching square brackets', () => {
    expect(Up.toDocument('(audio: ghosts eating luggage)[http://example.com/?[state=[NE]]]')).to.be.eql(
      new UpDocument([
        new Audio('ghosts eating luggage', 'http://example.com/?[state=[NE]]')
      ]))
  })
})


describe('An audio URL (enclosed in parentheses)', () => {
  it('can contain matching parentheses', () => {
    expect(Up.toDocument('[audio: ghosts eating luggage](http://example.com/?state=(NE))')).to.be.eql(
      new UpDocument([
        new Audio('ghosts eating luggage', 'http://example.com/?state=(NE)')
      ]))
  })

  it('can contain nested matching parentheses', () => {
    expect(Up.toDocument('[audio: ghosts eating luggage](http://example.com/?(state=(NE)))')).to.be.eql(
      new UpDocument([
        new Audio('ghosts eating luggage', 'http://example.com/?(state=(NE))')
      ]))
  })
})
