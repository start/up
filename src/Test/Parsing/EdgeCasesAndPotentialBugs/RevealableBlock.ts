import { expect } from 'chai'
import * as Up from '../../../Up'
import { insideDocumentAndParagraph } from '../Helpers'


context("A revealable block's label line does not produce a spoiler block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.parse('SPOILER:')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('SPOILER:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const markup = `
Spoiler:
No!
Roses don't glow!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([new Up.Text('Spoiler:')]),
          new Up.LineBlock.Line([new Up.Text('No!')]),
          new Up.LineBlock.Line([new Up.Text("Roses don't glow!")]),
        ])
      ]))
  })

  specify('followed by a blank line then a non-indented line', () => {
    const markup = `
Spoiler:

No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Spoiler:')
        ]),
        new Up.Paragraph([
          new Up.Text('No!')
        ])
      ]))
  })

  specify('followed by 2 blank lines then a non-indented line', () => {
    const markup = `
Spoiler:


No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Spoiler:')
        ]),
        new Up.Paragraph([
          new Up.Text('No!')
        ])
      ]))
  })

  specify('followed by 3 or more blank lines then a non-indented line', () => {
    const markup = `
Spoiler:




No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Spoiler:')
        ]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.Text('No!')
        ])
      ]))
  })
})
