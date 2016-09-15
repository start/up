import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from '../Helpers'


describe('Overlapped doubly parenthesized text (closing at the same time) and stress', () => {
  it('splits the stress node, with 1 part inside both normal parenthetical nodes (up to the first closing parenthesis), 1 part only enclosing the second closing parenthesis, and 1 part following both normal parenthetical nodes', () => {
    expect(Up.parse("(I know. (Well, I don't **really.)) Ha!**")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.PlainText('(I know. '),
          new Up.NormalParenthetical([
            new Up.PlainText("(Well, I don't "),
            new Up.Stress([
              new Up.PlainText('really.)')
            ])
          ]),
          new Up.Stress([
            new Up.PlainText(')')
          ])
        ]),
        new Up.Stress([
          new Up.PlainText(' Ha!')
        ]),
      ]))
  })
})


describe('Overlapped doubly parenthesized text (closing at different times) and stress', () => {
  it('splits the stress node, with 1 part inside both normal parenthetical nodes (up to first closing parenthesis), 1 part enclosing up to the second closing parenthesis, and 1 part following both normal parenthetical nodes', () => {
    expect(Up.parse("(I know. (Well, I don't **really.) So there.) Ha!**")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.PlainText('(I know. '),
          new Up.NormalParenthetical([
            new Up.PlainText("(Well, I don't "),
            new Up.Stress([
              new Up.PlainText('really.)')
            ])
          ]),
          new Up.Stress([
            new Up.PlainText(' So there.)')
          ])
        ]),
        new Up.Stress([
          new Up.PlainText(' Ha!')
        ]),
      ]))
  })
})


describe('Overlapped stress and doubly parenthesized text (opening at the same time)', () => {
  it('does not split the stress node', () => {
    expect(Up.parse("**I need to sleep. ((So** what?) It's late.)")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.PlainText("I need to sleep. "),
          new Up.NormalParenthetical([
            new Up.PlainText('('),
            new Up.NormalParenthetical([
              new Up.PlainText("(So"),
            ])
          ])
        ]),
        new Up.NormalParenthetical([
          new Up.NormalParenthetical([
            new Up.PlainText(" what?)"),
          ]),
          new Up.PlainText(" It's late.)")
        ]),
      ]))
  })
})


describe('Overlapped stress and doubly parenthesized text (opening at different times)', () => {
  it('does not split the stress node', () => {
    expect(Up.parse("**I need to sleep. (I know. (Well**, I don't really.))")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.PlainText("I need to sleep. "),
          new Up.NormalParenthetical([
            new Up.PlainText('(I know. '),
            new Up.NormalParenthetical([
              new Up.PlainText("(Well"),
            ])
          ])
        ]),
        new Up.NormalParenthetical([
          new Up.NormalParenthetical([
            new Up.PlainText(", I don't really.)"),
          ]),
          new Up.PlainText(')')
        ]),
      ]))
  })
})
