export interface Token {
  token(): void
}

export interface TokenType {
  new(..._: any[]):Token
}
