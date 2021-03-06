import * as Up from '../../Main'
import { NormalizedSettings } from '../NormalizedSettings'
import { WHITESPACE } from '../PatternPieces'


export abstract class Renderer {
  constructor(protected settings: NormalizedSettings.Rendering) { }

  abstract document(document: Up.Document): string
  abstract inlineDocument(inlineDocument: Up.InlineDocument): string
  abstract tableOfContents(tableOfContents: Up.Document.TableOfContents): string

  // Ideally, the following abstract methods wouldn't be public! But for the purpose of
  // double dispatch, they need to be exposed to our syntax node classes.

  abstract audio(audio: Up.Audio): string
  abstract blockquote(blockquote: Up.Blockquote): string
  abstract bold(bold: Up.Bold): string
  abstract bulletedList(list: Up.BulletedList): string
  abstract codeBlock(codeBlock: Up.CodeBlock): string
  abstract descriptionList(list: Up.DescriptionList): string
  abstract emphasis(emphasis: Up.Emphasis): string
  abstract exampleUserInput(exampleUserInput: Up.ExampleUserInput): string
  abstract footnoteBlock(footnoteBlock: Up.FootnoteBlock): string
  abstract referenceToFootnote(footnote: Up.Footnote): string
  abstract heading(heading: Up.Heading): string
  abstract highlight(highlight: Up.Highlight): string
  abstract image(image: Up.Image): string
  abstract inlineCode(inlineCode: Up.InlineCode): string
  abstract inlineQuote(inlineQuote: Up.InlineQuote): string
  abstract italic(italic: Up.Italic): string
  abstract lineBlock(lineBlock: Up.LineBlock): string
  abstract link(link: Up.Link): string
  abstract numberedList(list: Up.NumberedList): string
  abstract thematicBreak(thematicBreak: Up.ThematicBreak): string
  abstract paragraph(paragraph: Up.Paragraph): string
  abstract normalParenthetical(normalParenthetical: Up.NormalParenthetical): string
  abstract text(text: Up.Text): string
  abstract inlineRevealable(inlineRevealable: Up.InlineRevealable): string
  abstract revealableBlock(revealableBlock: Up.RevealableBlock): string
  abstract sectionLink(sectionLink: Up.SectionLink): string
  abstract squareParenthetical(squareParenthetical: Up.SquareParenthetical): string
  abstract stress(stress: Up.Stress): string
  abstract table(table: Up.Table): string
  abstract video(video: Up.Video): string

  protected renderEach(nodes: Up.SyntaxNode[]): string[] {
    return nodes.map(node => node.render(this))
  }

  protected renderAll(nodes: Up.SyntaxNode[]): string {
    return this.renderEach(nodes).join('')
  }

  protected idFor(...parts: Attr[]): string {
    const rawId =
      [this.settings.idPrefix, ...parts].join(' ')

    return rawId
      .trim()
      .replace(WHITESPACE_PATTERN, '-')
  }
}

export type Attr = number | string | undefined

const WHITESPACE_PATTERN = new RegExp(WHITESPACE, 'g')
