/// <reference path="../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineCodeNode } from '../../../SyntaxNodes/InlineCodeNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'


describe('Inline code', () => {
  it('can be the last convention in a paragraph', () => {
    expect(Up.ast('Dropship `harrass`')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Dropship '),
        new InlineCodeNode('harrass')
      ]))
  })
})
