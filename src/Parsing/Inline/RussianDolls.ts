import { RussianDoll } from './RussianDoll'
import { TokenMeaning } from './Token'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'

const SPOILER =
  new RussianDoll('[<_<]', '[>_>]', SpoilerNode, TokenMeaning.SpoilerStart, TokenMeaning.SpoilerEnd)

const INLINE_ASIDE =
  new RussianDoll('((', '))', InlineAsideNode, TokenMeaning.InlineAsideStart, TokenMeaning.InlineAsideEnd)
  
export {
  SPOILER,
  INLINE_ASIDE,
}