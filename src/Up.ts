import { parseDocument } from './Parsing/ParseDocument'
import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { SyntaxNode } from './SyntaxNodes/SyntaxNode'
import { HtmlWriter } from './Writer/HtmlWriter'


interface UpConfigArgs {
  documentName?: string,
  
  i18n?: {
    idWordDelimiter?: string,

    terms?: {
      image?: string,
      audio?: string,
      video?: string,
      spoiler?: string,
      footnote?: string,
      footnoteReference?: string
    }
  }
}


export class UpConfig {
  public settings: UpConfigArgs

  constructor(args?: UpConfigArgs) {
    args = args || {}
    const i18n = args.i18n || {}
    const i18nTerms = i18n.terms || {}

    this.settings = {
      documentName: args.documentName || '',

      i18n: {
        idWordDelimiter: i18n.idWordDelimiter || '-',

        terms: {
          image: i18nTerms.image || 'image',
          audio: i18nTerms.audio || 'audio',
          video: i18nTerms.video || 'video',
          spoiler: i18nTerms.spoiler || 'spoiler',
          footnote: i18nTerms.footnote || 'footnote',
          footnoteReference: i18nTerms.footnoteReference || 'footnote reference',
        }
      }
    }
  }
}


export class Up {
  private htmlWriter: HtmlWriter
  private config: UpConfig
  
  constructor(config?: UpConfigArgs) {
    this.config = new UpConfig(config)
    this.htmlWriter = new HtmlWriter(this.config)
  }
  
  // TODO: Accept configuration settings here, too
  toAst(text: string): DocumentNode {
    return parseDocument(text)
  }
  
  // TODO: Accept configuration settings here, too
  toHtml(textOrNode: string | SyntaxNode): string {
    const node = (
      typeof textOrNode === 'string'
        ? this.toAst(textOrNode)
        : textOrNode
    )

    return this.htmlWriter.write(node)
  }
}