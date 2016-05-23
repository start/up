export class NakedUrlToken {
  token(): void { }
  
  urlAfterProtocol = ''
  
  constructor(private protocol: string) { }
  
  url(): string {
    return this.protocol + this.urlAfterProtocol
  }
}
