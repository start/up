interface WriterConfigArgs {
  documentId?: string,
  termForFootnote?: string,
  idDelimiter?: string
}

export class WriterConfig {
  public documentId: string
  public termForFootnote: string
  public idDelimiter: string

  constructor(args: WriterConfigArgs) {
    this.documentId = args.documentId || ''
    this.termForFootnote = args.termForFootnote || 'footnote'
    this.idDelimiter = '-'
  }

  private id(...parts: string[]): string {
    return (
      [this.documentId]
        .concat(parts)
        .filter(part => !!part)
        .join(this.idDelimiter)
    )
  }

  private footnoteId(ordinal: number): string {
    return this.id(this.termForFootnote, ordinal.toString())
  }
}