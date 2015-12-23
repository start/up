/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../index'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'

describe('A document node', function() {
  it('is all you get when there is no text', function() {
    expect(Up.ast('')).to.be.eql(new DocumentNode())
  })
});