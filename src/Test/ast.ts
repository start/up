/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../index'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'

describe('No text', function() {
  it('creates only a document node', function() {
    expect(Up.ast('')).to.be.eql(new DocumentNode())
  })
})

describe('Text', function() {
  it('is put inside a plain text node', function() {
    expect(Up.ast('Hello, world!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, world!')
      ]))
  })
})

describe('A backslash', function() {
  it('causes the following character to be treated as plain text', function() {
    expect(Up.ast('Hello, \\world!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, world!')
      ]))
  })
  it('causes the following backslash to be treated as plain text', function() {
    expect(Up.ast('Hello, \\\\!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, \\!')
      ]))
  })
  it('causes only the following character to be treated as plain text', function() {
    expect(Up.ast('Hello, \\\\, meet \\\\!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, \\, meet \\!')
      ]))
  })
  it('is ignored if it is the final character', function() {
    expect(Up.ast('Hello, \\')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, ')
      ]))
  })
})

describe('Text surrounded by asterisks', function() {
  it('is put inside an emphasis node', function() {
    expect(Up.ast('Hello, *world*!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })
})
