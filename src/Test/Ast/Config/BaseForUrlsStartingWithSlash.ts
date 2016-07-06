import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { NsfwNode } from '../../../SyntaxNodes/NsfwNode'
import { NsflNode } from '../../../SyntaxNodes/NsflNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


const up = new Up({
  baseForUrlsStartingWithSlash: 'ftp://example.com'
})


describe('The "baseForUrlsStartingWithSlash" config setting', () => {
  it('is prefixed to link URLs that start with a slash', () => {
    const text = '[Chrono Cross](/wiki/Chrono_Chross)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'ftp://example.com/wiki/Chrono_Chross')
      ])
    )
  })

  it('is prefixed to image URLs that start with a slash', () => {
    const text = '[image: Chrono Cross logo](/cc-logo.png)'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross logo', 'ftp://example.com/cc-logo.png')
      ])
    )
  })

  it('is prefixed to audio URLs that start with a slash', () => {
    const text = '[audio: Chrono Cross ending theme](/radical dreamers.mp3)'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('Chrono Cross ending theme', 'ftp://example.com/radical dreamers.mp3')
      ])
    )
  })

  it('is prefixed to video URLs that start with a slash', () => {
    const text = '[video: Chrono Cross ending cinematic][/radical dreamers.webm]'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new VideoNode('Chrono Cross ending cinematic', 'ftp://example.com/radical dreamers.webm')
      ])
    )
  })

  it('is prefixed to link URLs that start with a slash when the link content and URL are separated by whitespace', () => {
    const text = '[Chrono Cross] (/wiki/Chrono_Chross)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'ftp://example.com/wiki/Chrono_Chross')
      ])
    )
  })

  it('is prefixed to linkified spoiler URLs that start with a slash', () => {
    const text = 'Walter White produces [SPOILER: Blue Sky meth](/wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new SpoilerNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ])
    )
  })

  it('is prefixed to linkified NSFW URLs that start with a slash', () => {
    const text = 'Walter White produces [NSFW: Blue Sky meth](/wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new NsfwNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ])
    )
  })

  it('is prefixed to linkified NSFL URLs that start with a slash', () => {
    const text = 'Walter White produces [NSFL: Blue Sky meth](/wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new NsflNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ])
    )
  })

  it("is prefixed to linkified footnote URLs that start with a slash", () => {
    const text = "I don't eat cereal. (^Well, I eat one.)[/cereals/lucky-charms?show=nutrition] Never have."

    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('Well, I eat one.')
      ], 'ftp://example.com/cereals/lucky-charms?show=nutrition')
    ], 1)

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })

  it('is prefixed to linkified audio URLs that start with a slash', () => {
    const text = 'Walter White produces [audio: Blue Sky meth](https://blueskymeth/sizzling.ogg)(/wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new AudioNode('Blue Sky meth', 'https://blueskymeth/sizzling.ogg')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ])
    )
  })

  it('is prefixed to linkified image URLs that start with a slash', () => {
    const text = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png)(/wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new ImageNode('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ])
    )
  })

  it('is prefixed to linkified video URLs that start with a slash', () => {
    const text = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm)(/wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new VideoNode('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ])
    )
  })

  it('is prefixed to linkified spoiler URLs that start with a slash when the spoiler part and the URL are separated by whitespace', () => {
    const text = 'Walter White produces [SPOILER: Blue Sky meth] (/wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new SpoilerNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ])
    )
  })

  it('is prefixed to linkified NSFW URLs that start with a slash when the NSFW part and the URL are separated by whitespace', () => {
    const text = 'Walter White produces [NSFW: Blue Sky meth] (/wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new NsfwNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ])
    )
  })

  it('is prefixed to linkified NSFL URLs that start with a slash when the NSFL part and the URL are separated by whitespace', () => {
    const text = 'Walter White produces [NSFL: Blue Sky meth] (/wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new NsflNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ])
    )
  })

  it("is prefixed to linkified footnote URLs that start with a slash when the footnote part and the URL are separated by whitespace", () => {
    const text = "I don't eat cereal. (^Well, I eat one.) [/cereals/lucky-charms?show=nutrition] Never have."

    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('Well, I eat one.')
      ], 'ftp://example.com/cereals/lucky-charms?show=nutrition')
    ], 1)

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })

  it('is prefixed to linkified audio URLs that start with a slash when the audio part and the linkifying URL are separated by whitespace', () => {
    const text = 'Walter White produces [audio: Blue Sky meth](https://blueskymeth/sizzling.ogg) (/wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new AudioNode('Blue Sky meth', 'https://blueskymeth/sizzling.ogg')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ])
    )
  })

  it('is prefixed to linkified image URLs that start with a slash when the image part and the linkifying URL are separated by whitespace', () => {
    const text = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png) (/wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new ImageNode('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ])
    )
  })

  it('is prefixed to linkified video URLs that start with a slash when the video part and the linkifying URL are separated by whitespace', () => {
    const text = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm) (/wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new VideoNode('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ])
    )
  })

  it('is not prefixed to schemeless URLs not starting with a slash (the default URL scheme is prefixed instead)', () => {
    const text = '[Chrono Cross](localhost/wiki/Chrono_Chross)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'https://localhost/wiki/Chrono_Chross')
      ])
    )
  })

  it('is not prefixed to URLs that have a scheme (which by definition cannot start with a slash)', () => {
    const text = '[Chrono Cross](my-app:localhost/wiki/Chrono_Chross)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'my-app:localhost/wiki/Chrono_Chross')
      ])
    )
  })
})
