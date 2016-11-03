import { expect } from 'chai'
import * as Up from '../../Main'


describe("The first line in a document underlined by any combination or arrangement of: # = - + ~ * @ :", () => {
  it('always produces a level-1 heading node', () => {
    const markup = `
Hello, world!
#=-+~*@:+**###=~=~=~--~~~~`

    const heading =
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        searchableMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document(
        [heading],
        new Up.Document.TableOfContents([heading])))
  })
})


describe("The heading's underline", () => {
  it('can use as few as 1 one of those characters in its underline', () => {
    const markup = `
Hello, world!
~~~~~~~~~~~~`

    const heading =
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        searchableMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document(
        [heading],
        new Up.Document.TableOfContents([heading])))
  })

  it('may be as short as 3 characters long', () => {
    const markup = `
Hello, world!
###`

    const heading =
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        searchableMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document(
        [heading],
        new Up.Document.TableOfContents([heading])))
  })
})


describe("A heading", () => {
  it('does not need to be the first convention in the document', () => {
    const markup = `
Hello, world!
      
Goodbye, world!
~~~~~~~~~~~~`

    const heading =
      new Up.Heading([new Up.Text('Goodbye, world!')], {
        level: 1,
        searchableMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.Text('Hello, world!')]),
        heading,
      ], new Up.Document.TableOfContents([heading])))
  })

  it('can contain inline conventions', () => {
    const markup = `
**Hello**, world!
~~~~~~~~~~~~`

    const heading =
      new Up.Heading([
        new Up.Stress([new Up.Text('Hello')]),
        new Up.Text(', world!'),
      ], {
          level: 1,
          searchableMarkup: '**Hello**, world!',
          ordinalInTableOfContents: 1
        })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document(
        [heading],
        new Up.Document.TableOfContents([heading])))
  })

  it('can have an optional overline consisting of the same characters as its underline', () => {
    const markup = `
#=-+~*@:
Hello, world!
#=-+~*@:`

    const heading =
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        searchableMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document(
        [heading],
        new Up.Document.TableOfContents([heading])
      ))
  })
})


describe("A heading's optional overline", () => {
  it('may be as short as 3 characters long, even when the underline is longer', () => {
    const markup = `
---
Hello, world!
----------`

    const heading =
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        searchableMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document(
        [heading],
        new Up.Document.TableOfContents([heading])))
  })

  it('can have its characters arranged differently than in the underline', () => {
    const markup = `
=-~-=-~-=-~-=
Hello, world!
--==~~~~~==--`

    const heading =
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        searchableMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document(
        [heading],
        new Up.Document.TableOfContents([heading])))
  })
})
