import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'


describe('Text surrounded by backticks', () => {
  it('is put into an inline code node', () => {
    expect(Up.toAst('`gabe.attack(james)`')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineCodeNode('gabe.attack(james)'),
      ]))
  })
})


describe('Inline code', () => {
  it('is not evaluated for other conventions', () => {
    expect(Up.toAst('Hello, `*Bruno*`!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new InlineCodeNode('*Bruno*'),
        new PlainTextNode('!')
      ]))
  })
})


context("Inline code can be surrounded by more than 1 backrick on each side, but the delimiters must be balanced. Each side must have exactly the same number of backticks.", () => {
  context("This means that inline code can contain streaks of backticks that aren't exactly as long as the surrounding delimiters", () => {
    specify('Inline code surrounded by 1 backtick on each side can contain streaks of 3 backticks', () => {
      expect(Up.toAst('`let display = ```score:``` + 5`')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineCodeNode('let display = ```score:``` + 5'),
        ]))
    })

    specify('Inline code surrounded by 2 backticks on each side can contain individual backticks (streaks of 1)', () => {
      expect(Up.toAst('``let display = `score:` + 5``')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineCodeNode('let display = `score:` + 5'),
        ]))
    })

    specify('Inline code surrounded by 3 backticks on each side can contain streaks of 2 backticks)', () => {
      expect(Up.toAst('```let display = ``score:`` + 5```')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineCodeNode('let display = ``score:`` + 5'),
        ]))
    })
  })
})



describe('Backslashes inside inline code', () => {
  it('are preserved', () => {
    expect(Up.toAst('Whiteboard `\\"prop\\"`')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Whiteboard '),
        new InlineCodeNode('\\"prop\\"')
      ]))
  })

  it('do not escape the enclosing backticks', () => {
    expect(Up.toAst('Funny lines: `/|\\`')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Funny lines: '),
        new InlineCodeNode('/|\\')
      ]))
  })
})
