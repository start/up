/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'


describe('Bracketed text containing a face with its second eye open, reading to a description, both of which point to a URL', () => {
  it('produces a video bide with the description and URL', () => {
    expect(Up.ast('I would never stay in a house with this. [-_o: ghosts eating luggage -> http://example.com/poltergeists.webm] Would you?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I would never stay in a house with this. '),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new PlainTextNode(' Would you?')
      ]))
  })
})

describe('Bracketed text containing a face with its first eye open, reading to a description, both of which point to a URL', () => {
  it('produces a video bide with the description and URL', () => {
    expect(Up.ast('I would never stay in a house with this. [o_-: ghosts eating luggage -> http://example.com/poltergeists.webm] Would you?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I would never stay in a house with this. '),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new PlainTextNode(' Would you?')
      ]))
  })
})