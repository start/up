import { expect } from 'chai'
import * as Up from '../../../Main'


context("In inline documents, all outer whitespace is considered meaningless, even when it's escaped. This includes:", () => {
  context('Trailing whitespace:', () => {
    specify('Not escaped', () => {
      expect(Up.parseInline("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?  \t  \t ")).to.deep.equal(
        new Up.InlineDocument([
          new Up.Text("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")
        ]))
    })

    specify('Escaped', () => {
      expect(Up.parseInline("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?\\ \t  ")).to.deep.equal(
        new Up.InlineDocument([
          new Up.Text("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")
        ]))
    })

    specify('Both escaped and not escaped', () => {
      expect(Up.parseInline("I'm just a normal guy who only eats when it's raining. Isn't everyone like that? \t \\ \\\t  \t ")).to.deep.equal(
        new Up.InlineDocument([
          new Up.Text("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")
        ]))
    })

    specify('Both escaped and not escaped, all following a backslash itself following an escaped backslash', () => {
      expect(Up.parseInline("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?\\\\\\  \t \\ \\\t  \t ")).to.deep.equal(
        new Up.InlineDocument([
          new Up.Text("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?\\")
        ]))
    })
  })


  context('Leading whitespace:', () => {
    specify('Not escaped', () => {
      expect(Up.parseInline("  \t  \t I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")).to.deep.equal(
        new Up.InlineDocument([
          new Up.Text("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")
        ]))
    })

    specify('Escaped', () => {
      expect(Up.parseInline("\\ I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")).to.deep.equal(
        new Up.InlineDocument([
          new Up.Text("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")
        ]))
    })

    specify('Both escaped and not escaped', () => {
      expect(Up.parseInline("  \\\t  \\   \\ I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")).to.deep.equal(
        new Up.InlineDocument([
          new Up.Text("I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")
        ]))
    })

    specify('Both escaped and not escaped, all followed by a backslash escaping another backslash', () => {
      expect(Up.parseInline("  \t  \\\t  \\  \\\\I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")).to.deep.equal(
        new Up.InlineDocument([
          new Up.Text("\\I'm just a normal guy who only eats when it's raining. Isn't everyone like that?")
        ]))
    })
  })


  specify('Both trailing and leading whitespace together, in the most absurd arrangement possible', () => {
    expect(Up.parseInline("  \t  \\\t  \\  \\\\I'm just a normal guy who only eats when it's raining. Isn't everyone like that?\\\\\\  \t \\ \\\t  \t ")).to.deep.equal(
      new Up.InlineDocument([
        new Up.Text("\\I'm just a normal guy who only eats when it's raining. Isn't everyone like that?\\")
      ]))
  })
})
