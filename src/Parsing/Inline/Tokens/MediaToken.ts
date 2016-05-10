export interface MediaTokenType {
  new(description?: string, url?: string): MediaToken
}

export abstract class MediaToken {
  token(): void { }
  
  constructor (public description?: string, public url?: string) { }
}
