interface WriterConfigArgs {
  documentId?: string,
  termForFootnote?: string,
  idDelimiter?: string
}

export class WriterConfig {
  private config: WriterConfigArgs

  constructor(args: WriterConfigArgs) {
    this.config = {
      documentId: args.documentId || '',
      termForFootnote: args.termForFootnote || 'footnote',
      idDelimiter: args.idDelimiter || '-'
    }
  }

  private id(...parts: string[]): string {
    return (
      [this.config.documentId]
        .concat(parts)
        .filter(part => !!part)
        .join(this.config.idDelimiter)
    )
  }

  private footnoteId(ordinal: number): string {
    return this.id(this.config.termForFootnote, ordinal.toString())
  }
}