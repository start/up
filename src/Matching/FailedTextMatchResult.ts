import { TextMatchResult } from './TextMatchResult'

export class FailedTextMatchResult extends TextMatchResult {
  constructor() {
    super(0, '')
  }
}