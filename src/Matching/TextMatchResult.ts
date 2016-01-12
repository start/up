export class TextMatchResult {
  constructor (public newIndex: number, public text: string) { }
  
  success(): boolean {
    return !!this.text.length
  }
}