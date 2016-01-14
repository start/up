import { TextMatchResult } from './TextMatchResult'

export class FailedLineMatchResult extends TextMatchResult {
  constructor() {
    super(0, '')
  }
}