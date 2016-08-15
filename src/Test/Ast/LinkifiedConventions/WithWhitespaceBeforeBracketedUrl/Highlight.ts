import { expect } from 'chai'
import Up from '../../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../../Helpers'
import { LinkNode } from '../../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../../SyntaxNodes/PlainTextNode'
import { ParentheticalNode } from '../../../../SyntaxNodes/ParentheticalNode'
import { HighlightNode } from '../../../../SyntaxNodes/HighlightNode'


context('A linkified highlight can have whitespace between itself and its bracketed URL, but only if the URL satisfies one of the following conditions:', () => {
  specify('It has a scheme', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'highlight: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'app:wiki/terrible-thing',
      toProduce: insideDocumentAndParagraph([
        new HighlightNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], 'app:wiki/terrible-thing')
        ])
      ])
    })
  })


  context('When the URL has a scheme', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new HighlightNode([
            new LinkNode([
              new PlainTextNode('Advance Wars')
            ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
          ])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toDocument('[highlight: something terrible] (https://stackoverflow.com is nice)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('something terrible')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('('),
            new LinkNode([
              new PlainTextNode('stackoverflow.com')
            ], 'https://stackoverflow.com'),
            new PlainTextNode(' is nice)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme', () => {
      expect(Up.toDocument('[highlight: email] (mailto:)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('email')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(mailto:)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      expect(Up.toDocument('[highlight: local files] (file:///)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('local files')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(file:///)')
          ]),
        ]))
    })

    specify('the rest of the URL can consist solely of digits', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: spooky phone call',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'tel:5555555555',
        toProduce: insideDocumentAndParagraph([
          new HighlightNode([
            new LinkNode([
              new PlainTextNode('spooky phone call')
            ], 'tel:5555555555')
          ])
        ])
      })
    })

    specify('the scheme must not be escaped', () => {
      expect(Up.toDocument('[highlight: email] (\\mailto:daniel@wants.email)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('email')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(mailto:daniel@wants.email)')
          ]),
        ]))
    })
  })


  specify('It starts with a slash', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'highlight: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '/wiki/something-terrible',
      toProduce: insideDocumentAndParagraph([
        new HighlightNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], '/wiki/something-terrible')
        ])
      ])
    })
  })


  describe('When the URL starts with a slash, the URL', () => {
    it('must not contain any spaces', () => {
      expect(Up.toDocument('[highlight: something terrible] (/r9k/ created it)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('something terrible')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(/r9k/ created it)')
          ]),
        ]))
    })

    it('must have something after the slash', () => {
      expect(Up.toDocument('[highlight: slash] (/)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('slash')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(/)')
          ]),
        ]))
    })

    it('can consist solely of digits after the slash', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: Model 3 theft',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '/3',
        toProduce: insideDocumentAndParagraph([
          new HighlightNode([
            new LinkNode([
              new PlainTextNode('Model 3 theft')
            ], '/3')
          ])
        ])
      })
    })

    it('must not have its slash escaped', () => {
      expect(Up.toDocument('[highlight: yeah] (\\/r9k/)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('yeah')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(/r9k/)')
          ]),
        ]))
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'highlight: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '#wiki/something-terrible',
      toProduce: insideDocumentAndParagraph([
        new HighlightNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], '#wiki/something-terrible')
        ])
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits after the hask mark', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: Model 3 theft',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '#3',
        toProduce: insideDocumentAndParagraph([
          new HighlightNode([
            new LinkNode([
              new PlainTextNode('Model 3 theft')
            ], '#3')
          ])
        ])
      })
    })

    it('must have something after the hash mark', () => {
      expect(Up.toDocument('[highlight: hash mark] (#)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('hash mark')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(#)')
          ]),
        ]))
    })

    it('must not contain any spaces', () => {
      expect(Up.toDocument('[highlight: something terrible] (#starcraft2 was never trending)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('something terrible')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(#starcraft2 was never trending)')
          ]),
        ]))
    })

    it('must not have its hashmark escaped', () => {
      expect(Up.toDocument('[highlight: yeah] (\\#starcraft2)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('yeah')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(#starcraft2)')
          ]),
        ]))
    })
  })


  specify('It has a top-level domain', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'highlight: Chrono Trigger',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'chrono-trigger.wiki',
      toProduce: insideDocumentAndParagraph([
        new HighlightNode([
          new LinkNode([
            new PlainTextNode('Chrono Trigger')
          ], 'https://chrono-trigger.wiki')
        ])
      ])
    })
  })


  describe('When the URL merely has a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new HighlightNode([
            new LinkNode([
              new PlainTextNode('Advance Wars')
            ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
          ])
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/',
        toProduce: insideDocumentAndParagraph([
          new HighlightNode([
            new LinkNode([
              new PlainTextNode('Advance Wars')
            ], 'https://advancewars.wikia.com/')
          ])
        ])
      })
    })

    specify('the top-level domain may not be followed by any character other than a forward slash', () => {
      expect(Up.toDocument('[highlight: that place] (4chan.org-terrifying)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('that place')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(4chan.org-terrifying)')
          ]),
        ]))
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: Good luck!',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '88.8888.cn',
        toProduce: insideDocumentAndParagraph([
          new HighlightNode([
            new LinkNode([
              new PlainTextNode('Good luck!')
            ], 'https://88.8888.cn')
          ])
        ])
      })
    })

    context('The top-level domain must contain only letters', () => {
      specify('No numbers', () => {
        expect(Up.toDocument('[highlight: username] (john.e.smith5)')).to.be.eql(
          insideDocumentAndParagraph([
            new HighlightNode([
              new PlainTextNode('username')
            ]),
            new PlainTextNode(' '),
            new ParentheticalNode([
              new PlainTextNode('(john.e.smith5)')
            ]),
          ]))
      })

      specify('No hyphens', () => {
        expect(Up.toDocument('[highlight: username] (john.e.smith-kline)')).to.be.eql(
          insideDocumentAndParagraph([
            new HighlightNode([
              new PlainTextNode('username')
            ]),
            new PlainTextNode(' '),
            new ParentheticalNode([
              new PlainTextNode('(john.e.smith-kline)')
            ]),
          ]))
      })
    })

    specify('the URL must start with a letter or a number, not a period', () => {
      expect(Up.toDocument('[highlight: top-level domain] (.co.uk)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('top-level domain')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(.co.uk)')
          ]),
        ]))
    })

    specify('the URL must not have consecutive periods before the top-level domain', () => {
      expect(Up.toDocument('[highlight: Ash is not his own father] (um..uh)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('Ash is not his own father')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(um..uh)')
          ]),
        ]))
    })

    specify('the URL must not have consecutive periods directly after the top-level domain before the slash that indicates the start of the resource path', () => {
      expect(Up.toDocument('[highlight: debilitating sadness] (4chan.org../r9k/)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('debilitating sadness')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(4chan.org../r9k/)')
          ]),
        ]))
    })

    specify('the URL may have consecutive periods before the top-level domain after the slash that indicates the start of the resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: rocket ship',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'example.com/321...blastoff/1',
        toProduce: insideDocumentAndParagraph([
          new HighlightNode([
            new LinkNode([
              new PlainTextNode('rocket ship')
            ], 'https://example.com/321...blastoff/1')
          ])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toDocument('[highlight: yeah] (ign.com had some hilarious forums)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('yeah')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(ign.com had some hilarious forums)')
          ]),
        ]))
    })

    specify('the domain part must not be escaped', () => {
      expect(Up.toDocument('[highlight: yeah] (\\ign.com)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('yeah')
          ]),
          new PlainTextNode(' '),
          new ParentheticalNode([
            new PlainTextNode('(ign.com)')
          ]),
        ]))
    })
  })


  specify('If none of the conditions are satisfied, the highlight is not linkified', () => {
    expect(Up.toDocument('[highlight: something terrible] (really)')).to.be.eql(
      insideDocumentAndParagraph([
        new HighlightNode([
          new PlainTextNode('something terrible')
        ]),
        new PlainTextNode(' '),
        new ParentheticalNode([
          new PlainTextNode('(really)')
        ]),
      ]))
  })
})


describe('If there is nothing but whitspace between a highlight and a bracketed URL, but one of the whitespace characters is escaped', () => {
  it('the highlight is not linkified', () => {
    expect(Up.toDocument('[highlight: something terrible]  \\  (https://example.com)')).to.be.eql(
      insideDocumentAndParagraph([
        new HighlightNode([
          new PlainTextNode('something terrible')
        ]),
        new PlainTextNode('    '),
        new ParentheticalNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com')
          ], 'https://example.com'),
          new PlainTextNode(')')
        ])
      ]))
  })
})


describe("A linkified highlight's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'highlight: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'stackoverflow.com/search=something\\ very\\ terrible',
      toProduce: insideDocumentAndParagraph([
        new HighlightNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], 'https://stackoverflow.com/search=something very terrible')
        ])
      ])
    })
  })
})
