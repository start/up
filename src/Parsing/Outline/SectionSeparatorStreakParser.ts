import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { BLANK_LINE } from './Patterns'
import { ParseArgs, OnParse } from '../Parser'
/*
// A line consisting solely of a streak characters, surrounded by any number of blank lines,
// indicates separation between section. 
export function parseSectionSeparatorStreak (text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)
  
  const countBlankLinesInSeparator = 3
  
  while (consumer.consumeLineIf(BLANK_LINE)) { }
  
  if (count < countBlankLinesInSeparator) {
    return false
  }
  
  while (consumer.consumeLineIf(BLANK_LINE)) { }
  
  onParse([new SectionSeparatorNode()], consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true
}
*/