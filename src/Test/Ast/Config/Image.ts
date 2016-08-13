import { expect } from 'chai'
import Up from '../../../index'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


describe('The term that represents image conventions', () => {
  const up = new Up({
    terms: { image: 'see' }
  })

  it('comes from the "image" config term', () => {
    const markup = '[see: Chrono Cross logo][https://example.com/cc.png]'

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross logo', 'https://example.com/cc.png')
      ]))
  })

  it('is case-insensitive even when custom', () => {
    const lowercase = '[see: Chrono Cross logo][https://example.com/cc.png]'
    const mixedCase = '[SeE: Chrono Cross logo][https://example.com/cc.png]'

    expect(up.toAst(mixedCase)).to.be.eql(up.toAst(lowercase))
  })

  it('is trimmed', () => {
    const markup = '[see: Chrono Cross logo][https://example.com/cc.png]'

    expect(Up.toAst(markup, { terms: { image: ' \t see \t' } })).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross logo', 'https://example.com/cc.png')
      ]))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = '[*see*: Chrono Cross logo][https://example.com/cc.png]'

    expect(Up.toAst(markup, { terms: { image: '*see*' } })).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross logo', 'https://example.com/cc.png')
      ]))
  })

  it('can have multiple variations', () => {
    const markup = '[look: Chrono Cross logo](https://example.com/cc.png) [view: Chrono Cross logo](https://example.com/cc.png)'

    expect(Up.toAst(markup, { terms: { image: ['view', 'look'] } })).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross logo', 'https://example.com/cc.png'),
        new ImageNode('Chrono Cross logo', 'https://example.com/cc.png')
      ]))
  })
})
