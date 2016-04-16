/// <reference path="../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'



describe('An image without a description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.ast('[o_o: -> http://example.com/hauntedhouse.svg]')).to.be.eql(
      new DocumentNode([
        new ImageNode('http://example.com/hauntedhouse.svg', 'http://example.com/hauntedhouse.svg')
      ]))
  })
})


describe('An image with a blank description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.ast('[o_o:\t   -> http://example.com/hauntedhouse.svg]')).to.be.eql(
      new DocumentNode([
        new ImageNode('http://example.com/hauntedhouse.svg', 'http://example.com/hauntedhouse.svg')
      ]))
  })
})
