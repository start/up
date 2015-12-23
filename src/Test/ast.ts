/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../index'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'

describe('A document node', function() {
  it('is all you get when there is no text', function() {
    expect(Up.ast('')).to.be.eql(new DocumentNode())
  })
});

describe('A document node', function() {
  it('is all you get when there is no text', function() {
    expect(Up.ast('Hello, world!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, world!')
      ]))
  })
});

describe('A backslash', function() {
  describe('causes the following character to be treated as plain text', function() {
    it('whether that following character is a backslash', function() {
      expect(Up.ast('Hello, \\\\')).to.be.eql(
        new DocumentNode([
          new PlainTextNode('Hello, \\!')
        ]))
    })
    it('or not', function() {
      expect(Up.ast('Hello, \\world! \\')).to.be.eql(
        new DocumentNode([
          new PlainTextNode('Hello, world!')
        ]))
    })
  })
});