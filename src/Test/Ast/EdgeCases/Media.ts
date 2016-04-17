/// <reference path="../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'



describe('A line consisting solely of media conventions', () => {
  it('produces a node for each convention and includes each directly into the outline, rather than squeezing them all into a paragraph', () => {
    const text =
      '[-_-: ghostly howling -> http://example.com/ghosts.ogg][o_o: haunted house -> http://example.com/hauntedhouse.svg][o_-: ghosts eating luggage -> http://example.com/poltergeists.webm]'
    
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A paragraph followed by a line consisting solely of media conventions', () => {
  it('does not produce a line block node', () => {
    const text = `
You'll never believe this fake evidence!
[-_-: ghostly howling -> http://example.com/ghosts.ogg][o_o: haunted house -> http://example.com/hauntedhouse.svg][o_-: ghosts eating luggage -> http://example.com/poltergeists.webm]`
    
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("You'll never believe this fake evidence!")
        ]),
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})