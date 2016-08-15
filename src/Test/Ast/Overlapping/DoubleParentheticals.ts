import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { NormalParentheticalNode } from '../../../SyntaxNodes/NormalParentheticalNode'


describe('Overlapped doubly parenthesized text (closing at the same time) and stress', () => {
  it('splits the stress node, with 1 part inside both normal parenthetical nodes (up to the first closing parenthesis), 1 part only enclosing the second closing parenthesis, and 1 part following both normal parenthetical nodes', () => {
    expect(Up.toDocument("(I know. (Well, I don't **really.)) Ha!**")).to.be.eql(
      insideDocumentAndParagraph([
        new NormalParentheticalNode([
          new PlainTextNode('(I know. '),
          new NormalParentheticalNode([
            new PlainTextNode("(Well, I don't "),
            new StressNode([
              new PlainTextNode('really.)')
            ])
          ]),
          new StressNode([
            new PlainTextNode(')')
          ])
        ]),
        new StressNode([
          new PlainTextNode(' Ha!')
        ]),
      ]))
  })
})


describe('Overlapped doubly parenthesized text (closing at different times) and stress', () => {
  it('splits the stress node, with 1 part inside both normal parenthetical nodes (up to first closing parenthesis), 1 part enclosing up to the second closing parenthesis, and 1 part following both normal parenthetical nodes', () => {
    expect(Up.toDocument("(I know. (Well, I don't **really.) So there.) Ha!**")).to.be.eql(
      insideDocumentAndParagraph([
        new NormalParentheticalNode([
          new PlainTextNode('(I know. '),
          new NormalParentheticalNode([
            new PlainTextNode("(Well, I don't "),
            new StressNode([
              new PlainTextNode('really.)')
            ])
          ]),
          new StressNode([
            new PlainTextNode(' So there.)')
          ])
        ]),
        new StressNode([
          new PlainTextNode(' Ha!')
        ]),
      ]))
  })
})


describe('Overlapped stress and doubly parenthesized text (opening at the same time)', () => {
  it('does not split the stress node', () => {
    expect(Up.toDocument("**I need to sleep. ((So** what?) It's late.)")).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode("I need to sleep. "),
          new NormalParentheticalNode([
            new PlainTextNode('('),
            new NormalParentheticalNode([
              new PlainTextNode("(So"),
            ])
          ])
        ]),
        new NormalParentheticalNode([
          new NormalParentheticalNode([
            new PlainTextNode(" what?)"),
          ]),
          new PlainTextNode(" It's late.)")
        ]),
      ]))
  })
})


describe('Overlapped stress and doubly parenthesized text (opening at different times)', () => {
  it('does not split the stress node', () => {
    expect(Up.toDocument("**I need to sleep. (I know. (Well**, I don't really.))")).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode("I need to sleep. "),
          new NormalParentheticalNode([
            new PlainTextNode('(I know. '),
            new NormalParentheticalNode([
              new PlainTextNode("(Well"),
            ])
          ])
        ]),
        new NormalParentheticalNode([
          new NormalParentheticalNode([
            new PlainTextNode(", I don't really.)"),
          ]),
          new PlainTextNode(')')
        ]),
      ]))
  })
})
