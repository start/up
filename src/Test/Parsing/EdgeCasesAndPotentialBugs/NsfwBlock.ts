import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


context("A NSFW block's label line does not produce a NSFW block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.parse('NSFW:')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('NSFW:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const markup = `
NSFW:
No!
Avoid that initialism!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([new Up.Text('NSFW:')]),
          new Up.LineBlock.Line([new Up.Text('No!')]),
          new Up.LineBlock.Line([new Up.Text("Avoid that initialism!")]),
        ])
      ]))
  })

  specify('followed by a blank line then a non-indented line', () => {
    const markup = `
NSFW:

No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('NSFW:')
        ]),
        new Up.Paragraph([
          new Up.Text('No!')
        ])
      ]))
  })

  specify('followed by 2 blank lines then a non-indented line', () => {
    const markup = `
NSFW:


No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('NSFW:')
        ]),
        new Up.Paragraph([
          new Up.Text('No!')
        ])
      ]))
  })

  specify('followed by 3 or more blank lines then a non-indented line', () => {
    const markup = `
NSFW:




No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('NSFW:')
        ]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.Text('No!')
        ])
      ]))
  })
})
