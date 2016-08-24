import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { InlineCode } from '../../SyntaxNodes/InlineCode'


describe('Text surrounded by backticks', () => {
  it('is put into an inline code node', () => {
    expect(Up.toDocument('`gabe.attack(james)`')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineCode('gabe.attack(james)')
      ]))
  })
})


describe('Inline code', () => {
  it('is not evaluated for other conventions', () => {
    expect(Up.toDocument('Hello, `*Bruno*`!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new InlineCode('*Bruno*'),
        new PlainText('!')
      ]))
  })
})


context("Inline code can be surrounded by more than 1 backrick on each side, but the delimiters must be balanced. Each side must have exactly the same number of backticks.", () => {
  context("This means that inline code can contain streaks of backticks that aren't exactly as long as the surrounding delimiters", () => {
    specify('Inline code surrounded by 1 backtick on each side can contain streaks of 3 backticks', () => {
      expect(Up.toDocument('`let display = ```score:``` + 5`')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineCode('let display = ```score:``` + 5')
        ]))
    })

    specify('Inline code surrounded by 2 backticks on each side can contain individual backticks (streaks of 1)', () => {
      expect(Up.toDocument('``let display = `score:` + 5``')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineCode('let display = `score:` + 5')
        ]))
    })

    specify('Inline code surrounded by 3 backticks on each side can contain streaks of 2 backticks)', () => {
      expect(Up.toDocument('```let display = ``score:`` + 5```')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineCode('let display = ``score:`` + 5')
        ]))
    })
  })


  context("When your inline code needs to start or end with backtacks, separate those backticks from the delimiters by a single space. Those single spaces on either side will be trimmed away.", () => {
    context('This works when there is a separating space', () => {
      specify('on both sides', () => {
        expect(Up.toDocument('` ``inline_code`` `')).to.deep.equal(
          insideDocumentAndParagraph([
            new InlineCode('``inline_code``')
          ]))
      })

      specify('only on the starting side', () => {
        expect(Up.toDocument('`` `unmatched start``')).to.deep.equal(
          insideDocumentAndParagraph([
            new InlineCode('`unmatched start')
          ]))
      })

      specify('only on the ending side', () => {
        expect(Up.toDocument('``unmatched end` ``')).to.deep.equal(
          insideDocumentAndParagraph([
            new InlineCode('unmatched end`')
          ]))
      })
    })


    specify('Only a single space gets trimmed. Anything beyond that single space is preserved.', () => {
      expect(Up.toDocument('``  `__private`  ``')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineCode(' `__private` ')
        ]))
    })

    specify('Tabs are always preserved', () => {
      expect(Up.toDocument('``\t__private\t``')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineCode('\t__private\t')
        ]))
    })


    context('The single spaces are only trimmed away when they separate the delimiters from backticks.', () => {
      context('Otherwise, a single space is preserved:', () => {
        specify("When it is trailing", () => {
          expect(Up.toDocument('`1. `')).to.deep.equal(
            insideDocumentAndParagraph([
              new InlineCode('1. ')
            ]))
        })

        specify("When it is leading", () => {
          expect(Up.toDocument('` ]`')).to.deep.equal(
            insideDocumentAndParagraph([
              new InlineCode(' ]')
            ]))
        })

        specify("When the other side has to be trimmed due to a neighboring backtick", () => {
          expect(Up.toDocument('`  ``... `')).to.deep.equal(
            insideDocumentAndParagraph([
              new InlineCode(' ``... ')
            ]))
        })

        specify('When inline code consists of just a single space', () => {
          expect(Up.toDocument('` `')).to.deep.equal(
            insideDocumentAndParagraph([
              new InlineCode(' ')
            ]))
        })

        specify('When inline code consists of multiple spaces', () => {
          expect(Up.toDocument('`   `')).to.deep.equal(
            insideDocumentAndParagraph([
              new InlineCode('   ')
            ]))
        })
      })
    })
  })


  context('Text surrounded by an uneven number of backticks does not produce an inline code node. This includes when:', () => {
    specify('There are fewer backticks on the opening side than the closing side', () => {
      expect(Up.toDocument('I enjoy the occasional backtick ` or two ``')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('I enjoy the occasional backtick ` or two ``')
        ]))
    })

    specify('There are more backticks on the opening side than the closing side', () => {
      expect(Up.toDocument('I enjoy the occasional three backticks ``` or two ``')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('I enjoy the occasional three backticks ``` or two ``')
        ]))
    })
  })
})


context('Inline code ends at the first matching delimiter.', () => {
  specify('Therefore, inline code can follow another instance of inline code, even when the first inline code is surrounded by the same number of backticks as the second', () => {
    expect(Up.toDocument('Ideally, your document will consist solely of ``<font>`` and ``<div role="alert">`` elements.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Ideally, your document will consist solely of '),
        new InlineCode('<font>'),
        new PlainText(' and '),
        new InlineCode('<div role="alert">'),
        new PlainText(' elements.')
      ]))
  })
})


describe('Backslashes inside inline code', () => {
  it('are preserved', () => {
    expect(Up.toDocument('Whiteboard `\\"prop\\"`')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Whiteboard '),
        new InlineCode('\\"prop\\"')
      ]))
  })

  it('do not escape the enclosing backticks', () => {
    expect(Up.toDocument('Funny lines: `/|\\`')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Funny lines: '),
        new InlineCode('/|\\')
      ]))
  })
})
