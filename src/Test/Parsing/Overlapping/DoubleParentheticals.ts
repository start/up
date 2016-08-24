import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Stress } from '../../../SyntaxNodes/Stress'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'


describe('Overlapped doubly parenthesized text (closing at the same time) and stress', () => {
  it('splits the stress node, with 1 part inside both normal parenthetical nodes (up to the first closing parenthesis), 1 part only enclosing the second closing parenthesis, and 1 part following both normal parenthetical nodes', () => {
    expect(Up.toDocument("(I know. (Well, I don't **really.)) Ha!**")).to.deep.equal(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new PlainText('(I know. '),
          new NormalParenthetical([
            new PlainText("(Well, I don't "),
            new Stress([
              new PlainText('really.)')
            ])
          ]),
          new Stress([
            new PlainText(')')
          ])
        ]),
        new Stress([
          new PlainText(' Ha!')
        ]),
      ]))
  })
})


describe('Overlapped doubly parenthesized text (closing at different times) and stress', () => {
  it('splits the stress node, with 1 part inside both normal parenthetical nodes (up to first closing parenthesis), 1 part enclosing up to the second closing parenthesis, and 1 part following both normal parenthetical nodes', () => {
    expect(Up.toDocument("(I know. (Well, I don't **really.) So there.) Ha!**")).to.deep.equal(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new PlainText('(I know. '),
          new NormalParenthetical([
            new PlainText("(Well, I don't "),
            new Stress([
              new PlainText('really.)')
            ])
          ]),
          new Stress([
            new PlainText(' So there.)')
          ])
        ]),
        new Stress([
          new PlainText(' Ha!')
        ]),
      ]))
  })
})


describe('Overlapped stress and doubly parenthesized text (opening at the same time)', () => {
  it('does not split the stress node', () => {
    expect(Up.toDocument("**I need to sleep. ((So** what?) It's late.)")).to.deep.equal(
      insideDocumentAndParagraph([
        new Stress([
          new PlainText("I need to sleep. "),
          new NormalParenthetical([
            new PlainText('('),
            new NormalParenthetical([
              new PlainText("(So"),
            ])
          ])
        ]),
        new NormalParenthetical([
          new NormalParenthetical([
            new PlainText(" what?)"),
          ]),
          new PlainText(" It's late.)")
        ]),
      ]))
  })
})


describe('Overlapped stress and doubly parenthesized text (opening at different times)', () => {
  it('does not split the stress node', () => {
    expect(Up.toDocument("**I need to sleep. (I know. (Well**, I don't really.))")).to.deep.equal(
      insideDocumentAndParagraph([
        new Stress([
          new PlainText("I need to sleep. "),
          new NormalParenthetical([
            new PlainText('(I know. '),
            new NormalParenthetical([
              new PlainText("(Well"),
            ])
          ])
        ]),
        new NormalParenthetical([
          new NormalParenthetical([
            new PlainText(", I don't really.)"),
          ]),
          new PlainText(')')
        ]),
      ]))
  })
})
