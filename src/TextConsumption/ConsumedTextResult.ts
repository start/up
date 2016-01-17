export class ConsumedTextResult {
  constructor (public newIndex: number, public text: string) { }
  
  success(): boolean {
    return !!this.text.length
  }
}