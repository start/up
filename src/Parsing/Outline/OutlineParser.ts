import { OutlineParserArgs } from './OutlineParserArgs'


export interface OutlineParser {
  (args: OutlineParserArgs): boolean
}
