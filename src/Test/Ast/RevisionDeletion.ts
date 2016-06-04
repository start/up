import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'


describe('Text surrounded by 2 tildes', () => {
  it('is put inside a revision deletion node', () => {
    expect(Up.toAst('I like ~~certain types of~~ pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionDeletionNode([
          new PlainTextNode('certain types of')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('A revision deletion', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toAst('I like ~~certain *types* of~~ pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionDeletionNode([
          new PlainTextNode('certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('An empty revision deletion', () => {
  it('produces no syntax nodes', () => {
    expect(Up.toAst('I have nothing to remove: ~~~~')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I have nothing to remove: ')
      ])
    )
  })
})

