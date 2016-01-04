import { ParseResult } from './ParseResult'

export class FailedParseResult extends ParseResult {
  constructor() {
    super([], 0);
  }
  
  success = false
}