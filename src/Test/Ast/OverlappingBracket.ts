import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'


describe('Overlapped stressed and parenthesized text', () => {
  it('produce a stress node, a nested parenthesized node, then a non-nested parenthesized node', () => {
    expect(Up.toAst('I **love (drinking** whole) milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new ParenthesizedNode([
            new PlainTextNode('(drinking')
          ])
        ]),
        new ParenthesizedNode([
          new PlainTextNode(' whole)')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped stressed and square bracketed text', () => {
  it('produce a stress node, a nested square bracketed node, then a non-nested square bracketed node', () => {
    expect(Up.toAst('I **love [drinking** whole] milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new SquareBracketedNode([
            new PlainTextNode('[drinking')
          ])
        ]),
        new SquareBracketedNode([
          new PlainTextNode(' whole]')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})