(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
function last(items) {
    return items[items.length - 1];
}
exports.last = last;
function lastChar(text) {
    return text[text.length - 1];
}
exports.lastChar = lastChar;
function swap(items, firstIndex, secondIndex) {
    var firstItem = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = firstItem;
}
exports.swap = swap;
function concat(collections) {
    return (_a = []).concat.apply(_a, [[]].concat(collections));
    var _a;
}
exports.concat = concat;
function reverse(items) {
    return items.slice().reverse();
}
exports.reverse = reverse;

},{}],2:[function(require,module,exports){
"use strict";
function merge(base, changes) {
    if (changes == null) {
        return base;
    }
    var merged = {};
    for (var key in base) {
        var baseValue = merged[key] = base[key];
        var changedValue = changes[key];
        if (baseValue == null) {
            merged[key] = changedValue;
            continue;
        }
        if (changedValue != null) {
            merged[key] =
                typeof baseValue === 'object'
                    ? merge(baseValue, changedValue)
                    : changedValue;
        }
    }
    return merged;
}
exports.merge = merge;

},{}],3:[function(require,module,exports){
"use strict";
var FailedStateTracker = (function () {
    function FailedStateTracker() {
        this.failedStatesByTextIndex = {};
    }
    FailedStateTracker.prototype.registerFailure = function (failedContext) {
        var textIndex = failedContext.textIndex, state = failedContext.state;
        if (!this.failedStatesByTextIndex[textIndex]) {
            this.failedStatesByTextIndex[textIndex] = [];
        }
        this.failedStatesByTextIndex[textIndex].push(state);
    };
    FailedStateTracker.prototype.hasFailed = function (state, textIndex) {
        var failedStates = (this.failedStatesByTextIndex[textIndex] || []);
        return failedStates.some(function (failedState) { return failedState === state; });
    };
    return FailedStateTracker;
}());
exports.FailedStateTracker = FailedStateTracker;

},{}],4:[function(require,module,exports){
"use strict";
var MediaConvention = (function () {
    function MediaConvention(nonLocalizedTerm, NodeType, TokenType, state) {
        this.nonLocalizedTerm = nonLocalizedTerm;
        this.NodeType = NodeType;
        this.TokenType = TokenType;
        this.state = state;
    }
    return MediaConvention;
}());
exports.MediaConvention = MediaConvention;

},{}],5:[function(require,module,exports){
"use strict";
var MediaConvention_1 = require('./MediaConvention');
var AudioToken_1 = require('./Tokens/AudioToken');
var ImageToken_1 = require('./Tokens/ImageToken');
var VideoToken_1 = require('./Tokens/VideoToken');
var AudioNode_1 = require('../../SyntaxNodes/AudioNode');
var ImageNode_1 = require('../../SyntaxNodes/ImageNode');
var VideoNode_1 = require('../../SyntaxNodes/VideoNode');
var TokenizerState_1 = require('./TokenizerState');
var AUDIO = new MediaConvention_1.MediaConvention('audio', AudioNode_1.AudioNode, AudioToken_1.AudioToken, TokenizerState_1.TokenizerState.Audio);
exports.AUDIO = AUDIO;
var IMAGE = new MediaConvention_1.MediaConvention('image', ImageNode_1.ImageNode, ImageToken_1.ImageToken, TokenizerState_1.TokenizerState.Image);
exports.IMAGE = IMAGE;
var VIDEO = new MediaConvention_1.MediaConvention('video', VideoNode_1.VideoNode, VideoToken_1.VideoToken, TokenizerState_1.TokenizerState.Video);
exports.VIDEO = VIDEO;

},{"../../SyntaxNodes/AudioNode":66,"../../SyntaxNodes/ImageNode":78,"../../SyntaxNodes/VideoNode":100,"./MediaConvention":4,"./TokenizerState":15,"./Tokens/AudioToken":16,"./Tokens/ImageToken":21,"./Tokens/VideoToken":44}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RaisedVoiceMarker_1 = require('./RaisedVoiceMarker');
var StartMarker_1 = require('./StartMarker');
var EmphasisEndToken_1 = require('../Tokens/EmphasisEndToken');
var StressEndToken_1 = require('../Tokens/StressEndToken');
var EndMarker = (function (_super) {
    __extends(EndMarker, _super);
    function EndMarker() {
        _super.apply(this, arguments);
    }
    EndMarker.prototype.tokens = function () {
        return this.tokenTypes.map(function (TokenType) { return new TokenType(); });
    };
    EndMarker.prototype.matchAnyApplicableStartMarkers = function (markers) {
        var availableStartMarkersFromMostRecentToLeast = (markers
            .filter(function (marker) { return (marker instanceof StartMarker_1.StartMarker) && !marker.isFullyMatched(); })
            .reverse());
        if (this.canOnlyIndicateEmphasis()) {
            for (var _i = 0, availableStartMarkersFromMostRecentToLeast_1 = availableStartMarkersFromMostRecentToLeast; _i < availableStartMarkersFromMostRecentToLeast_1.length; _i++) {
                var startMarker = availableStartMarkersFromMostRecentToLeast_1[_i];
                if (startMarker.canOnlyIndicateEmphasis() || startMarker.canIndicateStressAndEmphasisTogether()) {
                    this.endEmphasis(startMarker);
                    return;
                }
            }
        }
        else if (this.canIndicateStressButNotBothTogether()) {
            for (var _a = 0, availableStartMarkersFromMostRecentToLeast_2 = availableStartMarkersFromMostRecentToLeast; _a < availableStartMarkersFromMostRecentToLeast_2.length; _a++) {
                var startMarker = availableStartMarkersFromMostRecentToLeast_2[_a];
                if (startMarker.canIndicateStress()) {
                    this.endStress(startMarker);
                    return;
                }
            }
        }
        for (var _b = 0, availableStartMarkersFromMostRecentToLeast_3 = availableStartMarkersFromMostRecentToLeast; _b < availableStartMarkersFromMostRecentToLeast_3.length; _b++) {
            var startMarker = availableStartMarkersFromMostRecentToLeast_3[_b];
            if (this.isFullyMatched()) {
                break;
            }
            if (this.canIndicateStressAndEmphasisTogether() && startMarker.canIndicateStressAndEmphasisTogether()) {
                this.startStressAndEmphasisTogether(startMarker);
                continue;
            }
            if (this.canIndicateStress() && startMarker.canIndicateStress()) {
                this.endStress(startMarker);
                continue;
            }
            if (this.canIndicateEmphasis() && startMarker.canIndicateEmphasis()) {
                this.endEmphasis(startMarker);
                continue;
            }
        }
    };
    EndMarker.prototype.startStressAndEmphasisTogether = function (startMarker) {
        var countAsterisksInCommonWithStartMarker = Math.min(this.countSurplusAsterisks, startMarker.countSurplusAsterisks);
        this.payForStressAndEmphasisTogether(countAsterisksInCommonWithStartMarker);
        this.tokenTypes.push(EmphasisEndToken_1.EmphasisEndToken);
        this.tokenTypes.push(StressEndToken_1.StressEndToken);
        startMarker.startStressAndEmphasisTogether(countAsterisksInCommonWithStartMarker);
    };
    EndMarker.prototype.endStress = function (startMarker) {
        this.payForStress();
        this.tokenTypes.push(StressEndToken_1.StressEndToken);
        startMarker.startStress();
    };
    EndMarker.prototype.endEmphasis = function (startMarker) {
        this.payForEmphasis();
        this.tokenTypes.push(EmphasisEndToken_1.EmphasisEndToken);
        startMarker.startEmphasis();
    };
    return EndMarker;
}(RaisedVoiceMarker_1.RaisedVoiceMarker));
exports.EndMarker = EndMarker;

},{"../Tokens/EmphasisEndToken":17,"../Tokens/StressEndToken":42,"./RaisedVoiceMarker":8,"./StartMarker":9}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RaisedVoiceMarker_1 = require('./RaisedVoiceMarker');
var PlainTextToken_1 = require('../Tokens/PlainTextToken');
var PlainTextMarker = (function (_super) {
    __extends(PlainTextMarker, _super);
    function PlainTextMarker() {
        _super.apply(this, arguments);
    }
    PlainTextMarker.prototype.tokens = function () {
        return [new PlainTextToken_1.PlainTextToken(this.originalAsterisks)];
    };
    return PlainTextMarker;
}(RaisedVoiceMarker_1.RaisedVoiceMarker));
exports.PlainTextMarker = PlainTextMarker;

},{"../Tokens/PlainTextToken":29,"./RaisedVoiceMarker":8}],8:[function(require,module,exports){
"use strict";
var EMPHASIS_COST = 1;
var STRESS_COST = 2;
var STRESS_AND_EMPHASIS_TOGETHER_COST = STRESS_COST + EMPHASIS_COST;
var RaisedVoiceMarker = (function () {
    function RaisedVoiceMarker(originalTokenIndex, originalAsterisks) {
        this.originalTokenIndex = originalTokenIndex;
        this.originalAsterisks = originalAsterisks;
        this.tokenTypes = [];
        this.countSurplusAsterisks = originalAsterisks.length;
    }
    RaisedVoiceMarker.prototype.providesNoTokens = function () {
        return !this.tokens().length;
    };
    RaisedVoiceMarker.prototype.isFullyMatched = function () {
        return this.countSurplusAsterisks <= 0;
    };
    RaisedVoiceMarker.prototype.canIndicateStressAndEmphasisTogether = function () {
        return this.canAfford(STRESS_AND_EMPHASIS_TOGETHER_COST);
    };
    RaisedVoiceMarker.prototype.canIndicateEmphasis = function () {
        return this.canAfford(EMPHASIS_COST);
    };
    RaisedVoiceMarker.prototype.canIndicateStress = function () {
        return this.canAfford(STRESS_COST);
    };
    RaisedVoiceMarker.prototype.canOnlyIndicateEmphasis = function () {
        return this.canIndicateEmphasis && !this.canIndicateStress();
    };
    RaisedVoiceMarker.prototype.canIndicateStressButNotBothTogether = function () {
        return this.canIndicateStress && !this.canIndicateStressAndEmphasisTogether();
    };
    RaisedVoiceMarker.prototype.payForStressAndEmphasisTogether = function (countAsterisksInCommonWithMatchingDelimiter) {
        if (countAsterisksInCommonWithMatchingDelimiter < STRESS_AND_EMPHASIS_TOGETHER_COST) {
            throw new Error("Delimiter at index " + this.originalTokenIndex + " only spent " + countAsterisksInCommonWithMatchingDelimiter + " to open stress and emphasis");
        }
        this.pay(countAsterisksInCommonWithMatchingDelimiter);
    };
    RaisedVoiceMarker.prototype.payForStress = function () {
        this.pay(STRESS_COST);
    };
    RaisedVoiceMarker.prototype.payForEmphasis = function () {
        this.pay(EMPHASIS_COST);
    };
    RaisedVoiceMarker.prototype.pay = function (cost) {
        this.countSurplusAsterisks -= cost;
    };
    RaisedVoiceMarker.prototype.canAfford = function (cost) {
        return this.countSurplusAsterisks >= cost;
    };
    return RaisedVoiceMarker;
}());
exports.RaisedVoiceMarker = RaisedVoiceMarker;
function comapreMarkersDescending(a, b) {
    return b.originalTokenIndex - a.originalTokenIndex;
}
exports.comapreMarkersDescending = comapreMarkersDescending;

},{}],9:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RaisedVoiceMarker_1 = require('./RaisedVoiceMarker');
var EmphasisStartToken_1 = require('../Tokens/EmphasisStartToken');
var StressStartToken_1 = require('../Tokens/StressStartToken');
var StartMarker = (function (_super) {
    __extends(StartMarker, _super);
    function StartMarker() {
        _super.apply(this, arguments);
    }
    StartMarker.prototype.tokens = function () {
        return (this.tokenTypes
            .map(function (TokenType) { return new TokenType(); })
            .reverse());
    };
    StartMarker.prototype.startStressAndEmphasisTogether = function (countAsterisksInCommonWithEndMarker) {
        this.payForStressAndEmphasisTogether(countAsterisksInCommonWithEndMarker);
        this.tokenTypes.push(EmphasisStartToken_1.EmphasisStartToken);
        this.tokenTypes.push(StressStartToken_1.StressStartToken);
    };
    StartMarker.prototype.startStress = function () {
        this.payForStress();
        this.tokenTypes.push(StressStartToken_1.StressStartToken);
    };
    StartMarker.prototype.startEmphasis = function () {
        this.payForEmphasis();
        this.tokenTypes.push(EmphasisStartToken_1.EmphasisStartToken);
    };
    return StartMarker;
}(RaisedVoiceMarker_1.RaisedVoiceMarker));
exports.StartMarker = StartMarker;

},{"../Tokens/EmphasisStartToken":18,"../Tokens/StressStartToken":43,"./RaisedVoiceMarker":8}],10:[function(require,module,exports){
"use strict";
var RaisedVoiceMarker_1 = require('./RaisedVoiceMarker');
var StartMarker_1 = require('./StartMarker');
var EndMarker_1 = require('./EndMarker');
var PlainTextMarker_1 = require('./PlainTextMarker');
var PotentialRaisedVoiceEndToken_1 = require('../Tokens/PotentialRaisedVoiceEndToken');
var PotentialRaisedVoiceStartOrEndToken_1 = require('../Tokens/PotentialRaisedVoiceStartOrEndToken');
var PotentialRaisedVoiceStartToken_1 = require('../Tokens/PotentialRaisedVoiceStartToken');
function applyRaisedVoices(tokens) {
    var raisedVoiceMarkers = getRaisedVoiceMarkers(tokens);
    var resultTokens = tokens.slice();
    for (var _i = 0, _a = raisedVoiceMarkers.sort(RaisedVoiceMarker_1.comapreMarkersDescending); _i < _a.length; _i++) {
        var raisedVoiceMarker = _a[_i];
        resultTokens.splice.apply(resultTokens, [raisedVoiceMarker.originalTokenIndex, 1].concat(raisedVoiceMarker.tokens()));
    }
    return resultTokens;
}
exports.applyRaisedVoices = applyRaisedVoices;
function getRaisedVoiceMarkers(tokens) {
    var markers = [];
    for (var tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
        var token = tokens[tokenIndex];
        var canStartConvention = (token instanceof PotentialRaisedVoiceStartToken_1.PotentialRaisedVoiceStartToken
            || token instanceof PotentialRaisedVoiceStartOrEndToken_1.PotentialRaisedVoiceStartOrEndToken);
        var canEndConvention = (token instanceof PotentialRaisedVoiceEndToken_1.PotentialRaisedVoiceEndToken
            || token instanceof PotentialRaisedVoiceStartOrEndToken_1.PotentialRaisedVoiceStartOrEndToken);
        var isPotentialRaisedVoiceToken = canStartConvention || canEndConvention;
        if (!isPotentialRaisedVoiceToken) {
            continue;
        }
        var asterisks = token.asterisks;
        if (canEndConvention) {
            var endMarker = new EndMarker_1.EndMarker(tokenIndex, asterisks);
            endMarker.matchAnyApplicableStartMarkers(markers);
            if (!endMarker.providesNoTokens()) {
                markers.push(endMarker);
                continue;
            }
        }
        if (canStartConvention) {
            markers.push(new StartMarker_1.StartMarker(tokenIndex, asterisks));
        }
        else {
            markers.push(new PlainTextMarker_1.PlainTextMarker(tokenIndex, asterisks));
        }
    }
    var withFailedMarkersTreatedAsPlainText = markers.map(function (marker) {
        return marker.providesNoTokens()
            ? new PlainTextMarker_1.PlainTextMarker(marker.originalTokenIndex, marker.originalAsterisks)
            : marker;
    });
    return withFailedMarkersTreatedAsPlainText;
}

},{"../Tokens/PotentialRaisedVoiceEndToken":30,"../Tokens/PotentialRaisedVoiceStartOrEndToken":31,"../Tokens/PotentialRaisedVoiceStartToken":32,"./EndMarker":6,"./PlainTextMarker":7,"./RaisedVoiceMarker":8,"./StartMarker":9}],11:[function(require,module,exports){
"use strict";
var StressNode_1 = require('../../SyntaxNodes/StressNode');
var EmphasisNode_1 = require('../../SyntaxNodes/EmphasisNode');
var SpoilerNode_1 = require('../../SyntaxNodes/SpoilerNode');
var FootnoteNode_1 = require('../../SyntaxNodes/FootnoteNode');
var RevisionDeletionNode_1 = require('../../SyntaxNodes/RevisionDeletionNode');
var RevisionInsertionNode_1 = require('../../SyntaxNodes/RevisionInsertionNode');
var ParenthesizedStartToken_1 = require('./Tokens/ParenthesizedStartToken');
var ParenthesizedEndToken_1 = require('./Tokens/ParenthesizedEndToken');
var SquareBracketedStartToken_1 = require('./Tokens/SquareBracketedStartToken');
var SquareBracketedEndToken_1 = require('./Tokens/SquareBracketedEndToken');
var StressEndToken_1 = require('./Tokens/StressEndToken');
var StressStartToken_1 = require('./Tokens/StressStartToken');
var SpoilerEndToken_1 = require('./Tokens/SpoilerEndToken');
var SpoilerStartToken_1 = require('./Tokens/SpoilerStartToken');
var EmphasisEndToken_1 = require('./Tokens/EmphasisEndToken');
var EmphasisStartToken_1 = require('./Tokens/EmphasisStartToken');
var FootnoteEndToken_1 = require('./Tokens/FootnoteEndToken');
var FootnoteStartToken_1 = require('./Tokens/FootnoteStartToken');
var RevisionInsertionStartToken_1 = require('./Tokens/RevisionInsertionStartToken');
var RevisionInsertionEndToken_1 = require('./Tokens/RevisionInsertionEndToken');
var RevisionDeletionStartToken_1 = require('./Tokens/RevisionDeletionStartToken');
var RevisionDeletionEndToken_1 = require('./Tokens/RevisionDeletionEndToken');
var LinkStartToken_1 = require('./Tokens/LinkStartToken');
var LinkEndToken_1 = require('./Tokens/LinkEndToken');
var TokenizerState_1 = require('./TokenizerState');
var EMPHASIS = {
    NodeType: EmphasisNode_1.EmphasisNode,
    StartTokenType: EmphasisStartToken_1.EmphasisStartToken,
    EndTokenType: EmphasisEndToken_1.EmphasisEndToken,
};
exports.EMPHASIS = EMPHASIS;
var STRESS = {
    NodeType: StressNode_1.StressNode,
    StartTokenType: StressStartToken_1.StressStartToken,
    EndTokenType: StressEndToken_1.StressEndToken,
};
exports.STRESS = STRESS;
var REVISION_DELETION = {
    NodeType: RevisionDeletionNode_1.RevisionDeletionNode,
    StartTokenType: RevisionDeletionStartToken_1.RevisionDeletionStartToken,
    EndTokenType: RevisionDeletionEndToken_1.RevisionDeletionEndToken,
    tokenizerState: TokenizerState_1.TokenizerState.RevisionDeletion
};
exports.REVISION_DELETION = REVISION_DELETION;
var REVISION_INSERTION = {
    NodeType: RevisionInsertionNode_1.RevisionInsertionNode,
    StartTokenType: RevisionInsertionStartToken_1.RevisionInsertionStartToken,
    EndTokenType: RevisionInsertionEndToken_1.RevisionInsertionEndToken,
    tokenizerState: TokenizerState_1.TokenizerState.RevisionInsertion
};
exports.REVISION_INSERTION = REVISION_INSERTION;
var SPOILER = {
    NodeType: SpoilerNode_1.SpoilerNode,
    StartTokenType: SpoilerStartToken_1.SpoilerStartToken,
    EndTokenType: SpoilerEndToken_1.SpoilerEndToken,
    tokenizerState: TokenizerState_1.TokenizerState.Spoiler
};
exports.SPOILER = SPOILER;
var FOOTNOTE = {
    NodeType: FootnoteNode_1.FootnoteNode,
    StartTokenType: FootnoteStartToken_1.FootnoteStartToken,
    EndTokenType: FootnoteEndToken_1.FootnoteEndToken,
    tokenizerState: TokenizerState_1.TokenizerState.Footnote
};
exports.FOOTNOTE = FOOTNOTE;
var LINK = {
    StartTokenType: LinkStartToken_1.LinkStartToken,
    EndTokenType: LinkEndToken_1.LinkEndToken,
    tokenizerState: TokenizerState_1.TokenizerState.Link
};
exports.LINK = LINK;
var PARENTHESIZED = {
    StartTokenType: ParenthesizedStartToken_1.ParenthesizedStartToken,
    EndTokenType: ParenthesizedEndToken_1.ParenthesizedEndToken,
    tokenizerState: TokenizerState_1.TokenizerState.Parenthesized
};
exports.PARENTHESIZED = PARENTHESIZED;
var SQUARE_BRACKETED = {
    StartTokenType: SquareBracketedStartToken_1.SquareBracketedStartToken,
    EndTokenType: SquareBracketedEndToken_1.SquareBracketedEndToken,
    tokenizerState: TokenizerState_1.TokenizerState.SquareBracketed
};
exports.SQUARE_BRACKETED = SQUARE_BRACKETED;

},{"../../SyntaxNodes/EmphasisNode":74,"../../SyntaxNodes/FootnoteNode":76,"../../SyntaxNodes/RevisionDeletionNode":91,"../../SyntaxNodes/RevisionInsertionNode":92,"../../SyntaxNodes/SpoilerNode":95,"../../SyntaxNodes/StressNode":97,"./TokenizerState":15,"./Tokens/EmphasisEndToken":17,"./Tokens/EmphasisStartToken":18,"./Tokens/FootnoteEndToken":19,"./Tokens/FootnoteStartToken":20,"./Tokens/LinkEndToken":23,"./Tokens/LinkStartToken":24,"./Tokens/ParenthesizedEndToken":27,"./Tokens/ParenthesizedStartToken":28,"./Tokens/RevisionDeletionEndToken":34,"./Tokens/RevisionDeletionStartToken":35,"./Tokens/RevisionInsertionEndToken":36,"./Tokens/RevisionInsertionStartToken":37,"./Tokens/SpoilerEndToken":38,"./Tokens/SpoilerStartToken":39,"./Tokens/SquareBracketedEndToken":40,"./Tokens/SquareBracketedStartToken":41,"./Tokens/StressEndToken":42,"./Tokens/StressStartToken":43}],12:[function(require,module,exports){
"use strict";
var Patterns_1 = require('../Patterns');
var TokenizableMedia = (function () {
    function TokenizableMedia(media, localizedTerm) {
        this.TokenType = media.TokenType;
        this.state = media.state;
        this.startPattern = getPattern(Patterns_1.escapeForRegex('[' + localizedTerm + ':') + Patterns_1.ANY_WHITESPACE, 'i');
        this.endPattern = getPattern(Patterns_1.escapeForRegex(']'));
    }
    return TokenizableMedia;
}());
exports.TokenizableMedia = TokenizableMedia;
function getPattern(pattern, flags) {
    return new RegExp(Patterns_1.startsWith(pattern), flags);
}

},{"../Patterns":62}],13:[function(require,module,exports){
"use strict";
var Patterns_1 = require('../Patterns');
var TokenizableSandwich = (function () {
    function TokenizableSandwich(args) {
        this.state = args.state;
        this.startPattern = new RegExp(Patterns_1.startsWith(args.startPattern), 'i');
        this.endPattern = new RegExp(Patterns_1.startsWith(args.endPattern), 'i');
        this.onOpen = args.onOpen;
        this.onClose = args.onClose;
    }
    return TokenizableSandwich;
}());
exports.TokenizableSandwich = TokenizableSandwich;

},{"../Patterns":62}],14:[function(require,module,exports){
"use strict";
var Patterns_1 = require('../Patterns');
var RichConventions_1 = require('./RichConventions');
var MediaConventions_1 = require('./MediaConventions');
var applyRaisedVoices_1 = require('./RaisedVoices/applyRaisedVoices');
var nestOverlappingConventions_1 = require('./nestOverlappingConventions');
var CollectionHelpers_1 = require('../../CollectionHelpers');
var TokenizerState_1 = require('./TokenizerState');
var TokenizableSandwich_1 = require('./TokenizableSandwich');
var TokenizableMedia_1 = require('./TokenizableMedia');
var FailedStateTracker_1 = require('./FailedStateTracker');
var InlineCodeToken_1 = require('./Tokens/InlineCodeToken');
var PlainTextToken_1 = require('./Tokens/PlainTextToken');
var NakedUrlToken_1 = require('./Tokens/NakedUrlToken');
var PotentialRaisedVoiceEndToken_1 = require('./Tokens/PotentialRaisedVoiceEndToken');
var PotentialRaisedVoiceStartOrEndToken_1 = require('./Tokens/PotentialRaisedVoiceStartOrEndToken');
var PotentialRaisedVoiceStartToken_1 = require('./Tokens/PotentialRaisedVoiceStartToken');
var Tokenizer = (function () {
    function Tokenizer(entireText, config) {
        this.entireText = entireText;
        this.tokens = [];
        this.textIndex = 0;
        this.openContexts = [];
        this.failedStateTracker = new FailedStateTracker_1.FailedStateTracker();
        this.bufferedText = '';
        this.configureConventions(config);
        this.dirty();
        this.tokenize();
        this.tokens = nestOverlappingConventions_1.nestOverlappingConventions(applyRaisedVoices_1.applyRaisedVoices(this.tokens));
    }
    Tokenizer.prototype.tokenize = function () {
        while (!(this.reachedEndOfText() && this.resolveOpenContexts())) {
            this.collectCurrentCharIfEscaped()
                || this.handleInlineCode()
                || this.performContextSpecificTokenizations()
                || (this.hasState(TokenizerState_1.TokenizerState.NakedUrl) && (this.openParenthesisInsideUrl()
                    || this.openSquareBracketInsideUrl()
                    || this.bufferCurrentChar()))
                || (this.hasState(TokenizerState_1.TokenizerState.SquareBracketed)
                    && this.convertSquareBracketedContextToLink())
                || this.tokenizeRaisedVoicePlaceholders()
                || this.openSandwich(this.inlineCodeConvention)
                || this.openSandwich(this.spoilerConvention)
                || this.openSandwich(this.footnoteConvention)
                || this.openSandwich(this.revisionDeletionConvention)
                || this.openSandwich(this.revisionInsertionConvention)
                || this.openMedia()
                || this.openSandwich(this.parenthesizedConvention)
                || this.openSandwich(this.squareBracketedConvention)
                || this.openNakedUrl()
                || this.bufferCurrentChar();
        }
    };
    Tokenizer.prototype.performSpecificTokenizations = function (state) {
        return (this.closeSandwichCorrespondingToState(state)
            || this.handleMediaCorrespondingToState(state)
            || ((state === TokenizerState_1.TokenizerState.LinkUrl) && (this.openSquareBracketInsideUrl()
                || this.closeLink()
                || this.bufferCurrentChar()))
            || ((state === TokenizerState_1.TokenizerState.MediaUrl) && (this.openSquareBracketInsideUrl()
                || this.closeMedia()
                || this.bufferCurrentChar()))
            || ((state === TokenizerState_1.TokenizerState.NakedUrl) && this.tryCloseNakedUrl()));
    };
    Tokenizer.prototype.closeSandwichCorrespondingToState = function (state) {
        var _this = this;
        return [
            this.spoilerConvention,
            this.footnoteConvention,
            this.revisionDeletionConvention,
            this.revisionInsertionConvention,
            this.squareBracketedConvention,
            this.parenthesizedConvention,
            this.squareBracketedInsideUrlConvention,
            this.parenthesizedInsideUrlConvention
        ].some(function (sandwich) {
            return (sandwich.state === state)
                && _this.closeSandwich(sandwich);
        });
    };
    Tokenizer.prototype.handleMediaCorrespondingToState = function (state) {
        var _this = this;
        return this.mediaConventions.some(function (media) {
            return (media.state === state)
                && (_this.openMediaUrl() || _this.bufferCurrentChar());
        });
    };
    Tokenizer.prototype.handleInlineCode = function () {
        var currentOpenContext = CollectionHelpers_1.last(this.openContexts);
        return (currentOpenContext
            && (currentOpenContext.state === TokenizerState_1.TokenizerState.InlineCode)
            && (this.closeSandwich(this.inlineCodeConvention) || this.bufferCurrentChar()));
    };
    Tokenizer.prototype.performContextSpecificTokenizations = function () {
        for (var i = this.openContexts.length - 1; i >= 0; i--) {
            if (this.performSpecificTokenizations(this.openContexts[i].state)) {
                return true;
            }
        }
        return false;
    };
    Tokenizer.prototype.openParenthesisInsideUrl = function () {
        return this.openSandwich(this.parenthesizedInsideUrlConvention);
    };
    Tokenizer.prototype.openSquareBracketInsideUrl = function () {
        return this.openSandwich(this.squareBracketedInsideUrlConvention);
    };
    Tokenizer.prototype.collectCurrentCharIfEscaped = function () {
        var ESCAPE_CHAR = '\\';
        if (this.currentChar !== ESCAPE_CHAR) {
            return false;
        }
        this.advance(1);
        return (this.reachedEndOfText()
            || this.bufferCurrentChar());
    };
    Tokenizer.prototype.addToken = function (token) {
        this.currentToken = token;
        this.tokens.push(token);
    };
    Tokenizer.prototype.reachedEndOfText = function () {
        return !this.remainingText;
    };
    Tokenizer.prototype.resolveOpenContexts = function () {
        while (this.openContexts.length) {
            var context_1 = this.openContexts.pop();
            switch (context_1.state) {
                case TokenizerState_1.TokenizerState.NakedUrl:
                    this.flushUnmatchedTextToNakedUrl();
                    break;
                case TokenizerState_1.TokenizerState.SquareBracketed:
                case TokenizerState_1.TokenizerState.Parenthesized:
                case TokenizerState_1.TokenizerState.SquareBracketedInsideUrl:
                case TokenizerState_1.TokenizerState.ParenthesizedInsideUrl:
                case TokenizerState_1.TokenizerState.LinkUrl:
                case TokenizerState_1.TokenizerState.MediaUrl:
                    break;
                default:
                    this.failContextAndResetToBeforeIt(context_1);
                    return false;
            }
        }
        this.flushBufferToPlainTextToken();
        return true;
    };
    Tokenizer.prototype.failContextAndResetToBeforeIt = function (context) {
        this.failedStateTracker.registerFailure(context);
        this.textIndex = context.textIndex;
        this.tokens.splice(context.countTokens);
        this.openContexts = context.openContexts;
        this.bufferedText = context.plainTextBuffer;
        this.currentToken = CollectionHelpers_1.last(this.tokens);
        this.dirty();
    };
    Tokenizer.prototype.advance = function (length) {
        this.textIndex += length;
        this.dirty();
    };
    Tokenizer.prototype.bufferCurrentChar = function () {
        this.bufferedText += this.currentChar;
        this.advance(1);
        return true;
    };
    Tokenizer.prototype.flushBufferedText = function () {
        var bufferedText = this.bufferedText;
        this.bufferedText = '';
        return bufferedText;
    };
    Tokenizer.prototype.flushBufferToPlainTextToken = function () {
        this.addToken(new PlainTextToken_1.PlainTextToken(this.flushBufferedText()));
    };
    Tokenizer.prototype.canTry = function (state, textIndex) {
        if (textIndex === void 0) { textIndex = this.textIndex; }
        return !this.failedStateTracker.hasFailed(state, textIndex);
    };
    Tokenizer.prototype.openNakedUrl = function () {
        var _this = this;
        return !this.hasState(TokenizerState_1.TokenizerState.Link) && this.openConvention({
            state: TokenizerState_1.TokenizerState.NakedUrl,
            pattern: NAKED_URL_START_PATTERN,
            then: function (urlProtocol) {
                _this.addTokenAfterFlushingBufferToPlainTextToken(new NakedUrlToken_1.NakedUrlToken(urlProtocol));
            }
        });
    };
    Tokenizer.prototype.tryCloseNakedUrl = function () {
        if (!WHITESPACE_CHAR_PATTERN.test(this.currentChar)) {
            return false;
        }
        this.flushUnmatchedTextToNakedUrl();
        this.closeMostRecentContextWithStateAndAnyInnerContexts(TokenizerState_1.TokenizerState.NakedUrl);
        return true;
    };
    Tokenizer.prototype.flushUnmatchedTextToNakedUrl = function () {
        this.currentToken.restOfUrl = this.flushBufferedText();
    };
    Tokenizer.prototype.openMedia = function () {
        var _this = this;
        var _loop_1 = function(media) {
            var openedMediaConvention = this_1.openConvention({
                state: media.state,
                pattern: media.startPattern,
                then: function () {
                    _this.addTokenAfterFlushingBufferToPlainTextToken(new media.TokenType());
                }
            });
            if (openedMediaConvention) {
                return { value: true };
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.mediaConventions; _i < _a.length; _i++) {
            var media = _a[_i];
            var state_1 = _loop_1(media);
            if (typeof state_1 === "object") return state_1.value;
        }
        return false;
    };
    Tokenizer.prototype.convertSquareBracketedContextToLink = function () {
        var _this = this;
        var didStartLinkUrl = this.openConvention({
            state: TokenizerState_1.TokenizerState.LinkUrl,
            pattern: LINK_AND_MEDIA_URL_ARROW_PATTERN,
            then: function (arrow) { return _this.flushBufferToPlainTextToken(); }
        });
        if (!didStartLinkUrl) {
            return false;
        }
        var squareBrackeContext = this.getInnermostContextWithState(TokenizerState_1.TokenizerState.SquareBracketed);
        if (!this.canTry(TokenizerState_1.TokenizerState.Link, squareBrackeContext.textIndex)) {
            var linkUrlContext = this.openContexts.pop();
            this.failContextAndResetToBeforeIt(linkUrlContext);
            return false;
        }
        squareBrackeContext.state = TokenizerState_1.TokenizerState.Link;
        var indexOfSquareBracketedStartToken = squareBrackeContext.countTokens + 1;
        this.tokens.splice(indexOfSquareBracketedStartToken, 1, new RichConventions_1.LINK.StartTokenType());
        return true;
    };
    Tokenizer.prototype.openMediaUrl = function () {
        var _this = this;
        return this.openConvention({
            state: TokenizerState_1.TokenizerState.MediaUrl,
            pattern: LINK_AND_MEDIA_URL_ARROW_PATTERN,
            then: function () {
                _this.currentToken.description = _this.flushBufferedText();
            }
        });
    };
    Tokenizer.prototype.closeLink = function () {
        var _this = this;
        return this.advanceAfterMatch({
            pattern: LINK_END_PATTERN,
            then: function () {
                var url = _this.flushBufferedText();
                _this.addToken(new RichConventions_1.LINK.EndTokenType(url));
                _this.closeMostRecentContextWithState(TokenizerState_1.TokenizerState.LinkUrl);
                _this.closeMostRecentContextWithState(TokenizerState_1.TokenizerState.Link);
            }
        });
    };
    Tokenizer.prototype.closeMedia = function () {
        var _this = this;
        return this.advanceAfterMatch({
            pattern: LINK_END_PATTERN,
            then: function () {
                _this.currentToken.url = _this.flushBufferedText();
                _this.closeMostRecentContextWithState(TokenizerState_1.TokenizerState.MediaUrl);
                _this.closeInnermostContext();
            }
        });
    };
    Tokenizer.prototype.openSandwich = function (sandwich) {
        return this.openConvention({
            state: sandwich.state,
            pattern: sandwich.startPattern,
            then: sandwich.onOpen
        });
    };
    Tokenizer.prototype.closeSandwich = function (sandwich) {
        var _this = this;
        return this.advanceAfterMatch({
            pattern: sandwich.endPattern,
            then: function (match, isTouchingWordEnd, isTouchingWordStart) {
                var captures = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    captures[_i - 3] = arguments[_i];
                }
                _this.closeMostRecentContextWithState(sandwich.state);
                sandwich.onClose.apply(sandwich, [match, isTouchingWordEnd, isTouchingWordStart].concat(captures));
            }
        });
    };
    Tokenizer.prototype.openConvention = function (args) {
        var _this = this;
        var state = args.state, pattern = args.pattern, then = args.then;
        return this.canTry(state) && this.advanceAfterMatch({
            pattern: pattern,
            then: function (match, isTouchingWordEnd, isTouchingWordStart) {
                var captures = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    captures[_i - 3] = arguments[_i];
                }
                _this.openContexts.push({
                    state: state,
                    textIndex: _this.textIndex,
                    countTokens: _this.tokens.length,
                    openContexts: _this.openContexts.slice(),
                    plainTextBuffer: _this.bufferedText
                });
                then.apply(void 0, [match, isTouchingWordEnd, isTouchingWordStart].concat(captures));
            }
        });
    };
    Tokenizer.prototype.closeMostRecentContextWithState = function (state) {
        var indexOfEnclosedNakedUrlContext = -1;
        for (var i = this.openContexts.length - 1; i >= 0; i--) {
            var context_2 = this.openContexts[i];
            if (context_2.state === state) {
                if (indexOfEnclosedNakedUrlContext != -1) {
                    this.flushUnmatchedTextToNakedUrl();
                    this.openContexts.splice(indexOfEnclosedNakedUrlContext, 1);
                }
                this.openContexts.splice(i, 1);
                return;
            }
            if (context_2.state === TokenizerState_1.TokenizerState.NakedUrl) {
                indexOfEnclosedNakedUrlContext = i;
            }
        }
        throw new Error("State was not open: " + TokenizerState_1.TokenizerState[state]);
    };
    Tokenizer.prototype.closeMostRecentContextWithStateAndAnyInnerContexts = function (state) {
        while (this.openContexts.length) {
            var context_3 = this.openContexts.pop();
            if (context_3.state === state) {
                return;
            }
        }
        throw new Error("State was not open: " + TokenizerState_1.TokenizerState[state]);
    };
    Tokenizer.prototype.getInnermostContextWithState = function (state) {
        for (var i = this.openContexts.length - 1; i >= 0; i--) {
            var context_4 = this.openContexts[i];
            if (context_4.state === state) {
                return context_4;
            }
        }
        throw new Error("State was not open: " + TokenizerState_1.TokenizerState[state]);
    };
    Tokenizer.prototype.closeInnermostContext = function () {
        if (!this.openContexts.length) {
            throw new Error("No open contexts");
        }
        this.openContexts.pop();
    };
    Tokenizer.prototype.addTokenAfterFlushingBufferToPlainTextToken = function (token) {
        this.flushBufferToPlainTextToken();
        this.addToken(token);
    };
    Tokenizer.prototype.hasState = function (state) {
        return this.openContexts.some(function (context) { return context.state === state; });
    };
    Tokenizer.prototype.advanceAfterMatch = function (args) {
        var pattern = args.pattern, then = args.then;
        var result = pattern.exec(this.remainingText);
        if (!result) {
            return false;
        }
        var match = result[0], captures = result.slice(1);
        var charAfterMatch = this.entireText[this.textIndex + match.length];
        var isTouchingWordStart = NON_WHITESPACE_CHAR_PATTERN.test(charAfterMatch);
        if (then) {
            then.apply(void 0, [match, this.isTouchingWordEnd, isTouchingWordStart].concat(captures));
        }
        this.advance(match.length);
        return true;
    };
    Tokenizer.prototype.dirty = function () {
        this.remainingText = this.entireText.substr(this.textIndex);
        this.currentChar = this.remainingText[0];
        var previousChar = this.entireText[this.textIndex - 1];
        this.isTouchingWordEnd = NON_WHITESPACE_CHAR_PATTERN.test(previousChar);
    };
    Tokenizer.prototype.getRichSandwich = function (args) {
        var _this = this;
        var startPattern = args.startPattern, endPattern = args.endPattern, richConvention = args.richConvention;
        return new TokenizableSandwich_1.TokenizableSandwich({
            state: richConvention.tokenizerState,
            startPattern: startPattern,
            endPattern: endPattern,
            onOpen: function () { return _this.addTokenAfterFlushingBufferToPlainTextToken(new richConvention.StartTokenType()); },
            onClose: function () { return _this.addTokenAfterFlushingBufferToPlainTextToken(new richConvention.EndTokenType()); }
        });
    };
    Tokenizer.prototype.getBracketInsideUrlConvention = function (args) {
        var _this = this;
        var bufferBracket = function (bracket) {
            _this.bufferedText += bracket;
        };
        return new TokenizableSandwich_1.TokenizableSandwich({
            state: args.state,
            startPattern: args.openBracketPattern,
            endPattern: args.closeBracketPattern,
            onOpen: bufferBracket,
            onClose: bufferBracket
        });
    };
    Tokenizer.prototype.tokenizeRaisedVoicePlaceholders = function () {
        var _this = this;
        return this.advanceAfterMatch({
            pattern: RAISED_VOICE_DELIMITER_PATTERN,
            then: function (asterisks, isTouchingWordEnd, isTouchingWordStart) {
                var canCloseConvention = isTouchingWordEnd;
                var canOpenConvention = isTouchingWordStart;
                var AsteriskTokenType;
                if (canOpenConvention && canCloseConvention) {
                    AsteriskTokenType = PotentialRaisedVoiceStartOrEndToken_1.PotentialRaisedVoiceStartOrEndToken;
                }
                else if (canOpenConvention) {
                    AsteriskTokenType = PotentialRaisedVoiceStartToken_1.PotentialRaisedVoiceStartToken;
                }
                else if (canCloseConvention) {
                    AsteriskTokenType = PotentialRaisedVoiceEndToken_1.PotentialRaisedVoiceEndToken;
                }
                else {
                    AsteriskTokenType = PlainTextToken_1.PlainTextToken;
                }
                _this.addTokenAfterFlushingBufferToPlainTextToken(new AsteriskTokenType(asterisks));
            }
        });
    };
    Tokenizer.prototype.configureConventions = function (config) {
        var _this = this;
        this.mediaConventions =
            [MediaConventions_1.AUDIO, MediaConventions_1.IMAGE, MediaConventions_1.VIDEO]
                .map(function (media) {
                return new TokenizableMedia_1.TokenizableMedia(media, config.localizeTerm(media.nonLocalizedTerm));
            });
        this.footnoteConvention =
            this.getRichSandwich({
                richConvention: RichConventions_1.FOOTNOTE,
                startPattern: Patterns_1.ANY_WHITESPACE + Patterns_1.escapeForRegex('(('),
                endPattern: Patterns_1.escapeForRegex('))')
            });
        this.spoilerConvention =
            this.getRichSandwich({
                richConvention: RichConventions_1.SPOILER,
                startPattern: Patterns_1.OPEN_SQUARE_BRACKET + Patterns_1.escapeForRegex(config.settings.i18n.terms.spoiler) + ':' + Patterns_1.ANY_WHITESPACE,
                endPattern: Patterns_1.CLOSE_SQUARE_BRACKET
            });
        this.revisionDeletionConvention =
            this.getRichSandwich({
                richConvention: RichConventions_1.REVISION_DELETION,
                startPattern: '~~',
                endPattern: '~~'
            });
        this.revisionInsertionConvention =
            this.getRichSandwich({
                richConvention: RichConventions_1.REVISION_INSERTION,
                startPattern: Patterns_1.escapeForRegex('++'),
                endPattern: Patterns_1.escapeForRegex('++')
            });
        this.parenthesizedConvention =
            this.getRichSandwich({
                richConvention: RichConventions_1.PARENTHESIZED,
                startPattern: Patterns_1.OPEN_PAREN,
                endPattern: Patterns_1.CLOSE_PAREN,
            });
        this.squareBracketedConvention =
            this.getRichSandwich({
                richConvention: RichConventions_1.SQUARE_BRACKETED,
                startPattern: Patterns_1.OPEN_SQUARE_BRACKET,
                endPattern: Patterns_1.CLOSE_SQUARE_BRACKET,
            });
        this.parenthesizedInsideUrlConvention =
            this.getBracketInsideUrlConvention({
                state: TokenizerState_1.TokenizerState.ParenthesizedInsideUrl,
                openBracketPattern: Patterns_1.OPEN_PAREN,
                closeBracketPattern: Patterns_1.CLOSE_PAREN
            });
        this.squareBracketedInsideUrlConvention =
            this.getBracketInsideUrlConvention({
                state: TokenizerState_1.TokenizerState.SquareBracketedInsideUrl,
                openBracketPattern: Patterns_1.OPEN_SQUARE_BRACKET,
                closeBracketPattern: Patterns_1.CLOSE_SQUARE_BRACKET
            });
        this.inlineCodeConvention =
            new TokenizableSandwich_1.TokenizableSandwich({
                state: TokenizerState_1.TokenizerState.InlineCode,
                startPattern: '`',
                endPattern: '`',
                onOpen: function () { return _this.flushBufferToPlainTextToken(); },
                onClose: function () { return _this.addToken(new InlineCodeToken_1.InlineCodeToken(_this.flushBufferedText())); }
            });
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
var RAISED_VOICE_DELIMITER_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.atLeast(1, Patterns_1.escapeForRegex('*'))));
var LINK_START_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.OPEN_SQUARE_BRACKET));
var LINK_AND_MEDIA_URL_ARROW_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.ANY_WHITESPACE + '->' + Patterns_1.ANY_WHITESPACE));
var LINK_END_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.CLOSE_SQUARE_BRACKET));
var NAKED_URL_START_PATTERN = new RegExp(Patterns_1.startsWith('http' + Patterns_1.optional('s') + '://'));
var WHITESPACE_CHAR_PATTERN = new RegExp(Patterns_1.WHITESPACE_CHAR);
var NON_WHITESPACE_CHAR_PATTERN = new RegExp(Patterns_1.NON_WHITESPACE_CHAR);

},{"../../CollectionHelpers":1,"../Patterns":62,"./FailedStateTracker":3,"./MediaConventions":5,"./RaisedVoices/applyRaisedVoices":10,"./RichConventions":11,"./TokenizableMedia":12,"./TokenizableSandwich":13,"./TokenizerState":15,"./Tokens/InlineCodeToken":22,"./Tokens/NakedUrlToken":26,"./Tokens/PlainTextToken":29,"./Tokens/PotentialRaisedVoiceEndToken":30,"./Tokens/PotentialRaisedVoiceStartOrEndToken":31,"./Tokens/PotentialRaisedVoiceStartToken":32,"./nestOverlappingConventions":46}],15:[function(require,module,exports){
"use strict";
(function (TokenizerState) {
    TokenizerState[TokenizerState["InlineCode"] = 0] = "InlineCode";
    TokenizerState[TokenizerState["Footnote"] = 1] = "Footnote";
    TokenizerState[TokenizerState["Spoiler"] = 2] = "Spoiler";
    TokenizerState[TokenizerState["Parenthesized"] = 3] = "Parenthesized";
    TokenizerState[TokenizerState["SquareBracketed"] = 4] = "SquareBracketed";
    TokenizerState[TokenizerState["ParenthesizedInsideUrl"] = 5] = "ParenthesizedInsideUrl";
    TokenizerState[TokenizerState["SquareBracketedInsideUrl"] = 6] = "SquareBracketedInsideUrl";
    TokenizerState[TokenizerState["Link"] = 7] = "Link";
    TokenizerState[TokenizerState["LinkUrl"] = 8] = "LinkUrl";
    TokenizerState[TokenizerState["RevisionInsertion"] = 9] = "RevisionInsertion";
    TokenizerState[TokenizerState["RevisionDeletion"] = 10] = "RevisionDeletion";
    TokenizerState[TokenizerState["Audio"] = 11] = "Audio";
    TokenizerState[TokenizerState["Image"] = 12] = "Image";
    TokenizerState[TokenizerState["Video"] = 13] = "Video";
    TokenizerState[TokenizerState["MediaUrl"] = 14] = "MediaUrl";
    TokenizerState[TokenizerState["NakedUrl"] = 15] = "NakedUrl";
})(exports.TokenizerState || (exports.TokenizerState = {}));
var TokenizerState = exports.TokenizerState;

},{}],16:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MediaToken_1 = require('./MediaToken');
var AudioToken = (function (_super) {
    __extends(AudioToken, _super);
    function AudioToken() {
        _super.apply(this, arguments);
    }
    return AudioToken;
}(MediaToken_1.MediaToken));
exports.AudioToken = AudioToken;

},{"./MediaToken":25}],17:[function(require,module,exports){
"use strict";
var EmphasisEndToken = (function () {
    function EmphasisEndToken() {
    }
    EmphasisEndToken.prototype.token = function () { };
    return EmphasisEndToken;
}());
exports.EmphasisEndToken = EmphasisEndToken;

},{}],18:[function(require,module,exports){
"use strict";
var EmphasisStartToken = (function () {
    function EmphasisStartToken() {
    }
    EmphasisStartToken.prototype.token = function () { };
    return EmphasisStartToken;
}());
exports.EmphasisStartToken = EmphasisStartToken;

},{}],19:[function(require,module,exports){
"use strict";
var FootnoteEndToken = (function () {
    function FootnoteEndToken() {
    }
    FootnoteEndToken.prototype.token = function () { };
    return FootnoteEndToken;
}());
exports.FootnoteEndToken = FootnoteEndToken;

},{}],20:[function(require,module,exports){
"use strict";
var FootnoteStartToken = (function () {
    function FootnoteStartToken() {
    }
    FootnoteStartToken.prototype.token = function () { };
    return FootnoteStartToken;
}());
exports.FootnoteStartToken = FootnoteStartToken;

},{}],21:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MediaToken_1 = require('./MediaToken');
var ImageToken = (function (_super) {
    __extends(ImageToken, _super);
    function ImageToken() {
        _super.apply(this, arguments);
    }
    return ImageToken;
}(MediaToken_1.MediaToken));
exports.ImageToken = ImageToken;

},{"./MediaToken":25}],22:[function(require,module,exports){
"use strict";
var InlineCodeToken = (function () {
    function InlineCodeToken(code) {
        this.code = code;
    }
    InlineCodeToken.prototype.token = function () { };
    return InlineCodeToken;
}());
exports.InlineCodeToken = InlineCodeToken;

},{}],23:[function(require,module,exports){
"use strict";
var LinkEndToken = (function () {
    function LinkEndToken(url) {
        this.url = url;
    }
    LinkEndToken.prototype.token = function () { };
    return LinkEndToken;
}());
exports.LinkEndToken = LinkEndToken;

},{}],24:[function(require,module,exports){
"use strict";
var LinkStartToken = (function () {
    function LinkStartToken() {
    }
    LinkStartToken.prototype.token = function () { };
    return LinkStartToken;
}());
exports.LinkStartToken = LinkStartToken;

},{}],25:[function(require,module,exports){
"use strict";
var MediaToken = (function () {
    function MediaToken(description, url) {
        this.description = description;
        this.url = url;
    }
    MediaToken.prototype.token = function () { };
    return MediaToken;
}());
exports.MediaToken = MediaToken;

},{}],26:[function(require,module,exports){
"use strict";
var NakedUrlToken = (function () {
    function NakedUrlToken(protocol) {
        this.protocol = protocol;
        this.restOfUrl = '';
    }
    NakedUrlToken.prototype.token = function () { };
    NakedUrlToken.prototype.url = function () {
        return this.protocol + this.restOfUrl;
    };
    return NakedUrlToken;
}());
exports.NakedUrlToken = NakedUrlToken;

},{}],27:[function(require,module,exports){
"use strict";
var ParenthesizedEndToken = (function () {
    function ParenthesizedEndToken() {
    }
    ParenthesizedEndToken.prototype.token = function () { };
    return ParenthesizedEndToken;
}());
exports.ParenthesizedEndToken = ParenthesizedEndToken;

},{}],28:[function(require,module,exports){
"use strict";
var ParenthesizedStartToken = (function () {
    function ParenthesizedStartToken() {
    }
    ParenthesizedStartToken.prototype.token = function () { };
    return ParenthesizedStartToken;
}());
exports.ParenthesizedStartToken = ParenthesizedStartToken;

},{}],29:[function(require,module,exports){
"use strict";
var PlainTextToken = (function () {
    function PlainTextToken(text) {
        this.text = text;
    }
    PlainTextToken.prototype.token = function () { };
    return PlainTextToken;
}());
exports.PlainTextToken = PlainTextToken;

},{}],30:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PotentialRaisedVoiceToken_1 = require('./PotentialRaisedVoiceToken');
var PotentialRaisedVoiceEndToken = (function (_super) {
    __extends(PotentialRaisedVoiceEndToken, _super);
    function PotentialRaisedVoiceEndToken() {
        _super.apply(this, arguments);
    }
    return PotentialRaisedVoiceEndToken;
}(PotentialRaisedVoiceToken_1.PotentialRaisedVoiceToken));
exports.PotentialRaisedVoiceEndToken = PotentialRaisedVoiceEndToken;

},{"./PotentialRaisedVoiceToken":33}],31:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PotentialRaisedVoiceToken_1 = require('./PotentialRaisedVoiceToken');
var PotentialRaisedVoiceStartOrEndToken = (function (_super) {
    __extends(PotentialRaisedVoiceStartOrEndToken, _super);
    function PotentialRaisedVoiceStartOrEndToken() {
        _super.apply(this, arguments);
    }
    return PotentialRaisedVoiceStartOrEndToken;
}(PotentialRaisedVoiceToken_1.PotentialRaisedVoiceToken));
exports.PotentialRaisedVoiceStartOrEndToken = PotentialRaisedVoiceStartOrEndToken;

},{"./PotentialRaisedVoiceToken":33}],32:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PotentialRaisedVoiceToken_1 = require('./PotentialRaisedVoiceToken');
var PotentialRaisedVoiceStartToken = (function (_super) {
    __extends(PotentialRaisedVoiceStartToken, _super);
    function PotentialRaisedVoiceStartToken() {
        _super.apply(this, arguments);
    }
    return PotentialRaisedVoiceStartToken;
}(PotentialRaisedVoiceToken_1.PotentialRaisedVoiceToken));
exports.PotentialRaisedVoiceStartToken = PotentialRaisedVoiceStartToken;

},{"./PotentialRaisedVoiceToken":33}],33:[function(require,module,exports){
"use strict";
var PotentialRaisedVoiceToken = (function () {
    function PotentialRaisedVoiceToken(asterisks) {
        this.asterisks = asterisks;
    }
    PotentialRaisedVoiceToken.prototype.token = function () { };
    return PotentialRaisedVoiceToken;
}());
exports.PotentialRaisedVoiceToken = PotentialRaisedVoiceToken;

},{}],34:[function(require,module,exports){
"use strict";
var RevisionDeletionEndToken = (function () {
    function RevisionDeletionEndToken() {
    }
    RevisionDeletionEndToken.prototype.token = function () { };
    return RevisionDeletionEndToken;
}());
exports.RevisionDeletionEndToken = RevisionDeletionEndToken;

},{}],35:[function(require,module,exports){
"use strict";
var RevisionDeletionStartToken = (function () {
    function RevisionDeletionStartToken() {
    }
    RevisionDeletionStartToken.prototype.token = function () { };
    return RevisionDeletionStartToken;
}());
exports.RevisionDeletionStartToken = RevisionDeletionStartToken;

},{}],36:[function(require,module,exports){
"use strict";
var RevisionInsertionEndToken = (function () {
    function RevisionInsertionEndToken() {
    }
    RevisionInsertionEndToken.prototype.token = function () { };
    return RevisionInsertionEndToken;
}());
exports.RevisionInsertionEndToken = RevisionInsertionEndToken;

},{}],37:[function(require,module,exports){
"use strict";
var RevisionInsertionStartToken = (function () {
    function RevisionInsertionStartToken() {
    }
    RevisionInsertionStartToken.prototype.token = function () { };
    return RevisionInsertionStartToken;
}());
exports.RevisionInsertionStartToken = RevisionInsertionStartToken;

},{}],38:[function(require,module,exports){
"use strict";
var SpoilerEndToken = (function () {
    function SpoilerEndToken() {
    }
    SpoilerEndToken.prototype.token = function () { };
    return SpoilerEndToken;
}());
exports.SpoilerEndToken = SpoilerEndToken;

},{}],39:[function(require,module,exports){
"use strict";
var SpoilerStartToken = (function () {
    function SpoilerStartToken() {
    }
    SpoilerStartToken.prototype.token = function () { };
    return SpoilerStartToken;
}());
exports.SpoilerStartToken = SpoilerStartToken;

},{}],40:[function(require,module,exports){
"use strict";
var SquareBracketedEndToken = (function () {
    function SquareBracketedEndToken() {
    }
    SquareBracketedEndToken.prototype.token = function () { };
    return SquareBracketedEndToken;
}());
exports.SquareBracketedEndToken = SquareBracketedEndToken;

},{}],41:[function(require,module,exports){
"use strict";
var SquareBracketedStartToken = (function () {
    function SquareBracketedStartToken() {
    }
    SquareBracketedStartToken.prototype.token = function () { };
    return SquareBracketedStartToken;
}());
exports.SquareBracketedStartToken = SquareBracketedStartToken;

},{}],42:[function(require,module,exports){
"use strict";
var StressEndToken = (function () {
    function StressEndToken() {
    }
    StressEndToken.prototype.token = function () { };
    return StressEndToken;
}());
exports.StressEndToken = StressEndToken;

},{}],43:[function(require,module,exports){
"use strict";
var StressStartToken = (function () {
    function StressStartToken() {
    }
    StressStartToken.prototype.token = function () { };
    return StressStartToken;
}());
exports.StressStartToken = StressStartToken;

},{}],44:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MediaToken_1 = require('./MediaToken');
var VideoToken = (function (_super) {
    __extends(VideoToken, _super);
    function VideoToken() {
        _super.apply(this, arguments);
    }
    return VideoToken;
}(MediaToken_1.MediaToken));
exports.VideoToken = VideoToken;

},{"./MediaToken":25}],45:[function(require,module,exports){
"use strict";
var Tokenizer_1 = require('./Tokenizer');
var parse_1 = require('./parse');
function getInlineNodes(text, config) {
    return parse_1.parse({
        tokens: new Tokenizer_1.Tokenizer(text, config).tokens
    }).nodes;
}
exports.getInlineNodes = getInlineNodes;

},{"./Tokenizer":14,"./parse":47}],46:[function(require,module,exports){
"use strict";
var RichConventions_1 = require('./RichConventions');
function nestOverlappingConventions(tokens) {
    return new ConventionNester(tokens.slice()).tokens;
}
exports.nestOverlappingConventions = nestOverlappingConventions;
var FREELY_SPLITTABLE_CONVENTIONS = [
    RichConventions_1.REVISION_DELETION,
    RichConventions_1.REVISION_INSERTION,
    RichConventions_1.STRESS,
    RichConventions_1.EMPHASIS
];
var CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT = [
    RichConventions_1.LINK,
    RichConventions_1.SPOILER,
    RichConventions_1.FOOTNOTE
];
var ConventionNester = (function () {
    function ConventionNester(tokens) {
        this.tokens = tokens;
        this.splitConventionsThatStartInsideAnotherConventionAndEndAfter(FREELY_SPLITTABLE_CONVENTIONS);
        var conventionsToSplit = FREELY_SPLITTABLE_CONVENTIONS;
        for (var _i = 0, CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT_1 = CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT; _i < CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT_1.length; _i++) {
            var conventionNotToSplit = CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT_1[_i];
            this.resolveOverlapping(conventionsToSplit, conventionNotToSplit);
            conventionsToSplit.push(conventionNotToSplit);
        }
    }
    ConventionNester.prototype.splitConventionsThatStartInsideAnotherConventionAndEndAfter = function (conventions) {
        var unclosedConventions = [];
        for (var tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
            var token = this.tokens[tokenIndex];
            var conventionStartedByThisToken = getConventionStartedByThisToken(token, conventions);
            if (conventionStartedByThisToken) {
                unclosedConventions.push(conventionStartedByThisToken);
                continue;
            }
            var conventionEndedByThisToken = getConventionEndedBy(token, conventions);
            if (!conventionEndedByThisToken) {
                continue;
            }
            var overlappingFromMostRecentToLeast = [];
            for (var conventionIndex = unclosedConventions.length - 1; conventionIndex >= 0; conventionIndex--) {
                var unclosedConvention = unclosedConventions[conventionIndex];
                if (unclosedConvention === conventionEndedByThisToken) {
                    unclosedConventions.splice(conventionIndex, 1);
                    break;
                }
                overlappingFromMostRecentToLeast.push(unclosedConvention);
            }
            this.closeAndReopenConventionsAroundTokenAtIndex(tokenIndex, overlappingFromMostRecentToLeast);
            var countOverlapping = overlappingFromMostRecentToLeast.length;
            tokenIndex += (2 * countOverlapping);
        }
    };
    ConventionNester.prototype.resolveOverlapping = function (conventionsToSplit, conventionNotToSplit) {
        for (var tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
            if (!(this.tokens[tokenIndex] instanceof conventionNotToSplit.StartTokenType)) {
                continue;
            }
            var heroStartIndex = tokenIndex;
            var heroEndIndex = void 0;
            for (var i = heroStartIndex + 1; i < this.tokens.length; i++) {
                if (this.tokens[i] instanceof conventionNotToSplit.EndTokenType) {
                    heroEndIndex = i;
                    break;
                }
            }
            var overlappingStartingBefore = [];
            var overlappingStartingInside = [];
            for (var indexInsideHero = heroStartIndex + 1; indexInsideHero < heroEndIndex; indexInsideHero++) {
                var token = this.tokens[indexInsideHero];
                var conventionStartedByThisToken = getConventionStartedByThisToken(token, conventionsToSplit);
                if (conventionStartedByThisToken) {
                    overlappingStartingInside.push(conventionStartedByThisToken);
                    continue;
                }
                var conventionEndedByThisToken = getConventionEndedBy(token, conventionsToSplit);
                if (conventionEndedByThisToken) {
                    if (overlappingStartingInside.length) {
                        overlappingStartingInside.pop();
                        continue;
                    }
                    overlappingStartingBefore.push(conventionEndedByThisToken);
                }
            }
            this.closeAndReopenConventionsAroundTokenAtIndex(heroEndIndex, overlappingStartingInside);
            this.closeAndReopenConventionsAroundTokenAtIndex(heroStartIndex, overlappingStartingBefore);
            var countTokensAdded = (2 * overlappingStartingBefore.length) + (2 * overlappingStartingInside.length);
            tokenIndex = heroEndIndex + countTokensAdded;
        }
    };
    ConventionNester.prototype.closeAndReopenConventionsAroundTokenAtIndex = function (index, conventionsInTheOrderTheyShouldClose) {
        var startTokensToAdd = conventionsInTheOrderTheyShouldClose
            .map(function (convention) { return new convention.StartTokenType(); })
            .reverse();
        var endTokensToAdd = conventionsInTheOrderTheyShouldClose
            .map(function (convention) { return new convention.EndTokenType(); });
        this.insertTokens(index + 1, startTokensToAdd);
        this.insertTokens(index, endTokensToAdd);
    };
    ConventionNester.prototype.insertTokens = function (index, tokens) {
        (_a = this.tokens).splice.apply(_a, [index, 0].concat(tokens));
        var _a;
    };
    return ConventionNester;
}());
function getConventionStartedByThisToken(token, conventions) {
    return conventions.filter(function (convention) {
        return token instanceof convention.StartTokenType;
    })[0];
}
function getConventionEndedBy(token, conventions) {
    return conventions.filter(function (convention) {
        return token instanceof convention.EndTokenType;
    })[0];
}

},{"./RichConventions":11}],47:[function(require,module,exports){
"use strict";
var PlainTextNode_1 = require('../../SyntaxNodes/PlainTextNode');
var isWhitespace_1 = require('../../SyntaxNodes/isWhitespace');
var CollectionHelpers_1 = require('../../CollectionHelpers');
var ParenthesizedStartToken_1 = require('./Tokens/ParenthesizedStartToken');
var ParenthesizedEndToken_1 = require('./Tokens/ParenthesizedEndToken');
var SquareBracketedStartToken_1 = require('./Tokens/SquareBracketedStartToken');
var SquareBracketedEndToken_1 = require('./Tokens/SquareBracketedEndToken');
var InlineCodeToken_1 = require('./Tokens/InlineCodeToken');
var LinkStartToken_1 = require('./Tokens/LinkStartToken');
var LinkEndToken_1 = require('./Tokens/LinkEndToken');
var PlainTextToken_1 = require('./Tokens/PlainTextToken');
var NakedUrlToken_1 = require('./Tokens/NakedUrlToken');
var InlineCodeNode_1 = require('../../SyntaxNodes/InlineCodeNode');
var LinkNode_1 = require('../../SyntaxNodes/LinkNode');
var SquareBracketedNode_1 = require('../../SyntaxNodes/SquareBracketedNode');
var MediaConventions_1 = require('./MediaConventions');
var RichConventions_1 = require('./RichConventions');
var RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES = [
    RichConventions_1.STRESS,
    RichConventions_1.EMPHASIS,
    RichConventions_1.REVISION_DELETION,
    RichConventions_1.REVISION_INSERTION,
    RichConventions_1.SPOILER,
    RichConventions_1.FOOTNOTE
];
var MEDIA_CONVENTIONS = [
    MediaConventions_1.AUDIO,
    MediaConventions_1.IMAGE,
    MediaConventions_1.VIDEO
];
function parse(args) {
    var tokens = args.tokens, UntilTokenType = args.UntilTokenType, isTerminatorOptional = args.isTerminatorOptional;
    var nodes = [];
    var countTokensParsed = 0;
    LoopTokens: for (var tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
        var token = tokens[tokenIndex];
        countTokensParsed = tokenIndex + 1;
        if (UntilTokenType && token instanceof UntilTokenType) {
            return {
                countTokensParsed: countTokensParsed,
                nodes: combineConsecutivePlainTextNodes(nodes),
                isMissingTerminator: false
            };
        }
        if (token instanceof PlainTextToken_1.PlainTextToken) {
            if (!token.text) {
                continue;
            }
            nodes.push(new PlainTextNode_1.PlainTextNode(token.text));
            continue;
        }
        if (token instanceof ParenthesizedStartToken_1.ParenthesizedStartToken) {
            var result = parse({
                tokens: tokens.slice(countTokensParsed),
                UntilTokenType: ParenthesizedEndToken_1.ParenthesizedEndToken,
                isTerminatorOptional: true
            });
            tokenIndex += result.countTokensParsed;
            var resultNodes = (_a = [new PlainTextNode_1.PlainTextNode('(')]).concat.apply(_a, result.nodes);
            if (result.isMissingTerminator) {
                nodes.push.apply(nodes, resultNodes);
                continue;
            }
            resultNodes.push(new PlainTextNode_1.PlainTextNode(')'));
            nodes.push(new SquareBracketedNode_1.SquareBracketedNode(resultNodes));
            continue;
        }
        if (token instanceof SquareBracketedStartToken_1.SquareBracketedStartToken) {
            var result = parse({
                tokens: tokens.slice(countTokensParsed),
                UntilTokenType: SquareBracketedEndToken_1.SquareBracketedEndToken,
                isTerminatorOptional: true
            });
            tokenIndex += result.countTokensParsed;
            var resultNodes = (_b = [new PlainTextNode_1.PlainTextNode('[')]).concat.apply(_b, result.nodes);
            if (result.isMissingTerminator) {
                nodes.push.apply(nodes, resultNodes);
                continue;
            }
            resultNodes.push(new PlainTextNode_1.PlainTextNode(']'));
            nodes.push(new SquareBracketedNode_1.SquareBracketedNode(resultNodes));
            continue;
        }
        if (token instanceof InlineCodeToken_1.InlineCodeToken) {
            if (token.code) {
                nodes.push(new InlineCodeNode_1.InlineCodeNode(token.code));
            }
            continue;
        }
        if (token instanceof NakedUrlToken_1.NakedUrlToken) {
            var content = [new PlainTextNode_1.PlainTextNode(token.restOfUrl)];
            nodes.push(new LinkNode_1.LinkNode(content, token.url()));
            continue;
        }
        if (token instanceof LinkStartToken_1.LinkStartToken) {
            var result = parse({
                tokens: tokens.slice(countTokensParsed),
                UntilTokenType: LinkEndToken_1.LinkEndToken
            });
            tokenIndex += result.countTokensParsed;
            var contents = result.nodes;
            var hasContents = isNotPureWhitespace(contents);
            var linkEndToken = tokens[tokenIndex];
            var url = linkEndToken.url.trim();
            var hasUrl = !!url;
            if (!hasContents && !hasUrl) {
                continue;
            }
            if (hasContents && !hasUrl) {
                nodes.push.apply(nodes, contents);
                continue;
            }
            if (!hasContents && hasUrl) {
                contents = [new PlainTextNode_1.PlainTextNode(url)];
            }
            nodes.push(new LinkNode_1.LinkNode(contents, url));
            continue;
        }
        for (var _i = 0, MEDIA_CONVENTIONS_1 = MEDIA_CONVENTIONS; _i < MEDIA_CONVENTIONS_1.length; _i++) {
            var media = MEDIA_CONVENTIONS_1[_i];
            if (token instanceof media.TokenType) {
                var description = token.description.trim();
                var url = token.url.trim();
                if (!url) {
                    continue LoopTokens;
                }
                if (!description) {
                    description = url;
                }
                nodes.push(new media.NodeType(description, url));
                continue LoopTokens;
            }
        }
        for (var _c = 0, RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES_1 = RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES; _c < RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES_1.length; _c++) {
            var richConvention = RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES_1[_c];
            if (token instanceof richConvention.StartTokenType) {
                var result = parse({
                    tokens: tokens.slice(countTokensParsed),
                    UntilTokenType: richConvention.EndTokenType
                });
                tokenIndex += result.countTokensParsed;
                if (result.nodes.length) {
                    nodes.push(new richConvention.NodeType(result.nodes));
                }
                continue LoopTokens;
            }
        }
    }
    var wasTerminatorSpecified = !!UntilTokenType;
    if (!isTerminatorOptional && wasTerminatorSpecified) {
        throw new Error("Missing terminator token: " + UntilTokenType);
    }
    return {
        countTokensParsed: countTokensParsed,
        nodes: combineConsecutivePlainTextNodes(nodes),
        isMissingTerminator: wasTerminatorSpecified
    };
    var _a, _b;
}
exports.parse = parse;
function isNotPureWhitespace(nodes) {
    return !nodes.every(isWhitespace_1.isWhitespace);
}
function combineConsecutivePlainTextNodes(nodes) {
    var resultNodes = [];
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        var lastNode = CollectionHelpers_1.last(resultNodes);
        if ((node instanceof PlainTextNode_1.PlainTextNode) && (lastNode instanceof PlainTextNode_1.PlainTextNode)) {
            lastNode.text += node.text;
            continue;
        }
        resultNodes.push(node);
    }
    return resultNodes;
}

},{"../../CollectionHelpers":1,"../../SyntaxNodes/InlineCodeNode":79,"../../SyntaxNodes/LinkNode":83,"../../SyntaxNodes/PlainTextNode":90,"../../SyntaxNodes/SquareBracketedNode":96,"../../SyntaxNodes/isWhitespace":101,"./MediaConventions":5,"./RichConventions":11,"./Tokens/InlineCodeToken":22,"./Tokens/LinkEndToken":23,"./Tokens/LinkStartToken":24,"./Tokens/NakedUrlToken":26,"./Tokens/ParenthesizedEndToken":27,"./Tokens/ParenthesizedStartToken":28,"./Tokens/PlainTextToken":29,"./Tokens/SquareBracketedEndToken":40,"./Tokens/SquareBracketedStartToken":41}],48:[function(require,module,exports){
"use strict";
var StringHelpers_1 = require('../../StringHelpers');
var HeadingLeveler = (function () {
    function HeadingLeveler() {
        this.registeredUnderlineChars = [];
    }
    HeadingLeveler.prototype.registerUnderlineAndGetLevel = function (underline) {
        var underlineChars = StringHelpers_1.getDistinctTrimmedChars(underline);
        var isAlreadyRegistered = this.registeredUnderlineChars.some(function (registered) { return registered === underlineChars; });
        if (!isAlreadyRegistered) {
            this.registeredUnderlineChars.push(underlineChars);
        }
        return this.getLevel(underlineChars);
    };
    HeadingLeveler.prototype.getLevel = function (underlineChars) {
        return this.registeredUnderlineChars.indexOf(underlineChars) + 1;
    };
    return HeadingLeveler;
}());
exports.HeadingLeveler = HeadingLeveler;

},{"../../StringHelpers":65}],49:[function(require,module,exports){
"use strict";
var LineConsumer = (function () {
    function LineConsumer(text) {
        this.text = text;
        this.index = 0;
        this.dirty();
    }
    LineConsumer.prototype.advance = function (countCharacters) {
        this.index += countCharacters;
        this.dirty();
    };
    LineConsumer.prototype.done = function () {
        return this.index >= this.text.length;
    };
    LineConsumer.prototype.lengthConsumed = function () {
        return this.index;
    };
    LineConsumer.prototype.remainingText = function () {
        return this._remainingText;
    };
    LineConsumer.prototype.consumeLine = function (args) {
        if (this.done()) {
            return false;
        }
        var fullLine;
        var lineWithoutTerminatingLineBreak;
        for (var i = this.index; i < this.text.length; i++) {
            var char = this.text[i];
            if (char === '\\') {
                i++;
                continue;
            }
            if (char === '\n') {
                fullLine = this.text.substring(this.index, i + 1);
                lineWithoutTerminatingLineBreak = fullLine.slice(0, -1);
                break;
            }
        }
        if (!fullLine) {
            fullLine = lineWithoutTerminatingLineBreak = this.remainingText();
        }
        var captures = [];
        if (args.pattern) {
            var results = args.pattern.exec(lineWithoutTerminatingLineBreak);
            if (!results) {
                return false;
            }
            captures = results.slice(1);
        }
        if (args.if && !args.if.apply(args, [lineWithoutTerminatingLineBreak].concat(captures))) {
            return false;
        }
        this.advance(fullLine.length);
        if (args.then) {
            args.then.apply(args, [lineWithoutTerminatingLineBreak].concat(captures));
        }
        return true;
    };
    LineConsumer.prototype.dirty = function () {
        this._remainingText = this.text.slice(this.index);
    };
    return LineConsumer;
}());
exports.LineConsumer = LineConsumer;

},{}],50:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var HeadingNode_1 = require('../../SyntaxNodes/HeadingNode');
var Patterns_1 = require('../Patterns');
var getInlineNodes_1 = require('../Inline/getInlineNodes');
var isLineFancyOutlineConvention_1 = require('./isLineFancyOutlineConvention');
var StringHelpers_1 = require('../../StringHelpers');
function getHeadingParser(headingLeveler) {
    return function parseHeading(args) {
        var consumer = new LineConsumer_1.LineConsumer(args.text);
        var optionalOverline;
        consumer.consumeLine({
            pattern: STREAK_PATTERN,
            then: function (line) { optionalOverline = line; }
        });
        var content;
        var underline;
        var hasContentAndUnderline = (consumer.consumeLine({
            pattern: NON_BLANK_PATTERN,
            then: function (line) { content = line; }
        })
            && consumer.consumeLine({
                if: function (line) { return (STREAK_PATTERN.test(line)
                    && isUnderlineConsistentWithOverline(optionalOverline, line)); },
                then: function (line) { underline = line; }
            }));
        if (!hasContentAndUnderline) {
            return false;
        }
        if (isLineFancyOutlineConvention_1.isLineFancyOutlineConvention(content, args.config)) {
            return false;
        }
        var headingLevel = headingLeveler.registerUnderlineAndGetLevel(underline);
        args.then([new HeadingNode_1.HeadingNode(getInlineNodes_1.getInlineNodes(content, args.config), headingLevel)], consumer.lengthConsumed());
        return true;
    };
}
exports.getHeadingParser = getHeadingParser;
function isUnderlineConsistentWithOverline(overline, underline) {
    return !overline || (StringHelpers_1.getDistinctTrimmedChars(overline) === StringHelpers_1.getDistinctTrimmedChars(underline));
}
var NON_BLANK_PATTERN = new RegExp(Patterns_1.NON_BLANK);
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);

},{"../../StringHelpers":65,"../../SyntaxNodes/HeadingNode":77,"../Inline/getInlineNodes":45,"../Patterns":62,"./LineConsumer":49,"./isLineFancyOutlineConvention":53}],51:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var SectionSeparatorNode_1 = require('../../SyntaxNodes/SectionSeparatorNode');
var parseSectionSeparatorStreak_1 = require('./parseSectionSeparatorStreak');
var getHeadingParser_1 = require('./getHeadingParser');
var parseBlankLineSeparation_1 = require('./parseBlankLineSeparation');
var parseRegularLines_1 = require('./parseRegularLines');
var parseCodeBlock_1 = require('./parseCodeBlock');
var parseBlockquote_1 = require('./parseBlockquote');
var parseUnorderedList_1 = require('./parseUnorderedList');
var parseOrderedList_1 = require('./parseOrderedList');
var parseDescriptionList_1 = require('./parseDescriptionList');
var Patterns_1 = require('../Patterns');
var CollectionHelpers_1 = require('../../CollectionHelpers');
function getOutlineNodes(text, headingLeveler, config) {
    var outlineParsers = [
        parseBlankLineSeparation_1.parseBlankLineSeparation,
        getHeadingParser_1.getHeadingParser(headingLeveler),
        parseUnorderedList_1.parseUnorderedList,
        parseOrderedList_1.parseOrderedList,
        parseSectionSeparatorStreak_1.parseSectionSeparatorStreak,
        parseCodeBlock_1.parseCodeBlock,
        parseBlockquote_1.parseBlockquote,
        parseDescriptionList_1.parseDescriptionList,
        parseRegularLines_1.parseRegularLines,
    ];
    var consumer = new LineConsumer_1.LineConsumer(trimOuterBlankLines(text));
    var nodes = [];
    while (!consumer.done()) {
        for (var _i = 0, outlineParsers_1 = outlineParsers; _i < outlineParsers_1.length; _i++) {
            var parseOutlineConvention = outlineParsers_1[_i];
            var wasConventionFound = parseOutlineConvention({
                text: consumer.remainingText(),
                headingLeveler: headingLeveler,
                config: config,
                then: function (newNodes, lengthParsed) {
                    nodes.push.apply(nodes, newNodes);
                    consumer.advance(lengthParsed);
                }
            });
            if (wasConventionFound) {
                break;
            }
        }
    }
    return condenseConsecutiveSectionSeparatorNodes(nodes);
}
exports.getOutlineNodes = getOutlineNodes;
function condenseConsecutiveSectionSeparatorNodes(nodes) {
    var resultNodes = [];
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        var isConsecutiveSectionSeparatorNode = (node instanceof SectionSeparatorNode_1.SectionSeparatorNode
            && CollectionHelpers_1.last(resultNodes) instanceof SectionSeparatorNode_1.SectionSeparatorNode);
        if (!isConsecutiveSectionSeparatorNode) {
            resultNodes.push(node);
        }
    }
    return resultNodes;
}
function trimOuterBlankLines(text) {
    return (text
        .replace(LEADING_BLANK_LINES_PATTERN, '')
        .replace(TRAILIN_BLANK_LINES_PATTERN, ''));
}
var LEADING_BLANK_LINES_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.ANY_WHITESPACE + Patterns_1.LINE_BREAK));
var TRAILIN_BLANK_LINES_PATTERN = new RegExp(Patterns_1.endsWith(Patterns_1.LINE_BREAK + Patterns_1.ANY_WHITESPACE));

},{"../../CollectionHelpers":1,"../../SyntaxNodes/SectionSeparatorNode":94,"../Patterns":62,"./LineConsumer":49,"./getHeadingParser":50,"./parseBlankLineSeparation":54,"./parseBlockquote":55,"./parseCodeBlock":56,"./parseDescriptionList":57,"./parseOrderedList":58,"./parseRegularLines":59,"./parseSectionSeparatorStreak":60,"./parseUnorderedList":61}],52:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var Patterns_1 = require('../Patterns');
function getRemainingLinesOfListItem(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var lines = [];
    var countLinesIncluded = 0;
    var lengthParsed = 0;
    while (!consumer.done()) {
        var wasLineBlank = consumer.consumeLine({
            pattern: BLANK_PATTERN,
            then: function (line) { return lines.push(line); }
        });
        if (wasLineBlank) {
            continue;
        }
        var wasLineIndented = consumer.consumeLine({
            pattern: INDENTED_PATTERN,
            then: function (line) { return lines.push(line); }
        });
        if (!wasLineIndented) {
            break;
        }
        countLinesIncluded = lines.length;
        lengthParsed = consumer.lengthConsumed();
    }
    if (!lines.length) {
        return false;
    }
    var countTrailingBlankLines = lines.length - countLinesIncluded;
    var shouldTerminateList = countTrailingBlankLines >= 2;
    if (!shouldTerminateList) {
        countLinesIncluded = lines.length;
        lengthParsed = consumer.lengthConsumed();
    }
    var resultLines = lines
        .slice(0, countLinesIncluded)
        .map(function (line) { return line.replace(INDENTED_PATTERN, ''); });
    args.then(resultLines, lengthParsed, shouldTerminateList);
    return true;
}
exports.getRemainingLinesOfListItem = getRemainingLinesOfListItem;
var BLANK_PATTERN = new RegExp(Patterns_1.BLANK);
var INDENTED_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.INDENT));

},{"../Patterns":62,"./LineConsumer":49}],53:[function(require,module,exports){
"use strict";
var parseSectionSeparatorStreak_1 = require('./parseSectionSeparatorStreak');
var parseBlockquote_1 = require('./parseBlockquote');
var parseUnorderedList_1 = require('./parseUnorderedList');
var parseOrderedList_1 = require('./parseOrderedList');
var HeadingLeveler_1 = require('./HeadingLeveler');
var OUTLINE_CONVENTIONS_POSSIBLY_ONE_LINE_LONG = [
    parseUnorderedList_1.parseUnorderedList,
    parseOrderedList_1.parseOrderedList,
    parseSectionSeparatorStreak_1.parseSectionSeparatorStreak,
    parseBlockquote_1.parseBlockquote
];
function isLineFancyOutlineConvention(line, config) {
    return OUTLINE_CONVENTIONS_POSSIBLY_ONE_LINE_LONG.some(function (parse) { return parse({
        text: line,
        headingLeveler: DUMMY_HEADING_LEVELER,
        config: config,
        then: function () { }
    }); });
}
exports.isLineFancyOutlineConvention = isLineFancyOutlineConvention;
var DUMMY_HEADING_LEVELER = new HeadingLeveler_1.HeadingLeveler();

},{"./HeadingLeveler":48,"./parseBlockquote":55,"./parseOrderedList":58,"./parseSectionSeparatorStreak":60,"./parseUnorderedList":61}],54:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var SectionSeparatorNode_1 = require('../../SyntaxNodes/SectionSeparatorNode');
var Patterns_1 = require('../Patterns');
function parseBlankLineSeparation(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var countBlankLines = 0;
    while (consumer.consumeLine({ pattern: BLANK_PATTERN })) {
        countBlankLines += 1;
    }
    if (!countBlankLines) {
        return false;
    }
    var COUNT_BLANK_LINES_IN_SECTION_SEPARATOR = 3;
    var nodes = (countBlankLines >= COUNT_BLANK_LINES_IN_SECTION_SEPARATOR
        ? [new SectionSeparatorNode_1.SectionSeparatorNode()]
        : []);
    args.then(nodes, consumer.lengthConsumed());
    return true;
}
exports.parseBlankLineSeparation = parseBlankLineSeparation;
var BLANK_PATTERN = new RegExp(Patterns_1.BLANK);

},{"../../SyntaxNodes/SectionSeparatorNode":94,"../Patterns":62,"./LineConsumer":49}],55:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var BlockquoteNode_1 = require('../../SyntaxNodes/BlockquoteNode');
var getOutlineNodes_1 = require('./getOutlineNodes');
var HeadingLeveler_1 = require('./HeadingLeveler');
var Patterns_1 = require('../Patterns');
function parseBlockquote(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var blockquoteLines = [];
    while (consumer.consumeLine({
        pattern: ALL_BLOCKQUOTE_DELIMITERS_PATTERN,
        if: isLineProperlyBlockquoted,
        then: function (line) { return blockquoteLines.push(line.replace(FIRST_BLOCKQUOTE_DELIMITER_PATTERN, '')); }
    })) { }
    if (!blockquoteLines.length) {
        return false;
    }
    var blockquoteContent = blockquoteLines.join('\n');
    var headingLeveler = new HeadingLeveler_1.HeadingLeveler();
    args.then([
        new BlockquoteNode_1.BlockquoteNode(getOutlineNodes_1.getOutlineNodes(blockquoteContent, headingLeveler, args.config))], consumer.lengthConsumed());
    return true;
}
exports.parseBlockquote = parseBlockquote;
function isLineProperlyBlockquoted(line, delimiters) {
    return TRAILING_SPACE_PATTERN.test(delimiters) || (line === delimiters);
}
var BLOCKQUOTE_DELIMITER = '>' + Patterns_1.optional(Patterns_1.INLINE_WHITESPACE_CHAR);
var ALL_BLOCKQUOTE_DELIMITERS_PATTERN = new RegExp(Patterns_1.capture(Patterns_1.startsWith((Patterns_1.atLeast(1, BLOCKQUOTE_DELIMITER)))));
var FIRST_BLOCKQUOTE_DELIMITER_PATTERN = new RegExp(Patterns_1.startsWith(BLOCKQUOTE_DELIMITER));
var TRAILING_SPACE_PATTERN = new RegExp(Patterns_1.endsWith(Patterns_1.INLINE_WHITESPACE_CHAR));

},{"../../SyntaxNodes/BlockquoteNode":67,"../Patterns":62,"./HeadingLeveler":48,"./LineConsumer":49,"./getOutlineNodes":51}],56:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var CodeBlockNode_1 = require('../../SyntaxNodes/CodeBlockNode');
var Patterns_1 = require('../Patterns');
function parseCodeBlock(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    if (!consumer.consumeLine({ pattern: CODE_FENCE_PATTERN })) {
        return false;
    }
    var codeLines = [];
    while (!consumer.done()) {
        if (consumer.consumeLine({ pattern: CODE_FENCE_PATTERN })) {
            args.then([new CodeBlockNode_1.CodeBlockNode(codeLines.join('\n'))], consumer.lengthConsumed());
            return true;
        }
        consumer.consumeLine({
            then: function (line) { return codeLines.push(line); }
        });
    }
    return false;
}
exports.parseCodeBlock = parseCodeBlock;
var CODE_FENCE_PATTERN = new RegExp(Patterns_1.streakOf('`'));

},{"../../SyntaxNodes/CodeBlockNode":68,"../Patterns":62,"./LineConsumer":49}],57:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var DescriptionListItem_1 = require('../../SyntaxNodes/DescriptionListItem');
var DescriptionListNode_1 = require('../../SyntaxNodes/DescriptionListNode');
var DescriptionTerm_1 = require('../../SyntaxNodes/DescriptionTerm');
var Description_1 = require('../../SyntaxNodes/Description');
var getInlineNodes_1 = require('../Inline/getInlineNodes');
var getOutlineNodes_1 = require('./getOutlineNodes');
var isLineFancyOutlineConvention_1 = require('./isLineFancyOutlineConvention');
var Patterns_1 = require('../Patterns');
var getRemainingLinesOfListItem_1 = require('./getRemainingLinesOfListItem');
function parseDescriptionList(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var listItemNodes = [];
    var lengthParsed = 0;
    var _loop_1 = function() {
        var rawTerms = [];
        while (!consumer.done()) {
            var isTerm = consumer.consumeLine({
                pattern: NON_BLANK_PATTERN,
                if: function (line) { return !INDENTED_PATTERN.test(line) && !isLineFancyOutlineConvention_1.isLineFancyOutlineConvention(line, args.config); },
                then: function (line) { return rawTerms.push(line); }
            });
            if (!isTerm) {
                break;
            }
        }
        if (!rawTerms.length) {
            return "break";
        }
        var descriptionLines = [];
        var hasDescription = consumer.consumeLine({
            pattern: INDENTED_PATTERN,
            if: function (line) { return !BLANK_PATTERN.test(line); },
            then: function (line) { return descriptionLines.push(line.replace(INDENTED_PATTERN, '')); }
        });
        if (!hasDescription) {
            return "break";
        }
        var isListTerminated = false;
        getRemainingLinesOfListItem_1.getRemainingLinesOfListItem({
            text: consumer.remainingText(),
            then: function (lines, lengthParsed, shouldTerminateList) {
                descriptionLines.push.apply(descriptionLines, lines);
                consumer.advance(lengthParsed);
                isListTerminated = shouldTerminateList;
            }
        });
        lengthParsed = consumer.lengthConsumed();
        var terms = rawTerms.map(function (term) { return new DescriptionTerm_1.DescriptionTerm(getInlineNodes_1.getInlineNodes(term, args.config)); });
        var description = new Description_1.Description(getOutlineNodes_1.getOutlineNodes(descriptionLines.join('\n'), args.headingLeveler, args.config));
        listItemNodes.push(new DescriptionListItem_1.DescriptionListItem(terms, description));
        if (isListTerminated) {
            return "break";
        }
    };
    while (!consumer.done()) {
        var state_1 = _loop_1();
        if (state_1 === "break") break;
    }
    if (!listItemNodes.length) {
        return false;
    }
    args.then([new DescriptionListNode_1.DescriptionListNode(listItemNodes)], lengthParsed);
    return true;
}
exports.parseDescriptionList = parseDescriptionList;
var NON_BLANK_PATTERN = new RegExp(Patterns_1.NON_BLANK);
var BLANK_PATTERN = new RegExp(Patterns_1.BLANK);
var INDENTED_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.INDENT));

},{"../../SyntaxNodes/Description":69,"../../SyntaxNodes/DescriptionListItem":70,"../../SyntaxNodes/DescriptionListNode":71,"../../SyntaxNodes/DescriptionTerm":72,"../Inline/getInlineNodes":45,"../Patterns":62,"./LineConsumer":49,"./getOutlineNodes":51,"./getRemainingLinesOfListItem":52,"./isLineFancyOutlineConvention":53}],58:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var OrderedListNode_1 = require('../../SyntaxNodes/OrderedListNode');
var OrderedListItem_1 = require('../../SyntaxNodes/OrderedListItem');
var getOutlineNodes_1 = require('./getOutlineNodes');
var Patterns_1 = require('../Patterns');
var getRemainingLinesOfListItem_1 = require('./getRemainingLinesOfListItem');
function parseOrderedList(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var rawListItems = [];
    var _loop_1 = function() {
        var rawListItem = new RawListItem();
        var isLineBulleted = consumer.consumeLine({
            pattern: BULLETED_PATTERN,
            if: function (line) { return !STREAK_PATTERN.test(line); },
            then: function (line, bullet) {
                rawListItem.bullet = bullet;
                rawListItem.lines.push(line.replace(BULLETED_PATTERN, ''));
            }
        });
        if (!isLineBulleted) {
            return "break";
        }
        var isListTerminated = false;
        getRemainingLinesOfListItem_1.getRemainingLinesOfListItem({
            text: consumer.remainingText(),
            then: function (lines, lengthParsed, shouldTerminateList) {
                (_a = rawListItem.lines).push.apply(_a, lines);
                consumer.advance(lengthParsed);
                isListTerminated = shouldTerminateList;
                var _a;
            }
        });
        rawListItems.push(rawListItem);
        if (isListTerminated) {
            return "break";
        }
    };
    while (!consumer.done()) {
        var state_1 = _loop_1();
        if (state_1 === "break") break;
    }
    if (!rawListItems.length || isProbablyNotAnOrderedList(rawListItems)) {
        return false;
    }
    var listItems = rawListItems.map(function (rawListItem) {
        return new OrderedListItem_1.OrderedListItem(getOutlineNodes_1.getOutlineNodes(rawListItem.content(), args.headingLeveler, args.config), getExplicitOrdinal(rawListItem));
    });
    args.then([new OrderedListNode_1.OrderedListNode(listItems)], consumer.lengthConsumed());
    return true;
}
exports.parseOrderedList = parseOrderedList;
var RawListItem = (function () {
    function RawListItem() {
        this.lines = [];
    }
    RawListItem.prototype.content = function () {
        return this.lines.join('\n');
    };
    return RawListItem;
}());
function isProbablyNotAnOrderedList(rawListItems) {
    return (rawListItems.length === 1
        && INTEGER_FOLLOWED_BY_PERIOD_PATTERN.test(rawListItems[0].bullet));
}
function getExplicitOrdinal(rawListItem) {
    var result = INTEGER_PATTERN.exec(rawListItem.bullet);
    return (result ? parseInt(result[1]) : null);
}
var INTEGER_PATTERN = new RegExp(Patterns_1.capture(Patterns_1.INTEGER));
var BULLET = Patterns_1.either('#', Patterns_1.capture(Patterns_1.either(Patterns_1.INTEGER, '#') + Patterns_1.either('\\.', '\\)')));
var BULLETED_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.optional(' ') + BULLET + Patterns_1.INLINE_WHITESPACE_CHAR));
var INTEGER_FOLLOWED_BY_PERIOD_PATTERN = new RegExp(Patterns_1.INTEGER + '\\.');
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);
var BLANK_LINE_PATTERN = new RegExp(Patterns_1.BLANK);
var INDENTED_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.INDENT));

},{"../../SyntaxNodes/OrderedListItem":85,"../../SyntaxNodes/OrderedListNode":86,"../Patterns":62,"./LineConsumer":49,"./getOutlineNodes":51,"./getRemainingLinesOfListItem":52}],59:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var isWhitespace_1 = require('../../SyntaxNodes/isWhitespace');
var MediaSyntaxNode_1 = require('../../SyntaxNodes/MediaSyntaxNode');
var ParagraphNode_1 = require('../../SyntaxNodes/ParagraphNode');
var LineBlockNode_1 = require('../../SyntaxNodes/LineBlockNode');
var Line_1 = require('../../SyntaxNodes/Line');
var getInlineNodes_1 = require('../Inline/getInlineNodes');
var Patterns_1 = require('../Patterns');
var isLineFancyOutlineConvention_1 = require('./isLineFancyOutlineConvention');
function parseRegularLines(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var inlineNodesPerRegularLine = [];
    var regularLineNodes = [];
    var terminatingNodes = [];
    var _loop_1 = function() {
        var inlineNodes;
        var wasLineConsumed = consumer.consumeLine({
            pattern: NON_BLANK_LINE_PATTERN,
            if: function (line) { return !isLineFancyOutlineConvention_1.isLineFancyOutlineConvention(line, args.config); },
            then: function (line) { return inlineNodes = getInlineNodes_1.getInlineNodes(line, args.config); }
        });
        if (!wasLineConsumed || !inlineNodes.length) {
            return "break";
        }
        var doesLineConsistSolelyOfMediaConventions = (inlineNodes.every(function (node) { return isWhitespace_1.isWhitespace(node) || isMediaSyntaxNode(node); })
            && inlineNodes.some(isMediaSyntaxNode));
        if (doesLineConsistSolelyOfMediaConventions) {
            terminatingNodes = inlineNodes.filter(isMediaSyntaxNode);
            return "break";
        }
        inlineNodesPerRegularLine.push(inlineNodes);
    };
    while (true) {
        var state_1 = _loop_1();
        if (state_1 === "break") break;
    }
    var lengthConsumed = consumer.lengthConsumed();
    switch (inlineNodesPerRegularLine.length) {
        case 0:
            break;
        case 1:
            regularLineNodes = [new ParagraphNode_1.ParagraphNode(inlineNodesPerRegularLine[0])];
            break;
        default: {
            var lineBlockLines = inlineNodesPerRegularLine.map(function (inlineNodes) { return new Line_1.Line(inlineNodes); });
            regularLineNodes = [new LineBlockNode_1.LineBlockNode(lineBlockLines)];
            break;
        }
    }
    args.then(regularLineNodes.concat(terminatingNodes), consumer.lengthConsumed());
    return true;
}
exports.parseRegularLines = parseRegularLines;
function isMediaSyntaxNode(node) {
    return node instanceof MediaSyntaxNode_1.MediaSyntaxNode;
}
var NON_BLANK_LINE_PATTERN = new RegExp(Patterns_1.NON_BLANK);
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);

},{"../../SyntaxNodes/Line":81,"../../SyntaxNodes/LineBlockNode":82,"../../SyntaxNodes/MediaSyntaxNode":84,"../../SyntaxNodes/ParagraphNode":89,"../../SyntaxNodes/isWhitespace":101,"../Inline/getInlineNodes":45,"../Patterns":62,"./LineConsumer":49,"./isLineFancyOutlineConvention":53}],60:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var SectionSeparatorNode_1 = require('../../SyntaxNodes/SectionSeparatorNode');
var Patterns_1 = require('../Patterns');
function parseSectionSeparatorStreak(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    if (!consumer.consumeLine({ pattern: STREAK_PATTERN })) {
        return false;
    }
    args.then([new SectionSeparatorNode_1.SectionSeparatorNode()], consumer.lengthConsumed());
    return true;
}
exports.parseSectionSeparatorStreak = parseSectionSeparatorStreak;
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);

},{"../../SyntaxNodes/SectionSeparatorNode":94,"../Patterns":62,"./LineConsumer":49}],61:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var UnorderedListNode_1 = require('../../SyntaxNodes/UnorderedListNode');
var UnorderedListItem_1 = require('../../SyntaxNodes/UnorderedListItem');
var getOutlineNodes_1 = require('./getOutlineNodes');
var getRemainingLinesOfListItem_1 = require('./getRemainingLinesOfListItem');
var Patterns_1 = require('../Patterns');
function parseUnorderedList(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var listItemsContents = [];
    var _loop_1 = function() {
        var listItemLines = [];
        var isLineBulleted = consumer.consumeLine({
            pattern: BULLET_PATTERN,
            if: function (line) { return !STREAK_PATTERN.test(line); },
            then: function (line) { return listItemLines.push(line.replace(BULLET_PATTERN, '')); }
        });
        if (!isLineBulleted) {
            return "break";
        }
        var isListTerminated = false;
        getRemainingLinesOfListItem_1.getRemainingLinesOfListItem({
            text: consumer.remainingText(),
            then: function (lines, lengthParsed, shouldTerminateList) {
                listItemLines.push.apply(listItemLines, lines);
                consumer.advance(lengthParsed);
                isListTerminated = shouldTerminateList;
            }
        });
        listItemsContents.push(listItemLines.join('\n'));
        if (isListTerminated) {
            return "break";
        }
    };
    while (!consumer.done()) {
        var state_1 = _loop_1();
        if (state_1 === "break") break;
    }
    if (!listItemsContents.length) {
        return false;
    }
    var listItems = listItemsContents.map(function (listItemContents) {
        return new UnorderedListItem_1.UnorderedListItem(getOutlineNodes_1.getOutlineNodes(listItemContents, args.headingLeveler, args.config));
    });
    args.then([new UnorderedListNode_1.UnorderedListNode(listItems)], consumer.lengthConsumed());
    return true;
}
exports.parseUnorderedList = parseUnorderedList;
var BULLET_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.optional(' ') + Patterns_1.either('\\*', '-', '\\+') + Patterns_1.INLINE_WHITESPACE_CHAR));
var BLANK_LINE_PATTERN = new RegExp(Patterns_1.BLANK);
var INDENTED_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.INDENT));
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);

},{"../../SyntaxNodes/UnorderedListItem":98,"../../SyntaxNodes/UnorderedListNode":99,"../Patterns":62,"./LineConsumer":49,"./getOutlineNodes":51,"./getRemainingLinesOfListItem":52}],62:[function(require,module,exports){
"use strict";
function escapeForRegex(text) {
    return text.replace(/[(){}[\].+*?^$\\|-]/g, '\\$&');
}
exports.escapeForRegex = escapeForRegex;
var group = function (pattern) { return ("(?:" + pattern + ")"); };
var capture = function (pattern) { return ("(" + pattern + ")"); };
exports.capture = capture;
var optional = function (pattern) { return group(pattern) + '?'; };
exports.optional = optional;
var any = function (pattern) { return group(pattern) + '*'; };
var atLeast = function (count, pattern) { return group(pattern) + ("{" + count + ",}"); };
exports.atLeast = atLeast;
var either = function () {
    var patterns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        patterns[_i - 0] = arguments[_i];
    }
    return group(patterns.join('|'));
};
exports.either = either;
var solely = function (pattern) { return '^' + pattern + INLINE_WHITESPACE + '$'; };
exports.solely = solely;
var streakOf = function (charPattern) { return solely(atLeast(3, charPattern)); };
exports.streakOf = streakOf;
var startsWith = function (pattern) { return '^' + pattern; };
exports.startsWith = startsWith;
var endsWith = function (pattern) { return pattern + '$'; };
exports.endsWith = endsWith;
var INLINE_WHITESPACE_CHAR = '[^\\S\\n]';
exports.INLINE_WHITESPACE_CHAR = INLINE_WHITESPACE_CHAR;
var WHITESPACE_CHAR = '\\s';
exports.WHITESPACE_CHAR = WHITESPACE_CHAR;
var ANY_WHITESPACE = any('\\s');
exports.ANY_WHITESPACE = ANY_WHITESPACE;
var INLINE_WHITESPACE = any('[^\\S\\n]');
var LINE_BREAK = '\n';
exports.LINE_BREAK = LINE_BREAK;
var BLANK = solely('');
exports.BLANK = BLANK;
var INDENT = either('  ', '\t');
exports.INDENT = INDENT;
var STREAK_CHAR = either('#', '=', '-', '\\+', '~', '\\*', '\\^', '@', ':', '_');
var INTEGER = '\\d+';
exports.INTEGER = INTEGER;
var STREAK = solely(atLeast(3, STREAK_CHAR + ANY_WHITESPACE));
exports.STREAK = STREAK;
var NON_WHITESPACE_CHAR = '\\S';
exports.NON_WHITESPACE_CHAR = NON_WHITESPACE_CHAR;
var OPEN_SQUARE_BRACKET = escapeForRegex('[');
exports.OPEN_SQUARE_BRACKET = OPEN_SQUARE_BRACKET;
var CLOSE_SQUARE_BRACKET = escapeForRegex(']');
exports.CLOSE_SQUARE_BRACKET = CLOSE_SQUARE_BRACKET;
var OPEN_PAREN = escapeForRegex('(');
exports.OPEN_PAREN = OPEN_PAREN;
var CLOSE_PAREN = escapeForRegex(')');
exports.CLOSE_PAREN = CLOSE_PAREN;
var NON_BLANK = NON_WHITESPACE_CHAR;
exports.NON_BLANK = NON_BLANK;

},{}],63:[function(require,module,exports){
"use strict";
var ParagraphNode_1 = require('../SyntaxNodes/ParagraphNode');
var BlockquoteNode_1 = require('../SyntaxNodes/BlockquoteNode');
var LineBlockNode_1 = require('../SyntaxNodes/LineBlockNode');
var HeadingNode_1 = require('../SyntaxNodes/HeadingNode');
var UnorderedListNode_1 = require('../SyntaxNodes/UnorderedListNode');
var OrderedListNode_1 = require('../SyntaxNodes/OrderedListNode');
var DescriptionListNode_1 = require('../SyntaxNodes/DescriptionListNode');
var FootnoteNode_1 = require('../SyntaxNodes/FootnoteNode');
var FootnoteBlockNode_1 = require('../SyntaxNodes/FootnoteBlockNode');
var CollectionHelpers_1 = require('../CollectionHelpers');
function insertFootnoteBlocks(documentNode) {
    new FootnoteBlockInserter(documentNode);
}
exports.insertFootnoteBlocks = insertFootnoteBlocks;
var FootnoteBlockInserter = (function () {
    function FootnoteBlockInserter(documentNode) {
        this.footnoteReferenceNumberSequence = new Sequence({ start: 1 });
        this.produceFootnoteBlocks(documentNode);
    }
    FootnoteBlockInserter.prototype.produceFootnoteBlocks = function (outlineNodeContainer) {
        var outlineNodesWithFootnoteBlocks = [];
        for (var _i = 0, _a = outlineNodeContainer.children; _i < _a.length; _i++) {
            var outlineNode = _a[_i];
            outlineNodesWithFootnoteBlocks.push(outlineNode);
            var footnotesForNextFootnoteBlock = this.getBlocklessFootnotes(outlineNode);
            if (footnotesForNextFootnoteBlock.length) {
                outlineNodesWithFootnoteBlocks.push(this.getFootnoteBlock(footnotesForNextFootnoteBlock));
            }
        }
        outlineNodeContainer.children = outlineNodesWithFootnoteBlocks;
    };
    FootnoteBlockInserter.prototype.getBlocklessFootnotes = function (node) {
        if ((node instanceof ParagraphNode_1.ParagraphNode) || (node instanceof HeadingNode_1.HeadingNode)) {
            return this.getFootnotesAndAssignReferenceNumbers(node.children);
        }
        if (node instanceof LineBlockNode_1.LineBlockNode) {
            return this.getFootnotesFromInlineContainers(node.lines);
        }
        if ((node instanceof UnorderedListNode_1.UnorderedListNode) || (node instanceof OrderedListNode_1.OrderedListNode)) {
            return this.getBlocklessFootnotesFromOutlineContainers(node.listItems);
        }
        if (node instanceof DescriptionListNode_1.DescriptionListNode) {
            return this.getBlocklessFootnotesFromDescriptionList(node);
        }
        if (node instanceof BlockquoteNode_1.BlockquoteNode) {
            this.produceFootnoteBlocks(node);
            return [];
        }
        return [];
    };
    FootnoteBlockInserter.prototype.getFootnotesAndAssignReferenceNumbers = function (nodes) {
        var footnotes = [];
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            if (node instanceof FootnoteNode_1.FootnoteNode) {
                node.referenceNumber = this.footnoteReferenceNumberSequence.next();
                footnotes.push(node);
            }
        }
        return footnotes;
    };
    FootnoteBlockInserter.prototype.getFootnotesFromInlineContainers = function (containers) {
        var _this = this;
        return CollectionHelpers_1.concat(containers.map(function (container) { return _this.getFootnotesAndAssignReferenceNumbers(container.children); }));
    };
    FootnoteBlockInserter.prototype.getBlocklessFootnotesFromOutlineContainers = function (containers) {
        var _this = this;
        return CollectionHelpers_1.concat(containers.map(function (container) { return _this.getBlocklessFootnotesFromOutlineNodes(container.children); }));
    };
    FootnoteBlockInserter.prototype.getBlocklessFootnotesFromDescriptionList = function (list) {
        var _this = this;
        return CollectionHelpers_1.concat(list.listItems.map(function (item) { return _this.getBlocklessFootnotesFromDescriptionListItem(item); }));
    };
    FootnoteBlockInserter.prototype.getBlocklessFootnotesFromDescriptionListItem = function (item) {
        var footnotesFromTerms = this.getFootnotesFromInlineContainers(item.terms);
        var footnotesFromDescription = this.getBlocklessFootnotesFromOutlineNodes(item.description.children);
        return footnotesFromTerms.concat(footnotesFromDescription);
    };
    FootnoteBlockInserter.prototype.getBlocklessFootnotesFromOutlineNodes = function (nodes) {
        var _this = this;
        return CollectionHelpers_1.concat(nodes.map(function (node) { return _this.getBlocklessFootnotes(node); }));
    };
    FootnoteBlockInserter.prototype.getFootnoteBlock = function (footnotes) {
        var footnoteBlock = new FootnoteBlockNode_1.FootnoteBlockNode(footnotes);
        for (var i = 0; i < footnoteBlock.footnotes.length; i++) {
            var footnote = footnoteBlock.footnotes[i];
            var innerFootnotes = this.getFootnotesAndAssignReferenceNumbers(footnote.children);
            (_a = footnoteBlock.footnotes).push.apply(_a, innerFootnotes);
        }
        return footnoteBlock;
        var _a;
    };
    return FootnoteBlockInserter;
}());
var Sequence = (function () {
    function Sequence(args) {
        this.nextValue = args.start;
    }
    Sequence.prototype.next = function () {
        return this.nextValue++;
    };
    return Sequence;
}());

},{"../CollectionHelpers":1,"../SyntaxNodes/BlockquoteNode":67,"../SyntaxNodes/DescriptionListNode":71,"../SyntaxNodes/FootnoteBlockNode":75,"../SyntaxNodes/FootnoteNode":76,"../SyntaxNodes/HeadingNode":77,"../SyntaxNodes/LineBlockNode":82,"../SyntaxNodes/OrderedListNode":86,"../SyntaxNodes/ParagraphNode":89,"../SyntaxNodes/UnorderedListNode":99}],64:[function(require,module,exports){
"use strict";
var getOutlineNodes_1 = require('./Outline/getOutlineNodes');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var insertFootnoteBlocks_1 = require('./insertFootnoteBlocks');
var HeadingLeveler_1 = require('./Outline/HeadingLeveler');
function parseDocument(text, config) {
    var documentNode = new DocumentNode_1.DocumentNode(getOutlineNodes_1.getOutlineNodes(text, new HeadingLeveler_1.HeadingLeveler(), config));
    insertFootnoteBlocks_1.insertFootnoteBlocks(documentNode);
    return documentNode;
}
exports.parseDocument = parseDocument;

},{"../SyntaxNodes/DocumentNode":73,"./Outline/HeadingLeveler":48,"./Outline/getOutlineNodes":51,"./insertFootnoteBlocks":63}],65:[function(require,module,exports){
"use strict";
function getDistinctTrimmedChars(text) {
    return text
        .trim()
        .split('')
        .reduce(function (distinctChars, char) {
        return (distinctChars.indexOf(char) !== -1)
            ? distinctChars
            : distinctChars.concat([char]);
    }, [])
        .sort()
        .join('');
}
exports.getDistinctTrimmedChars = getDistinctTrimmedChars;

},{}],66:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MediaSyntaxNode_1 = require('./MediaSyntaxNode');
var AudioNode = (function (_super) {
    __extends(AudioNode, _super);
    function AudioNode() {
        _super.apply(this, arguments);
        this.AUDIO = null;
    }
    return AudioNode;
}(MediaSyntaxNode_1.MediaSyntaxNode));
exports.AudioNode = AudioNode;

},{"./MediaSyntaxNode":84}],67:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutlineSyntaxNode_1 = require('./OutlineSyntaxNode');
var BlockquoteNode = (function (_super) {
    __extends(BlockquoteNode, _super);
    function BlockquoteNode(children) {
        if (children === void 0) { children = []; }
        _super.call(this);
        this.children = children;
        this.BLOCKQUOTE = null;
    }
    return BlockquoteNode;
}(OutlineSyntaxNode_1.OutlineSyntaxNode));
exports.BlockquoteNode = BlockquoteNode;

},{"./OutlineSyntaxNode":88}],68:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutlineSyntaxNode_1 = require('./OutlineSyntaxNode');
var CodeBlockNode = (function (_super) {
    __extends(CodeBlockNode, _super);
    function CodeBlockNode(text) {
        _super.call(this);
        this.text = text;
        this.CODE_BLOCK = null;
    }
    return CodeBlockNode;
}(OutlineSyntaxNode_1.OutlineSyntaxNode));
exports.CodeBlockNode = CodeBlockNode;

},{"./OutlineSyntaxNode":88}],69:[function(require,module,exports){
"use strict";
var Description = (function () {
    function Description(children) {
        this.children = children;
        this.DESCRIPTION = null;
    }
    return Description;
}());
exports.Description = Description;

},{}],70:[function(require,module,exports){
"use strict";
var DescriptionListItem = (function () {
    function DescriptionListItem(terms, description) {
        this.terms = terms;
        this.description = description;
        this.DESCRIPTION_LIST_ITEM = null;
    }
    return DescriptionListItem;
}());
exports.DescriptionListItem = DescriptionListItem;

},{}],71:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutlineSyntaxNode_1 = require('./OutlineSyntaxNode');
var DescriptionListNode = (function (_super) {
    __extends(DescriptionListNode, _super);
    function DescriptionListNode(listItems) {
        _super.call(this);
        this.listItems = listItems;
        this.DESCRIPTION_LIST = null;
    }
    return DescriptionListNode;
}(OutlineSyntaxNode_1.OutlineSyntaxNode));
exports.DescriptionListNode = DescriptionListNode;

},{"./OutlineSyntaxNode":88}],72:[function(require,module,exports){
"use strict";
var DescriptionTerm = (function () {
    function DescriptionTerm(children) {
        this.children = children;
        this.DESCRIPTION_TERM = null;
    }
    return DescriptionTerm;
}());
exports.DescriptionTerm = DescriptionTerm;

},{}],73:[function(require,module,exports){
"use strict";
var DocumentNode = (function () {
    function DocumentNode(children) {
        if (children === void 0) { children = []; }
        this.children = children;
        this.DOCUMENT = null;
    }
    return DocumentNode;
}());
exports.DocumentNode = DocumentNode;

},{}],74:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RichInlineSyntaxNode_1 = require('./RichInlineSyntaxNode');
var EmphasisNode = (function (_super) {
    __extends(EmphasisNode, _super);
    function EmphasisNode() {
        _super.apply(this, arguments);
        this.EMPHASIS = null;
    }
    return EmphasisNode;
}(RichInlineSyntaxNode_1.RichInlineSyntaxNode));
exports.EmphasisNode = EmphasisNode;

},{"./RichInlineSyntaxNode":93}],75:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutlineSyntaxNode_1 = require('./OutlineSyntaxNode');
var FootnoteBlockNode = (function (_super) {
    __extends(FootnoteBlockNode, _super);
    function FootnoteBlockNode(footnotes) {
        if (footnotes === void 0) { footnotes = []; }
        _super.call(this);
        this.footnotes = footnotes;
        this.FOOTNOTE_BLOCK = null;
    }
    return FootnoteBlockNode;
}(OutlineSyntaxNode_1.OutlineSyntaxNode));
exports.FootnoteBlockNode = FootnoteBlockNode;

},{"./OutlineSyntaxNode":88}],76:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RichInlineSyntaxNode_1 = require('./RichInlineSyntaxNode');
var FootnoteNode = (function (_super) {
    __extends(FootnoteNode, _super);
    function FootnoteNode(children, referenceNumber) {
        _super.call(this, children);
        this.referenceNumber = referenceNumber;
        this.FOOTNOTE = null;
    }
    return FootnoteNode;
}(RichInlineSyntaxNode_1.RichInlineSyntaxNode));
exports.FootnoteNode = FootnoteNode;

},{"./RichInlineSyntaxNode":93}],77:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutlineSyntaxNode_1 = require('./OutlineSyntaxNode');
var HeadingNode = (function (_super) {
    __extends(HeadingNode, _super);
    function HeadingNode(children, level) {
        _super.call(this);
        this.children = children;
        this.level = level;
        this.HEADING = null;
    }
    return HeadingNode;
}(OutlineSyntaxNode_1.OutlineSyntaxNode));
exports.HeadingNode = HeadingNode;

},{"./OutlineSyntaxNode":88}],78:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MediaSyntaxNode_1 = require('./MediaSyntaxNode');
var ImageNode = (function (_super) {
    __extends(ImageNode, _super);
    function ImageNode() {
        _super.apply(this, arguments);
        this.IMAGE = null;
    }
    return ImageNode;
}(MediaSyntaxNode_1.MediaSyntaxNode));
exports.ImageNode = ImageNode;

},{"./MediaSyntaxNode":84}],79:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var InlineSyntaxNode_1 = require('./InlineSyntaxNode');
var InlineCodeNode = (function (_super) {
    __extends(InlineCodeNode, _super);
    function InlineCodeNode(text) {
        _super.call(this);
        this.text = text;
        this.INLINE_CODE = null;
    }
    return InlineCodeNode;
}(InlineSyntaxNode_1.InlineSyntaxNode));
exports.InlineCodeNode = InlineCodeNode;

},{"./InlineSyntaxNode":80}],80:[function(require,module,exports){
"use strict";
var InlineSyntaxNode = (function () {
    function InlineSyntaxNode() {
    }
    InlineSyntaxNode.prototype.inlineSyntaxNode = function () { };
    return InlineSyntaxNode;
}());
exports.InlineSyntaxNode = InlineSyntaxNode;

},{}],81:[function(require,module,exports){
"use strict";
var Line = (function () {
    function Line(children) {
        this.children = children;
        this.LINE = null;
    }
    return Line;
}());
exports.Line = Line;

},{}],82:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutlineSyntaxNode_1 = require('./OutlineSyntaxNode');
var LineBlockNode = (function (_super) {
    __extends(LineBlockNode, _super);
    function LineBlockNode(lines) {
        if (lines === void 0) { lines = []; }
        _super.call(this);
        this.lines = lines;
        this.LINE_BLOCK = null;
    }
    return LineBlockNode;
}(OutlineSyntaxNode_1.OutlineSyntaxNode));
exports.LineBlockNode = LineBlockNode;

},{"./OutlineSyntaxNode":88}],83:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RichInlineSyntaxNode_1 = require('./RichInlineSyntaxNode');
var LinkNode = (function (_super) {
    __extends(LinkNode, _super);
    function LinkNode(children, url) {
        if (children === void 0) { children = []; }
        if (url === void 0) { url = ''; }
        _super.call(this, children);
        this.children = children;
        this.url = url;
        this.LINK = null;
    }
    return LinkNode;
}(RichInlineSyntaxNode_1.RichInlineSyntaxNode));
exports.LinkNode = LinkNode;

},{"./RichInlineSyntaxNode":93}],84:[function(require,module,exports){
"use strict";
var MediaSyntaxNode = (function () {
    function MediaSyntaxNode(description, url) {
        this.description = description;
        this.url = url;
    }
    MediaSyntaxNode.prototype.mediaSyntaxNode = function () { };
    MediaSyntaxNode.prototype.outlineSyntaxNode = function () { };
    MediaSyntaxNode.prototype.inlineSyntaxNode = function () { };
    return MediaSyntaxNode;
}());
exports.MediaSyntaxNode = MediaSyntaxNode;

},{}],85:[function(require,module,exports){
"use strict";
var OrderedListItem = (function () {
    function OrderedListItem(children, ordinal) {
        if (ordinal === void 0) { ordinal = null; }
        this.children = children;
        this.ordinal = ordinal;
        this.ORDERED_LIST_ITEM = null;
    }
    return OrderedListItem;
}());
exports.OrderedListItem = OrderedListItem;

},{}],86:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutlineSyntaxNode_1 = require('./OutlineSyntaxNode');
var OrderedListOrder_1 = require('./OrderedListOrder');
var OrderedListNode = (function (_super) {
    __extends(OrderedListNode, _super);
    function OrderedListNode(listItems) {
        if (listItems === void 0) { listItems = []; }
        _super.call(this);
        this.listItems = listItems;
        this.ORDERED_LIST = null;
    }
    OrderedListNode.prototype.start = function () {
        return this.listItems[0].ordinal;
    };
    OrderedListNode.prototype.order = function () {
        var withExplicitOrdinals = this.listItems.filter(function (item) { return item.ordinal != null; });
        if (withExplicitOrdinals.length < 2) {
            return OrderedListOrder_1.OrderedListOrder.Ascending;
        }
        return (withExplicitOrdinals[0].ordinal > withExplicitOrdinals[1].ordinal
            ? OrderedListOrder_1.OrderedListOrder.Descrending
            : OrderedListOrder_1.OrderedListOrder.Ascending);
    };
    return OrderedListNode;
}(OutlineSyntaxNode_1.OutlineSyntaxNode));
exports.OrderedListNode = OrderedListNode;

},{"./OrderedListOrder":87,"./OutlineSyntaxNode":88}],87:[function(require,module,exports){
"use strict";
(function (OrderedListOrder) {
    OrderedListOrder[OrderedListOrder["Ascending"] = 0] = "Ascending";
    OrderedListOrder[OrderedListOrder["Descrending"] = 1] = "Descrending";
})(exports.OrderedListOrder || (exports.OrderedListOrder = {}));
var OrderedListOrder = exports.OrderedListOrder;

},{}],88:[function(require,module,exports){
"use strict";
var OutlineSyntaxNode = (function () {
    function OutlineSyntaxNode() {
    }
    OutlineSyntaxNode.prototype.outlineSyntaxNode = function () { };
    return OutlineSyntaxNode;
}());
exports.OutlineSyntaxNode = OutlineSyntaxNode;

},{}],89:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutlineSyntaxNode_1 = require('./OutlineSyntaxNode');
var ParagraphNode = (function (_super) {
    __extends(ParagraphNode, _super);
    function ParagraphNode(children) {
        if (children === void 0) { children = []; }
        _super.call(this);
        this.children = children;
        this.PARAGRAPH = null;
    }
    return ParagraphNode;
}(OutlineSyntaxNode_1.OutlineSyntaxNode));
exports.ParagraphNode = ParagraphNode;

},{"./OutlineSyntaxNode":88}],90:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var InlineSyntaxNode_1 = require('./InlineSyntaxNode');
var PlainTextNode = (function (_super) {
    __extends(PlainTextNode, _super);
    function PlainTextNode(text) {
        _super.call(this);
        this.text = text;
        this.PLAIN_TEXT = null;
    }
    return PlainTextNode;
}(InlineSyntaxNode_1.InlineSyntaxNode));
exports.PlainTextNode = PlainTextNode;

},{"./InlineSyntaxNode":80}],91:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RichInlineSyntaxNode_1 = require('./RichInlineSyntaxNode');
var RevisionDeletionNode = (function (_super) {
    __extends(RevisionDeletionNode, _super);
    function RevisionDeletionNode() {
        _super.apply(this, arguments);
        this.REVISION_DELETION = null;
    }
    return RevisionDeletionNode;
}(RichInlineSyntaxNode_1.RichInlineSyntaxNode));
exports.RevisionDeletionNode = RevisionDeletionNode;

},{"./RichInlineSyntaxNode":93}],92:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RichInlineSyntaxNode_1 = require('./RichInlineSyntaxNode');
var RevisionInsertionNode = (function (_super) {
    __extends(RevisionInsertionNode, _super);
    function RevisionInsertionNode() {
        _super.apply(this, arguments);
        this.REVISION_INSERTION = null;
    }
    return RevisionInsertionNode;
}(RichInlineSyntaxNode_1.RichInlineSyntaxNode));
exports.RevisionInsertionNode = RevisionInsertionNode;

},{"./RichInlineSyntaxNode":93}],93:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var InlineSyntaxNode_1 = require('../SyntaxNodes/InlineSyntaxNode');
var RichInlineSyntaxNode = (function (_super) {
    __extends(RichInlineSyntaxNode, _super);
    function RichInlineSyntaxNode(children) {
        _super.call(this);
        this.children = children;
    }
    RichInlineSyntaxNode.prototype.richInlineSyntaxNode = function () { };
    return RichInlineSyntaxNode;
}(InlineSyntaxNode_1.InlineSyntaxNode));
exports.RichInlineSyntaxNode = RichInlineSyntaxNode;

},{"../SyntaxNodes/InlineSyntaxNode":80}],94:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutlineSyntaxNode_1 = require('./OutlineSyntaxNode');
var SectionSeparatorNode = (function (_super) {
    __extends(SectionSeparatorNode, _super);
    function SectionSeparatorNode() {
        _super.apply(this, arguments);
        this.SECTION_SEPARATOR = null;
    }
    return SectionSeparatorNode;
}(OutlineSyntaxNode_1.OutlineSyntaxNode));
exports.SectionSeparatorNode = SectionSeparatorNode;

},{"./OutlineSyntaxNode":88}],95:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RichInlineSyntaxNode_1 = require('./RichInlineSyntaxNode');
var SpoilerNode = (function (_super) {
    __extends(SpoilerNode, _super);
    function SpoilerNode() {
        _super.apply(this, arguments);
        this.SPOILER = null;
    }
    return SpoilerNode;
}(RichInlineSyntaxNode_1.RichInlineSyntaxNode));
exports.SpoilerNode = SpoilerNode;

},{"./RichInlineSyntaxNode":93}],96:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RichInlineSyntaxNode_1 = require('./RichInlineSyntaxNode');
var SquareBracketedNode = (function (_super) {
    __extends(SquareBracketedNode, _super);
    function SquareBracketedNode() {
        _super.apply(this, arguments);
        this.PARENTHESIZED = null;
    }
    return SquareBracketedNode;
}(RichInlineSyntaxNode_1.RichInlineSyntaxNode));
exports.SquareBracketedNode = SquareBracketedNode;

},{"./RichInlineSyntaxNode":93}],97:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RichInlineSyntaxNode_1 = require('./RichInlineSyntaxNode');
var StressNode = (function (_super) {
    __extends(StressNode, _super);
    function StressNode() {
        _super.apply(this, arguments);
        this.STRESS = null;
    }
    return StressNode;
}(RichInlineSyntaxNode_1.RichInlineSyntaxNode));
exports.StressNode = StressNode;

},{"./RichInlineSyntaxNode":93}],98:[function(require,module,exports){
"use strict";
var UnorderedListItem = (function () {
    function UnorderedListItem(children) {
        this.children = children;
        this.UNORDERED_LIST_ITEM = null;
    }
    return UnorderedListItem;
}());
exports.UnorderedListItem = UnorderedListItem;

},{}],99:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutlineSyntaxNode_1 = require('./OutlineSyntaxNode');
var UnorderedListNode = (function (_super) {
    __extends(UnorderedListNode, _super);
    function UnorderedListNode(listItems) {
        if (listItems === void 0) { listItems = []; }
        _super.call(this);
        this.listItems = listItems;
        this.UNORDERED_LIST = null;
    }
    return UnorderedListNode;
}(OutlineSyntaxNode_1.OutlineSyntaxNode));
exports.UnorderedListNode = UnorderedListNode;

},{"./OutlineSyntaxNode":88}],100:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MediaSyntaxNode_1 = require('./MediaSyntaxNode');
var VideoNode = (function (_super) {
    __extends(VideoNode, _super);
    function VideoNode() {
        _super.apply(this, arguments);
        this.VIDEO = null;
    }
    return VideoNode;
}(MediaSyntaxNode_1.MediaSyntaxNode));
exports.VideoNode = VideoNode;

},{"./MediaSyntaxNode":84}],101:[function(require,module,exports){
"use strict";
var PlainTextNode_1 = require('./PlainTextNode');
function isWhitespace(node) {
    return (node instanceof PlainTextNode_1.PlainTextNode) && !/\S/.test(node.text);
}
exports.isWhitespace = isWhitespace;

},{"./PlainTextNode":90}],102:[function(require,module,exports){
"use strict";
var parseDocument_1 = require('./Parsing/parseDocument');
var HtmlWriter_1 = require('./Writer/HtmlWriter');
var UpConfig_1 = require('./UpConfig');
var Up = (function () {
    function Up(config) {
        this.config = new UpConfig_1.UpConfig(config);
    }
    Up.toAst = function (text, configChanges) {
        return this.defaultUp.toAst(text, configChanges);
    };
    Up.toHtml = function (textOrNode, configChanges) {
        return this.defaultUp.toHtml(textOrNode, configChanges);
    };
    Up.prototype.toAst = function (text, configChanges) {
        return toAst(text, this.config.withChanges(configChanges));
    };
    Up.prototype.toHtml = function (textOrNode, configChanges) {
        return toHtml(textOrNode, this.config.withChanges(configChanges));
    };
    Up.defaultUp = new Up();
    return Up;
}());
exports.Up = Up;
function toAst(text, config) {
    return parseDocument_1.parseDocument(text, config);
}
function toHtml(textOrNode, config) {
    var node = typeof textOrNode === 'string'
        ? toAst(textOrNode, config)
        : textOrNode;
    return new HtmlWriter_1.HtmlWriter(config).write(node);
}

},{"./Parsing/parseDocument":64,"./UpConfig":103,"./Writer/HtmlWriter":104}],103:[function(require,module,exports){
"use strict";
var ObjectHelpers_1 = require('./ObjectHelpers');
var DEFAULT_CONFIG = {
    documentName: null,
    i18n: {
        idWordDelimiter: '-',
        terms: {
            image: 'image',
            audio: 'audio',
            video: 'video',
            spoiler: 'spoiler',
            footnote: 'footnote',
            footnoteReference: 'footnote reference'
        }
    }
};
var UpConfig = (function () {
    function UpConfig(configArgs, defaults) {
        if (defaults === void 0) { defaults = DEFAULT_CONFIG; }
        this.settings = ObjectHelpers_1.merge(defaults, configArgs);
    }
    UpConfig.prototype.withChanges = function (changes) {
        return new UpConfig(changes, this.settings);
    };
    UpConfig.prototype.localizeTerm = function (nonLocalizedTerm) {
        var localizedTerm = this.settings.i18n.terms[nonLocalizedTerm];
        if (localizedTerm) {
            return localizedTerm;
        }
        throw new Error("Unrecognizes term: " + nonLocalizedTerm);
    };
    return UpConfig;
}());
exports.UpConfig = UpConfig;

},{"./ObjectHelpers":2}],104:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinkNode_1 = require('../SyntaxNodes/LinkNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var OrderedListOrder_1 = require('../SyntaxNodes/OrderedListOrder');
var Writer_1 = require('./Writer');
var HtmlWriter = (function (_super) {
    __extends(HtmlWriter, _super);
    function HtmlWriter(config) {
        _super.call(this, config);
        this.isInsideLink = false;
    }
    HtmlWriter.prototype.document = function (node) {
        return this.htmlElements(node.children);
    };
    HtmlWriter.prototype.blockquote = function (node) {
        return this.htmlElement('blockquote', node.children);
    };
    HtmlWriter.prototype.unorderedList = function (node) {
        var _this = this;
        return htmlElement('ul', node.listItems.map(function (listItem) { return _this.unorderedListItem(listItem); }).join(''));
    };
    HtmlWriter.prototype.orderedList = function (node) {
        var _this = this;
        var attrs = {};
        var start = node.start();
        if (start != null) {
            attrs.start = start;
        }
        if (node.order() === OrderedListOrder_1.OrderedListOrder.Descrending) {
            attrs.reversed = null;
        }
        return htmlElement('ol', node.listItems.map(function (listItem) { return _this.orderedListItem(listItem); }).join(''), attrs);
    };
    HtmlWriter.prototype.descriptionList = function (node) {
        var _this = this;
        return htmlElement('dl', node.listItems.map(function (listItem) { return _this.descriptionListItem(listItem); }).join(''));
    };
    HtmlWriter.prototype.lineBlock = function (node) {
        var _this = this;
        return htmlElement('div', node.lines.map(function (line) { return _this.line(line); }).join(''), { 'data-lines': null });
    };
    HtmlWriter.prototype.codeBlock = function (node) {
        return htmlElement('pre', htmlElement('code', node.text));
    };
    HtmlWriter.prototype.paragraph = function (node) {
        return this.htmlElement('p', node.children);
    };
    HtmlWriter.prototype.heading = function (node) {
        return this.htmlElement('h' + Math.min(6, node.level), node.children);
    };
    HtmlWriter.prototype.sectionSeparator = function (node) {
        return htmlElementWithNoEndTag('hr');
    };
    HtmlWriter.prototype.emphasis = function (node) {
        return this.htmlElement('em', node.children);
    };
    HtmlWriter.prototype.stress = function (node) {
        return this.htmlElement('strong', node.children);
    };
    HtmlWriter.prototype.inlineCode = function (node) {
        return htmlElement('code', node.text);
    };
    HtmlWriter.prototype.revisionInsertion = function (node) {
        return this.htmlElement('ins', node.children);
    };
    HtmlWriter.prototype.revisionDeletion = function (node) {
        return this.htmlElement('del', node.children);
    };
    HtmlWriter.prototype.spoiler = function (node) {
        return this.htmlElement('span', node.children, { 'data-spoiler': null });
    };
    HtmlWriter.prototype.footnoteReference = function (node) {
        var innerLinkNode = this.footnoteReferenceInnerLink(node);
        return this.htmlElement('sup', [innerLinkNode], {
            id: this.footnoteReferenceId(node.referenceNumber),
            'data-footnote-reference': null
        });
    };
    HtmlWriter.prototype.footnoteBlock = function (node) {
        var _this = this;
        return htmlElement('dl', node.footnotes.map(function (footnote) { return _this.footnote(footnote); }).join(''), { 'data-footnotes': null });
    };
    HtmlWriter.prototype.link = function (node) {
        var _this = this;
        if (this.isInsideLink) {
            return node.children.map(function (child) { return _this.write(child); }).join('');
        }
        this.isInsideLink = true;
        var html = this.htmlElement('a', node.children, { href: node.url });
        this.isInsideLink = false;
        return html;
    };
    HtmlWriter.prototype.image = function (node) {
        return htmlElementWithNoEndTag('img', { src: node.url, alt: node.description, title: node.description });
    };
    HtmlWriter.prototype.audio = function (node) {
        var description = node.description, url = node.url;
        return this.htmlElement('audio', this.mediaFallback(description, url), { src: url, title: description });
    };
    HtmlWriter.prototype.video = function (node) {
        var description = node.description, url = node.url;
        return this.htmlElement('video', this.mediaFallback(description, url), { src: url, title: description });
    };
    HtmlWriter.prototype.plainText = function (node) {
        return node.text;
    };
    HtmlWriter.prototype.unorderedListItem = function (listItem) {
        return this.htmlElement('li', listItem.children);
    };
    HtmlWriter.prototype.orderedListItem = function (listItem) {
        var attrs = {};
        if (listItem.ordinal != null) {
            attrs.value = listItem.ordinal;
        }
        return this.htmlElement('li', listItem.children, attrs);
    };
    HtmlWriter.prototype.descriptionListItem = function (listItem) {
        var _this = this;
        return (listItem.terms.map(function (term) { return _this.descriptionTerm(term); }).join('')
            + this.description(listItem.description));
    };
    HtmlWriter.prototype.descriptionTerm = function (term) {
        return this.htmlElement('dt', term.children);
    };
    HtmlWriter.prototype.description = function (description) {
        return this.htmlElement('dd', description.children);
    };
    HtmlWriter.prototype.line = function (line) {
        return this.htmlElement('div', line.children);
    };
    HtmlWriter.prototype.footnoteReferenceInnerLink = function (footnoteReference) {
        var referenceNumber = footnoteReference.referenceNumber;
        return new LinkNode_1.LinkNode([new PlainTextNode_1.PlainTextNode(referenceNumber.toString())], internalUrl(this.footnoteId(referenceNumber)));
    };
    HtmlWriter.prototype.footnote = function (footnote) {
        var termHtml = this.htmlElement('dt', [this.footnoteLinkBackToReference(footnote)], {
            id: this.footnoteId(footnote.referenceNumber),
            'data-footnote': null
        });
        var descriptionHtml = this.htmlElement('dd', footnote.children);
        return termHtml + descriptionHtml;
    };
    HtmlWriter.prototype.footnoteLinkBackToReference = function (footnote) {
        var referenceNumber = footnote.referenceNumber;
        return new LinkNode_1.LinkNode([new PlainTextNode_1.PlainTextNode(referenceNumber.toString())], internalUrl(this.footnoteReferenceId(referenceNumber)));
    };
    HtmlWriter.prototype.mediaFallback = function (content, url) {
        return [new LinkNode_1.LinkNode([new PlainTextNode_1.PlainTextNode(content)], url)];
    };
    HtmlWriter.prototype.htmlElement = function (tagName, children, attrs) {
        if (attrs === void 0) { attrs = {}; }
        return htmlElement(tagName, this.htmlElements(children), attrs);
    };
    HtmlWriter.prototype.htmlElements = function (nodes) {
        var _this = this;
        return nodes.reduce(function (html, child) { return html + _this.write(child); }, '');
    };
    return HtmlWriter;
}(Writer_1.Writer));
exports.HtmlWriter = HtmlWriter;
function htmlElement(tagName, content, attrs) {
    if (attrs === void 0) { attrs = {}; }
    return "" + htmlTag(tagName, attrs) + content + "</" + tagName + ">";
}
function htmlElementWithNoEndTag(tagName, attrs) {
    if (attrs === void 0) { attrs = {}; }
    return htmlTag(tagName, attrs);
}
function htmlTag(tagName, attrs) {
    var tagNameWithAttrs = [tagName].concat(htmlAttrs(attrs)).join(' ');
    return "<" + tagNameWithAttrs + ">";
}
function htmlAttrs(attrs) {
    return (Object.keys(attrs)
        .map(function (key) {
        var value = attrs[key];
        return (value == null ? key : key + "=\"" + value + "\"");
    }));
}
function internalUrl(id) {
    return '#' + id;
}

},{"../SyntaxNodes/LinkNode":83,"../SyntaxNodes/OrderedListOrder":87,"../SyntaxNodes/PlainTextNode":90,"./Writer":105}],105:[function(require,module,exports){
"use strict";
var LinkNode_1 = require('../SyntaxNodes/LinkNode');
var ImageNode_1 = require('../SyntaxNodes/ImageNode');
var AudioNode_1 = require('../SyntaxNodes/AudioNode');
var VideoNode_1 = require('../SyntaxNodes/VideoNode');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var StressNode_1 = require('../SyntaxNodes/StressNode');
var InlineCodeNode_1 = require('../SyntaxNodes/InlineCodeNode');
var RevisionInsertionNode_1 = require('../SyntaxNodes/RevisionInsertionNode');
var RevisionDeletionNode_1 = require('../SyntaxNodes/RevisionDeletionNode');
var SpoilerNode_1 = require('../SyntaxNodes/SpoilerNode');
var FootnoteNode_1 = require('../SyntaxNodes/FootnoteNode');
var FootnoteBlockNode_1 = require('../SyntaxNodes/FootnoteBlockNode');
var ParagraphNode_1 = require('../SyntaxNodes/ParagraphNode');
var BlockquoteNode_1 = require('../SyntaxNodes/BlockquoteNode');
var UnorderedListNode_1 = require('../SyntaxNodes/UnorderedListNode');
var OrderedListNode_1 = require('../SyntaxNodes/OrderedListNode');
var DescriptionListNode_1 = require('../SyntaxNodes/DescriptionListNode');
var LineBlockNode_1 = require('../SyntaxNodes/LineBlockNode');
var HeadingNode_1 = require('../SyntaxNodes/HeadingNode');
var CodeBlockNode_1 = require('../SyntaxNodes/CodeBlockNode');
var SectionSeparatorNode_1 = require('../SyntaxNodes/SectionSeparatorNode');
var Writer = (function () {
    function Writer(config) {
        this.config = config;
    }
    Writer.prototype.write = function (node) {
        return this.dispatchWrite(node);
    };
    Writer.prototype.dispatchWrite = function (node) {
        if (node instanceof DocumentNode_1.DocumentNode) {
            return this.document(node);
        }
        if (node instanceof BlockquoteNode_1.BlockquoteNode) {
            return this.blockquote(node);
        }
        if (node instanceof UnorderedListNode_1.UnorderedListNode) {
            return this.unorderedList(node);
        }
        if (node instanceof OrderedListNode_1.OrderedListNode) {
            return this.orderedList(node);
        }
        if (node instanceof DescriptionListNode_1.DescriptionListNode) {
            return this.descriptionList(node);
        }
        if (node instanceof LineBlockNode_1.LineBlockNode) {
            return this.lineBlock(node);
        }
        if (node instanceof ParagraphNode_1.ParagraphNode) {
            return this.paragraph(node);
        }
        if (node instanceof CodeBlockNode_1.CodeBlockNode) {
            return this.codeBlock(node);
        }
        if (node instanceof HeadingNode_1.HeadingNode) {
            return this.heading(node);
        }
        if (node instanceof SectionSeparatorNode_1.SectionSeparatorNode) {
            return this.sectionSeparator(node);
        }
        if (node instanceof EmphasisNode_1.EmphasisNode) {
            return this.emphasis(node);
        }
        if (node instanceof StressNode_1.StressNode) {
            return this.stress(node);
        }
        if (node instanceof InlineCodeNode_1.InlineCodeNode) {
            return this.inlineCode(node);
        }
        if (node instanceof FootnoteNode_1.FootnoteNode) {
            return this.footnoteReference(node);
        }
        if (node instanceof FootnoteBlockNode_1.FootnoteBlockNode) {
            return this.footnoteBlock(node);
        }
        if (node instanceof LinkNode_1.LinkNode) {
            return this.link(node);
        }
        if (node instanceof ImageNode_1.ImageNode) {
            return this.image(node);
        }
        if (node instanceof AudioNode_1.AudioNode) {
            return this.audio(node);
        }
        if (node instanceof VideoNode_1.VideoNode) {
            return this.video(node);
        }
        if (node instanceof RevisionDeletionNode_1.RevisionDeletionNode) {
            return this.revisionDeletion(node);
        }
        if (node instanceof RevisionInsertionNode_1.RevisionInsertionNode) {
            return this.revisionInsertion(node);
        }
        if (node instanceof SpoilerNode_1.SpoilerNode) {
            return this.spoiler(node);
        }
        if (node instanceof PlainTextNode_1.PlainTextNode) {
            return this.plainText(node);
        }
        throw new Error("Unrecognized syntax node");
    };
    Writer.prototype.getId = function () {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i - 0] = arguments[_i];
        }
        var allParts = [this.config.settings.documentName].concat(parts);
        var rawId = allParts.join(' ');
        return (rawId
            .trim()
            .replace(/\s+/g, this.config.settings.i18n.idWordDelimiter));
    };
    Writer.prototype.footnoteId = function (referenceNumber) {
        return this.getId(this.config.settings.i18n.terms.footnote, referenceNumber.toString());
    };
    Writer.prototype.footnoteReferenceId = function (referenceNumber) {
        return this.getId(this.config.settings.i18n.terms.footnoteReference, referenceNumber.toString());
    };
    return Writer;
}());
exports.Writer = Writer;

},{"../SyntaxNodes/AudioNode":66,"../SyntaxNodes/BlockquoteNode":67,"../SyntaxNodes/CodeBlockNode":68,"../SyntaxNodes/DescriptionListNode":71,"../SyntaxNodes/DocumentNode":73,"../SyntaxNodes/EmphasisNode":74,"../SyntaxNodes/FootnoteBlockNode":75,"../SyntaxNodes/FootnoteNode":76,"../SyntaxNodes/HeadingNode":77,"../SyntaxNodes/ImageNode":78,"../SyntaxNodes/InlineCodeNode":79,"../SyntaxNodes/LineBlockNode":82,"../SyntaxNodes/LinkNode":83,"../SyntaxNodes/OrderedListNode":86,"../SyntaxNodes/ParagraphNode":89,"../SyntaxNodes/PlainTextNode":90,"../SyntaxNodes/RevisionDeletionNode":91,"../SyntaxNodes/RevisionInsertionNode":92,"../SyntaxNodes/SectionSeparatorNode":94,"../SyntaxNodes/SpoilerNode":95,"../SyntaxNodes/StressNode":97,"../SyntaxNodes/UnorderedListNode":99,"../SyntaxNodes/VideoNode":100}],106:[function(require,module,exports){
"use strict";
var index_1 = require('./index');
window.Up = index_1.default;

},{"./index":107}],107:[function(require,module,exports){
"use strict";
var Up_1 = require('./Up');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Up_1.Up;

},{"./Up":102}]},{},[106]);
