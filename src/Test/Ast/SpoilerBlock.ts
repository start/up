import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionListItem } from '../../SyntaxNodes/DescriptionListItem'
import { DescriptionTerm } from '../../SyntaxNodes/DescriptionTerm'
import { Description } from '../../SyntaxNodes/Description'


describe('A line consisting solely of "spoiler:", followed by an indented block of text,', () => {
  it('produces an inline spoiler block node', () => {
    const text = `
SPOILER:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })
})


describe('The spoiler term in a spoiler block', () => {
  it('is case-insensitive', () => {
    const text = `
sPoiLeR:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can be followed by a blank line', () => {
    const text = `
SPOILER:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can be followed by two blank lines', () => {
    const text = `
SPOILER:


  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can be followed by three or more blank lines', () => {
    const text = `
SPOILER:




  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })
})