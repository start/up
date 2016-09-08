import { expect } from 'chai'
import Up from'../../../index'
import { InlineUpDocument } from'../../../SyntaxNodes/InlineUpDocument'
import { PlainText } from'../../../SyntaxNodes/PlainText'


context("In inline documents, all outer whitespace is considered meaningless, even when it's escaped. This includes:", () => {
  context("Trailing whitespace:", () => {
    specify('Not escaped', () => {
      expect(Up.parseInlineDocument("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?  \t  \t ")).to.deep.equal(
        new InlineUpDocument([
          new PlainText("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")
        ]))
    })

    specify('Escaped', () => {
      expect(Up.parseInlineDocument("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?\\ \t  ")).to.deep.equal(
        new InlineUpDocument([
          new PlainText("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")
        ]))
    })

    specify('Both escaped and not escaped', () => {
      expect(Up.parseInlineDocument("I'm just a normal guy who only eats when it's raining. Isn't everyone like that? \t \\ \\\t  \t ")).to.deep.equal(
        new InlineUpDocument([
          new PlainText("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")
        ]))
    })

    specify('Both escaped and not escaped, all following a backslash itself following an escaped backslash', () => {
      expect(Up.parseInlineDocument("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?\\\\\\  \t \\ \\\t  \t ")).to.deep.equal(
        new InlineUpDocument([
          new PlainText("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?\\")
        ]))
    })
  })


  context("Leading whitespace:", () => {
    specify('Not escaped', () => {
      expect(Up.parseInlineDocument("  \t  \t I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")).to.deep.equal(
        new InlineUpDocument([
          new PlainText("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")
        ]))
    })

    specify('Escaped', () => {
      expect(Up.parseInlineDocument("\\ I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")).to.deep.equal(
        new InlineUpDocument([
          new PlainText("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")
        ]))
    })

    specify('Both escaped and not escaped', () => {
      expect(Up.parseInlineDocument("  \\\t  \\   \\ I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")).to.deep.equal(
        new InlineUpDocument([
          new PlainText("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")
        ]))
    })

    specify('Both escaped and not escaped, all followed by a backslash escaping another backslash', () => {
      expect(Up.parseInlineDocument("  \t  \\\t  \\  \\\\I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")).to.deep.equal(
        new InlineUpDocument([
          new PlainText("\\I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")
        ]))
    })
  })


  specify("Both trailing and leading whitespace together, in the most absurd arrangement possible", () => {
    expect(Up.parseInlineDocument("  \t  \\\t  \\  \\\\I'm just a normal guy who only eats when it's raining. Isn't everyone like that?\\\\\\  \t \\ \\\t  \t ")).to.deep.equal(
      new InlineUpDocument([
        new PlainText("\\I'm just a normal guy who only eats when it's raining. Isn't everyone like that?\\")
      ]))
  })
})
