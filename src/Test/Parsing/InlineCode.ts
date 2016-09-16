import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


describe('Text surrounded by backticks', () => {
  it('is put into an inline code node', () => {
    expect(Up.parse('`gabe.attack(james)`')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineCode('gabe.attack(james)')
      ]))
  })
})


describe('Inline code', () => {
  it('is not evaluated for other conventions', () => {
    expect(Up.parse('Hello, `*Bruno*`!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.InlineCode('*Bruno*'),
        new Up.Text('!')
      ]))
  })
})


context("Inline code can be surrounded by more than 1 backrick on each side, but the delimiters must be balanced. Each side must have exactly the same number of backticks.", () => {
  context("This means that inline code can contain streaks of backticks that aren't exactly as long as the surrounding delimiters", () => {
    specify('Inline code surrounded by 1 backtick on each side can contain streaks of 3 backticks', () => {
      expect(Up.parse('`let display = ```score:``` + 5`')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineCode('let display = ```score:``` + 5')
        ]))
    })

    specify('Inline code surrounded by 2 backticks on each side can contain individual backticks (streaks of 1)', () => {
      expect(Up.parse('``let display = `score:` + 5``')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineCode('let display = `score:` + 5')
        ]))
    })

    specify('Inline code surrounded by 3 backticks on each side can contain streaks of 2 backticks)', () => {
      expect(Up.parse('```let display = ``score:`` + 5```')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineCode('let display = ``score:`` + 5')
        ]))
    })
  })


  context("When your inline code needs to start or end with backtacks, separate those backticks from the delimiters by a single space. Those single spaces on either side will be trimmed away.", () => {
    context('This works when there is a separating space', () => {
      specify('on both sides', () => {
        expect(Up.parse('` ``inline_code`` `')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.InlineCode('``inline_code``')
          ]))
      })

      specify('only on the starting side', () => {
        expect(Up.parse('`` `unmatched start``')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.InlineCode('`unmatched start')
          ]))
      })

      specify('only on the ending side', () => {
        expect(Up.parse('``unmatched end` ``')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.InlineCode('unmatched end`')
          ]))
      })
    })


    specify('Only a single space gets trimmed. Anything beyond that single space is preserved.', () => {
      expect(Up.parse('``  `__private`  ``')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineCode(' `__private` ')
        ]))
    })

    specify('Tabs are always preserved', () => {
      expect(Up.parse('``\t__private\t``')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineCode('\t__private\t')
        ]))
    })


    context('The single spaces are only trimmed away when they separate the delimiters from backticks.', () => {
      context('Otherwise, a single space is preserved:', () => {
        specify("When it is trailing", () => {
          expect(Up.parse('`1. `')).to.deep.equal(
            insideDocumentAndParagraph([
              new Up.InlineCode('1. ')
            ]))
        })

        specify("When it is leading", () => {
          expect(Up.parse('` ]`')).to.deep.equal(
            insideDocumentAndParagraph([
              new Up.InlineCode(' ]')
            ]))
        })

        specify("When the other side has to be trimmed due to a neighboring backtick", () => {
          expect(Up.parse('`  ``... `')).to.deep.equal(
            insideDocumentAndParagraph([
              new Up.InlineCode(' ``... ')
            ]))
        })

        specify('When inline code consists of just a single space', () => {
          expect(Up.parse('` `')).to.deep.equal(
            insideDocumentAndParagraph([
              new Up.InlineCode(' ')
            ]))
        })

        specify('When inline code consists of multiple spaces', () => {
          expect(Up.parse('`   `')).to.deep.equal(
            insideDocumentAndParagraph([
              new Up.InlineCode('   ')
            ]))
        })
      })
    })
  })


  context('Text surrounded by an uneven number of backticks does not produce an inline code node. This includes when:', () => {
    specify('There are fewer backticks on the opening side than the closing side', () => {
      expect(Up.parse('I enjoy the occasional backtick ` or two ``')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('I enjoy the occasional backtick ` or two ``')
        ]))
    })

    specify('There are more backticks on the opening side than the closing side', () => {
      expect(Up.parse('I enjoy the occasional three backticks ``` or two ``')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('I enjoy the occasional three backticks ``` or two ``')
        ]))
    })
  })
})


context('Inline code ends at the first matching delimiter.', () => {
  specify('Therefore, inline code can follow another instance of inline code, even when the first inline code is surrounded by the same number of backticks as the second', () => {
    expect(Up.parse('Ideally, your document will consist solely of ``<font>`` and ``<div role="alert">`` elements.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Ideally, your document will consist solely of '),
        new Up.InlineCode('<font>'),
        new Up.Text(' and '),
        new Up.InlineCode('<div role="alert">'),
        new Up.Text(' elements.')
      ]))
  })
})


describe('Backslashes inside inline code', () => {
  it('are preserved', () => {
    expect(Up.parse('Whiteboard `\\"prop\\"`')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Whiteboard '),
        new Up.InlineCode('\\"prop\\"')
      ]))
  })

  it('do not escape the enclosing backticks', () => {
    expect(Up.parse('Funny lines: `/|\\`')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Funny lines: '),
        new Up.InlineCode('/|\\')
      ]))
  })
})
