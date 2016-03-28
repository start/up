import { Token, TokenMeaning } from './Token'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { Convention } from './Convention'

const LINK = new Convention(TokenMeaning.LinkStart, TokenMeaning.LinkUrlAndLinkEnd)

export { LINK }