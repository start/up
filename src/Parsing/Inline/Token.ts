import { InlineTextConsumer } from './InlineTextConsumer'

export enum TokenMeaning {
  PlainText,
  EmphasisStart,
  EmphasisEnd,
  StressStart,
  StressEnd,
  InlineCode,
  RevisionDeletionStart,
  RevisionDeletionEnd,
  RevisionInserionStart,
  RevisionInsertionEnd,
  SpoilerStart,
  SpoilerEnd,
  FootnoteReferenceStart,
  FootnoteReferenceEnd,
  LinkStart,
  LinkUrlAndLinkEnd,
  AudioStartAndAudioDescription,
  AudioUrlAndAudioEnd,
  ImageStartAndAudioDescription,
  ImageUrlAndAudioEnd,
  VideoStartAndAudioDescription,
  VideoUrlAndAudioEnd,
  PotentialRaisedVoiceStart,
  PotentialRaisedVoiceEnd,
  PotentialRaisedVoiceStartOrEnd
}

class EmphasisStartToken { }

class EmphasisEndToken { }

class StressStartToken { }

class StressStartEndToken { }

class SpoilerStartToken { }

class FootnoteReferenceStartToken { }

class FootnoteReferenceEndToken { }

class PotentialRaisedVoiceStart { }

class PotentialRaisedVoiceEnd { }

class PotentialRaisedVoiceStartOrEnd { }

class LinkStartToken { }

class LinkUrlAndLinkEndToken {
  constructor(public url: string) { }
}

class InlineCodeToken {
  constructor(public code: string) { }
}

class PlainTextToken {
  constructor(public text: string) { }
}

class MediaToken {
  constructor (public description: string, url: string) { }
}

class ImageToken extends MediaToken { }

class AudioToken extends MediaToken { }

class VideoToken extends MediaToken { }



export class Token {
  public value: string
  public consumerBefore: InlineTextConsumer
  
  constructor(public meaning: TokenMeaning, valueOrConsumerBefore?: string|InlineTextConsumer) {
    if (typeof valueOrConsumerBefore === 'string') {
      this.value = valueOrConsumerBefore
    } else {
      this.consumerBefore = valueOrConsumerBefore
    }
  }
  
  textIndex(): number {
    return this.consumerBefore.lengthConsumed()
  }
}