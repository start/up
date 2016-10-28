import { expect } from 'chai'
import * as Up from '../../Up'
import { insideDocumentAndParagraph } from './Helpers'


context('Text enclosed within 2 or more equal signs is highlighted. For example:', () => {
  specify('2 equal signs', () => {
    expect(Up.parse('After you beat the Elite Four, ==you fight Gary==.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })

  specify('3 equal signs', () => {
    expect(Up.parse('After you beat the Elite Four, ===you fight Gary===.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })

  specify('4 equal signs', () => {
    expect(Up.parse('After you beat the Elite Four, ====you fight Gary====.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('Text enclosed within 1 equal sign on each side ', () => {
  it('is not highlighted', () => {
    expect(Up.parse('x=1 and y=2')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('x=1 and y=2'),
      ]))
  })
})


describe('Highlighted text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.parse('==You should always use `<font>` elements.==')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Text('You should always use '),
          new Up.InlineCode('<font>'),
          new Up.Text(' elements.'),
        ]),
      ]))
  })

  it('can contain nested highlighted text', () => {
    expect(Up.parse('Yeah, I agree. ==Everyone should eat ==expensive== cereal.==')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Yeah, I agree. '),
        new Up.Highlight([
          new Up.Text('Everyone should eat '),
          new Up.Highlight([
            new Up.Text('expensive')
          ]),
          new Up.Text(' cereal.')
        ])
      ]))
  })
})


describe('Nested highlighting', () => {
  it('can open at the same time', () => {
    expect(Up.parse('I love eating ====gluten-free== blueberry muffins.==')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I love eating '),
        new Up.Highlight([
          new Up.Highlight([
            new Up.Text('gluten-free')
          ]),
          new Up.Text(' blueberry muffins.')
        ])
      ]))
  })

  it('can close at the same time', () => {
    expect(Up.parse('==Integrated ==GPUs==== are all the rage.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Text('Integrated '),
          new Up.Highlight([
            new Up.Text('GPUs'),
          ]),
        ]),
        new Up.Text(' are all the rage.')
      ]))
  })
})


context('Text separated from (otherwise surrounding) equal signs by whitespace is not highlighted:', () => {
  specify('2 eaqual signs on each side', () => {
    expect(Up.parse('My favorite lines == are your favorite quote mark == and we all know it.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('My favorite lines == are your favorite quote mark == and we all know it.'),
      ]))
  })

  specify('4 eaqual signs on each side', () => {
    expect(Up.parse('My favorite lines ==== are your favorite quote mark ==== and we all know it.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('My favorite lines ==== are your favorite quote mark ==== and we all know it.'),
      ]))
  })
})



context('Unmatched double equal signs (that would otherwise start a highlight) are preserved as plain text. These unmatched double equal signs:', () => {
  specify('Can be the only double equal signs in a paragraph', () => {
    expect(Up.parse('I said that ==I am still typi')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I said that ==I am still typi'),
      ]))
  })

  specify('Can follow another unmatched instance of double equal signs', () => {
    expect(Up.parse('Bob likes ==eating every ==blueberry')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Bob likes ==eating every ==blueberry'),
      ]))
  })

  specify('Can follow proper highlighted text', () => {
    expect(Up.parse('I like ==blueberries==! Yes, I like ==blueberries')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like '),
        new Up.Highlight([
          new Up.Text('blueberries')
        ]),
        new Up.Text('! Yes, I like ==blueberries')
      ]))
  })
})


context('Unmatched double equal signs (that would otherwise end a highlight) are preserved as plain text. The unmatched double equal signs:', () => {
  specify('Can be the only double equal signs in a paragraph', () => {
    expect(Up.parse('I love lines== a lot.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I love lines== a lot.'),
      ]))
  })

  specify('Can follow another unmatched doublequote', () => {
    expect(Up.parse('I love lines== more than you love lines== and that cannot be disputed.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I love lines== more than you love lines== and that cannot be disputed.'),
      ]))
  })

  specify('Can follow a proper inline quote', () => {
    expect(Up.parse('I love ==cupcakes==, but I also love lines== a lot.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I love '),
        new Up.Highlight([
          new Up.Text('cupcakes')
        ]),
        new Up.Text(', but I also love lines== a lot.')
      ]))
  })
})
