import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('Square bracketed text starting with "image:" with a description pointing to a URL', () => {
  it('produces an image node with the description and URL', () => {
    expect(Up.toAst('I would never stay here. [image: haunted house -> http://example.com/hauntedhouse.svg] Would you?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I would never stay here. '),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new PlainTextNode(' Would you?')
      ]))
  })
})


describe('An image that is the only convention on its line', () => {
  it('is not placed inside a paragraph node, instead being placed directly inside the node that would have contained paragraph', () => {
    expect(Up.toAst('[image: haunted house -> http://example.com/hauntedhouse.svg]')).to.be.eql(
      new DocumentNode([
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg')
      ]))
  })
})


describe('Parenthesized text starting with "image:" with a description pointing to a URL', () => {
  it('produce an image node', () => {
    expect(Up.toAst('(image: haunted house -> http://example.com/hauntedhouse.svg)')).to.be.eql(
      new DocumentNode([
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg')
      ]))
  })
})


describe('Curly bracketed text starting with "image:" with a description pointing to a URL', () => {
  it('produce an image node', () => {
    expect(Up.toAst('{image: haunted house -> http://example.com/hauntedhouse.svg}')).to.be.eql(
      new DocumentNode([
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg')
      ]))
  })
})


describe('An image with a relative URL containing spaces and no extension', () => {
  it('is parsed correctly', () => {
    expect(Up.toAst('[image: haunted house -> haunted house]')).to.be.eql(
      new DocumentNode([
        new ImageNode('haunted house', 'haunted house'),
      ]))
  })
})


describe('An image description', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('[image: haunted [house] -> http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new ImageNode('haunted [house]', 'http://example.com/?state=NE'),
      ]))
  })
  
  it('can contain nested matching square brackets', () => {
    expect(Up.toAst('[image: [haunted [house]] -> http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new ImageNode('[haunted [house]]', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('The URL of a image produced by square brackets', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('[image: ghosts eating luggage -> http://example.com/?state=[NE]]')).to.be.eql(
      new DocumentNode([
        new ImageNode('ghosts eating luggage', 'http://example.com/?state=[NE]'),
      ]))
  })
  
  it('can contain nested matching square brackets', () => {
    expect(Up.toAst('[image: ghosts eating luggage -> http://example.com/?[state=[NE]]]')).to.be.eql(
      new DocumentNode([
        new ImageNode('ghosts eating luggage', 'http://example.com/?[state=[NE]]'),
      ]))
  })
})


describe('The URL of a image produced by parentheses', () => {
  it('can contain matching parentheses', () => {
    expect(Up.toAst('(image: ghosts eating luggage -> http://example.com/?state=(NE))')).to.be.eql(
      new DocumentNode([
        new ImageNode('ghosts eating luggage', 'http://example.com/?state=(NE)'),
      ]))
  })
  
  it('can contain nested matching parentheses', () => {
    expect(Up.toAst('(image: ghosts eating luggage -> http://example.com/?(state=(NE)))')).to.be.eql(
      new DocumentNode([
        new ImageNode('ghosts eating luggage', 'http://example.com/?(state=[NE))'),
      ]))
  })
})


describe('The URL of a image produced by curly braces', () => {
  it('can contain matching curly braces', () => {
    expect(Up.toAst('{image: ghosts eating luggage -> http://example.com/?state={NE}}')).to.be.eql(
      new DocumentNode([
        new ImageNode('ghosts eating luggage', 'http://example.com/?state={NE}'),
      ]))
  })
  
  it('can contain nested matching curly braces', () => {
    expect(Up.toAst('{image: ghosts eating luggage -> http://example.com/?{state={NE}}}')).to.be.eql(
      new DocumentNode([
        new ImageNode('ghosts eating luggage', 'http://example.com/?{state={NE}}'),
      ]))
  })
})