import { RaisedVoiceStartDelimiter } from './RaisedVoiceStartDelimiter'


export class RaisedVoiceHandlerSnapshot {
  public startDelimitersFromMostToLeastRecent: RaisedVoiceStartDelimiter[]

  constructor(startDelimiters: RaisedVoiceStartDelimiter[]) {
    this.startDelimitersFromMostToLeastRecent =
      startDelimiters.map(delimiter => delimiter.clone())
  }
}