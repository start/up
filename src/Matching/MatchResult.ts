export class MatchResult {
  constructor (public newIndex: number, public matchedText: string) { }
  
  success(): boolean {
    return !!this.matchedText.length
  }
}