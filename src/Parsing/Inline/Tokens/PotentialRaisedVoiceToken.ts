export interface PotentialRaisedVoiceTokenType {
  new(asterisks: string): PotentialRaisedVoiceToken
}

export class PotentialRaisedVoiceToken {
  token(): void { }
  
  constructor(public asterisks: string) { }
}