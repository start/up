import { expect } from 'chai'
import Up = require('../../../../index')
import { insideDocumentAndParagraph, expectEveryPermutationOfBrackets } from '../../Helpers'


const WITH_AND_WITHOUT_WHITESPACE = ['', ' \t\t ']


context('A linkified example input convention can have whitespace between itself and its linkifying URL, but only if the linkifying URL satisfies one of the following conditions:', () => {
  specify('It has a scheme', () => {
    expectEveryPermutationOfBrackets({
      precededBy: '{ Something Terrible }',
      bracketedSegments: [{
        prefixes: WITH_AND_WITHOUT_WHITESPACE,
        text: 'app:wiki/terrible-thing'
      }],
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.ExampleInput('Something Terrible')
        ], 'app:wiki/terrible-thing')
      ])
    })
  })


  context('When the URL has a scheme', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBrackets({
        precededBy: '{ Advance Wars }',
        bracketedSegments: [{
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)'
        }],
        toProduce: insideDocumentAndParagraph([
          new Up.Link([
            new Up.ExampleInput('Advance Wars')
          ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.parse('{ Ask Question } (https://stackoverflow.com is nice)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Ask Question'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('('),
            new Up.Link([
              new Up.PlainText('stackoverflow.com')
            ], 'https://stackoverflow.com'),
            new Up.PlainText(' is nice)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme', () => {
      expect(Up.parse('{ Send Email } (mailto:)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Send Email'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(mailto:)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      expect(Up.parse('{ Rustle Files } (file:///)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Rustle Files'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(file:///)')
          ]),
        ]))
    })

    specify('the rest of the URL can consist solely of digits', () => {
      expectEveryPermutationOfBrackets({
        precededBy: '{ Place Call }',
        bracketedSegments: [{
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'tel:5555555555'
        }],
        toProduce: insideDocumentAndParagraph([
          new Up.Link([
            new Up.ExampleInput('Place Call')
          ], 'tel:5555555555')
        ])
      })
    })

    specify('the scheme must not be escaped', () => {
      expect(Up.parse('{ Send Email } (\\mailto:daniel@wants.email)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Send Email'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(mailto:daniel@wants.email)')
          ]),
        ]))
    })
  })


  specify('It starts with a slash', () => {
    expectEveryPermutationOfBrackets({
      precededBy: '{ Something Terrible }',
      bracketedSegments: [{
        prefixes: WITH_AND_WITHOUT_WHITESPACE,
        text: '/wiki/something-terrible'
      }],
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.ExampleInput('Something Terrible')
        ], '/wiki/something-terrible')
      ])
    })
  })


  describe('When the URL starts with a slash, the URL', () => {
    it('must not contain any spaces', () => {
      expect(Up.parse('{ Something Terrible } (/r9k/ created it)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Something Terrible'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(/r9k/ created it)')
          ]),
        ]))
    })

    it('must have something after the slash', () => {
      expect(Up.parse('{ Slash } (/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Slash'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(/)')
          ]),
        ]))
    })

    it('can consist solely of digits after the slash', () => {
      expectEveryPermutationOfBrackets({
        precededBy: '{ Go }',
        bracketedSegments: [{
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: '/3'
        }],
        toProduce: insideDocumentAndParagraph([
          new Up.Link([
            new Up.ExampleInput('Go')
          ], '/3')
        ])
      })
    })

    it('must not have its slash escaped', () => {
      expect(Up.parse('{ Get Sad } (\\/r9k/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Get Sad'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(/r9k/)')
          ]),
        ]))
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    expectEveryPermutationOfBrackets({
      precededBy: '{ Read Wiki }',
      bracketedSegments: [{
        prefixes: WITH_AND_WITHOUT_WHITESPACE,
        text: '#wiki/something-terrible'
      }],
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.ExampleInput('Read Wiki')
        ], '#wiki/something-terrible')
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits after the hask mark', () => {
      expectEveryPermutationOfBrackets({
        precededBy: '{ Go }',
        bracketedSegments: [{
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: '#3'
        }],
        toProduce: insideDocumentAndParagraph([
          new Up.Link([
            new Up.ExampleInput('Go')
          ], '#3')
        ])
      })
    })

    it('must have something after the hash mark', () => {
      expect(Up.parse('{ Hash } (#)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Hash'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(#)')
          ]),
        ]))
    })

    it('must not contain any spaces', () => {
      expect(Up.parse('{ Play } (#starcraft2 was never trending)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Play'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(#starcraft2 was never trending)')
          ]),
        ]))
    })

    it('must not have its hashmark escaped', () => {
      expect(Up.parse('{Play} (\\#starcraft2)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Play'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(#starcraft2)')
          ]),
        ]))
    })
  })


  specify('It has a subdomain and a top-level domain', () => {
    expectEveryPermutationOfBrackets({
      precededBy: '{ Go }',
      bracketedSegments: [{
        prefixes: WITH_AND_WITHOUT_WHITESPACE,
        text: 'https://chrono-trigger.wiki'
      }],
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.ExampleInput('Go')
        ], 'https://chrono-trigger.wiki')
      ])
    })
  })


  describe('When the URL merely has a subdomain and a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBrackets({
        precededBy: '{ Play }',
        bracketedSegments: [{
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'advancewars.wikia.com/wiki/Advance_Wars_(game)'
        }],
        toProduce: insideDocumentAndParagraph([
          new Up.Link([
            new Up.ExampleInput('Play')
          ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      expectEveryPermutationOfBrackets({
        precededBy: '{Play}',
        bracketedSegments: [{
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'advancewars.wikia.com/'
        }],
        toProduce: insideDocumentAndParagraph([
          new Up.Link([
            new Up.ExampleInput('Play')
          ], 'https://advancewars.wikia.com/')
        ])
      })
    })

    specify('the top-level domain may not be followed by any character other than a forward slash', () => {
      expect(Up.parse('{ Get Scared } (4chan.org-terrifying)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Get Scared'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(4chan.org-terrifying)')
          ]),
        ]))
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      expectEveryPermutationOfBrackets({
        precededBy: '{ Go }',
        bracketedSegments: [{
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: '88.8888.cn'
        }],
        toProduce: insideDocumentAndParagraph([
          new Up.Link([
            new Up.ExampleInput('Go')
          ], 'https://88.8888.cn')
        ])
      })
    })

    context('The top-level domain must contain only letters', () => {
      specify('No numbers', () => {
        expect(Up.parse('{ Create User } (john.e.smith5)')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.ExampleInput('Create User'),
            new Up.PlainText(' '),
            new Up.NormalParenthetical([
              new Up.PlainText('(john.e.smith5)')
            ]),
          ]))
      })

      specify('No hyphens', () => {
        expect(Up.parse('{Create User} (john.e.smith-kline)')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.ExampleInput('Create User'),
            new Up.PlainText(' '),
            new Up.NormalParenthetical([
              new Up.PlainText('(john.e.smith-kline)')
            ]),
          ]))
      })
    })

    specify('the URL must start with a letter or a number, not a period', () => {
      expect(Up.parse('{ Buy Domain } (.co.uk)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Buy Domain'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(.co.uk)')
          ]),
        ]))
    })

    specify('the URL must not have consecutive periods before the top-level domain', () => {
      expect(Up.parse('{ Claim To Be Your Own Father } (um..uh)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Claim To Be Your Own Father'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(um…uh)')
          ]),
        ]))
    })

    specify('the URL must not have consecutive periods directly after the top-level domain before the slash that indicates the start of the resource path', () => {
      expect(Up.parse('{ Get Sad } (4chan.org../r9k/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Get Sad'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(4chan.org…/r9k/)')
          ]),
        ]))
    })

    specify('the URL may have consecutive periods after the slash that indicates the start of the resource path', () => {
      expectEveryPermutationOfBrackets({
        precededBy: '{Blast Off}',
        bracketedSegments: [{
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'example.com/321...blastoff/1'
        }],
        toProduce: insideDocumentAndParagraph([
          new Up.Link([
            new Up.ExampleInput('Blast Off')
          ], 'https://example.com/321...blastoff/1')
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.parse('{ Create Topic } (ign.com had some hilarious forums)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Create Topic'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(ign.com had some hilarious forums)')
          ]),
        ]))
    })

    specify('the domain part must not be escaped', () => {
      expect(Up.parse('{Create Topic} (\\ign.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.ExampleInput('Create Topic'),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(ign.com)')
          ]),
        ]))
    })
  })


  specify('If none of the conditions are satisfied, the audio convention is not linkified', () => {
    expect(Up.parse('{Try} (really)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.ExampleInput('Try'),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('(really)')
        ]),
      ]))
  })
})


describe("If there is whitespace between an otherwise-valid linkified audio convention's audio URL and its linkifying URL", () => {
  it('the audio convention is not linkified', () => {
    expect(Up.parse('{ Something Terrible }  \\  (https://example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.ExampleInput('Something Terrible'),
        new Up.PlainText('    '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('example.com')
          ], 'https://example.com'),
          new Up.PlainText(')')
        ])
      ]))
  })
})


describe("An audio convention's linkifying URL, when separated from its audio URL by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped', () => {
    expectEveryPermutationOfBrackets({
      precededBy: '{ Something Terrible }',
      bracketedSegments: [{
        prefixes: WITH_AND_WITHOUT_WHITESPACE,
        text: 'stackoverflow.com/search=something\\ very\\ terrible'
      }],
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.ExampleInput('Something Terrible')
        ], 'https://stackoverflow.com/search=something very terrible')
      ])
    })
  })
})
