import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'


context('By default, media with unsafe URLs schemes produce no HTML.', () => {
  context('Images produce no HTML if their scheme is:', () => {
    specify('javascript', () => {
      const documentNode = new DocumentNode([
          new ImageNode('Uh-oh!', 'javascript:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('data', () => {
      const documentNode = new DocumentNode([
          new ImageNode('Uh-oh!', 'data:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('file', () => {
      const documentNode = new DocumentNode([
          new ImageNode('Uh-oh!', 'file:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('vbscript', () => {
      const documentNode = new DocumentNode([
          new ImageNode('Uh-oh!', 'vbscript:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })
  })

  context('Audio conventions produce no HTML if their scheme is:', () => {
    specify('javascript', () => {
      const documentNode = new DocumentNode([
          new AudioNode('Uh-oh!', 'javascript:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('data', () => {
      const documentNode = new DocumentNode([
          new AudioNode('Uh-oh!', 'data:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('file', () => {
      const documentNode = new DocumentNode([
          new AudioNode('Uh-oh!', 'file:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('vbscript', () => {
      const documentNode = new DocumentNode([
          new AudioNode('Uh-oh!', 'vbscript:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })
  })

  context('Videos produce no HTML if their scheme is:', () => {
    specify('javascript', () => {
      const documentNode = new DocumentNode([
          new VideoNode('Uh-oh!', 'javascript:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('data', () => {
      const documentNode = new DocumentNode([
          new VideoNode('Uh-oh!', 'data:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('file', () => {
      const documentNode = new DocumentNode([
          new VideoNode('Uh-oh!', 'file:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('vbscript', () => {
      const documentNode = new DocumentNode([
          new VideoNode('Uh-oh!', 'vbscript:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })
  })
})
