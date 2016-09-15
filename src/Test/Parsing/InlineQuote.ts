import { expect } from 'chai'
import Up = require('../../index')
import { insideDocumentAndParagraph } from './Helpers'


describe('Text surrounded by doublequote characters', () => {
  it('is put inside an inline quote node', () => {
    expect(Up.parse('Hello, "world"!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.InlineQuote([
          new Up.PlainText('world')
        ]),
        new Up.PlainText('!!')
      ]))
  })
})


describe('Inline quotes', () => {
  it('are evaluated for inline conventions', () => {
    expect(Up.parse('"You should always use `<font>` elements."')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.PlainText('You should always use '),
          new Up.InlineCode('<font>'),
          new Up.PlainText(' elements.'),
        ]),
      ]))
  })

  it('can contain nested inline quotes', () => {
    expect(Up.parse('John stood up. "Hello, my "little" world!"')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('John stood up. '),
        new Up.InlineQuote([
          new Up.PlainText('Hello, my '),
          new Up.InlineQuote([
            new Up.PlainText('little')
          ]),
          new Up.PlainText(' world!')
        ])
      ]))
  })
})


describe('Nested inline quotes', () => {
  it('can open at the same time', () => {
    expect(Up.parse('Bob recounted, ""Come here right now!", she said. But I walked away."')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Bob recounted, '),
        new Up.InlineQuote([
          new Up.InlineQuote([
            new Up.PlainText('Come here right now!'),
          ]),
          new Up.PlainText(', she said. But I walked away.')
        ])
      ]))
  })

  it('can close at the same time', () => {
    expect(Up.parse('"I walked away while she screamed "come here right now!"", Bob recounted.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.PlainText('I walked away while she screamed '),
          new Up.InlineQuote([
            new Up.PlainText('come here right now!'),
          ]),
        ]),
        new Up.PlainText(', Bob recounted.')
      ]))
  })
})


describe('Text separated from (otherwise surrounding) doublequotes by whitespace', () => {
  it('is not put inside an inline quote node', () => {
    expect(Up.parse('My favorite quote mark " is your favorite quote mark " and we all know it.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('My favorite quote mark " is your favorite quote mark " and we all know it.'),
      ]))
  })
})


context('An unmatched doublequote (that would otherwise start a quote) is preserved as plain text. This unmatched doublequote:', () => {
  specify('Can be the only doublequote in a paragraph', () => {
    expect(Up.parse('I said, "I am still typi')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I said, "I am still typi'),
      ]))
  })

  specify('Can follow another unmatched doublequote', () => {
    expect(Up.parse('Bob said, "I said, "I am still typi')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Bob said, "I said, "I am still typi'),
      ]))
  })

  specify('Can follow a proper inline quote', () => {
    expect(Up.parse('I said, "Hello world"! I repeat, "Hel')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I said, '),
        new Up.InlineQuote([
          new Up.PlainText('Hello world')
        ]),
        new Up.PlainText('! I repeat, "Hel')
      ]))
  })
})


context('An unmatched doublequote (that would otherwise end a quote) is preserved as plain text. This unmatched doublequote:', () => {
  specify('Can be the only doublequote in a paragraph', () => {
    expect(Up.parse('My model airplane has a 30" wingspan.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('My model airplane has a 30" wingspan.'),
      ]))
  })

  specify('Can follow another unmatched doublequote', () => {
    expect(Up.parse('My model airplane has a 30" wingspan and is 20" long')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('My model airplane has a 30" wingspan and is 20" long'),
      ]))
  })

  specify('Can follow a proper inline quote', () => {
    expect(Up.parse('I said, "Thanks!" My new model airplane has a 30" wingspan.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I said, '),
        new Up.InlineQuote([
          new Up.PlainText('Thanks!')
        ]),
        new Up.PlainText(' My new model airplane has a 30" wingspan.')
      ]))
  })
})


context('Inline quotes can follow each other in a paragraph', () => {
  specify('With a space in between them', () => {
    expect(Up.parse('"Thanks." "Okay."')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.PlainText('Thanks.')
        ]),
        new Up.PlainText(' '),
        new Up.InlineQuote([
          new Up.PlainText('Okay.')
        ])
      ]))
  })

  specify('With words in between them', () => {
    expect(Up.parse('"Thanks." He looked down. "Okay."')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.PlainText('Thanks.')
        ]),
        new Up.PlainText(' He looked down. '),
        new Up.InlineQuote([
          new Up.PlainText('Okay.')
        ])
      ]))
  })
})


context('Text surrounded by multiple consecutive doublequotes produces a single inline quote.', () => {
  specify('The doublequotes can be balanced', () => {
    expect(Up.parse('Yeah, check the """"car"""".')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Yeah, check the '),
        new Up.InlineQuote([
          new Up.PlainText('car')
        ]),
        new Up.PlainText('.')
      ]))
  })

  specify('There can be more doublequotes on the starting side', () => {
    expect(Up.parse('Yeah, check the """"""car"""".')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Yeah, check the '),
        new Up.InlineQuote([
          new Up.PlainText('car')
        ]),
        new Up.PlainText('.')
      ]))
  })

  specify('There can be more doublequotes on the ending side', () => {
    expect(Up.parse('Yeah, check the """"car""""".')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Yeah, check the '),
        new Up.InlineQuote([
          new Up.PlainText('car')
        ]),
        new Up.PlainText('.')
      ]))
  })


  specify('This inline quote can contain nested inline quotes', () => {
    expect(Up.parse('Yeah, check the """"new "office" building"""".')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Yeah, check the '),
        new Up.InlineQuote([
          new Up.PlainText('new '),
          new Up.InlineQuote([
            new Up.PlainText('office')
          ]),
          new Up.PlainText(' building')
        ]),
        new Up.PlainText('.')
      ]))
  })
})
