export class TextMatchResult {
  constructor (public newIndex: number, public matchedText: string) { }
  
  success(): boolean {
    return !!this.matchedText.length
  }
}