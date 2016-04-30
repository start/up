export abstract class MediaToken {
  token(): void { }
  
  constructor (public description: string, url: string) { }
}