import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { either, lineStartingWith, INDENT, BLANK_LINE } from './Patterns'

const INDENTED_OR_BLANK_LINE_PATTERN = new RegExp(
  either(
    lineStartingWith(INDENT),
    BLANK_LINE
  )
)

export function getCurrentIndentedBlock(text: string) {
  const consumer = new TextConsumer(text)

  const lines: string[] = []

  while (!consumer.done()) {
    const didLineMatch = consumer.consumeLineIf(INDENTED_OR_BLANK_LINE_PATTERN,
      (line) =>
        lines.push(line))

    if (!didLineMatch) {
      break
    }
  }
  
  return lines.join('\n')
}