import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOf } from './Helpers'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('Bracketed/parenthesized text starting with "video:" followed by a bracketed/parenthesized URL', () => {
  it('produces a video bide with the description and URL', () => {
    expect(Up.toAst('I would never stay in a house with this. [video: ghosts eating luggage](http://example.com/poltergeists.webm) Would you?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I would never stay in a house with this. '),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new PlainTextNode(' Would you?')
      ]))
  })
})


describe('A video that is the only convention on its line', () => {
  it('is not placed inside a paragraph node, instead being placed directly inside the node that would have contained paragraph', () => {
    expect(Up.toAst('[video: ghosts eating luggage](http://example.com/poltergeists.webm)')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A video produced by parentheses, square brackets, or curly brackets followed immediately by a parenthesized, a square bracketed, or a curly bracketed URL', () => {
  it('produces a video node. The type of bracket surrounding the text can be different from the type of bracket surrounding the URL', () => {
    expectEveryCombinationOf({
      firstHalves: [
        '[video: ghosts eating luggage]',
        '(video: ghosts eating luggage)',
        '{video: ghosts eating luggage}'
      ],
      secondHalves: [
        '[http://example.com/poltergeists.webm]',
        '(http://example.com/poltergeists.webm)',
        '{http://example.com/poltergeists.webm}'
      ],
      toProduce: new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
      ])
    })
  })
})


describe('A video with a relative URL containing spaces and no extension', () => {
  it('is parsed correctly', () => {
    expect(Up.toAst('[video: ghosts eating luggage](ghosts eating luggage)')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'ghosts eating luggage'),
      ]))
  })
})


describe('A video description produced by square brackets', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('[video: ghosts eating [luggage]](http://example.com/?state=NE)')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating [luggage]', 'http://example.com/?state=NE'),
      ]))
  })

  it('can contain nested matching square brackets', () => {
    expect(Up.toAst('[video: [ghosts [eating]] [[luggage]]](http://example.com/?state=NE)')).to.be.eql(
      new DocumentNode([
        new VideoNode('[ghosts [eating]] [[luggage]]', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('A video description (enclosed by parentheses)', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('(video: ghosts eating (luggage))[http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating (luggage)', 'http://example.com/?state=NE'),
      ]))
  })

  it('can contain nested matching parentheses', () => {
    expect(Up.toAst('(video: (ghosts (eating)) ((luggage)))[http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new VideoNode('(ghosts (eating)) ((luggage))', 'http://example.com/?state=NE'),
      ]))
  })
})


describe('A video description (enclosed by curly brackets)', () => {
  it('can contain matching curly brackets', () => {
    expect(Up.toAst('{video: ghosts eating {luggage}}[http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating {luggage}', 'http://example.com/?state=NE'),
      ]))
  })

  it('can contain nested matching curly brackets', () => {
    expect(Up.toAst('{video: {ghosts {eating}} {{luggage}}}[http://example.com/?state=NE]')).to.be.eql(
      new DocumentNode([
        new VideoNode('{ghosts {eating}} {{luggage}}', 'http://example.com/?state=NE'),
      ]))
  })
})


describe("A video URL (enclosed by square brackets)", () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('(video: ghosts eating luggage)[http://example.com/?state=[NE]]')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/?state=[NE]'),
      ]))
  })

  it('can contain nested matching square brackets', () => {
    expect(Up.toAst('(video: ghosts eating luggage)[http://example.com/?[state=[NE]]]')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/?[state=[NE]]'),
      ]))
  })
})


describe("A video URL (enclosed by parentheses)", () => {
  it('can contain matching parentheses', () => {
    expect(Up.toAst('[video: ghosts eating luggage](http://example.com/?state=(NE))')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/?state=(NE)'),
      ]))
  })

  it('can contain nested matching parentheses', () => {
    expect(Up.toAst('[video: ghosts eating luggage](http://example.com/?(state=(NE)))')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/?(state=(NE))'),
      ]))
  })
})


describe("A video URL (enclosed by square brackets)", () => {
  it('can contain matching curly brackets', () => {
    expect(Up.toAst('[video: ghosts eating luggage]{http://example.com/?state={NE}}')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/?state={NE}'),
      ]))
  })

  it('can contain nested matching curly brackets', () => {
    expect(Up.toAst('[video: ghosts eating luggage]{http://example.com/?{state={NE}}}')).to.be.eql(
      new DocumentNode([
        new VideoNode('ghosts eating luggage', 'http://example.com/?{state={NE}}'),
      ]))
  })
})
