import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Stress } from '../../SyntaxNodes/Stress'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Heading } from '../../SyntaxNodes/Heading'


describe("The first line in a document underlined by any combination or arrangement of: # = - + ~ * @ :", () => {
  it('always produces a level-1 heading node', () => {
    const markup = `
Hello, world!
#=-+~*@:+**###=~=~=~--~~~~`

    const heading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.toDocument(markup)).to.eql(
      new UpDocument(
        [heading],
        new UpDocument.TableOfContents([heading])))
  })
})


describe("The heading's underline", () => {
  it('can use as few as 1 one of those characters in its underline', () => {
    const markup = `
Hello, world!
~~~~~~~~~~~~`

    const heading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.toDocument(markup)).to.eql(
      new UpDocument(
        [heading],
        new UpDocument.TableOfContents([heading])))
  })

  it('may be as short as 3 characters long', () => {
    const markup = `
Hello, world!
###`

    const heading =
      new Heading([new PlainText('Hello, world!!')], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.toDocument(markup)).to.eql(
      new UpDocument(
        [heading],
        new UpDocument.TableOfContents([heading])))
  })
})


describe("A heading", () => {
  it('does not need to be the first convention in the document', () => {
    const markup = `
Hello, world!
      
Goodbye, world!
~~~~~~~~~~~~`

    const heading =
      new Heading([new PlainText('Goodbye, world!')], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([new PlainText('Hello, world!')]),
        heading,
      ], new UpDocument.TableOfContents([heading])))
  })

  it('can contain inline conventions', () => {
    const markup = `
**Hello**, world!
~~~~~~~~~~~~`

    const heading =
      new Heading([
        new Stress([new PlainText('Hello')]),
        new PlainText(', world!'),
      ], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.toDocument(markup)).to.eql(
      new UpDocument(
        [heading],
        new UpDocument.TableOfContents([heading])))
  })

  it('can have an optional overline consisting of the same characters as its underline', () => {
    const markup = `
#=-+~*@:
Hello, world!
#=-+~*@:`

    const heading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument(
        [heading],
        new UpDocument.TableOfContents([heading])
      ))
  })
})


describe("A heading's optional overline", () => {
  it('does not need to be the same length as the underline', () => {
    const markup = `
--------
Hello, world!
----------`

    const heading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.toDocument(markup)).to.eql(
      new UpDocument(
        [heading],
        new UpDocument.TableOfContents([heading])))
  })

  it('can have its characters arranged differently than in the underline', () => {
    const markup = `
=-~-=-~-=-~-=
Hello, world!
--==~~~~~==--`

    const heading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.toDocument(markup)).to.eql(
      new UpDocument(
        [heading],
        new UpDocument.TableOfContents([heading])))
  })
})
