import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


context("A NSFL block's label line does not produce a NSFL block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.parse('NSFL:')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('NSFL:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const markup = `
NSFL:
No!
Avoid that initialism!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([new Up.Text('NSFL:')]),
          new Up.LineBlock.Line([new Up.Text('No!')]),
          new Up.LineBlock.Line([new Up.Text("Avoid that initialism!")]),
        ])
      ]))
  })

  specify('followed by a blank line then a non-indented line', () => {
    const markup = `
NSFL:

No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('NSFL:')
        ]),
        new Up.Paragraph([
          new Up.Text('No!')
        ])
      ]))
  })

  specify('followed by 2 blank lines then a non-indented line', () => {
    const markup = `
NSFL:


No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('NSFL:')
        ]),
        new Up.Paragraph([
          new Up.Text('No!')
        ])
      ]))
  })

  specify('followed by 3 or more blank lines then a non-indented line', () => {
    const markup = `
NSFL:




No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('NSFL:')
        ]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.Text('No!')
        ])
      ]))
  })
})
