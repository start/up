/// <reference path="../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


describe('Audio without a description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.ast('[-_-: -> http://example.com/ghosts.ogg]')).to.be.eql(
      new DocumentNode([
        new AudioNode('http://example.com/ghosts.ogg', 'http://example.com/ghosts.ogg'),
      ]))
  })
})


describe('Audio with a blank description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.ast('[-_-:    \t -> http://example.com/ghosts.ogg]')).to.be.eql(
      new DocumentNode([
        new AudioNode('http://example.com/ghosts.ogg', 'http://example.com/ghosts.ogg'),
      ]))
  })
})


describe('Audio with a blank URL', () => {
  it('is not included in the document', () => {
    expect(Up.ast('[-_-: ghostly howling -> \t   ]')).to.be.eql(
      new DocumentNode([]))
  })
})