import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


describe('The "relativeUrlBase" config setting', () => {
  const up = new Up({
    'relativeUrlBase': 'https://imgur.com/'
  })

  it('is used as a prefix for relative image URLs', () => {
    const text = '[image: Chrono Cross logo][cc.png]'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross logo', 'https://imgur.com/cc.png')
      ])
    )
  })
})
