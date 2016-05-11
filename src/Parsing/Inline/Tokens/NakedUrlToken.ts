export class NakedUrlToken {
  token(): void { }
  
  public restOfUrl = ''
  
  constructor(public protocol: string) { }
}
