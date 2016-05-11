export class NakedUrlToken {
  token(): void { }
  
  public restOfUrl = ''
  
  constructor(private protocol: string) { }
  
  url(): string {
    return this.protocol + this.restOfUrl
  }
}
