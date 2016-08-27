import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { InlineQuote } from '../../SyntaxNodes/InlineQuote'
import { InlineCode } from '../../SyntaxNodes/InlineCode'


describe('Text surrounded by doublequote characters', () => {
  it('is put inside an inline quote node', () => {
    expect(Up.toDocument('Hello, "world"!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new InlineQuote([
          new PlainText('world')
        ]),
        new PlainText('!!')
      ]))
  })
})


describe('Inline quotes', () => {
  it('are evaluated for inline conventions', () => {
    expect(Up.toDocument('"You should always use `<font>` elements."')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineQuote([
          new PlainText('You should always use '),
          new InlineCode('<font>'),
          new PlainText(' elements.'),
        ]),
      ]))
  })

  it('can contain nested inline quotes', () => {
    expect(Up.toDocument('John stood up. "Hello, my "little" world!"')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('John stood up. '),
        new InlineQuote([
          new PlainText('Hello, my '),
          new InlineQuote([
            new PlainText('little')
          ]),
          new PlainText(' world!')
        ])
      ]))
  })
})


describe('Nested inline quotes', () => {
  it('can open at the same time', () => {
    expect(Up.toDocument('Bob recounted, ""Come here right now!", she said. But I walked away."')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Bob recounted, '),
        new InlineQuote([
          new InlineQuote([
            new PlainText('Come here right now!'),
          ]),
          new PlainText(', she said. But I walked away.')
        ])
      ]))
  })

  it('can close at the same time', () => {
    expect(Up.toDocument('"I walked away while she screamed "come here right now!"", Bob recounted.')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineQuote([
          new PlainText('I walked away while she screamed '),
          new InlineQuote([
            new PlainText('come here right now!'),
          ]),
        ]),
        new PlainText(', Bob recounted.')
      ]))
  })
})


describe('Text separated from (otherwise surrounding) doublequotes by whitespace', () => {
  it('is not put inside an inline quote node', () => {
    expect(Up.toDocument('My favorite quote mark " is your favorite quote mark " and we all know it.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('My favorite quote mark " is your favorite quote mark " and we all know it.'),
      ]))
  })
})


context('An unmatched doublequote (that would otherwise start a quote) is preserved as plain text. This unmatched doublequote:', () => {
  specify('Can be the only doublequote in a paragraph', () => {
    expect(Up.toDocument('I said, "I am still typi')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I said, "I am still typi'),
      ]))
  })

  specify('Can follow another unmatched doublequote', () => {
    expect(Up.toDocument('Bob said, "I said, "I am still typi')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Bob said, "I said, "I am still typi'),
      ]))
  })

  specify('Can follow a proper inline quote', () => {
    expect(Up.toDocument('I said, "Hello world"! I repeat, "Hel')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I said, '),
        new InlineQuote([
          new PlainText('Hello world')
        ]),
        new PlainText('! I repeat, "Hel')
      ]))
  })
})


context('An unmatched doublequote (that would otherwise end a quote) is preserved as plain text. This unmatched doublequote:', () => {
  specify('Can be the only doublequote in a paragraph', () => {
    expect(Up.toDocument('My model airplane has a 30" wingspan.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('My model airplane has a 30" wingspan.'),
      ]))
  })

  specify('Can follow another unmatched doublequote', () => {
    expect(Up.toDocument('My model airplane has a 30" wingspan and is 20" long')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('My model airplane has a 30" wingspan and is 20" long'),
      ]))
  })

  specify('Can follow a proper inline quote', () => {
    expect(Up.toDocument('I said, "Thanks!" My new model airplane has a 30" wingspan.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I said, '),
        new InlineQuote([
          new PlainText('Thanks!')
        ]),
        new PlainText(' My new model airplane has a 30" wingspan.')
      ]))
  })
})


context('Inline quotes can follow each other in a paragraph', () => {
  specify('With a space in between them', () => {
    expect(Up.toDocument('"Thanks." "Okay."')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineQuote([
          new PlainText('Thanks.')
        ]),
        new PlainText(' '),
        new InlineQuote([
          new PlainText('Okay.')
        ])
      ]))
  })

  specify('With words in between them', () => {
    expect(Up.toDocument('"Thanks." He looked down. "Okay."')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineQuote([
          new PlainText('Thanks.')
        ]),
        new PlainText(' He looked down. '),
        new InlineQuote([
          new PlainText('Okay.')
        ])
      ]))
  })
})


context('Text surrounded by multiple consecutive doublequotes produces a single inline quote.', () => {
  specify('The doublequotes can be balanced', () => {
    expect(Up.toDocument('Yeah, check the """"car"""".')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Yeah, check the '),
        new InlineQuote([
          new PlainText('car')
        ]),
        new PlainText('.')
      ]))
  })

  specify('There can be more doublequotes on the starting side', () => {
    expect(Up.toDocument('Yeah, check the """"""car"""".')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Yeah, check the '),
        new InlineQuote([
          new PlainText('car')
        ]),
        new PlainText('.')
      ]))
  })

  specify('There can be more doublequotes on the ending side', () => {
    expect(Up.toDocument('Yeah, check the """"car""""".')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Yeah, check the '),
        new InlineQuote([
          new PlainText('car')
        ]),
        new PlainText('.')
      ]))
  })


  specify('This inline quote can contain nested inline quotes', () => {
    expect(Up.toDocument('Yeah, check the """"new "office" building"""".')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Yeah, check the '),
        new InlineQuote([
          new PlainText('new '),
          new InlineQuote([
            new PlainText('office')
          ]),
          new PlainText(' building')
        ]),
        new PlainText('.')
      ]))
  })
})
