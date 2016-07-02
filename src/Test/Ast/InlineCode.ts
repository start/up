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


  context("Inline code content is trimmed. ", () => {
    specify('If your inline code must start or end with backticks, you can separate them from the outer delimiters with a space.', () => {
      expect(Up.toAst('`` `inline_code` ``')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineCodeNode('`inline_code`'),
        ]))
    })
  })


  context('Text surrounded by an uneven number of backticks does not produce an inline code node. This includes when:', () => {
    specify('There are fewer backticks on the opening side than the closing side', () => {
      expect(Up.toAst('I enjoy the occasional backtick ` or two ``')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('I enjoy the occasional backtick ` or two ``'),
        ]))
    })

    specify('There are more backticks on the opening side than the closing side', () => {
      expect(Up.toAst('I enjoy the occasional three backticks ``` or two ``')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('I enjoy the occasional three backticks ``` or two ``'),
        ]))
    })
  })
})


context('Inline code ends at the first matching delimiter.', () => {
  specify('Therefore, inline code can follow another instance of inline code, even when the first inline code is surrounded by the same number of backticks as the second', () => {
    expect(Up.toAst('Ideally, your document will consist solely of ``<font>`` and ``<div>`` elements.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Ideally, your document will consist solely of '),
        new InlineCodeNode('<font>'),
        new PlainTextNode(' and '),
        new InlineCodeNode('<div>'),
        new PlainTextNode(' elements.')                
      ]))
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