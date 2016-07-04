import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'


context("Some naked URLs produce links. The content of those links is the URL without its scheme.", () => {
  context('For a naked URL to produce a link, it must either:', () => {
    specify('Start with "https://', () => {
      expect(Up.toAst('Check out https://archive.org')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Check out '),
          new LinkNode([
            new PlainTextNode('archive.org')
          ], 'https://archive.org')
        ]))
    })

    specify('Start with "http://', () => {
      expect(Up.toAst('Check out https://archive.org')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Check out '),
          new LinkNode([
            new PlainTextNode('archive.org')
          ], 'https://archive.org')
        ]))
    })
  })


  context('A naked URL will not produce a link if:', () => {
    specify("It consists solely of 'http://'", () => {
      expect(Up.toAst('http://')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('http://')
        ]))
    })

    specify("It consists solely of 'https://'", () => {
      expect(Up.toAst('https://')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('https://')
        ]))
    })
  })

  specify("It has a scheme other than 'https://' or 'http://", () => {
    expect(Up.toAst('ftp://google.com')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('ftp://google.com')
      ]))
  })

  specify("It doesn't have both forward slashes", () => {
    expect(Up.toAst('In the homepage field, you can use either http:/mailto:')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In the homepage field, you can use either http:/mailto:')
      ]))
  })
})


describe('A naked URL', () => {
  it('is terminated by a space', () => {
    expect(Up.toAst('https://archive.org is exciting')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('archive.org')
        ], 'https://archive.org'),
        new PlainTextNode(' is exciting')
      ]))
  })

  it('can contain escaped spaces', () => {
    expect(Up.toAst('https://archive.org/fake\\ url')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('archive.org/fake url')
        ], 'https://archive.org/fake url')
      ]))
  })

  it('is terminated by a parenthesized convention closing', () => {
    expect(Up.toAst('(https://archive.org/fake)')).to.be.eql(
      insideDocumentAndParagraph([
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake'),
          new PlainTextNode(')')
        ])
      ]))
  })

  it('is terminated by a square bracketed convention closing', () => {
    expect(Up.toAst('[https://archive.org/fake]')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('['),
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake'),
          new PlainTextNode(']')
        ])
      ]))
  })

  it('is terminated by an action convention closing', () => {
    expect(Up.toAst('{https://archive.org/fake}')).to.be.eql(
      insideDocumentAndParagraph([
        new ActionNode([
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake')
        ])
      ]))
  })

  it('can contain matching parentheses', () => {
    expect(Up.toAst('https://archive.org/fake(url)')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('archive.org/fake(url)')
        ], 'https://archive.org/fake(url)')
      ]))
  })

  it('can contain matching square brackets', () => {
    expect(Up.toAst('https://archive.org/fake[url]')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('archive.org/fake[url]')
        ], 'https://archive.org/fake[url]')
      ]))
  })

  it('can contain matching curly brackets', () => {
    expect(Up.toAst('https://archive.org/fake{url}')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('archive.org/fake{url}')
        ], 'https://archive.org/fake{url}')
      ]))
  })

  it("can be inside a link", () => {
    expect(Up.toAst('[https://inner.example.com/fake][https://outer.example.com/real]')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new LinkNode([
            new PlainTextNode('inner.example.com/fake')
          ], 'https://inner.example.com/fake')
        ], 'https://outer.example.com/real')
      ]))
  })

  it("is terminated by revision insertion closing", () => {
    expect(Up.toAst('++I love... https://archive.org/fake++!')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertionNode([
          new PlainTextNode('I love... '),
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('is terminated by emphasis closing', () => {
    expect(Up.toAst('*I love... https://archive.org/fake*!')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('I love... '),
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('is closed by stress closing', () => {
    expect(Up.toAst('**I love https://archive.org/fake**!')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('I love '),
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('is closed by shouting closing', () => {
    expect(Up.toAst('***I love https://archive.org/fake***!')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new EmphasisNode([
            new PlainTextNode('I love '),
            new LinkNode([
              new PlainTextNode('archive.org/fake')
            ], 'https://archive.org/fake')
          ])
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('is closed by 3 or more asterisks closing emphasis', () => {
    expect(Up.toAst('*I love https://archive.org/fake***!')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('I love '),
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('is closed by 3 or more asterisks closing emphasis', () => {
    expect(Up.toAst('**I love https://archive.org/fake***!')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('I love '),
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('is closed by emphasis (starting with 2 asterisks) closing with 1 asterisk', () => {
    expect(Up.toAst('**I love https://archive.org/fake*!')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('I love '),
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('is closed by emphasis (starting with 3+ asterisks) closing with 1 asterisk', () => {
    expect(Up.toAst('***I love https://archive.org/fake*!')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('I love '),
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('is closed by stress (starting with 3+ asterisks) closing with 2 asterisks', () => {
    expect(Up.toAst('***I love https://archive.org/fake**!')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('I love '),
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it("can contain unescaped asterisks if not inside an emphasis convention", () => {
    expect(Up.toAst('https://example.org/a*normal*url')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('example.org/a*normal*url')
        ], 'https://example.org/a*normal*url')
      ]))
  })
})


describe('Inside parantheses, a naked URL', () => {
  it('can contain matching parentheses', () => {
    expect(Up.toAst('(https://archive.org/fake(url))')).to.be.eql(
      insideDocumentAndParagraph([
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('archive.org/fake(url)')
          ], 'https://archive.org/fake(url)'),
          new PlainTextNode(')')
        ])
      ]))
  })
})


describe('Inside square brackets, a naked URL', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toAst('[https://archive.org/fake[url]]')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('['),
          new LinkNode([
            new PlainTextNode('archive.org/fake[url]')
          ], 'https://archive.org/fake[url]'),
          new PlainTextNode(']')
        ])
      ]))
  })
})


describe('Inside an action node, a naked URL', () => {
  it('can contain matching curly brackets', () => {
    expect(Up.toAst('{https://archive.org/fake{url}}')).to.be.eql(
      insideDocumentAndParagraph([
        new ActionNode([
          new LinkNode([
            new PlainTextNode('archive.org/fake{url}')
          ], 'https://archive.org/fake{url}')
        ])
      ]))
  })
})
