import { expect } from 'chai'
import Up from '../../../index'
import { BlockquoteNode } from '../../../SyntaxNodes/BlockquoteNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'


describe("Within a video's description in its title attribute, all instances of \" and &", () => {
  it("are escaped by replacing them with &quot; and &amp;, respectively (but they're not escaped within the fallback link)", () => {
    const node = new VideoNode('John said, "1 and 2 > 0. I can\'t believe it."', 'https://example.com/vid1')

    expect(Up.toHtml(node)).to.be.eql(
      '<video src="https://example.com/vid1" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;"><a href="https://example.com/vid1">John said, "1 and 2 > 0. I can\'t believe it."</a></video>')
  })
})


describe("Within an audio convention's description in its title attribute, all instances of \" and &", () => {
  it("are escaped by replacing them with &quot; and &amp;, respectively (but they're not escaped within the fallback link)", () => {
    const node = new AudioNode('John said, "1 and 2 > 0. I can\'t believe it."', 'https://example.com/clip1')

    expect(Up.toHtml(node)).to.be.eql(
      '<audio src="https://example.com/clip1" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;"><a href="https://example.com/clip1">John said, "1 and 2 > 0. I can\'t believe it."</a></audio>')
  })
})