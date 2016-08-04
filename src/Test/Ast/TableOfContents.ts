import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
/*import { StressNode } from '../../SyntaxNodes/StressNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'*/
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'


context("A document is not given a table of contents if", () => {
  const tableOfContents: DocumentNode.TableOfContents = undefined

  specify('the "createTableOfContents" config setting (which defaults to false) is not set to true', () => {
    const markup = `
I enjoy apples
==============`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1),
      ], tableOfContents))
  })

  specify("the 'createTableOfContents' config setting is set to true, but the document has no outline conventions that would be put into its table of contents", () => {
    const markup = `
Can you guess what this chart represents?

Chart:

        1;      0
1;      true;   false
0;      false;  false


SPOILER:
  The answer!
  -----------
  
  The chart represents the logic for the \`AND\` operator.`

    expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Can you guess what this chart represents?')]),
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('1')]),
            new TableNode.Header.Cell([new PlainTextNode('0')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('true')]),
              new TableNode.Row.Cell([new PlainTextNode('false')]),
            ], new TableNode.Header.Cell([new PlainTextNode('1')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('false')]),
              new TableNode.Row.Cell([new PlainTextNode('false')])
            ], new TableNode.Header.Cell([new PlainTextNode('0')]))
          ]),
        new SpoilerBlockNode([
          new HeadingNode([new PlainTextNode('The answer!')], 1),
          new ParagraphNode([
            new PlainTextNode('The chart represents the logic for the '),
            new InlineCodeNode('AND'),
            new PlainTextNode(' operator.'),
          ])
        ])
      ], tableOfContents))
  })
})


context('A document is given a table of contents if the "createTableOfContents" config setting is set to true and the document contains', () => {
  const up = new Up({
    createTableOfContents: true
  })

  specify('a heading', () => {
    const markup = `
I enjoy apples
==============`

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([heading], tableOfContents))
  })

  specify('a chart with a caption', () => {
    const markup = `
Chart: \`AND\` operator logic

        1;      0
1;      true;   false
0;      false;  false`

    const chart =
      new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('1')]),
            new TableNode.Header.Cell([new PlainTextNode('0')])
          ]), [

            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('true')]),
              new TableNode.Row.Cell([new PlainTextNode('false')]),
            ], new TableNode.Header.Cell([new PlainTextNode('1')])),

            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('false')]),
              new TableNode.Row.Cell([new PlainTextNode('false')])
            ], new TableNode.Header.Cell([new PlainTextNode('0')])),
          ],

          new TableNode.Caption([
            new InlineCodeNode('AND'),
            new PlainTextNode(' operator logic')
          ]))

    const tableOfContents =
      new DocumentNode.TableOfContents([chart])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([chart], tableOfContents))
  })
})
