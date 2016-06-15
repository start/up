import { RaisedVoiceStartDelimiter } from './RaisedVoiceStartDelimiter'


export class RaisedVoiceHandlerSnapshot {
  public startDelimitersFromMostToLeastRecent: RaisedVoiceStartDelimiter[]

  constructor(startDelimitersFromMostToLeastRecent: RaisedVoiceStartDelimiter[]) {
    this.startDelimitersFromMostToLeastRecent =
      startDelimitersFromMostToLeastRecent.map(delimiter => delimiter.clone())
  }
}