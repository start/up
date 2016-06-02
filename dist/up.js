(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
function last(items) {
    return items[items.length - 1];
}
exports.last = last;
function swap(items, index1, index2) {
    var firstItem = items[index1];
    items[index1] = items[index2];
    items[index2] = firstItem;
}
exports.swap = swap;
function concat(collections) {
    return (_a = []).concat.apply(_a, [[]].concat(collections));
    var _a;
}
exports.concat = concat;

},{}],2:[function(require,module,exports){
"use strict";
var MediaConvention = (function () {
    function MediaConvention(NodeType, StartTokenType) {
        this.NodeType = NodeType;
        this.StartTokenType = StartTokenType;
    }
    return MediaConvention;
}());
exports.MediaConvention = MediaConvention;

},{}],3:[function(require,module,exports){
"use strict";
var MediaConvention_1 = require('./MediaConvention');
var AudioStartToken_1 = require('./Tokenizing/Tokens/AudioStartToken');
var ImageStartToken_1 = require('./Tokenizing/Tokens/ImageStartToken');
var VideoStartToken_1 = require('./Tokenizing/Tokens/VideoStartToken');
var AudioNode_1 = require('../../SyntaxNodes/AudioNode');
var ImageNode_1 = require('../../SyntaxNodes/ImageNode');
var VideoNode_1 = require('../../SyntaxNodes/VideoNode');
var AUDIO = new MediaConvention_1.MediaConvention(AudioNode_1.AudioNode, AudioStartToken_1.AudioStartToken);
exports.AUDIO = AUDIO;
var IMAGE = new MediaConvention_1.MediaConvention(ImageNode_1.ImageNode, ImageStartToken_1.ImageStartToken);
exports.IMAGE = IMAGE;
var VIDEO = new MediaConvention_1.MediaConvention(VideoNode_1.VideoNode, VideoStartToken_1.VideoStartToken);
exports.VIDEO = VIDEO;

},{"../../SyntaxNodes/AudioNode":78,"../../SyntaxNodes/ImageNode":91,"../../SyntaxNodes/VideoNode":114,"./MediaConvention":2,"./Tokenizing/Tokens/AudioStartToken":26,"./Tokenizing/Tokens/ImageStartToken":31,"./Tokenizing/Tokens/VideoStartToken":56}],4:[function(require,module,exports){
"use strict";
var StressNode_1 = require('../../SyntaxNodes/StressNode');
var EmphasisNode_1 = require('../../SyntaxNodes/EmphasisNode');
var SpoilerNode_1 = require('../../SyntaxNodes/SpoilerNode');
var FootnoteNode_1 = require('../../SyntaxNodes/FootnoteNode');
var RevisionDeletionNode_1 = require('../../SyntaxNodes/RevisionDeletionNode');
var RevisionInsertionNode_1 = require('../../SyntaxNodes/RevisionInsertionNode');
var SquareBracketedNode_1 = require('../../SyntaxNodes/SquareBracketedNode');
var ParenthesizedNode_1 = require('../../SyntaxNodes/ParenthesizedNode');
var ActionNode_1 = require('../../SyntaxNodes/ActionNode');
var ParenthesizedStartToken_1 = require('./Tokenizing/Tokens/ParenthesizedStartToken');
var ParenthesizedEndToken_1 = require('./Tokenizing/Tokens/ParenthesizedEndToken');
var SquareBracketedStartToken_1 = require('./Tokenizing/Tokens/SquareBracketedStartToken');
var SquareBracketedEndToken_1 = require('./Tokenizing/Tokens/SquareBracketedEndToken');
var ActionStartToken_1 = require('./Tokenizing/Tokens/ActionStartToken');
var ActionEndToken_1 = require('./Tokenizing/Tokens/ActionEndToken');
var StressEndToken_1 = require('./Tokenizing/Tokens/StressEndToken');
var StressStartToken_1 = require('./Tokenizing/Tokens/StressStartToken');
var SpoilerEndToken_1 = require('./Tokenizing/Tokens/SpoilerEndToken');
var SpoilerStartToken_1 = require('./Tokenizing/Tokens/SpoilerStartToken');
var EmphasisEndToken_1 = require('./Tokenizing/Tokens/EmphasisEndToken');
var EmphasisStartToken_1 = require('./Tokenizing/Tokens/EmphasisStartToken');
var FootnoteEndToken_1 = require('./Tokenizing/Tokens/FootnoteEndToken');
var FootnoteStartToken_1 = require('./Tokenizing/Tokens/FootnoteStartToken');
var RevisionInsertionStartToken_1 = require('./Tokenizing/Tokens/RevisionInsertionStartToken');
var RevisionInsertionEndToken_1 = require('./Tokenizing/Tokens/RevisionInsertionEndToken');
var RevisionDeletionStartToken_1 = require('./Tokenizing/Tokens/RevisionDeletionStartToken');
var RevisionDeletionEndToken_1 = require('./Tokenizing/Tokens/RevisionDeletionEndToken');
var LinkStartToken_1 = require('./Tokenizing/Tokens/LinkStartToken');
var LinkEndToken_1 = require('./Tokenizing/Tokens/LinkEndToken');
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
    EndTokenType: RevisionDeletionEndToken_1.RevisionDeletionEndToken
};
exports.REVISION_DELETION = REVISION_DELETION;
var REVISION_INSERTION = {
    NodeType: RevisionInsertionNode_1.RevisionInsertionNode,
    StartTokenType: RevisionInsertionStartToken_1.RevisionInsertionStartToken,
    EndTokenType: RevisionInsertionEndToken_1.RevisionInsertionEndToken
};
exports.REVISION_INSERTION = REVISION_INSERTION;
var SPOILER = {
    NodeType: SpoilerNode_1.SpoilerNode,
    StartTokenType: SpoilerStartToken_1.SpoilerStartToken,
    EndTokenType: SpoilerEndToken_1.SpoilerEndToken
};
exports.SPOILER = SPOILER;
var FOOTNOTE = {
    NodeType: FootnoteNode_1.FootnoteNode,
    StartTokenType: FootnoteStartToken_1.FootnoteStartToken,
    EndTokenType: FootnoteEndToken_1.FootnoteEndToken
};
exports.FOOTNOTE = FOOTNOTE;
var PARENTHESIZED = {
    NodeType: ParenthesizedNode_1.ParenthesizedNode,
    StartTokenType: ParenthesizedStartToken_1.ParenthesizedStartToken,
    EndTokenType: ParenthesizedEndToken_1.ParenthesizedEndToken
};
exports.PARENTHESIZED = PARENTHESIZED;
var SQUARE_BRACKETED = {
    NodeType: SquareBracketedNode_1.SquareBracketedNode,
    StartTokenType: SquareBracketedStartToken_1.SquareBracketedStartToken,
    EndTokenType: SquareBracketedEndToken_1.SquareBracketedEndToken
};
exports.SQUARE_BRACKETED = SQUARE_BRACKETED;
var ACTION = {
    NodeType: ActionNode_1.ActionNode,
    StartTokenType: ActionStartToken_1.ActionStartToken,
    EndTokenType: ActionEndToken_1.ActionEndToken
};
exports.ACTION = ACTION;
var LINK = {
    StartTokenType: LinkStartToken_1.LinkStartToken,
    EndTokenType: LinkEndToken_1.LinkEndToken
};
exports.LINK = LINK;

},{"../../SyntaxNodes/ActionNode":77,"../../SyntaxNodes/EmphasisNode":86,"../../SyntaxNodes/FootnoteNode":89,"../../SyntaxNodes/ParenthesizedNode":103,"../../SyntaxNodes/RevisionDeletionNode":105,"../../SyntaxNodes/RevisionInsertionNode":106,"../../SyntaxNodes/SpoilerNode":109,"../../SyntaxNodes/SquareBracketedNode":110,"../../SyntaxNodes/StressNode":111,"./Tokenizing/Tokens/ActionEndToken":24,"./Tokenizing/Tokens/ActionStartToken":25,"./Tokenizing/Tokens/EmphasisEndToken":27,"./Tokenizing/Tokens/EmphasisStartToken":28,"./Tokenizing/Tokens/FootnoteEndToken":29,"./Tokenizing/Tokens/FootnoteStartToken":30,"./Tokenizing/Tokens/LinkEndToken":33,"./Tokenizing/Tokens/LinkStartToken":34,"./Tokenizing/Tokens/ParenthesizedEndToken":39,"./Tokenizing/Tokens/ParenthesizedStartToken":40,"./Tokenizing/Tokens/RevisionDeletionEndToken":46,"./Tokenizing/Tokens/RevisionDeletionStartToken":47,"./Tokenizing/Tokens/RevisionInsertionEndToken":48,"./Tokenizing/Tokens/RevisionInsertionStartToken":49,"./Tokenizing/Tokens/SpoilerEndToken":50,"./Tokenizing/Tokens/SpoilerStartToken":51,"./Tokenizing/Tokens/SquareBracketedEndToken":52,"./Tokenizing/Tokens/SquareBracketedStartToken":53,"./Tokenizing/Tokens/StressEndToken":54,"./Tokenizing/Tokens/StressStartToken":55}],5:[function(require,module,exports){
"use strict";
var FailedGoalTracker = (function () {
    function FailedGoalTracker() {
        this.failedGoalsByTextIndex = {};
    }
    FailedGoalTracker.prototype.registerFailure = function (failedContext) {
        var snapshot = failedContext.snapshot, goal = failedContext.goal;
        var textIndex = snapshot.textIndex;
        if (!this.failedGoalsByTextIndex[textIndex]) {
            this.failedGoalsByTextIndex[textIndex] = [];
        }
        this.failedGoalsByTextIndex[textIndex].push(goal);
    };
    FailedGoalTracker.prototype.hasFailed = function (goal, textIndex) {
        var failedGoals = (this.failedGoalsByTextIndex[textIndex] || []);
        return failedGoals.some(function (failedGoal) { return failedGoal === goal; });
    };
    return FailedGoalTracker;
}());
exports.FailedGoalTracker = FailedGoalTracker;

},{}],6:[function(require,module,exports){
"use strict";
var Patterns_1 = require('../../../Patterns');
var InlineConsumer = (function () {
    function InlineConsumer(entireText) {
        this.entireText = entireText;
        this.textIndex = 0;
        this.setTextIndex(0);
    }
    InlineConsumer.prototype.advanceTextIndex = function (length) {
        this.setTextIndex(this.textIndex + length);
    };
    InlineConsumer.prototype.reachedEndOfText = function () {
        return this.textIndex >= this.entireText.length;
    };
    InlineConsumer.prototype.advanceAfterMatch = function (args) {
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
        this.advanceTextIndex(match.length);
        return true;
    };
    InlineConsumer.prototype.setTextIndex = function (countCharsConsumed) {
        this.textIndex = countCharsConsumed;
        this.updateComputedTextFields();
    };
    InlineConsumer.prototype.updateComputedTextFields = function () {
        this.remainingText = this.entireText.substr(this.textIndex);
        this.currentChar = this.remainingText[0];
        var previousChar = this.entireText[this.textIndex - 1];
        this.isTouchingWordEnd = NON_WHITESPACE_CHAR_PATTERN.test(previousChar);
    };
    return InlineConsumer;
}());
exports.InlineConsumer = InlineConsumer;
var NON_WHITESPACE_CHAR_PATTERN = new RegExp(Patterns_1.NON_WHITESPACE_CHAR);

},{"../../../Patterns":76}],7:[function(require,module,exports){
"use strict";
var MediaConvention = (function () {
    function MediaConvention(nonLocalizedTerm, StartTokenType, goal) {
        this.nonLocalizedTerm = nonLocalizedTerm;
        this.StartTokenType = StartTokenType;
        this.goal = goal;
    }
    return MediaConvention;
}());
exports.MediaConvention = MediaConvention;

},{}],8:[function(require,module,exports){
"use strict";
var MediaConvention_1 = require('./MediaConvention');
var AudioStartToken_1 = require('./Tokens/AudioStartToken');
var ImageStartToken_1 = require('./Tokens/ImageStartToken');
var VideoStartToken_1 = require('./Tokens/VideoStartToken');
var TokenizerGoal_1 = require('./TokenizerGoal');
var AUDIO = new MediaConvention_1.MediaConvention('audio', AudioStartToken_1.AudioStartToken, TokenizerGoal_1.TokenizerGoal.Audio);
exports.AUDIO = AUDIO;
var IMAGE = new MediaConvention_1.MediaConvention('image', ImageStartToken_1.ImageStartToken, TokenizerGoal_1.TokenizerGoal.Image);
exports.IMAGE = IMAGE;
var VIDEO = new MediaConvention_1.MediaConvention('video', VideoStartToken_1.VideoStartToken, TokenizerGoal_1.TokenizerGoal.Video);
exports.VIDEO = VIDEO;

},{"./MediaConvention":7,"./TokenizerGoal":22,"./Tokens/AudioStartToken":26,"./Tokens/ImageStartToken":31,"./Tokens/VideoStartToken":56}],9:[function(require,module,exports){
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

},{"../Tokens/EmphasisEndToken":27,"../Tokens/StressEndToken":54,"./RaisedVoiceMarker":11,"./StartMarker":12}],10:[function(require,module,exports){
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

},{"../Tokens/PlainTextToken":41,"./RaisedVoiceMarker":11}],11:[function(require,module,exports){
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
            throw new Error("Marker at index " + this.originalTokenIndex + " only spent " + countAsterisksInCommonWithMatchingDelimiter + " to open stress and emphasis");
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

},{}],12:[function(require,module,exports){
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

},{"../Tokens/EmphasisStartToken":28,"../Tokens/StressStartToken":55,"./RaisedVoiceMarker":11}],13:[function(require,module,exports){
"use strict";
var StartMarker_1 = require('./StartMarker');
var EndMarker_1 = require('./EndMarker');
var PlainTextMarker_1 = require('./PlainTextMarker');
var PotentialRaisedVoiceEndToken_1 = require('../Tokens/PotentialRaisedVoiceEndToken');
var PotentialRaisedVoiceStartOrEndToken_1 = require('../Tokens/PotentialRaisedVoiceStartOrEndToken');
var PotentialRaisedVoiceStartToken_1 = require('../Tokens/PotentialRaisedVoiceStartToken');
function applyRaisedVoices(tokens) {
    var raisedVoiceMarkers = getRaisedVoiceMarkers(tokens);
    var resultTokens = tokens.slice();
    for (var _i = 0, _a = raisedVoiceMarkers.sort(comapreMarkersDescending); _i < _a.length; _i++) {
        var marker = _a[_i];
        resultTokens.splice.apply(resultTokens, [marker.originalTokenIndex, 1].concat(marker.tokens()));
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
function comapreMarkersDescending(a, b) {
    return b.originalTokenIndex - a.originalTokenIndex;
}

},{"../Tokens/PotentialRaisedVoiceEndToken":42,"../Tokens/PotentialRaisedVoiceStartOrEndToken":43,"../Tokens/PotentialRaisedVoiceStartToken":44,"./EndMarker":9,"./PlainTextMarker":10,"./StartMarker":12}],14:[function(require,module,exports){
"use strict";
var ParenthesizedStartToken_1 = require('./Tokens/ParenthesizedStartToken');
var ParenthesizedEndToken_1 = require('./Tokens/ParenthesizedEndToken');
var SquareBracketedStartToken_1 = require('./Tokens/SquareBracketedStartToken');
var SquareBracketedEndToken_1 = require('./Tokens/SquareBracketedEndToken');
var ActionStartToken_1 = require('./Tokens/ActionStartToken');
var ActionEndToken_1 = require('./Tokens/ActionEndToken');
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
var TokenizerGoal_1 = require('./TokenizerGoal');
var EMPHASIS = {
    StartTokenType: EmphasisStartToken_1.EmphasisStartToken,
    EndTokenType: EmphasisEndToken_1.EmphasisEndToken,
};
exports.EMPHASIS = EMPHASIS;
var STRESS = {
    StartTokenType: StressStartToken_1.StressStartToken,
    EndTokenType: StressEndToken_1.StressEndToken,
};
exports.STRESS = STRESS;
var REVISION_DELETION = {
    StartTokenType: RevisionDeletionStartToken_1.RevisionDeletionStartToken,
    EndTokenType: RevisionDeletionEndToken_1.RevisionDeletionEndToken,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.RevisionDeletion
};
exports.REVISION_DELETION = REVISION_DELETION;
var REVISION_INSERTION = {
    StartTokenType: RevisionInsertionStartToken_1.RevisionInsertionStartToken,
    EndTokenType: RevisionInsertionEndToken_1.RevisionInsertionEndToken,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.RevisionInsertion
};
exports.REVISION_INSERTION = REVISION_INSERTION;
var SPOILER = {
    StartTokenType: SpoilerStartToken_1.SpoilerStartToken,
    EndTokenType: SpoilerEndToken_1.SpoilerEndToken,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.Spoiler
};
exports.SPOILER = SPOILER;
var FOOTNOTE = {
    StartTokenType: FootnoteStartToken_1.FootnoteStartToken,
    EndTokenType: FootnoteEndToken_1.FootnoteEndToken,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.Footnote
};
exports.FOOTNOTE = FOOTNOTE;
var PARENTHESIZED = {
    StartTokenType: ParenthesizedStartToken_1.ParenthesizedStartToken,
    EndTokenType: ParenthesizedEndToken_1.ParenthesizedEndToken,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.Parenthesized
};
exports.PARENTHESIZED = PARENTHESIZED;
var SQUARE_BRACKETED = {
    StartTokenType: SquareBracketedStartToken_1.SquareBracketedStartToken,
    EndTokenType: SquareBracketedEndToken_1.SquareBracketedEndToken,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.SquareBracketed
};
exports.SQUARE_BRACKETED = SQUARE_BRACKETED;
var ACTION = {
    StartTokenType: ActionStartToken_1.ActionStartToken,
    EndTokenType: ActionEndToken_1.ActionEndToken,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.Action
};
exports.ACTION = ACTION;
var LINK = {
    StartTokenType: LinkStartToken_1.LinkStartToken,
    EndTokenType: LinkEndToken_1.LinkEndToken,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.Link
};
exports.LINK = LINK;

},{"./TokenizerGoal":22,"./Tokens/ActionEndToken":24,"./Tokens/ActionStartToken":25,"./Tokens/EmphasisEndToken":27,"./Tokens/EmphasisStartToken":28,"./Tokens/FootnoteEndToken":29,"./Tokens/FootnoteStartToken":30,"./Tokens/LinkEndToken":33,"./Tokens/LinkStartToken":34,"./Tokens/ParenthesizedEndToken":39,"./Tokens/ParenthesizedStartToken":40,"./Tokens/RevisionDeletionEndToken":46,"./Tokens/RevisionDeletionStartToken":47,"./Tokens/RevisionInsertionEndToken":48,"./Tokens/RevisionInsertionStartToken":49,"./Tokens/SpoilerEndToken":50,"./Tokens/SpoilerStartToken":51,"./Tokens/SquareBracketedEndToken":52,"./Tokens/SquareBracketedStartToken":53,"./Tokens/StressEndToken":54,"./Tokens/StressStartToken":55}],15:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextualizedToken_1 = require('./ContextualizedToken');
var ContextualizedEndToken = (function (_super) {
    __extends(ContextualizedEndToken, _super);
    function ContextualizedEndToken(originalToken, convention) {
        _super.call(this, originalToken);
        this.originalToken = originalToken;
        this.convention = convention;
    }
    return ContextualizedEndToken;
}(ContextualizedToken_1.ContextualizedToken));
exports.ContextualizedEndToken = ContextualizedEndToken;

},{"./ContextualizedToken":17}],16:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextualizedToken_1 = require('./ContextualizedToken');
var ContextualizedStartToken = (function (_super) {
    __extends(ContextualizedStartToken, _super);
    function ContextualizedStartToken(originalToken, convention) {
        _super.call(this, originalToken);
        this.originalToken = originalToken;
        this.convention = convention;
    }
    return ContextualizedStartToken;
}(ContextualizedToken_1.ContextualizedToken));
exports.ContextualizedStartToken = ContextualizedStartToken;

},{"./ContextualizedToken":17}],17:[function(require,module,exports){
"use strict";
var ContextualizedToken = (function () {
    function ContextualizedToken(originalToken) {
        this.originalToken = originalToken;
    }
    return ContextualizedToken;
}());
exports.ContextualizedToken = ContextualizedToken;

},{}],18:[function(require,module,exports){
"use strict";
var RichConventions_1 = require('../RichConventions');
var ContextualizedToken_1 = require('./ContextualizedToken');
var ContextualizedStartToken_1 = require('./ContextualizedStartToken');
var ContextualizedEndToken_1 = require('./ContextualizedEndToken');
var RICH_CONVENTIONS = [
    RichConventions_1.LINK, RichConventions_1.STRESS, RichConventions_1.EMPHASIS,
    RichConventions_1.REVISION_DELETION,
    RichConventions_1.REVISION_INSERTION,
    RichConventions_1.SPOILER,
    RichConventions_1.FOOTNOTE,
    RichConventions_1.PARENTHESIZED,
    RichConventions_1.SQUARE_BRACKETED,
    RichConventions_1.ACTION
];
function contextualizeTokens(tokens) {
    var resultTokens = [];
    var openStartTokens = [];
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        var conventionStartedByToken = getConventionStartedBy(token, RICH_CONVENTIONS);
        if (conventionStartedByToken) {
            var startToken = new ContextualizedStartToken_1.ContextualizedStartToken(token, conventionStartedByToken);
            resultTokens.push(startToken);
            openStartTokens.push(startToken);
            continue;
        }
        var conventionEndedByToken = getConventionEndedBy(token, RICH_CONVENTIONS);
        if (conventionEndedByToken) {
            var endToken = new ContextualizedEndToken_1.ContextualizedEndToken(token, conventionEndedByToken);
            resultTokens.push(endToken);
            for (var i = openStartTokens.length - 1; i >= 0; i--) {
                var startToken = openStartTokens[i];
                if (token instanceof startToken.convention.EndTokenType) {
                    startToken.end = endToken;
                    endToken.start = startToken;
                    openStartTokens.splice(i, 1);
                    break;
                }
            }
            continue;
        }
        resultTokens.push(new ContextualizedToken_1.ContextualizedToken(token));
    }
    return resultTokens;
}
exports.contextualizeTokens = contextualizeTokens;
function getConventionStartedBy(token, conventions) {
    return conventions.filter(function (convention) {
        return token instanceof convention.StartTokenType;
    })[0];
}
exports.getConventionStartedBy = getConventionStartedBy;
function getConventionEndedBy(token, conventions) {
    return conventions.filter(function (convention) {
        return token instanceof convention.EndTokenType;
    })[0];
}

},{"../RichConventions":14,"./ContextualizedEndToken":15,"./ContextualizedStartToken":16,"./ContextualizedToken":17}],19:[function(require,module,exports){
"use strict";
var Patterns_1 = require('../../../Patterns');
var TokenizableMedia = (function () {
    function TokenizableMedia(media, localizedTerm) {
        this.StartTokenType = media.StartTokenType;
        this.goal = media.goal;
        this.startPattern = getPattern(Patterns_1.escapeForRegex('[' + localizedTerm + ':') + Patterns_1.ANY_WHITESPACE, 'i');
        this.endPattern = getPattern(Patterns_1.escapeForRegex(']'));
    }
    return TokenizableMedia;
}());
exports.TokenizableMedia = TokenizableMedia;
function getPattern(pattern, flags) {
    return new RegExp(Patterns_1.startsWith(pattern), flags);
}

},{"../../../Patterns":76}],20:[function(require,module,exports){
"use strict";
var Patterns_1 = require('../../../Patterns');
var TokenizableSandwich = (function () {
    function TokenizableSandwich(args) {
        this.goal = args.goal;
        this.startPattern = new RegExp(Patterns_1.startsWith(args.startPattern), 'i');
        this.endPattern = new RegExp(Patterns_1.startsWith(args.endPattern), 'i');
        this.onOpen = args.onOpen;
        this.onClose = args.onClose;
    }
    return TokenizableSandwich;
}());
exports.TokenizableSandwich = TokenizableSandwich;

},{"../../../Patterns":76}],21:[function(require,module,exports){
"use strict";
var Patterns_1 = require('../../../Patterns');
var RichConventions_1 = require('./RichConventions');
var MediaConventions_1 = require('./MediaConventions');
var applyRaisedVoices_1 = require('./RaisedVoices/applyRaisedVoices');
var nestOverlappingConventions_1 = require('./nestOverlappingConventions');
var MediaDescriptionToken_1 = require('./Tokens/MediaDescriptionToken');
var MediaEndToken_1 = require('./Tokens/MediaEndToken');
var TokenizerGoal_1 = require('./TokenizerGoal');
var TokenizableSandwich_1 = require('./TokenizableSandwich');
var TokenizableMedia_1 = require('./TokenizableMedia');
var FailedGoalTracker_1 = require('./FailedGoalTracker');
var TokenizerSnapshot_1 = require('./TokenizerSnapshot');
var InlineConsumer_1 = require('./InlineConsumer');
var InlineCodeToken_1 = require('./Tokens/InlineCodeToken');
var PlainTextToken_1 = require('./Tokens/PlainTextToken');
var NakedUrlStartToken_1 = require('./Tokens/NakedUrlStartToken');
var NakedUrlEndToken_1 = require('./Tokens/NakedUrlEndToken');
var PotentialRaisedVoiceEndToken_1 = require('./Tokens/PotentialRaisedVoiceEndToken');
var PotentialRaisedVoiceStartOrEndToken_1 = require('./Tokens/PotentialRaisedVoiceStartOrEndToken');
var PotentialRaisedVoiceStartToken_1 = require('./Tokens/PotentialRaisedVoiceStartToken');
var Tokenizer = (function () {
    function Tokenizer(entireText, config) {
        this.tokens = [];
        this.openContexts = [];
        this.failedGoalTracker = new FailedGoalTracker_1.FailedGoalTracker();
        this.bufferedText = '';
        this.consumer = new InlineConsumer_1.InlineConsumer(entireText);
        this.configureConventions(config);
        this.tokenize();
    }
    Tokenizer.prototype.configureConventions = function (config) {
        var _this = this;
        this.mediaConventions =
            [MediaConventions_1.AUDIO, MediaConventions_1.IMAGE, MediaConventions_1.VIDEO].map(function (media) {
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
        this.actionConvention =
            this.getRichSandwich({
                richConvention: RichConventions_1.ACTION,
                startPattern: Patterns_1.OPEN_CURLY_BRACKET,
                endPattern: Patterns_1.CLOSE_CURLY_BRACKET,
            });
        this.parenthesizedRawTextConvention =
            this.getBracketInsideUrlConvention({
                goal: TokenizerGoal_1.TokenizerGoal.ParenthesizedInRawText,
                openBracketPattern: Patterns_1.OPEN_PAREN,
                closeBracketPattern: Patterns_1.CLOSE_PAREN
            });
        this.squareBracketedRawTextConvention =
            this.getBracketInsideUrlConvention({
                goal: TokenizerGoal_1.TokenizerGoal.SquareBracketedInRawText,
                openBracketPattern: Patterns_1.OPEN_SQUARE_BRACKET,
                closeBracketPattern: Patterns_1.CLOSE_SQUARE_BRACKET
            });
        this.curlyBracketedRawTextConvention =
            this.getBracketInsideUrlConvention({
                goal: TokenizerGoal_1.TokenizerGoal.CurlyBracketedInRawText,
                openBracketPattern: Patterns_1.OPEN_CURLY_BRACKET,
                closeBracketPattern: Patterns_1.CLOSE_CURLY_BRACKET
            });
        this.inlineCodeConvention =
            new TokenizableSandwich_1.TokenizableSandwich({
                goal: TokenizerGoal_1.TokenizerGoal.InlineCode,
                startPattern: '`',
                endPattern: '`',
                onOpen: function () { return _this.flushBufferToPlainTextToken(); },
                onClose: function () { return _this.addToken(new InlineCodeToken_1.InlineCodeToken(_this.flushBufferedText())); }
            });
        this.sandwichesThatCanAppearInRegularContent = [
            this.inlineCodeConvention,
            this.spoilerConvention,
            this.footnoteConvention,
            this.revisionDeletionConvention,
            this.revisionInsertionConvention,
            this.actionConvention,
            this.parenthesizedConvention,
            this.squareBracketedConvention
        ];
        this.allSandwiches = this.sandwichesThatCanAppearInRegularContent.concat([
            this.squareBracketedRawTextConvention,
            this.parenthesizedRawTextConvention,
            this.curlyBracketedRawTextConvention
        ]);
    };
    Tokenizer.prototype.tokenize = function () {
        while (!(this.consumer.reachedEndOfText() && this.resolveOpenContexts())) {
            this.tryToCollectCurrentCharIfEscaped()
                || this.tryToCloseOrAdvanceOpenContexts()
                || (this.hasGoal(TokenizerGoal_1.TokenizerGoal.NakedUrl) && this.handleNakedUrl())
                || this.tryToTokenizeRaisedVoicePlaceholders()
                || this.tryToOpenMedia()
                || this.tryToOpenAnySandwichThatCanAppearInRegularContent()
                || this.tryToOpenNakedUrl()
                || this.bufferCurrentChar();
        }
        this.tokens =
            nestOverlappingConventions_1.nestOverlappingConventions(applyRaisedVoices_1.applyRaisedVoices(this.addPlainTextBrackets()));
    };
    Tokenizer.prototype.tryToCloseOrAdvanceOpenContexts = function () {
        for (var i = this.openContexts.length - 1; i >= 0; i--) {
            if (this.tryToCloseOrAdvanceContext(this.openContexts[i])) {
                return true;
            }
        }
        return false;
    };
    Tokenizer.prototype.handleNakedUrl = function () {
        return (this.tryToOpenParenthesizedRawText()
            || this.tryToOpenSquareBracketedRawText()
            || this.tryToOpenCurlyBracketedRawText()
            || this.tryToCloseNakedUrl()
            || this.bufferCurrentChar());
    };
    Tokenizer.prototype.tryToCloseOrAdvanceContext = function (context) {
        var goal = context.goal;
        return (this.tryToCloseSandwichCorrespondingToGoal(goal)
            || this.handleMediaCorrespondingToGoal(goal)
            || ((goal === TokenizerGoal_1.TokenizerGoal.InlineCode) && this.bufferCurrentChar())
            || ((goal === TokenizerGoal_1.TokenizerGoal.MediaUrl) && this.closeMediaOrAppendCharToUrl()));
    };
    Tokenizer.prototype.closeMediaOrAppendCharToUrl = function () {
        return (this.tryToOpenSquareBracketedRawText()
            || this.tryToCloseMedia()
            || this.bufferCurrentChar());
    };
    Tokenizer.prototype.tryToCloseSandwichCorrespondingToGoal = function (goal) {
        var _this = this;
        return this.allSandwiches.some(function (sandwich) { return (sandwich.goal === goal) && _this.tryToCloseSandwich(sandwich); });
    };
    Tokenizer.prototype.handleMediaCorrespondingToGoal = function (goal) {
        var _this = this;
        return this.mediaConventions
            .some(function (media) {
            return (media.goal === goal)
                && (_this.tryToOpenMediaUrl()
                    || _this.tryToOpenSquareBracketedRawText()
                    || _this.tryToCloseFalseMediaConvention(goal)
                    || _this.bufferCurrentChar());
        });
    };
    Tokenizer.prototype.tryToCloseFalseMediaConvention = function (mediaGoal) {
        if (!CLOSE_SQUARE_BRACKET_PATTERN.test(this.consumer.remainingText)) {
            return false;
        }
        this.failMostRecentContextWithGoalAndResetToBeforeIt(mediaGoal);
        return true;
    };
    Tokenizer.prototype.tryToOpenAnySandwichThatCanAppearInRegularContent = function () {
        var _this = this;
        return this.sandwichesThatCanAppearInRegularContent
            .some(function (sandwich) { return _this.tryToOpenSandwich(sandwich); });
    };
    Tokenizer.prototype.tryToOpenParenthesizedRawText = function () {
        return this.tryToOpenSandwich(this.parenthesizedRawTextConvention);
    };
    Tokenizer.prototype.tryToOpenSquareBracketedRawText = function () {
        return this.tryToOpenSandwich(this.squareBracketedRawTextConvention);
    };
    Tokenizer.prototype.tryToOpenCurlyBracketedRawText = function () {
        return this.tryToOpenSandwich(this.curlyBracketedRawTextConvention);
    };
    Tokenizer.prototype.tryToCollectCurrentCharIfEscaped = function () {
        var ESCAPE_CHAR = '\\';
        if (this.consumer.currentChar !== ESCAPE_CHAR) {
            return false;
        }
        this.consumer.advanceTextIndex(1);
        return (this.consumer.reachedEndOfText()
            || this.bufferCurrentChar());
    };
    Tokenizer.prototype.tryToOpenNakedUrl = function () {
        var _this = this;
        return this.tryToOpenConvention({
            goal: TokenizerGoal_1.TokenizerGoal.NakedUrl,
            pattern: NAKED_URL_START_PATTERN,
            then: function (urlProtocol) {
                _this.addTokenAfterFlushingBufferToPlainTextToken(new NakedUrlStartToken_1.NakedUrlStartToken(urlProtocol));
            }
        });
    };
    Tokenizer.prototype.tryToCloseNakedUrl = function () {
        if (WHITESPACE_CHAR_PATTERN.test(this.consumer.currentChar)) {
            this.closeNakedUrl();
            return true;
        }
        return false;
    };
    Tokenizer.prototype.tryToOpenMedia = function () {
        var _this = this;
        return this.mediaConventions.some(function (media) {
            return _this.tryToOpenConvention({
                goal: media.goal,
                pattern: media.startPattern,
                then: function () {
                    _this.addTokenAfterFlushingBufferToPlainTextToken(new media.StartTokenType());
                }
            });
        });
    };
    Tokenizer.prototype.tryToOpenMediaUrl = function () {
        var _this = this;
        return this.tryToOpenConvention({
            goal: TokenizerGoal_1.TokenizerGoal.MediaUrl,
            pattern: URL_ARROW_PATTERN_DEPCRECATED,
            then: function () {
                _this.addToken(new MediaDescriptionToken_1.MediaDescriptionToken(_this.flushBufferedText()));
            }
        });
    };
    Tokenizer.prototype.tryToCloseMedia = function () {
        var _this = this;
        return this.consumer.advanceAfterMatch({
            pattern: MEDIA_END_PATTERN_DEPCRECATED,
            then: function () {
                _this.addToken(new MediaEndToken_1.MediaEndToken(_this.flushBufferedText()));
                _this.closeMostRecentContextWithGoal(TokenizerGoal_1.TokenizerGoal.MediaUrl);
                _this.openContexts.pop();
            }
        });
    };
    Tokenizer.prototype.closeNakedUrl = function () {
        this.flushBufferedTextToNakedUrlToken();
        this.closeMostRecentContextWithGoalAndAnyInnerContexts(TokenizerGoal_1.TokenizerGoal.NakedUrl);
    };
    Tokenizer.prototype.tryToOpenSandwich = function (sandwich) {
        return this.tryToOpenConvention({
            goal: sandwich.goal,
            pattern: sandwich.startPattern,
            then: sandwich.onOpen
        });
    };
    Tokenizer.prototype.tryToCloseSandwich = function (sandwich) {
        var _this = this;
        return this.consumer.advanceAfterMatch({
            pattern: sandwich.endPattern,
            then: function (match, isTouchingWordEnd, isTouchingWordStart) {
                var captures = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    captures[_i - 3] = arguments[_i];
                }
                _this.closeMostRecentContextWithGoal(sandwich.goal);
                sandwich.onClose.apply(sandwich, [match, isTouchingWordEnd, isTouchingWordStart].concat(captures));
            }
        });
    };
    Tokenizer.prototype.tryToOpenConvention = function (args) {
        var _this = this;
        var goal = args.goal, pattern = args.pattern, then = args.then;
        return this.canTry(goal) && this.consumer.advanceAfterMatch({
            pattern: pattern,
            then: function (match, isTouchingWordEnd, isTouchingWordStart) {
                var captures = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    captures[_i - 3] = arguments[_i];
                }
                _this.openContext({ goal: goal });
                then.apply(void 0, [match, isTouchingWordEnd, isTouchingWordStart].concat(captures));
            }
        });
    };
    Tokenizer.prototype.openContext = function (args) {
        this.openContexts.push(this.getContext({ goal: args.goal }));
    };
    Tokenizer.prototype.getContext = function (args) {
        return {
            goal: args.goal,
            snapshot: this.getSnapshot()
        };
    };
    Tokenizer.prototype.getSnapshot = function () {
        return new TokenizerSnapshot_1.TokenizerSnapshot({
            textIndex: this.consumer.textIndex,
            tokens: this.tokens,
            openContexts: this.openContexts,
            bufferedText: this.bufferedText
        });
    };
    Tokenizer.prototype.resolveOpenContexts = function () {
        while (this.openContexts.length) {
            var context_1 = this.openContexts.pop();
            switch (context_1.goal) {
                case TokenizerGoal_1.TokenizerGoal.NakedUrl:
                    this.flushBufferedTextToNakedUrlToken();
                    break;
                case TokenizerGoal_1.TokenizerGoal.Parenthesized:
                case TokenizerGoal_1.TokenizerGoal.SquareBracketed:
                case TokenizerGoal_1.TokenizerGoal.ParenthesizedInRawText:
                case TokenizerGoal_1.TokenizerGoal.SquareBracketedInRawText:
                case TokenizerGoal_1.TokenizerGoal.CurlyBracketedInRawText:
                case TokenizerGoal_1.TokenizerGoal.MediaUrl:
                    break;
                default:
                    this.backtrackToBeforeContext(context_1);
                    return false;
            }
        }
        this.flushBufferToPlainTextToken();
        return true;
    };
    Tokenizer.prototype.backtrackToBeforeContext = function (context) {
        this.failedGoalTracker.registerFailure(context);
        this.tokens = context.snapshot.tokens;
        this.openContexts = context.snapshot.openContexts;
        this.bufferedText = context.snapshot.bufferedText;
        this.consumer.setTextIndex(context.snapshot.textIndex);
    };
    Tokenizer.prototype.failMostRecentContextWithGoalAndResetToBeforeIt = function (goal) {
        while (this.openContexts.length) {
            var context_2 = this.openContexts.pop();
            if (context_2.goal === goal) {
                this.backtrackToBeforeContext(context_2);
                return;
            }
        }
        throw new Error("Goal was missing: " + TokenizerGoal_1.TokenizerGoal[goal]);
    };
    Tokenizer.prototype.closeMostRecentContextWithGoal = function (goal) {
        for (var i = this.openContexts.length - 1; i >= 0; i--) {
            var context_3 = this.openContexts[i];
            if (context_3.goal === goal) {
                this.openContexts.splice(i, 1);
                return;
            }
            if (context_3.goal === TokenizerGoal_1.TokenizerGoal.NakedUrl) {
                this.closeNakedUrl();
            }
        }
        throw new Error("Goal was missing: " + TokenizerGoal_1.TokenizerGoal[goal]);
    };
    Tokenizer.prototype.closeMostRecentContextWithGoalAndAnyInnerContexts = function (goal) {
        while (this.openContexts.length) {
            var context_4 = this.openContexts.pop();
            if (context_4.goal === goal) {
                return;
            }
        }
        throw new Error("Goal was missing: " + TokenizerGoal_1.TokenizerGoal[goal]);
    };
    Tokenizer.prototype.getIndexOfInnermostContextWithGoal = function (goal) {
        for (var i = this.openContexts.length - 1; i >= 0; i--) {
            if (this.openContexts[i].goal === goal) {
                return i;
            }
        }
        throw new Error("Goal was missing: " + TokenizerGoal_1.TokenizerGoal[goal]);
    };
    Tokenizer.prototype.flushBufferedTextToNakedUrlToken = function () {
        this.addToken(new NakedUrlEndToken_1.NakedUrlEndToken(this.flushBufferedText()));
    };
    Tokenizer.prototype.addTokenAfterFlushingBufferToPlainTextToken = function (token) {
        this.flushBufferToPlainTextToken();
        this.addToken(token);
    };
    Tokenizer.prototype.hasGoal = function (goal) {
        return this.openContexts.some(function (context) { return context.goal === goal; });
    };
    Tokenizer.prototype.getRichSandwich = function (args) {
        var _this = this;
        var startPattern = args.startPattern, endPattern = args.endPattern, richConvention = args.richConvention;
        return new TokenizableSandwich_1.TokenizableSandwich({
            goal: richConvention.tokenizerGoal,
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
            goal: args.goal,
            startPattern: args.openBracketPattern,
            endPattern: args.closeBracketPattern,
            onOpen: bufferBracket,
            onClose: bufferBracket
        });
    };
    Tokenizer.prototype.tryToTokenizeRaisedVoicePlaceholders = function () {
        var _this = this;
        return this.consumer.advanceAfterMatch({
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
    Tokenizer.prototype.addPlainTextBrackets = function () {
        var resultTokens = [];
        var _loop_1 = function(token) {
            function addBracketIfTokenIs(bracket, TokenType) {
                if (token instanceof TokenType) {
                    resultTokens.push(new PlainTextToken_1.PlainTextToken(bracket));
                }
            }
            addBracketIfTokenIs(')', RichConventions_1.PARENTHESIZED.EndTokenType);
            addBracketIfTokenIs(']', RichConventions_1.SQUARE_BRACKETED.EndTokenType);
            resultTokens.push(token);
            addBracketIfTokenIs('(', RichConventions_1.PARENTHESIZED.StartTokenType);
            addBracketIfTokenIs('[', RichConventions_1.SQUARE_BRACKETED.StartTokenType);
        };
        for (var _i = 0, _a = this.tokens; _i < _a.length; _i++) {
            var token = _a[_i];
            _loop_1(token);
        }
        return resultTokens;
    };
    Tokenizer.prototype.addToken = function (token) {
        this.tokens.push(token);
    };
    Tokenizer.prototype.bufferCurrentChar = function () {
        this.bufferedText += this.consumer.currentChar;
        this.consumer.advanceTextIndex(1);
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
    Tokenizer.prototype.canTry = function (goal, textIndex) {
        if (textIndex === void 0) { textIndex = this.consumer.textIndex; }
        return !this.failedGoalTracker.hasFailed(goal, textIndex);
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
var RAISED_VOICE_DELIMITER_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.atLeast(1, Patterns_1.escapeForRegex('*'))));
var URL_ARROW_PATTERN_DEPCRECATED = new RegExp(Patterns_1.startsWith(Patterns_1.ANY_WHITESPACE + '->' + Patterns_1.ANY_WHITESPACE));
var MEDIA_END_PATTERN_DEPCRECATED = new RegExp(Patterns_1.startsWith(Patterns_1.CLOSE_SQUARE_BRACKET));
var NAKED_URL_START_PATTERN = new RegExp(Patterns_1.startsWith('http' + Patterns_1.optional('s') + '://'));
var WHITESPACE_CHAR_PATTERN = new RegExp(Patterns_1.WHITESPACE_CHAR);
var NON_WHITESPACE_CHAR_PATTERN = new RegExp(Patterns_1.NON_WHITESPACE_CHAR);
var CLOSE_SQUARE_BRACKET_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.CLOSE_SQUARE_BRACKET));

},{"../../../Patterns":76,"./FailedGoalTracker":5,"./InlineConsumer":6,"./MediaConventions":8,"./RaisedVoices/applyRaisedVoices":13,"./RichConventions":14,"./TokenizableMedia":19,"./TokenizableSandwich":20,"./TokenizerGoal":22,"./TokenizerSnapshot":23,"./Tokens/InlineCodeToken":32,"./Tokens/MediaDescriptionToken":35,"./Tokens/MediaEndToken":36,"./Tokens/NakedUrlEndToken":37,"./Tokens/NakedUrlStartToken":38,"./Tokens/PlainTextToken":41,"./Tokens/PotentialRaisedVoiceEndToken":42,"./Tokens/PotentialRaisedVoiceStartOrEndToken":43,"./Tokens/PotentialRaisedVoiceStartToken":44,"./nestOverlappingConventions":57}],22:[function(require,module,exports){
"use strict";
(function (TokenizerGoal) {
    TokenizerGoal[TokenizerGoal["InlineCode"] = 0] = "InlineCode";
    TokenizerGoal[TokenizerGoal["Footnote"] = 1] = "Footnote";
    TokenizerGoal[TokenizerGoal["Spoiler"] = 2] = "Spoiler";
    TokenizerGoal[TokenizerGoal["Parenthesized"] = 3] = "Parenthesized";
    TokenizerGoal[TokenizerGoal["SquareBracketed"] = 4] = "SquareBracketed";
    TokenizerGoal[TokenizerGoal["Action"] = 5] = "Action";
    TokenizerGoal[TokenizerGoal["ParenthesizedInRawText"] = 6] = "ParenthesizedInRawText";
    TokenizerGoal[TokenizerGoal["SquareBracketedInRawText"] = 7] = "SquareBracketedInRawText";
    TokenizerGoal[TokenizerGoal["CurlyBracketedInRawText"] = 8] = "CurlyBracketedInRawText";
    TokenizerGoal[TokenizerGoal["Link"] = 9] = "Link";
    TokenizerGoal[TokenizerGoal["LinkUrl"] = 10] = "LinkUrl";
    TokenizerGoal[TokenizerGoal["RevisionInsertion"] = 11] = "RevisionInsertion";
    TokenizerGoal[TokenizerGoal["RevisionDeletion"] = 12] = "RevisionDeletion";
    TokenizerGoal[TokenizerGoal["Audio"] = 13] = "Audio";
    TokenizerGoal[TokenizerGoal["Image"] = 14] = "Image";
    TokenizerGoal[TokenizerGoal["Video"] = 15] = "Video";
    TokenizerGoal[TokenizerGoal["MediaUrl"] = 16] = "MediaUrl";
    TokenizerGoal[TokenizerGoal["NakedUrl"] = 17] = "NakedUrl";
})(exports.TokenizerGoal || (exports.TokenizerGoal = {}));
var TokenizerGoal = exports.TokenizerGoal;

},{}],23:[function(require,module,exports){
"use strict";
var TokenizerSnapshot = (function () {
    function TokenizerSnapshot(args) {
        this.textIndex = args.textIndex;
        this.tokens = args.tokens.slice();
        this.openContexts = args.openContexts.slice();
        this.bufferedText = args.bufferedText;
    }
    return TokenizerSnapshot;
}());
exports.TokenizerSnapshot = TokenizerSnapshot;

},{}],24:[function(require,module,exports){
"use strict";
var ActionEndToken = (function () {
    function ActionEndToken() {
    }
    ActionEndToken.prototype.token = function () { };
    return ActionEndToken;
}());
exports.ActionEndToken = ActionEndToken;

},{}],25:[function(require,module,exports){
"use strict";
var ActionStartToken = (function () {
    function ActionStartToken() {
    }
    ActionStartToken.prototype.token = function () { };
    return ActionStartToken;
}());
exports.ActionStartToken = ActionStartToken;

},{}],26:[function(require,module,exports){
"use strict";
var AudioStartToken = (function () {
    function AudioStartToken() {
    }
    AudioStartToken.prototype.token = function () { };
    return AudioStartToken;
}());
exports.AudioStartToken = AudioStartToken;

},{}],27:[function(require,module,exports){
"use strict";
var EmphasisEndToken = (function () {
    function EmphasisEndToken() {
    }
    EmphasisEndToken.prototype.token = function () { };
    return EmphasisEndToken;
}());
exports.EmphasisEndToken = EmphasisEndToken;

},{}],28:[function(require,module,exports){
"use strict";
var EmphasisStartToken = (function () {
    function EmphasisStartToken() {
    }
    EmphasisStartToken.prototype.token = function () { };
    return EmphasisStartToken;
}());
exports.EmphasisStartToken = EmphasisStartToken;

},{}],29:[function(require,module,exports){
"use strict";
var FootnoteEndToken = (function () {
    function FootnoteEndToken() {
    }
    FootnoteEndToken.prototype.token = function () { };
    return FootnoteEndToken;
}());
exports.FootnoteEndToken = FootnoteEndToken;

},{}],30:[function(require,module,exports){
"use strict";
var FootnoteStartToken = (function () {
    function FootnoteStartToken() {
    }
    FootnoteStartToken.prototype.token = function () { };
    return FootnoteStartToken;
}());
exports.FootnoteStartToken = FootnoteStartToken;

},{}],31:[function(require,module,exports){
"use strict";
var ImageStartToken = (function () {
    function ImageStartToken() {
    }
    ImageStartToken.prototype.token = function () { };
    return ImageStartToken;
}());
exports.ImageStartToken = ImageStartToken;

},{}],32:[function(require,module,exports){
"use strict";
var InlineCodeToken = (function () {
    function InlineCodeToken(code) {
        this.code = code;
    }
    InlineCodeToken.prototype.token = function () { };
    return InlineCodeToken;
}());
exports.InlineCodeToken = InlineCodeToken;

},{}],33:[function(require,module,exports){
"use strict";
var LinkEndToken = (function () {
    function LinkEndToken(url) {
        this.url = url;
    }
    LinkEndToken.prototype.token = function () { };
    return LinkEndToken;
}());
exports.LinkEndToken = LinkEndToken;

},{}],34:[function(require,module,exports){
"use strict";
var LinkStartToken = (function () {
    function LinkStartToken() {
    }
    LinkStartToken.prototype.token = function () { };
    return LinkStartToken;
}());
exports.LinkStartToken = LinkStartToken;

},{}],35:[function(require,module,exports){
"use strict";
var MediaDescriptionToken = (function () {
    function MediaDescriptionToken(description) {
        this.description = description;
    }
    MediaDescriptionToken.prototype.token = function () { };
    return MediaDescriptionToken;
}());
exports.MediaDescriptionToken = MediaDescriptionToken;

},{}],36:[function(require,module,exports){
"use strict";
var MediaEndToken = (function () {
    function MediaEndToken(url) {
        this.url = url;
    }
    MediaEndToken.prototype.token = function () { };
    return MediaEndToken;
}());
exports.MediaEndToken = MediaEndToken;

},{}],37:[function(require,module,exports){
"use strict";
var NakedUrlEndToken = (function () {
    function NakedUrlEndToken(urlAfterProtocol) {
        this.urlAfterProtocol = urlAfterProtocol;
    }
    NakedUrlEndToken.prototype.token = function () { };
    return NakedUrlEndToken;
}());
exports.NakedUrlEndToken = NakedUrlEndToken;

},{}],38:[function(require,module,exports){
"use strict";
var NakedUrlStartToken = (function () {
    function NakedUrlStartToken(protocol) {
        this.protocol = protocol;
    }
    NakedUrlStartToken.prototype.token = function () { };
    return NakedUrlStartToken;
}());
exports.NakedUrlStartToken = NakedUrlStartToken;

},{}],39:[function(require,module,exports){
"use strict";
var ParenthesizedEndToken = (function () {
    function ParenthesizedEndToken() {
    }
    ParenthesizedEndToken.prototype.token = function () { };
    return ParenthesizedEndToken;
}());
exports.ParenthesizedEndToken = ParenthesizedEndToken;

},{}],40:[function(require,module,exports){
"use strict";
var ParenthesizedStartToken = (function () {
    function ParenthesizedStartToken() {
    }
    ParenthesizedStartToken.prototype.token = function () { };
    return ParenthesizedStartToken;
}());
exports.ParenthesizedStartToken = ParenthesizedStartToken;

},{}],41:[function(require,module,exports){
"use strict";
var PlainTextToken = (function () {
    function PlainTextToken(text) {
        this.text = text;
    }
    PlainTextToken.prototype.token = function () { };
    return PlainTextToken;
}());
exports.PlainTextToken = PlainTextToken;

},{}],42:[function(require,module,exports){
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

},{"./PotentialRaisedVoiceToken":45}],43:[function(require,module,exports){
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

},{"./PotentialRaisedVoiceToken":45}],44:[function(require,module,exports){
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

},{"./PotentialRaisedVoiceToken":45}],45:[function(require,module,exports){
"use strict";
var PotentialRaisedVoiceToken = (function () {
    function PotentialRaisedVoiceToken(asterisks) {
        this.asterisks = asterisks;
    }
    PotentialRaisedVoiceToken.prototype.token = function () { };
    return PotentialRaisedVoiceToken;
}());
exports.PotentialRaisedVoiceToken = PotentialRaisedVoiceToken;

},{}],46:[function(require,module,exports){
"use strict";
var RevisionDeletionEndToken = (function () {
    function RevisionDeletionEndToken() {
    }
    RevisionDeletionEndToken.prototype.token = function () { };
    return RevisionDeletionEndToken;
}());
exports.RevisionDeletionEndToken = RevisionDeletionEndToken;

},{}],47:[function(require,module,exports){
"use strict";
var RevisionDeletionStartToken = (function () {
    function RevisionDeletionStartToken() {
    }
    RevisionDeletionStartToken.prototype.token = function () { };
    return RevisionDeletionStartToken;
}());
exports.RevisionDeletionStartToken = RevisionDeletionStartToken;

},{}],48:[function(require,module,exports){
"use strict";
var RevisionInsertionEndToken = (function () {
    function RevisionInsertionEndToken() {
    }
    RevisionInsertionEndToken.prototype.token = function () { };
    return RevisionInsertionEndToken;
}());
exports.RevisionInsertionEndToken = RevisionInsertionEndToken;

},{}],49:[function(require,module,exports){
"use strict";
var RevisionInsertionStartToken = (function () {
    function RevisionInsertionStartToken() {
    }
    RevisionInsertionStartToken.prototype.token = function () { };
    return RevisionInsertionStartToken;
}());
exports.RevisionInsertionStartToken = RevisionInsertionStartToken;

},{}],50:[function(require,module,exports){
"use strict";
var SpoilerEndToken = (function () {
    function SpoilerEndToken() {
    }
    SpoilerEndToken.prototype.token = function () { };
    return SpoilerEndToken;
}());
exports.SpoilerEndToken = SpoilerEndToken;

},{}],51:[function(require,module,exports){
"use strict";
var SpoilerStartToken = (function () {
    function SpoilerStartToken() {
    }
    SpoilerStartToken.prototype.token = function () { };
    return SpoilerStartToken;
}());
exports.SpoilerStartToken = SpoilerStartToken;

},{}],52:[function(require,module,exports){
"use strict";
var SquareBracketedEndToken = (function () {
    function SquareBracketedEndToken() {
    }
    SquareBracketedEndToken.prototype.token = function () { };
    return SquareBracketedEndToken;
}());
exports.SquareBracketedEndToken = SquareBracketedEndToken;

},{}],53:[function(require,module,exports){
"use strict";
var SquareBracketedStartToken = (function () {
    function SquareBracketedStartToken() {
    }
    SquareBracketedStartToken.prototype.token = function () { };
    return SquareBracketedStartToken;
}());
exports.SquareBracketedStartToken = SquareBracketedStartToken;

},{}],54:[function(require,module,exports){
"use strict";
var StressEndToken = (function () {
    function StressEndToken() {
    }
    StressEndToken.prototype.token = function () { };
    return StressEndToken;
}());
exports.StressEndToken = StressEndToken;

},{}],55:[function(require,module,exports){
"use strict";
var StressStartToken = (function () {
    function StressStartToken() {
    }
    StressStartToken.prototype.token = function () { };
    return StressStartToken;
}());
exports.StressStartToken = StressStartToken;

},{}],56:[function(require,module,exports){
"use strict";
var VideoStartToken = (function () {
    function VideoStartToken() {
    }
    VideoStartToken.prototype.token = function () { };
    return VideoStartToken;
}());
exports.VideoStartToken = VideoStartToken;

},{}],57:[function(require,module,exports){
"use strict";
var RichConventions_1 = require('./RichConventions');
var contextualizeTokens_1 = require('./TokenContextualization/contextualizeTokens');
var ContextualizedStartToken_1 = require('./TokenContextualization/ContextualizedStartToken');
var ContextualizedEndToken_1 = require('./TokenContextualization/ContextualizedEndToken');
function nestOverlappingConventions(tokens) {
    return new ConventionNester(tokens).tokens;
}
exports.nestOverlappingConventions = nestOverlappingConventions;
var FREELY_SPLITTABLE_CONVENTIONS = [
    RichConventions_1.REVISION_DELETION,
    RichConventions_1.REVISION_INSERTION,
    RichConventions_1.STRESS,
    RichConventions_1.EMPHASIS,
    RichConventions_1.PARENTHESIZED,
    RichConventions_1.SQUARE_BRACKETED,
];
var CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT = [
    RichConventions_1.LINK,
    RichConventions_1.ACTION,
    RichConventions_1.SPOILER,
    RichConventions_1.FOOTNOTE
];
var ConventionNester = (function () {
    function ConventionNester(tokens) {
        this.contextualizedTokens = contextualizeTokens_1.contextualizeTokens(tokens);
        var splittableConventions = FREELY_SPLITTABLE_CONVENTIONS.slice();
        this.splitConventionsThatStartInsideAnotherConventionAndEndAfter(splittableConventions);
        for (var _i = 0, CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT_1 = CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT; _i < CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT_1.length; _i++) {
            var conventionNotToSplit = CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT_1[_i];
            this.resolveOverlapping(splittableConventions, conventionNotToSplit);
            splittableConventions.push(conventionNotToSplit);
        }
        this.tokens = this.contextualizedTokens.map(function (token) { return token.originalToken; });
    }
    ConventionNester.prototype.splitConventionsThatStartInsideAnotherConventionAndEndAfter = function (conventions) {
        var unclosedStartTokens = [];
        for (var tokenIndex = 0; tokenIndex < this.contextualizedTokens.length; tokenIndex++) {
            var token = this.contextualizedTokens[tokenIndex];
            if (doesTokenStartConvention(token, conventions)) {
                unclosedStartTokens.push(token);
                continue;
            }
            if (!doesTokenEndConvention(token, conventions)) {
                continue;
            }
            var endTokensOfOverlappingConventions = [];
            for (var i = unclosedStartTokens.length - 1; i >= 0; i--) {
                var unclosedStartToken = unclosedStartTokens[i];
                if (unclosedStartToken.end === token) {
                    unclosedStartTokens.splice(i, 1);
                    break;
                }
                endTokensOfOverlappingConventions.push(unclosedStartToken.end);
            }
            this.closeAndReopenConventionsAroundTokenAtIndex(tokenIndex, endTokensOfOverlappingConventions);
            var countOverlapping = endTokensOfOverlappingConventions.length;
            tokenIndex += (2 * countOverlapping);
        }
    };
    ConventionNester.prototype.resolveOverlapping = function (splittableConventions, conventionNotToSplit) {
        for (var tokenIndex = 0; tokenIndex < this.contextualizedTokens.length; tokenIndex++) {
            var potentialHeroStartToken = this.contextualizedTokens[tokenIndex];
            var isStartTokenForHeroConvention = potentialHeroStartToken instanceof ContextualizedStartToken_1.ContextualizedStartToken
                && potentialHeroStartToken.originalToken instanceof conventionNotToSplit.StartTokenType;
            if (!isStartTokenForHeroConvention) {
                continue;
            }
            var heroStartIndex = tokenIndex;
            var heroEndIndex = void 0;
            for (var i = heroStartIndex + 1; i < this.contextualizedTokens.length; i++) {
                var potentialHeroEndToken = this.contextualizedTokens[i];
                var isEndTokenForHeroConvention = potentialHeroEndToken instanceof ContextualizedEndToken_1.ContextualizedEndToken
                    && potentialHeroEndToken.originalToken instanceof conventionNotToSplit.EndTokenType;
                if (isEndTokenForHeroConvention) {
                    heroEndIndex = i;
                    break;
                }
            }
            var overlappingStartingBefore = [];
            var overlappingStartingInside = [];
            for (var indexInsideHero = heroStartIndex + 1; indexInsideHero < heroEndIndex; indexInsideHero++) {
                var token = this.contextualizedTokens[indexInsideHero];
                if (doesTokenStartConvention(token, splittableConventions)) {
                    overlappingStartingInside.push(token.end);
                    continue;
                }
                if (doesTokenEndConvention(token, splittableConventions)) {
                    if (overlappingStartingInside.length) {
                        overlappingStartingInside.pop();
                        continue;
                    }
                    overlappingStartingBefore.push(token);
                }
            }
            this.closeAndReopenConventionsAroundTokenAtIndex(heroEndIndex, overlappingStartingInside);
            this.closeAndReopenConventionsAroundTokenAtIndex(heroStartIndex, overlappingStartingBefore);
            var countTokensAdded = (2 * overlappingStartingBefore.length) + (2 * overlappingStartingInside.length);
            tokenIndex = heroEndIndex + countTokensAdded;
        }
    };
    ConventionNester.prototype.closeAndReopenConventionsAroundTokenAtIndex = function (index, endTokensFromMostRecentToLeast) {
        var contextualizedStartTokens = endTokensFromMostRecentToLeast
            .map(function (convention) { return convention.start; })
            .reverse();
        this.insertTokens(index + 1, contextualizedStartTokens);
        this.insertTokens(index, endTokensFromMostRecentToLeast);
    };
    ConventionNester.prototype.insertTokens = function (index, contextualizedTokens) {
        (_a = this.contextualizedTokens).splice.apply(_a, [index, 0].concat(contextualizedTokens));
        var _a;
    };
    return ConventionNester;
}());
function doesTokenStartConvention(token, conventions) {
    return (token instanceof ContextualizedStartToken_1.ContextualizedStartToken
        && conventions.some(function (convention) { return token.originalToken instanceof convention.StartTokenType; }));
}
function doesTokenEndConvention(token, conventions) {
    return (token instanceof ContextualizedEndToken_1.ContextualizedEndToken
        && conventions.some(function (convention) { return token.originalToken instanceof convention.EndTokenType; }));
}

},{"./RichConventions":14,"./TokenContextualization/ContextualizedEndToken":15,"./TokenContextualization/ContextualizedStartToken":16,"./TokenContextualization/contextualizeTokens":18}],58:[function(require,module,exports){
"use strict";
var Tokenizer_1 = require('./Tokenizing/Tokenizer');
var parse_1 = require('./parse');
function getInlineNodes(text, config) {
    return parse_1.parse({
        tokens: new Tokenizer_1.Tokenizer(text, config).tokens
    }).nodes;
}
exports.getInlineNodes = getInlineNodes;

},{"./Tokenizing/Tokenizer":21,"./parse":59}],59:[function(require,module,exports){
"use strict";
var RichConventions_1 = require('./RichConventions');
var MediaConventions_1 = require('./MediaConventions');
var PlainTextNode_1 = require('../../SyntaxNodes/PlainTextNode');
var isWhitespace_1 = require('../../SyntaxNodes/isWhitespace');
var CollectionHelpers_1 = require('../../CollectionHelpers');
var InlineCodeToken_1 = require('./Tokenizing/Tokens/InlineCodeToken');
var LinkStartToken_1 = require('./Tokenizing/Tokens/LinkStartToken');
var LinkEndToken_1 = require('./Tokenizing/Tokens/LinkEndToken');
var PlainTextToken_1 = require('./Tokenizing/Tokens/PlainTextToken');
var NakedUrlStartToken_1 = require('./Tokenizing/Tokens/NakedUrlStartToken');
var InlineCodeNode_1 = require('../../SyntaxNodes/InlineCodeNode');
var LinkNode_1 = require('../../SyntaxNodes/LinkNode');
function parse(args) {
    return new Parser(args).result;
}
exports.parse = parse;
var RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES = [
    RichConventions_1.STRESS,
    RichConventions_1.EMPHASIS,
    RichConventions_1.REVISION_DELETION,
    RichConventions_1.REVISION_INSERTION,
    RichConventions_1.SPOILER,
    RichConventions_1.FOOTNOTE,
    RichConventions_1.ACTION
];
var MEDIA_CONVENTIONS = [
    MediaConventions_1.AUDIO,
    MediaConventions_1.IMAGE,
    MediaConventions_1.VIDEO
];
var BRACKET_CONVENTIONS = [
    RichConventions_1.PARENTHESIZED,
    RichConventions_1.SQUARE_BRACKETED,
];
var Parser = (function () {
    function Parser(args) {
        this.tokenIndex = 0;
        this.countTokensParsed = 0;
        this.nodes = [];
        var UntilTokenType = args.UntilTokenType, isTerminatorOptional = args.isTerminatorOptional;
        this.tokens = args.tokens;
        LoopTokens: for (; this.tokenIndex < this.tokens.length; this.tokenIndex++) {
            var token = this.tokens[this.tokenIndex];
            this.countTokensParsed = this.tokenIndex + 1;
            if (UntilTokenType && token instanceof UntilTokenType) {
                this.setResult({ isMissingTerminator: false });
                return;
            }
            if (token instanceof PlainTextToken_1.PlainTextToken) {
                if (!token.text) {
                    continue;
                }
                this.nodes.push(new PlainTextNode_1.PlainTextNode(token.text));
                continue;
            }
            for (var _i = 0, BRACKET_CONVENTIONS_1 = BRACKET_CONVENTIONS; _i < BRACKET_CONVENTIONS_1.length; _i++) {
                var bracketed = BRACKET_CONVENTIONS_1[_i];
                if (token instanceof bracketed.StartTokenType) {
                    this.parseBracket(bracketed);
                }
            }
            if (token instanceof InlineCodeToken_1.InlineCodeToken) {
                if (token.code) {
                    this.nodes.push(new InlineCodeNode_1.InlineCodeNode(token.code));
                }
                continue;
            }
            if (token instanceof NakedUrlStartToken_1.NakedUrlStartToken) {
                var nakedUrlEndToken = this.getNextTokenAndAdvanceIndex();
                var protocol = token.protocol;
                var urlAfterProtocol = nakedUrlEndToken.urlAfterProtocol;
                var url = protocol + urlAfterProtocol;
                if (!urlAfterProtocol) {
                    this.nodes.push(new PlainTextNode_1.PlainTextNode(url));
                    continue;
                }
                var contents = [new PlainTextNode_1.PlainTextNode(urlAfterProtocol)];
                this.nodes.push(new LinkNode_1.LinkNode(contents, url));
                continue;
            }
            if (token instanceof LinkStartToken_1.LinkStartToken) {
                var result = this.parse({ UntilTokenType: LinkEndToken_1.LinkEndToken });
                var contents = result.nodes;
                var hasContents = isNotPureWhitespace(contents);
                var linkEndToken = this.tokens[this.tokenIndex];
                var url = linkEndToken.url.trim();
                var hasUrl = !!url;
                if (!hasContents && !hasUrl) {
                    continue;
                }
                if (hasContents && !hasUrl) {
                    (_a = this.nodes).push.apply(_a, contents);
                    continue;
                }
                if (!hasContents && hasUrl) {
                    contents = [new PlainTextNode_1.PlainTextNode(url)];
                }
                this.nodes.push(new LinkNode_1.LinkNode(contents, url));
                continue;
            }
            for (var _b = 0, MEDIA_CONVENTIONS_1 = MEDIA_CONVENTIONS; _b < MEDIA_CONVENTIONS_1.length; _b++) {
                var media = MEDIA_CONVENTIONS_1[_b];
                if (token instanceof media.StartTokenType) {
                    var descriptionToken = this.getNextTokenAndAdvanceIndex();
                    var mediaEndToken = this.getNextTokenAndAdvanceIndex();
                    var description = descriptionToken.description.trim();
                    var url = mediaEndToken.url.trim();
                    if (!url) {
                        continue LoopTokens;
                    }
                    if (!description) {
                        description = url;
                    }
                    this.nodes.push(new media.NodeType(description, url));
                    continue LoopTokens;
                }
            }
            for (var _c = 0, RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES_1 = RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES; _c < RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES_1.length; _c++) {
                var richConvention = RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES_1[_c];
                if (token instanceof richConvention.StartTokenType) {
                    var result = this.parse({ UntilTokenType: richConvention.EndTokenType });
                    if (result.nodes.length) {
                        this.nodes.push(new richConvention.NodeType(result.nodes));
                    }
                    continue LoopTokens;
                }
            }
        }
        var wasTerminatorSpecified = !!UntilTokenType;
        if (!isTerminatorOptional && wasTerminatorSpecified) {
            throw new Error("Missing terminator token: " + UntilTokenType);
        }
        this.setResult({ isMissingTerminator: wasTerminatorSpecified });
        var _a;
    }
    Parser.prototype.getNextTokenAndAdvanceIndex = function () {
        return this.tokens[++this.tokenIndex];
    };
    Parser.prototype.parse = function (args) {
        var UntilTokenType = args.UntilTokenType, isTerminatorOptional = args.isTerminatorOptional;
        var result = parse({
            tokens: this.tokens.slice(this.countTokensParsed),
            UntilTokenType: UntilTokenType,
            isTerminatorOptional: isTerminatorOptional
        });
        this.tokenIndex += result.countTokensParsed;
        return result;
    };
    Parser.prototype.parseBracket = function (bracketed) {
        var result = this.parse({
            UntilTokenType: bracketed.EndTokenType,
            isTerminatorOptional: true
        });
        if (result.isMissingTerminator) {
            (_a = this.nodes).push.apply(_a, result.nodes);
            return;
        }
        this.nodes.push(new bracketed.NodeType(result.nodes));
        var _a;
    };
    Parser.prototype.setResult = function (args) {
        this.result = {
            countTokensParsed: this.countTokensParsed,
            nodes: combineConsecutivePlainTextNodes(this.nodes),
            isMissingTerminator: args.isMissingTerminator
        };
    };
    return Parser;
}());
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

},{"../../CollectionHelpers":1,"../../SyntaxNodes/InlineCodeNode":92,"../../SyntaxNodes/LinkNode":96,"../../SyntaxNodes/PlainTextNode":104,"../../SyntaxNodes/isWhitespace":115,"./MediaConventions":3,"./RichConventions":4,"./Tokenizing/Tokens/InlineCodeToken":32,"./Tokenizing/Tokens/LinkEndToken":33,"./Tokenizing/Tokens/LinkStartToken":34,"./Tokenizing/Tokens/NakedUrlStartToken":38,"./Tokenizing/Tokens/PlainTextToken":41}],60:[function(require,module,exports){
"use strict";
var getSortedUnderlineChars_1 = require('./getSortedUnderlineChars');
var HeadingLeveler = (function () {
    function HeadingLeveler() {
        this.registeredUnderlineChars = [];
    }
    HeadingLeveler.prototype.registerUnderlineAndGetLevel = function (underline) {
        var underlineChars = getSortedUnderlineChars_1.getSortedUnderlineChars(underline);
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

},{"./getSortedUnderlineChars":65}],61:[function(require,module,exports){
"use strict";
var LineConsumer = (function () {
    function LineConsumer(entireText) {
        this.entireText = entireText;
        this.countCharsConsumed = 0;
        this.updateRemainingText();
    }
    LineConsumer.prototype.advance = function (countCharacters) {
        this.countCharsConsumed += countCharacters;
        this.updateRemainingText();
    };
    LineConsumer.prototype.done = function () {
        return this.countCharsConsumed >= this.entireText.length;
    };
    LineConsumer.prototype.consumeLine = function (args) {
        if (this.done()) {
            return false;
        }
        var fullLine;
        var lineWithoutTerminatingLineBreak;
        for (var i = this.countCharsConsumed; i < this.entireText.length; i++) {
            var char = this.entireText[i];
            if (char === '\\') {
                i++;
                continue;
            }
            if (char === '\n') {
                fullLine = this.entireText.substring(this.countCharsConsumed, i + 1);
                lineWithoutTerminatingLineBreak = fullLine.slice(0, -1);
                break;
            }
        }
        if (!fullLine) {
            fullLine = lineWithoutTerminatingLineBreak = this.remainingText;
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
    LineConsumer.prototype.updateRemainingText = function () {
        this.remainingText = this.entireText.slice(this.countCharsConsumed);
    };
    return LineConsumer;
}());
exports.LineConsumer = LineConsumer;

},{}],62:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var HeadingNode_1 = require('../../SyntaxNodes/HeadingNode');
var Patterns_1 = require('../../Patterns');
var getInlineNodes_1 = require('../Inline/getInlineNodes');
var isLineFancyOutlineConvention_1 = require('./isLineFancyOutlineConvention');
var getSortedUnderlineChars_1 = require('./getSortedUnderlineChars');
function getHeadingParser(headingLeveler) {
    return function parseHeading(args) {
        var consumer = new LineConsumer_1.LineConsumer(args.text);
        var optionalOverline;
        consumer.consumeLine({
            pattern: STREAK_PATTERN,
            then: function (line) { optionalOverline = line; }
        });
        var rawContent;
        var underline;
        var hasContentAndUnderline = (consumer.consumeLine({
            pattern: NON_BLANK_PATTERN,
            then: function (line) { rawContent = line; }
        })
            && consumer.consumeLine({
                if: function (line) { return (STREAK_PATTERN.test(line)
                    && isUnderlineConsistentWithOverline(optionalOverline, line)); },
                then: function (line) { underline = line; }
            }));
        if (!hasContentAndUnderline) {
            return false;
        }
        if (isLineFancyOutlineConvention_1.isLineFancyOutlineConvention(rawContent, args.config)) {
            return false;
        }
        var headingLevel = headingLeveler.registerUnderlineAndGetLevel(underline);
        args.then([new HeadingNode_1.HeadingNode(getInlineNodes_1.getInlineNodes(rawContent, args.config), headingLevel)], consumer.countCharsConsumed);
        return true;
    };
}
exports.getHeadingParser = getHeadingParser;
function isUnderlineConsistentWithOverline(overline, underline) {
    return !overline || (getSortedUnderlineChars_1.getSortedUnderlineChars(overline) === getSortedUnderlineChars_1.getSortedUnderlineChars(underline));
}
var NON_BLANK_PATTERN = new RegExp(Patterns_1.NON_BLANK);
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);

},{"../../Patterns":76,"../../SyntaxNodes/HeadingNode":90,"../Inline/getInlineNodes":58,"./LineConsumer":61,"./getSortedUnderlineChars":65,"./isLineFancyOutlineConvention":66}],63:[function(require,module,exports){
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
var Patterns_1 = require('../../Patterns');
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
                text: consumer.remainingText,
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

},{"../../CollectionHelpers":1,"../../Patterns":76,"../../SyntaxNodes/SectionSeparatorNode":108,"./LineConsumer":61,"./getHeadingParser":62,"./parseBlankLineSeparation":67,"./parseBlockquote":68,"./parseCodeBlock":69,"./parseDescriptionList":70,"./parseOrderedList":71,"./parseRegularLines":72,"./parseSectionSeparatorStreak":73,"./parseUnorderedList":74}],64:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var Patterns_1 = require('../../Patterns');
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
        lengthParsed = consumer.countCharsConsumed;
    }
    if (!lines.length) {
        return false;
    }
    var countTrailingBlankLines = lines.length - countLinesIncluded;
    var shouldTerminateList = countTrailingBlankLines >= 2;
    if (!shouldTerminateList) {
        countLinesIncluded = lines.length;
        lengthParsed = consumer.countCharsConsumed;
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

},{"../../Patterns":76,"./LineConsumer":61}],65:[function(require,module,exports){
"use strict";
function getSortedUnderlineChars(underline) {
    return underline
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
exports.getSortedUnderlineChars = getSortedUnderlineChars;

},{}],66:[function(require,module,exports){
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

},{"./HeadingLeveler":60,"./parseBlockquote":68,"./parseOrderedList":71,"./parseSectionSeparatorStreak":73,"./parseUnorderedList":74}],67:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var SectionSeparatorNode_1 = require('../../SyntaxNodes/SectionSeparatorNode');
var Patterns_1 = require('../../Patterns');
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
    args.then(nodes, consumer.countCharsConsumed);
    return true;
}
exports.parseBlankLineSeparation = parseBlankLineSeparation;
var BLANK_PATTERN = new RegExp(Patterns_1.BLANK);

},{"../../Patterns":76,"../../SyntaxNodes/SectionSeparatorNode":108,"./LineConsumer":61}],68:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var BlockquoteNode_1 = require('../../SyntaxNodes/BlockquoteNode');
var getOutlineNodes_1 = require('./getOutlineNodes');
var HeadingLeveler_1 = require('./HeadingLeveler');
var Patterns_1 = require('../../Patterns');
function parseBlockquote(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var rawBlockquoteLines = [];
    while (consumer.consumeLine({
        pattern: ALL_BLOCKQUOTE_DELIMITERS_PATTERN,
        if: isLineProperlyBlockquoted,
        then: function (line) { return rawBlockquoteLines.push(line.replace(FIRST_BLOCKQUOTE_DELIMITER_PATTERN, '')); }
    })) { }
    if (!rawBlockquoteLines.length) {
        return false;
    }
    var rawBlockquoteContent = rawBlockquoteLines.join('\n');
    var headingLeveler = new HeadingLeveler_1.HeadingLeveler();
    args.then([
        new BlockquoteNode_1.BlockquoteNode(getOutlineNodes_1.getOutlineNodes(rawBlockquoteContent, headingLeveler, args.config))], consumer.countCharsConsumed);
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

},{"../../Patterns":76,"../../SyntaxNodes/BlockquoteNode":79,"./HeadingLeveler":60,"./LineConsumer":61,"./getOutlineNodes":63}],69:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var CodeBlockNode_1 = require('../../SyntaxNodes/CodeBlockNode');
var Patterns_1 = require('../../Patterns');
function parseCodeBlock(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    if (!consumer.consumeLine({ pattern: CODE_FENCE_PATTERN })) {
        return false;
    }
    var codeLines = [];
    while (!consumer.done()) {
        if (consumer.consumeLine({ pattern: CODE_FENCE_PATTERN })) {
            args.then([new CodeBlockNode_1.CodeBlockNode(codeLines.join('\n'))], consumer.countCharsConsumed);
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

},{"../../Patterns":76,"../../SyntaxNodes/CodeBlockNode":80,"./LineConsumer":61}],70:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var DescriptionListItem_1 = require('../../SyntaxNodes/DescriptionListItem');
var DescriptionListNode_1 = require('../../SyntaxNodes/DescriptionListNode');
var DescriptionTerm_1 = require('../../SyntaxNodes/DescriptionTerm');
var Description_1 = require('../../SyntaxNodes/Description');
var getInlineNodes_1 = require('../Inline/getInlineNodes');
var getOutlineNodes_1 = require('./getOutlineNodes');
var isLineFancyOutlineConvention_1 = require('./isLineFancyOutlineConvention');
var Patterns_1 = require('../../Patterns');
var getRemainingLinesOfListItem_1 = require('./getRemainingLinesOfListItem');
function parseDescriptionList(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var listItems = [];
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
        var rawDescriptionLines = [];
        var hasDescription = consumer.consumeLine({
            pattern: INDENTED_PATTERN,
            if: function (line) { return !BLANK_PATTERN.test(line); },
            then: function (line) { return rawDescriptionLines.push(line.replace(INDENTED_PATTERN, '')); }
        });
        if (!hasDescription) {
            return "break";
        }
        var isListTerminated = false;
        getRemainingLinesOfListItem_1.getRemainingLinesOfListItem({
            text: consumer.remainingText,
            then: function (lines, lengthParsed, shouldTerminateList) {
                rawDescriptionLines.push.apply(rawDescriptionLines, lines);
                consumer.advance(lengthParsed);
                isListTerminated = shouldTerminateList;
            }
        });
        lengthParsed = consumer.countCharsConsumed;
        var terms = rawTerms.map(function (term) { return new DescriptionTerm_1.DescriptionTerm(getInlineNodes_1.getInlineNodes(term, args.config)); });
        var rawDescription = rawDescriptionLines.join('\n');
        var description = new Description_1.Description(getOutlineNodes_1.getOutlineNodes(rawDescription, args.headingLeveler, args.config));
        listItems.push(new DescriptionListItem_1.DescriptionListItem(terms, description));
        if (isListTerminated) {
            return "break";
        }
    };
    while (!consumer.done()) {
        var state_1 = _loop_1();
        if (state_1 === "break") break;
    }
    if (!listItems.length) {
        return false;
    }
    args.then([new DescriptionListNode_1.DescriptionListNode(listItems)], lengthParsed);
    return true;
}
exports.parseDescriptionList = parseDescriptionList;
var NON_BLANK_PATTERN = new RegExp(Patterns_1.NON_BLANK);
var BLANK_PATTERN = new RegExp(Patterns_1.BLANK);
var INDENTED_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.INDENT));

},{"../../Patterns":76,"../../SyntaxNodes/Description":81,"../../SyntaxNodes/DescriptionListItem":82,"../../SyntaxNodes/DescriptionListNode":83,"../../SyntaxNodes/DescriptionTerm":84,"../Inline/getInlineNodes":58,"./LineConsumer":61,"./getOutlineNodes":63,"./getRemainingLinesOfListItem":64,"./isLineFancyOutlineConvention":66}],71:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var OrderedListNode_1 = require('../../SyntaxNodes/OrderedListNode');
var OrderedListItem_1 = require('../../SyntaxNodes/OrderedListItem');
var getOutlineNodes_1 = require('./getOutlineNodes');
var Patterns_1 = require('../../Patterns');
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
            text: consumer.remainingText,
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
    args.then([new OrderedListNode_1.OrderedListNode(listItems)], consumer.countCharsConsumed);
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

},{"../../Patterns":76,"../../SyntaxNodes/OrderedListItem":98,"../../SyntaxNodes/OrderedListNode":99,"./LineConsumer":61,"./getOutlineNodes":63,"./getRemainingLinesOfListItem":64}],72:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var isWhitespace_1 = require('../../SyntaxNodes/isWhitespace');
var MediaSyntaxNode_1 = require('../../SyntaxNodes/MediaSyntaxNode');
var ParagraphNode_1 = require('../../SyntaxNodes/ParagraphNode');
var LineBlockNode_1 = require('../../SyntaxNodes/LineBlockNode');
var Line_1 = require('../../SyntaxNodes/Line');
var getInlineNodes_1 = require('../Inline/getInlineNodes');
var Patterns_1 = require('../../Patterns');
var isLineFancyOutlineConvention_1 = require('./isLineFancyOutlineConvention');
function parseRegularLines(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var inlineNodesPerRegularLine = [];
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
    var lengthConsumed = consumer.countCharsConsumed;
    var regularLinesResultNode;
    switch (inlineNodesPerRegularLine.length) {
        case 0:
            args.then(terminatingNodes, lengthConsumed);
            return true;
        case 1:
            regularLinesResultNode = new ParagraphNode_1.ParagraphNode(inlineNodesPerRegularLine[0]);
            break;
        default: {
            var lineBlockLines = inlineNodesPerRegularLine.map(function (inlineNodes) { return new Line_1.Line(inlineNodes); });
            regularLinesResultNode = new LineBlockNode_1.LineBlockNode(lineBlockLines);
            break;
        }
    }
    args.then([regularLinesResultNode].concat(terminatingNodes), lengthConsumed);
    return true;
}
exports.parseRegularLines = parseRegularLines;
function isMediaSyntaxNode(node) {
    return node instanceof MediaSyntaxNode_1.MediaSyntaxNode;
}
var NON_BLANK_LINE_PATTERN = new RegExp(Patterns_1.NON_BLANK);
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);

},{"../../Patterns":76,"../../SyntaxNodes/Line":94,"../../SyntaxNodes/LineBlockNode":95,"../../SyntaxNodes/MediaSyntaxNode":97,"../../SyntaxNodes/ParagraphNode":102,"../../SyntaxNodes/isWhitespace":115,"../Inline/getInlineNodes":58,"./LineConsumer":61,"./isLineFancyOutlineConvention":66}],73:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var SectionSeparatorNode_1 = require('../../SyntaxNodes/SectionSeparatorNode');
var Patterns_1 = require('../../Patterns');
function parseSectionSeparatorStreak(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    if (!consumer.consumeLine({ pattern: STREAK_PATTERN })) {
        return false;
    }
    args.then([new SectionSeparatorNode_1.SectionSeparatorNode()], consumer.countCharsConsumed);
    return true;
}
exports.parseSectionSeparatorStreak = parseSectionSeparatorStreak;
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);

},{"../../Patterns":76,"../../SyntaxNodes/SectionSeparatorNode":108,"./LineConsumer":61}],74:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var UnorderedListNode_1 = require('../../SyntaxNodes/UnorderedListNode');
var UnorderedListItem_1 = require('../../SyntaxNodes/UnorderedListItem');
var getOutlineNodes_1 = require('./getOutlineNodes');
var getRemainingLinesOfListItem_1 = require('./getRemainingLinesOfListItem');
var Patterns_1 = require('../../Patterns');
function parseUnorderedList(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var rawListItemsContents = [];
    var _loop_1 = function() {
        var rawListItemLines = [];
        var isLineBulleted = consumer.consumeLine({
            pattern: BULLET_PATTERN,
            if: function (line) { return !STREAK_PATTERN.test(line); },
            then: function (line) { return rawListItemLines.push(line.replace(BULLET_PATTERN, '')); }
        });
        if (!isLineBulleted) {
            return "break";
        }
        var isListTerminated = false;
        getRemainingLinesOfListItem_1.getRemainingLinesOfListItem({
            text: consumer.remainingText,
            then: function (lines, lengthParsed, shouldTerminateList) {
                rawListItemLines.push.apply(rawListItemLines, lines);
                consumer.advance(lengthParsed);
                isListTerminated = shouldTerminateList;
            }
        });
        rawListItemsContents.push(rawListItemLines.join('\n'));
        if (isListTerminated) {
            return "break";
        }
    };
    while (!consumer.done()) {
        var state_1 = _loop_1();
        if (state_1 === "break") break;
    }
    if (!rawListItemsContents.length) {
        return false;
    }
    var listItems = rawListItemsContents.map(function (rawContents) {
        return new UnorderedListItem_1.UnorderedListItem(getOutlineNodes_1.getOutlineNodes(rawContents, args.headingLeveler, args.config));
    });
    args.then([new UnorderedListNode_1.UnorderedListNode(listItems)], consumer.countCharsConsumed);
    return true;
}
exports.parseUnorderedList = parseUnorderedList;
var BULLET_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.optional(' ') + Patterns_1.either('\\*', '-', '\\+') + Patterns_1.INLINE_WHITESPACE_CHAR));
var BLANK_LINE_PATTERN = new RegExp(Patterns_1.BLANK);
var INDENTED_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.INDENT));
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);

},{"../../Patterns":76,"../../SyntaxNodes/UnorderedListItem":112,"../../SyntaxNodes/UnorderedListNode":113,"./LineConsumer":61,"./getOutlineNodes":63,"./getRemainingLinesOfListItem":64}],75:[function(require,module,exports){
"use strict";
var getOutlineNodes_1 = require('./Outline/getOutlineNodes');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var HeadingLeveler_1 = require('./Outline/HeadingLeveler');
function parseDocument(text, config) {
    var documentChildren = getOutlineNodes_1.getOutlineNodes(text, new HeadingLeveler_1.HeadingLeveler(), config);
    var documentNode = new DocumentNode_1.DocumentNode(documentChildren);
    documentNode.insertFootnoteBlocks();
    return documentNode;
}
exports.parseDocument = parseDocument;

},{"../SyntaxNodes/DocumentNode":85,"./Outline/HeadingLeveler":60,"./Outline/getOutlineNodes":63}],76:[function(require,module,exports){
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
var OPEN_PAREN = escapeForRegex('(');
exports.OPEN_PAREN = OPEN_PAREN;
var CLOSE_PAREN = escapeForRegex(')');
exports.CLOSE_PAREN = CLOSE_PAREN;
var OPEN_SQUARE_BRACKET = escapeForRegex('[');
exports.OPEN_SQUARE_BRACKET = OPEN_SQUARE_BRACKET;
var CLOSE_SQUARE_BRACKET = escapeForRegex(']');
exports.CLOSE_SQUARE_BRACKET = CLOSE_SQUARE_BRACKET;
var OPEN_CURLY_BRACKET = escapeForRegex('{');
exports.OPEN_CURLY_BRACKET = OPEN_CURLY_BRACKET;
var CLOSE_CURLY_BRACKET = escapeForRegex('}');
exports.CLOSE_CURLY_BRACKET = CLOSE_CURLY_BRACKET;
var NON_BLANK = NON_WHITESPACE_CHAR;
exports.NON_BLANK = NON_BLANK;

},{}],77:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RichInlineSyntaxNode_1 = require('./RichInlineSyntaxNode');
var ActionNode = (function (_super) {
    __extends(ActionNode, _super);
    function ActionNode() {
        _super.apply(this, arguments);
        this.ACTION = null;
    }
    return ActionNode;
}(RichInlineSyntaxNode_1.RichInlineSyntaxNode));
exports.ActionNode = ActionNode;

},{"./RichInlineSyntaxNode":107}],78:[function(require,module,exports){
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

},{"./MediaSyntaxNode":97}],79:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":101}],80:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":101}],81:[function(require,module,exports){
"use strict";
var Description = (function () {
    function Description(children) {
        this.children = children;
        this.DESCRIPTION = null;
    }
    return Description;
}());
exports.Description = Description;

},{}],82:[function(require,module,exports){
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

},{}],83:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":101}],84:[function(require,module,exports){
"use strict";
var DescriptionTerm = (function () {
    function DescriptionTerm(children) {
        this.children = children;
        this.DESCRIPTION_TERM = null;
    }
    return DescriptionTerm;
}());
exports.DescriptionTerm = DescriptionTerm;

},{}],85:[function(require,module,exports){
"use strict";
var FootnoteBlockInserter_1 = require('./FootnoteBlockInserter');
var DocumentNode = (function () {
    function DocumentNode(children) {
        if (children === void 0) { children = []; }
        this.children = children;
        this.DOCUMENT = null;
    }
    DocumentNode.prototype.insertFootnoteBlocks = function () {
        new FootnoteBlockInserter_1.FootnoteBlockInserter(this);
    };
    return DocumentNode;
}());
exports.DocumentNode = DocumentNode;

},{"./FootnoteBlockInserter":87}],86:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":107}],87:[function(require,module,exports){
"use strict";
var ParagraphNode_1 = require('./ParagraphNode');
var BlockquoteNode_1 = require('./BlockquoteNode');
var LineBlockNode_1 = require('./LineBlockNode');
var HeadingNode_1 = require('./HeadingNode');
var UnorderedListNode_1 = require('./UnorderedListNode');
var OrderedListNode_1 = require('./OrderedListNode');
var DescriptionListNode_1 = require('./DescriptionListNode');
var FootnoteNode_1 = require('./FootnoteNode');
var FootnoteBlockNode_1 = require('./FootnoteBlockNode');
var CollectionHelpers_1 = require('../CollectionHelpers');
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
exports.FootnoteBlockInserter = FootnoteBlockInserter;
var Sequence = (function () {
    function Sequence(args) {
        this.nextValue = args.start;
    }
    Sequence.prototype.next = function () {
        return this.nextValue++;
    };
    return Sequence;
}());

},{"../CollectionHelpers":1,"./BlockquoteNode":79,"./DescriptionListNode":83,"./FootnoteBlockNode":88,"./FootnoteNode":89,"./HeadingNode":90,"./LineBlockNode":95,"./OrderedListNode":99,"./ParagraphNode":102,"./UnorderedListNode":113}],88:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":101}],89:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":107}],90:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":101}],91:[function(require,module,exports){
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

},{"./MediaSyntaxNode":97}],92:[function(require,module,exports){
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

},{"./InlineSyntaxNode":93}],93:[function(require,module,exports){
"use strict";
var InlineSyntaxNode = (function () {
    function InlineSyntaxNode() {
    }
    InlineSyntaxNode.prototype.inlineSyntaxNode = function () { };
    return InlineSyntaxNode;
}());
exports.InlineSyntaxNode = InlineSyntaxNode;

},{}],94:[function(require,module,exports){
"use strict";
var Line = (function () {
    function Line(children) {
        this.children = children;
        this.LINE = null;
    }
    return Line;
}());
exports.Line = Line;

},{}],95:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":101}],96:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":107}],97:[function(require,module,exports){
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

},{}],98:[function(require,module,exports){
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

},{}],99:[function(require,module,exports){
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

},{"./OrderedListOrder":100,"./OutlineSyntaxNode":101}],100:[function(require,module,exports){
"use strict";
(function (OrderedListOrder) {
    OrderedListOrder[OrderedListOrder["Ascending"] = 0] = "Ascending";
    OrderedListOrder[OrderedListOrder["Descrending"] = 1] = "Descrending";
})(exports.OrderedListOrder || (exports.OrderedListOrder = {}));
var OrderedListOrder = exports.OrderedListOrder;

},{}],101:[function(require,module,exports){
"use strict";
var OutlineSyntaxNode = (function () {
    function OutlineSyntaxNode() {
    }
    OutlineSyntaxNode.prototype.outlineSyntaxNode = function () { };
    return OutlineSyntaxNode;
}());
exports.OutlineSyntaxNode = OutlineSyntaxNode;

},{}],102:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":101}],103:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RichInlineSyntaxNode_1 = require('./RichInlineSyntaxNode');
var ParenthesizedNode = (function (_super) {
    __extends(ParenthesizedNode, _super);
    function ParenthesizedNode() {
        _super.apply(this, arguments);
        this.PARENTHESIZED = null;
    }
    return ParenthesizedNode;
}(RichInlineSyntaxNode_1.RichInlineSyntaxNode));
exports.ParenthesizedNode = ParenthesizedNode;

},{"./RichInlineSyntaxNode":107}],104:[function(require,module,exports){
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

},{"./InlineSyntaxNode":93}],105:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":107}],106:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":107}],107:[function(require,module,exports){
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

},{"../SyntaxNodes/InlineSyntaxNode":93}],108:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":101}],109:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":107}],110:[function(require,module,exports){
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
        this.SQUARE_BRACKETED = null;
    }
    return SquareBracketedNode;
}(RichInlineSyntaxNode_1.RichInlineSyntaxNode));
exports.SquareBracketedNode = SquareBracketedNode;

},{"./RichInlineSyntaxNode":107}],111:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":107}],112:[function(require,module,exports){
"use strict";
var UnorderedListItem = (function () {
    function UnorderedListItem(children) {
        this.children = children;
        this.UNORDERED_LIST_ITEM = null;
    }
    return UnorderedListItem;
}());
exports.UnorderedListItem = UnorderedListItem;

},{}],113:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":101}],114:[function(require,module,exports){
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

},{"./MediaSyntaxNode":97}],115:[function(require,module,exports){
"use strict";
var PlainTextNode_1 = require('./PlainTextNode');
function isWhitespace(node) {
    return (node instanceof PlainTextNode_1.PlainTextNode) && !/\S/.test(node.text);
}
exports.isWhitespace = isWhitespace;

},{"./PlainTextNode":104}],116:[function(require,module,exports){
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

},{"./Parsing/parseDocument":75,"./UpConfig":117,"./Writer/HtmlWriter":118}],117:[function(require,module,exports){
"use strict";
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
        this.settings = merge(defaults, configArgs);
    }
    UpConfig.prototype.withChanges = function (changes) {
        return new UpConfig(changes, this.settings);
    };
    UpConfig.prototype.localizeTerm = function (nonLocalizedTerm) {
        var localizedTerm = this.settings.i18n.terms[nonLocalizedTerm];
        if (localizedTerm) {
            return localizedTerm;
        }
        throw new Error("Unrecognized term: " + nonLocalizedTerm);
    };
    return UpConfig;
}());
exports.UpConfig = UpConfig;
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

},{}],118:[function(require,module,exports){
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
        return htmlElement('div', node.lines.map(function (line) { return _this.line(line); }).join(''), (_a = {}, _a[dataAttr('lines')] = null, _a));
        var _a;
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
    HtmlWriter.prototype.parenthesized = function (node) {
        return this.bracketed(node, 'parenthesized');
    };
    HtmlWriter.prototype.squareBracketed = function (node) {
        return this.bracketed(node, 'square-bracketed');
    };
    HtmlWriter.prototype.action = function (node) {
        return this.htmlElement('span', node.children, (_a = {}, _a[dataAttr('action')] = null, _a));
        var _a;
    };
    HtmlWriter.prototype.spoiler = function (node) {
        return this.htmlElement('span', node.children, (_a = {}, _a[dataAttr('spoiler')] = null, _a));
        var _a;
    };
    HtmlWriter.prototype.footnoteReference = function (node) {
        var innerLinkNode = this.footnoteReferenceInnerLink(node);
        return this.htmlElement('sup', [innerLinkNode], (_a = {
                id: this.footnoteReferenceId(node.referenceNumber)
            },
            _a[dataAttr('footnote-reference')] = null,
            _a
        ));
        var _a;
    };
    HtmlWriter.prototype.footnoteBlock = function (node) {
        var _this = this;
        return htmlElement('dl', node.footnotes.map(function (footnote) { return _this.footnote(footnote); }).join(''), (_a = {}, _a[dataAttr('footnotes')] = null, _a));
        var _a;
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
    HtmlWriter.prototype.bracketed = function (bracketed, dataAttributeName) {
        return this.htmlElement('span', bracketed.children, (_a = {}, _a[dataAttr(dataAttributeName)] = null, _a));
        var _a;
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
        var termHtml = this.htmlElement('dt', [this.footnoteLinkBackToReference(footnote)], { id: this.footnoteId(footnote.referenceNumber) });
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
function dataAttr(name) {
    return 'data-up-' + name;
}

},{"../SyntaxNodes/LinkNode":96,"../SyntaxNodes/OrderedListOrder":100,"../SyntaxNodes/PlainTextNode":104,"./Writer":119}],119:[function(require,module,exports){
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
var ParenthesizedNode_1 = require('../SyntaxNodes/ParenthesizedNode');
var SquareBracketedNode_1 = require('../SyntaxNodes/SquareBracketedNode');
var ActionNode_1 = require('../SyntaxNodes/ActionNode');
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
        if (node instanceof ParenthesizedNode_1.ParenthesizedNode) {
            return this.parenthesized(node);
        }
        if (node instanceof SquareBracketedNode_1.SquareBracketedNode) {
            return this.squareBracketed(node);
        }
        if (node instanceof ActionNode_1.ActionNode) {
            return this.action(node);
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

},{"../SyntaxNodes/ActionNode":77,"../SyntaxNodes/AudioNode":78,"../SyntaxNodes/BlockquoteNode":79,"../SyntaxNodes/CodeBlockNode":80,"../SyntaxNodes/DescriptionListNode":83,"../SyntaxNodes/DocumentNode":85,"../SyntaxNodes/EmphasisNode":86,"../SyntaxNodes/FootnoteBlockNode":88,"../SyntaxNodes/FootnoteNode":89,"../SyntaxNodes/HeadingNode":90,"../SyntaxNodes/ImageNode":91,"../SyntaxNodes/InlineCodeNode":92,"../SyntaxNodes/LineBlockNode":95,"../SyntaxNodes/LinkNode":96,"../SyntaxNodes/OrderedListNode":99,"../SyntaxNodes/ParagraphNode":102,"../SyntaxNodes/ParenthesizedNode":103,"../SyntaxNodes/PlainTextNode":104,"../SyntaxNodes/RevisionDeletionNode":105,"../SyntaxNodes/RevisionInsertionNode":106,"../SyntaxNodes/SectionSeparatorNode":108,"../SyntaxNodes/SpoilerNode":109,"../SyntaxNodes/SquareBracketedNode":110,"../SyntaxNodes/StressNode":111,"../SyntaxNodes/UnorderedListNode":113,"../SyntaxNodes/VideoNode":114}],120:[function(require,module,exports){
"use strict";
var index_1 = require('./index');
window.Up = index_1.default;

},{"./index":121}],121:[function(require,module,exports){
"use strict";
var Up_1 = require('./Up');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Up_1.Up;

},{"./Up":116}]},{},[120]);
