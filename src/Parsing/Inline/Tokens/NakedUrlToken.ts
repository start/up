export class NakedUrlToken {
  token(): void { }
  
  restOfUrl = ''
  
  constructor(private protocol: string) { }
  
  url(): string {
    return this.protocol + this.restOfUrl
  }
}
