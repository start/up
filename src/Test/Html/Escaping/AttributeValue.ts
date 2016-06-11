import { expect } from 'chai'
import Up from '../../../index'
import { BlockquoteNode } from '../../../SyntaxNodes/BlockquoteNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'


describe("Within a link's src attribute, all instances of \" and &", () => {
  it("are escaped by replacing them with &quot; and &amp;", () => {
    const node = new LinkNode([], 'https://example.com/?x&y&z="hi"')

    expect(Up.toHtml(node)).to.be.eql(
      '<a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a>')
  })
})


describe("Within a link's src attribute, <, ', and >", () => {
  it("are not escaped", () => {
    const node = new LinkNode([], "https://example.com/?z='<span>'")

    expect(Up.toHtml(node)).to.be.eql(
      '<a href="https://example.com/?z=\'<span>\'"></a>')
  })
})


describe("Within an audio convention's src attribute, all instances of \" and &", () => {
  it("are escaped (and they're escaped within the fallback link src attribute)", () => {
    const node = new AudioNode('', 'https://example.com/?x&y&z="hi"')

    expect(Up.toHtml(node)).to.be.eql(
      '<audio src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" title=""><a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a></audio>')
  })
})


describe("Within a video's title attribute, all instances of \" and &", () => {
  it("are escaped (but they're not escaped within the fallback link's contents)", () => {
    const node = new VideoNode('John said, "1 and 2 > 0. I can\'t believe it."', '')

    expect(Up.toHtml(node)).to.be.eql(
      '<video src="" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;"><a href="">John said, "1 and 2 > 0. I can\'t believe it."</a></video>')
  })
})


describe("Within an audio convention's detitle attribute, all instances of \" and &", () => {
  it("are escaped (but they're not escaped within the fallback link's contents)", () => {
    const node = new AudioNode('John said, "1 and 2 > 0. I can\'t believe it."', '')

    expect(Up.toHtml(node)).to.be.eql(
      '<audio src="" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;"><a href="">John said, "1 and 2 > 0. I can\'t believe it."</a></audio>')
  })
})