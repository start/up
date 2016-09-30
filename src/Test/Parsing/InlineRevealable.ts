import { expect } from 'chai'
import * as Up from '../../Up'
import { insideDocumentAndParagraph } from './Helpers'


context('Bracketed text "labeled" with a revealable keyword produces an inline revealable node. The keyword can be:', () => {
  specify('Spoiler', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })

  specify('NSFW', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFW: you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })

  specify('NSFL', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })

  specify('Revealable', () => {
    expect(Up.parse('After you beat the Elite Four, [revealable: you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('An inline revealable convention', () => {
  it('can be produced by parentheses', () => {
    expect(Up.parse('After you beat the Elite Four, (SPOILER: you fight Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })

  it('can use any capitalization for its label', () => {
    const withLowercase = 'After you beat the Elite Four, [spoiler: you fight Gary].'
    const withRandomCase = 'After you beat the Elite Four, [SPoILeR: you fight Gary].'

    expect(Up.parse(withLowercase)).to.deep.equal(Up.parse(withRandomCase))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight *Gary*].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Text('you fight '),
          new Up.Emphasis([
            new Up.Text('Gary')
          ]),
        ]),
        new Up.Text('.')
      ]))
  })

  it('can be nested within another inline revealable convention', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight [SPOILER: Gary]].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Text('you fight '),
          new Up.InlineRevealable([
            new Up.Text('Gary')
          ]),
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('An inline revealable convention produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight [and beat] Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Text('you fight '),
          new Up.SquareParenthetical([
            new Up.Text('[and beat]')
          ]),
          new Up.Text(' Gary')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('An inline revealable convention produced by parentheses', () => {
  it('can contain parenthesized text', () => {
    expect(Up.parse('After you beat the Elite Four, (SPOILER: you fight (and beat) Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Text('you fight '),
          new Up.NormalParenthetical([
            new Up.Text('(and beat)')
          ]),
          new Up.Text(' Gary')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('Any whitespace between label of an inline revealable convention and the start of its content', () => {
  it('is optional', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER:you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: \t  \t you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })
})
