import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


describe('Text surrounded by doublequote characters', () => {
  it('is put inside an inline quote node', () => {
    expect(Up.parse('Hello, "world"!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.InlineQuote([
          new Up.Text('world')
        ]),
        new Up.Text('!!')
      ]))
  })
})


describe('Inline quotes', () => {
  it('are evaluated for inline conventions', () => {
    expect(Up.parse('"You should always use `<font>` elements."')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.Text('You should always use '),
          new Up.InlineCode('<font>'),
          new Up.Text(' elements.'),
        ]),
      ]))
  })

  it('can contain nested inline quotes', () => {
    expect(Up.parse('John stood up. "Hello, my "little" world!"')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('John stood up. '),
        new Up.InlineQuote([
          new Up.Text('Hello, my '),
          new Up.InlineQuote([
            new Up.Text('little')
          ]),
          new Up.Text(' world!')
        ])
      ]))
  })
})


describe('Nested inline quotes', () => {
  it('can open at the same time', () => {
    expect(Up.parse('Bob recounted, ""Come here right now!", she said. But I walked away."')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Bob recounted, '),
        new Up.InlineQuote([
          new Up.InlineQuote([
            new Up.Text('Come here right now!'),
          ]),
          new Up.Text(', she said. But I walked away.')
        ])
      ]))
  })

  it('can close at the same time', () => {
    expect(Up.parse('"I walked away while she screamed "come here right now!"", Bob recounted.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.Text('I walked away while she screamed '),
          new Up.InlineQuote([
            new Up.Text('come here right now!'),
          ]),
        ]),
        new Up.Text(', Bob recounted.')
      ]))
  })
})


describe('Text separated from (otherwise surrounding) doublequotes by whitespace', () => {
  it('is not put inside an inline quote node', () => {
    expect(Up.parse('My favorite quote mark " is your favorite quote mark " and we all know it.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('My favorite quote mark " is your favorite quote mark " and we all know it.'),
      ]))
  })
})


context('An unmatched doublequote (that would otherwise start a quote) is preserved as plain text. This unmatched doublequote:', () => {
  specify('Can be the only doublequote in a paragraph', () => {
    expect(Up.parse('I said, "I am still typi')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I said, "I am still typi'),
      ]))
  })

  specify('Can follow another unmatched doublequote', () => {
    expect(Up.parse('Bob said, "I said, "I am still typi')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Bob said, "I said, "I am still typi'),
      ]))
  })

  specify('Can follow a proper inline quote', () => {
    expect(Up.parse('I said, "Hello world"! I repeat, "Hel')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I said, '),
        new Up.InlineQuote([
          new Up.Text('Hello world')
        ]),
        new Up.Text('! I repeat, "Hel')
      ]))
  })
})


context('An unmatched doublequote (that would otherwise end a quote) is preserved as plain text. This unmatched doublequote:', () => {
  specify('Can be the only doublequote in a paragraph', () => {
    expect(Up.parse('My model airplane has a 30" wingspan.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('My model airplane has a 30" wingspan.'),
      ]))
  })

  specify('Can follow another unmatched doublequote', () => {
    expect(Up.parse('My model airplane has a 30" wingspan and is 20" long')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('My model airplane has a 30" wingspan and is 20" long'),
      ]))
  })

  specify('Can follow a proper inline quote', () => {
    expect(Up.parse('I said, "Thanks!" My new model airplane has a 30" wingspan.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I said, '),
        new Up.InlineQuote([
          new Up.Text('Thanks!')
        ]),
        new Up.Text(' My new model airplane has a 30" wingspan.')
      ]))
  })
})


context('Inline quotes can follow each other in a paragraph', () => {
  specify('With a space in between them', () => {
    expect(Up.parse('"Thanks." "Okay."')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.Text('Thanks.')
        ]),
        new Up.Text(' '),
        new Up.InlineQuote([
          new Up.Text('Okay.')
        ])
      ]))
  })

  specify('With words in between them', () => {
    expect(Up.parse('"Thanks." He looked down. "Okay."')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.Text('Thanks.')
        ]),
        new Up.Text(' He looked down. '),
        new Up.InlineQuote([
          new Up.Text('Okay.')
        ])
      ]))
  })
})


context('Text surrounded by multiple consecutive doublequotes produces a single inline quote.', () => {
  specify('The doublequotes can be balanced', () => {
    expect(Up.parse('Yeah, check the """"car"""".')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Yeah, check the '),
        new Up.InlineQuote([
          new Up.Text('car')
        ]),
        new Up.Text('.')
      ]))
  })

  specify('There can be more doublequotes on the starting side', () => {
    expect(Up.parse('Yeah, check the """"""car"""".')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Yeah, check the '),
        new Up.InlineQuote([
          new Up.Text('car')
        ]),
        new Up.Text('.')
      ]))
  })

  specify('There can be more doublequotes on the ending side', () => {
    expect(Up.parse('Yeah, check the """"car""""".')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Yeah, check the '),
        new Up.InlineQuote([
          new Up.Text('car')
        ]),
        new Up.Text('.')
      ]))
  })


  specify('This inline quote can contain nested inline quotes', () => {
    expect(Up.parse('Yeah, check the """"new "office" building"""".')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Yeah, check the '),
        new Up.InlineQuote([
          new Up.Text('new '),
          new Up.InlineQuote([
            new Up.Text('office')
          ]),
          new Up.Text(' building"')
        ]),
        new Up.Text('.')
      ]))
  })
})
