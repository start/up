export interface Token {
  token(): void
}

export interface TokenType {
  new(_1?: any, _2?: any):Token
}