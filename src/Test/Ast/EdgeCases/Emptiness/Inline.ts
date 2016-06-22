import { expect } from 'chai'
import Up from '../../../../index'
import { insideDocumentAndParagraph } from '../../Helpers'
import { DocumentNode } from '../../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../../../SyntaxNodes/LinkNode'
import { EmphasisNode } from '../../../../SyntaxNodes/EmphasisNode'


describe('A link with no URL', () => {
  it("does not produce a link node, but its contents are evaulated for inline conventions and included directly in the link's place", () => {
    expect(Up.toAst('[*Yggdra Union*][]')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Yggdra Union')
        ])
      ]))
  })
})


describe('A link with a blank URL', () => {
  it("does not produce a link node, but its contents are evaulated for inline conventions and included directly in the link's place", () => {
    expect(Up.toAst('[*Yggdra Union*][  \t  ]')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Yggdra Union')
        ])
      ]))
  })
})


describe('A link with no content', () => {
  it('produces a link node with its URL for its content', () => {
    expect(Up.toAst('[][https://google.com]')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('https://google.com')
        ], 'https://google.com'
        )]
      ))
  })
})


describe('A link with blank content', () => {
  it('produces a link node with its URL for its content', () => {
    expect(Up.toAst('[   \t  ][https://google.com]')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('https://google.com')
        ], 'https://google.com'
        )]))
  })
})


describe('A link with no content and no URL', () => {
  it('produces no syntax nodes', () => {
    expect(Up.toAst('Hello, [][]!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, !')
      ])
    )
  })
})


describe('An empty revision insertion containing an empty revision deletion', () => {
  it('produces no syntax nodes', () => {
    expect(Up.toAst('I have nothing to add or remove: ++~~~~++')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I have nothing to add or remove: ')
      ])
    )
  })
})


context('Most inline conventions produce no syntax nodes if they have no content. These conventions are:', () => {

  specify('Spoilers', () => {
    expect(Up.toAst('[SPOILER:]')).to.eql(new DocumentNode())
  })

  specify('NSFW', () => {
    expect(Up.toAst('[NSFW:]')).to.eql(new DocumentNode())
  })

  specify('NSFL', () => {
    expect(Up.toAst('[NSFL:]')).to.eql(new DocumentNode())
  })

  specify('Inline code', () => {
    expect(Up.toAst('``')).to.eql(new DocumentNode())
  })

  specify('Revision insertion', () => {
    // If the revision insertion delimiters were alone on a line, they would be interpreted as a section separator streak. 
    expect(Up.toAst('Spiders.++++')).to.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Spiders.')
        ])
      ])
    )
  })

  specify('Revision insertion', () => {
    // If the revision deletion delimiters were alone on a line, they would be interpreted as a section separator streak.
    expect(Up.toAst('Spiders.~~~~')).to.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Spiders.')
        ])
      ])
    )
  })
})