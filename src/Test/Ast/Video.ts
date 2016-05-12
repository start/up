import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('Bracketed text starting with "video:" with a description pointing to a URL', () => {
  it('produces a video bide with the description and URL', () => {
    expect(Up.toAst('I would never stay in a house with this. [video: ghosts eating luggage -> http://example.com/poltergeists.webm] Would you?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I would never stay in a house with this. '),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new PlainTextNode(' Would you?')
      ]))
  })
})

describe('A video that is the only convention on its line', () => {
  it('is not placed inside a paragraph node, instead being placed directly inside the node that would have contained paragraph', () => {
    expect(Up.toAst('[video: ghosts eating luggage -> http://example.com/poltergeists.webm]')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A video with a relative URL containing spaces and no extension', () => {
  it('is parsed correctly', () => {
    expect(Up.toAst('[video: ghosts eating luggage -> ghosts eating luggage]')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'ghosts eating luggage'),
      ]))
  })
})


describe('A video description', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('[video: ghosts eating [luggage] -> http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating [luggage]', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('A video URL', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('[video: ghosts eating luggage -> http://example.com/?state=[NE]]')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/?state=[NE]'),
      ]))
  })
})
