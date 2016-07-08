import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { NsfwNode } from '../../SyntaxNodes/NsfwNode'
import { NsflNode } from '../../SyntaxNodes/NsflNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'


describe("Common smileys with brackets matching an audio description's open bracket", () => {
  specify('does not close the description', () => {
    expect(Up.toAst("[audio: ghostly ;'] howling :] ;] :'] ;']](http://example.com/ghosts.ogg)")).to.be.eql(
      new DocumentNode([
        new AudioNode("ghostly :'] howling :] ;] :'] ;']", 'http://example.com/ghosts.ogg')
      ]))
  })
})


describe("Common smileys with brackets matching an image description's open bracket", () => {
  specify('does not close the description', () => {
    expect(Up.toAst("{image: ghostly :'} howling :} ;} :'} ;'}}(http://example.com/ghosts.png)")).to.be.eql(
      new DocumentNode([
        new ImageNode("ghostly :'} howling :} ;} :'} ;'}", 'http://example.com/ghosts.png')
      ]))
  })
})


describe("Common smileys with brackets matching a video's open bracket", () => {
  specify('does not close the desription', () => {
    expect(Up.toAst("(video: ghostly ;') howling :) ;) :') ;'))(http://example.com/ghosts.webm)")).to.be.eql(
      new DocumentNode([
        new VideoNode("ghostly ;') howling :) ;) :') ;')", 'http://example.com/ghosts.webm')
      ]))
  })
})


describe("Common smileys with curly brackets", () => {
  it('do not close action conventions', () => {
    expect(Up.toAst("I can eat some pizza! {jump ;'} and smile :} ;} :'} ;'}}")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I can't eat most pizza."),
        new ActionNode([
          new PlainTextNode("jump ;'} and smile :} ;} :'} ;'}")
        ])
      ]))
  })
})


describe("Common smileys with brackets matching a footnote's open bracket", () => {
  it("do not close the footnote", () => {
    const footnote = new FootnoteNode([
      new PlainTextNode('Well... )oB I pretend not to.')
    ], 1)

    expect(Up.toAst("I don't eat cereal. (^ ;') Well...  :) ;) :') ;') I pretend not to.) Never have.")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe("Common smileys with closing parentheses", () => {
  it('do not close parenthesized conventions', () => {
    expect(Up.toAst("I can eat some pizza! (yes! ;') yay! :) ;) :') ;'))")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I can't eat most pizza."),
        new ParenthesizedNode([
          new PlainTextNode("(yes ;') yay! :) ;) :') ;'))")
        ])
      ]))
  })
})


describe("Common smileys with closing square brackets", () => {
  it('do not close square bracketed conventions', () => {
    expect(Up.toAst("I can eat some pizza! [yes! ;'] yay! :] ;] :'] ;']]")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I can't eat most pizza."),
        new SquareBracketedNode([
          new PlainTextNode("[yes! ;'] yay! :] ;] :'] ;']]")
        ])
      ]))
  })
})


describe("Common smileys with brackets matching a link's opening bracket", () => {
  it("do not prematurely close the link's content", () => {
    expect(Up.toAst("I can eat some pizza! My favorite is [Luigi's Layered Pizza! :] ;] :'] ;']] (example.com/pizza)")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I can't eat most pizza."),
        new LinkNode([
          new PlainTextNode("Luigi's Layered Pizza! :] ;] :'] ;']")
        ], 'https://example.com/pizza')
      ]))
  })
})


describe("Common smileys with brackets matching a spoiler's open bracket", () => {
  it('does not close the spoiler', () => {
    expect(Up.toAst("After you beat the Elite Four, {NSFL: you face ;'} Gary :} ;} :'} ;'}}.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new NsflNode([
          new PlainTextNode("you face ;'} Gary :} ;} :'} ;'}")
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe("Common smileys with brackets matching a spoiler's open bracket", () => {
  it('does not close the spoiler', () => {
    expect(Up.toAst("After you beat the Elite Four, [NSFW: you face ;'] Gary :] ;] :'] ;']].")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new NsfwNode([
          new PlainTextNode("you face ;'] Gary :] ;] :'] ;']")
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe("Common smileys with brackets matching a spoiler's open bracket", () => {
  it('does not close the spoiler', () => {
    expect(Up.toAst("After you beat the Elite Four, (SPOILER: you face ;') Gary :) ;) :') ;')).")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new PlainTextNode("you face ;') Gary :) ;) :') ;')")
        ]),
        new PlainTextNode('.')
      ]))
  })
})