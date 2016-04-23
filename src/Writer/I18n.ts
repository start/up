interface I18nArgs {
  footnote: string
}

export class I18n {
  public term: I18nArgs

  constructor(args: I18nArgs) {
    this.term = {
      footnote: args.footnote || 'footnote'
    }
  }
}