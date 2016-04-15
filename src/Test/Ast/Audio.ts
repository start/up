/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
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


describe('Bracketed text containing a face with closed eyes, listening to a description, both of which point to a URL', () => {
  it('produces an audio node with the description and URL', () => {
    expect(Up.ast('I would never stay in a house with these sounds. [-_-: ghostly howling -> http://example.com/ghosts.ogg] Would you?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I would never stay in a house with these sounds. '),
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new PlainTextNode(' Would you?')
      ]))
  })
})
