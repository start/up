/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'


describe('Text surrounded by 2 parentheses', () => {
  it('is put inside an inline aside node', () => {
    expect(Up.toAst("I don't eat cereal. ((Well, I do, but I pretend not to.)) I haven't for years.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I don't eat cereal. "),
        new InlineAsideNode([
          new PlainTextNode('Well, I do, but I pretend not to.')
        ]),
        new PlainTextNode(" I haven't for years.")
      ]))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.toAst("I don't eat cereal. ((Well, I *do*, but I pretend not to.)) I haven't for years.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I don't eat cereal. "),
        new InlineAsideNode([
          new PlainTextNode('Well, I '),
          new EmphasisNode([
            new PlainTextNode('do')
          ]),
          new PlainTextNode(', but I pretend not to.')
        ]),
        new PlainTextNode(" I haven't for years.")
      ]))
  })

  it('can be nested inside other inline aside nodes', () => {
    expect(Up.toAst("((I don't eat cereal. ((Well, I *do*, but I pretend not to.)) I haven't for years.))")).to.be.eql(
      insideDocumentAndParagraph([
        new InlineAsideNode([
          new PlainTextNode("I don't eat cereal. "),
          new InlineAsideNode([
            new PlainTextNode('Well, I '),
            new EmphasisNode([
              new PlainTextNode('do')
            ]),
            new PlainTextNode(', but I pretend not to.')
          ]),
          new PlainTextNode(" I haven't for years.")
        ])
      ]))
  })
})
