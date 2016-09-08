import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { repeat } from '../../../StringHelpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'


// For context, please see: http://stackstatus.net/post/147710624694/outage-postmortem-july-20-2016

const lotsOfWhitespace = repeat(' ', 2000)

context('A long string of whitespace should never cause cause the parser to hang:', () => {
  specify('Between words', () => {
    expect(Up.parseDocument('Hear' + lotsOfWhitespace + 'me?')).to.deep.equal(
      insideDocumentAndParagraph([
          new PlainText('Hear' + lotsOfWhitespace + 'me?')
      ]))
  })
})