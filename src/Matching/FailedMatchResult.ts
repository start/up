import { MatchResult } from './MatchResult'

export class FailedMatchResult extends MatchResult {
  constructor() {
    super(0, '')
  }
}