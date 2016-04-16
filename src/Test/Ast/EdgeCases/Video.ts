/// <reference path="../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


describe('A video without a description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.ast('[-_o: -> http://example.com/poltergeists.webm]')).to.be.eql(
      new DocumentNode([
        new VideoNode('http://example.com/poltergeists.webm', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A video with a blank description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.ast('[-_o:  \t  -> http://example.com/poltergeists.webm]')).to.be.eql(
      new DocumentNode([
        new VideoNode('http://example.com/poltergeists.webm', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A video with a blank URL', () => {
  it('has its URL treated as its description', () => {
    expect(Up.ast('[-_o: ghosts eating luggage ->    \t  ]')).to.be.eql(
      new DocumentNode([]))
  })
})