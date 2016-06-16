import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'


describe('An image URL starting with a slash', () => {
  it('has no added prefix by default, because the default "baseForUrlsStartingWithSlash" config setting is blank', () => {
    const text = '[image: Chrono Cross title screen](/wiki/Chrono_Chross.png)'

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross title screen', '/wiki/Chrono_Chross.png')
      ])
    )
  })
})


describe('A video URL starting with a slash', () => {
  it('has no added prefix by default, because the default "baseForUrlsStartingWithSlash" config setting is blank', () => {
    const text = '[video: Chrono Cross intro](/wiki/Chrono_Chross.webm)'

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new VideoNode('Chrono Cross intro', '/wiki/Chrono_Chross.webm')
      ])
    )
  })
})
