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
function contains(items, item) {
    return (items.indexOf(item) !== -1);
}
exports.contains = contains;
function reversed(items) {
    return items.slice().reverse();
}
exports.reversed = reversed;

},{}],2:[function(require,module,exports){
"use strict";
var Patterns_1 = require('../../Patterns');
var Bracket = (function () {
    function Bracket(start, end) {
        this.start = start;
        this.end = end;
        this.startPattern = Patterns_1.escapeForRegex(start);
        this.endPattern = Patterns_1.escapeForRegex(end);
    }
    return Bracket;
}());
exports.Bracket = Bracket;

},{"../../Patterns":41}],3:[function(require,module,exports){
"use strict";
var FailedGoalTracker = (function () {
    function FailedGoalTracker() {
        this.failedGoalsByTextIndex = {};
    }
    FailedGoalTracker.prototype.registerFailure = function (failedContext) {
        var convention = failedContext.convention, snapshot = failedContext.snapshot;
        var textIndex = snapshot.textIndex;
        if (!this.failedGoalsByTextIndex[textIndex]) {
            this.failedGoalsByTextIndex[textIndex] = [];
        }
        this.failedGoalsByTextIndex[textIndex].push(convention.goal);
    };
    FailedGoalTracker.prototype.hasFailed = function (goal, textIndex) {
        var failedGoals = (this.failedGoalsByTextIndex[textIndex] || []);
        return failedGoals.some(function (failedGoal) { return failedGoal === goal; });
    };
    return FailedGoalTracker;
}());
exports.FailedGoalTracker = FailedGoalTracker;

},{}],4:[function(require,module,exports){
"use strict";
var Patterns_1 = require('../../Patterns');
var InlineConsumer = (function () {
    function InlineConsumer(entireText) {
        this.entireText = entireText;
        this._textIndex = 0;
        this.textIndex = 0;
    }
    Object.defineProperty(InlineConsumer.prototype, "textIndex", {
        get: function () {
            return this._textIndex;
        },
        set: function (value) {
            this._textIndex = value;
            this.updateComputedTextFields();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InlineConsumer.prototype, "remainingText", {
        get: function () {
            return this._remainingText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InlineConsumer.prototype, "currentChar", {
        get: function () {
            return this._currentChar;
        },
        enumerable: true,
        configurable: true
    });
    InlineConsumer.prototype.advanceTextIndex = function (length) {
        this.textIndex += length;
    };
    InlineConsumer.prototype.reachedEndOfText = function () {
        return this._textIndex >= this.entireText.length;
    };
    InlineConsumer.prototype.advanceAfterMatch = function (args) {
        var pattern = args.pattern, then = args.then;
        var result = pattern.exec(this._remainingText);
        if (!result) {
            return false;
        }
        var match = result[0], captures = result.slice(1);
        var charAfterMatch = this.entireText[this._textIndex + match.length];
        var isTouchingWordStart = NON_WHITESPACE_CHAR_PATTERN.test(charAfterMatch);
        if (then) {
            then.apply(void 0, [match, this.isTouchingWordEnd, isTouchingWordStart].concat(captures));
        }
        this.advanceTextIndex(match.length);
        return true;
    };
    InlineConsumer.prototype.updateComputedTextFields = function () {
        this._remainingText = this.entireText.substr(this._textIndex);
        this._currentChar = this._remainingText[0];
        var previousChar = this.entireText[this._textIndex - 1];
        this.isTouchingWordEnd = NON_WHITESPACE_CHAR_PATTERN.test(previousChar);
    };
    return InlineConsumer;
}());
exports.InlineConsumer = InlineConsumer;
var NON_WHITESPACE_CHAR_PATTERN = new RegExp(Patterns_1.NON_WHITESPACE_CHAR);

},{"../../Patterns":41}],5:[function(require,module,exports){
"use strict";
var MediaConvention = (function () {
    function MediaConvention(nonLocalizedTerm, NodeType, startTokenKind, goal) {
        this.nonLocalizedTerm = nonLocalizedTerm;
        this.NodeType = NodeType;
        this.startTokenKind = startTokenKind;
        this.goal = goal;
    }
    return MediaConvention;
}());
exports.MediaConvention = MediaConvention;

},{}],6:[function(require,module,exports){
"use strict";
var MediaConvention_1 = require('./MediaConvention');
var TokenKind_1 = require('./TokenKind');
var TokenizerGoal_1 = require('./TokenizerGoal');
var AudioNode_1 = require('../../SyntaxNodes/AudioNode');
var ImageNode_1 = require('../../SyntaxNodes/ImageNode');
var VideoNode_1 = require('../../SyntaxNodes/VideoNode');
var AUDIO = new MediaConvention_1.MediaConvention('audio', AudioNode_1.AudioNode, TokenKind_1.TokenKind.AudioStart, TokenizerGoal_1.TokenizerGoal.Audio);
exports.AUDIO = AUDIO;
var IMAGE = new MediaConvention_1.MediaConvention('image', ImageNode_1.ImageNode, TokenKind_1.TokenKind.ImageStart, TokenizerGoal_1.TokenizerGoal.Image);
exports.IMAGE = IMAGE;
var VIDEO = new MediaConvention_1.MediaConvention('video', VideoNode_1.VideoNode, TokenKind_1.TokenKind.VideoStart, TokenizerGoal_1.TokenizerGoal.Video);
exports.VIDEO = VIDEO;

},{"../../SyntaxNodes/AudioNode":43,"../../SyntaxNodes/ImageNode":56,"../../SyntaxNodes/VideoNode":79,"./MediaConvention":5,"./TokenKind":15,"./TokenizerGoal":20}],7:[function(require,module,exports){
"use strict";
var RichConventions_1 = require('./RichConventions');
var MediaConventions_1 = require('./MediaConventions');
var PlainTextNode_1 = require('../../SyntaxNodes/PlainTextNode');
var isWhitespace_1 = require('../../SyntaxNodes/isWhitespace');
var CollectionHelpers_1 = require('../../CollectionHelpers');
var TokenKind_1 = require('./TokenKind');
var InlineCodeNode_1 = require('../../SyntaxNodes/InlineCodeNode');
var LinkNode_1 = require('../../SyntaxNodes/LinkNode');
var RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES = [
    RichConventions_1.STRESS_CONVENTION,
    RichConventions_1.EMPHASIS_CONVENTION,
    RichConventions_1.REVISION_DELETION_CONVENTION,
    RichConventions_1.REVISION_INSERTION_CONVENTION,
    RichConventions_1.SPOILER_CONVENTION,
    RichConventions_1.FOOTNOTE_CONVENTION,
    RichConventions_1.ACTION_CONVENTION,
    RichConventions_1.PARENTHESIZED_CONVENTION,
    RichConventions_1.SQUARE_BRACKETED_CONVENTION
];
var MEDIA_CONVENTIONS = [
    MediaConventions_1.AUDIO,
    MediaConventions_1.IMAGE,
    MediaConventions_1.VIDEO
];
var Parser = (function () {
    function Parser(args) {
        this.tokenIndex = 0;
        this.countTokensParsed = 0;
        this.nodes = [];
        var untilTokenKind = args.untilTokenKind;
        this.tokens = args.tokens;
        LoopTokens: for (; this.tokenIndex < this.tokens.length; this.tokenIndex++) {
            var token = this.tokens[this.tokenIndex];
            this.countTokensParsed = this.tokenIndex + 1;
            if (token.kind === untilTokenKind) {
                this.setResult();
                return;
            }
            if (token.kind === TokenKind_1.TokenKind.PlainText) {
                if (!token.value) {
                    continue;
                }
                this.nodes.push(new PlainTextNode_1.PlainTextNode(token.value));
                continue;
            }
            if (token.kind === TokenKind_1.TokenKind.InlineCode) {
                if (token.value) {
                    this.nodes.push(new InlineCodeNode_1.InlineCodeNode(token.value));
                }
                continue;
            }
            if (token.kind === TokenKind_1.TokenKind.NakedUrlProtocolAndStart) {
                var protocol = token.value;
                var nakedUrlAfterProtocolAndEndToken = this.getNextTokenAndAdvanceIndex();
                var urlAfterProtocol = nakedUrlAfterProtocolAndEndToken.value;
                if (!urlAfterProtocol) {
                    this.nodes.push(new PlainTextNode_1.PlainTextNode(protocol));
                    continue;
                }
                var url = protocol + urlAfterProtocol;
                if (!urlAfterProtocol) {
                    this.nodes.push(new PlainTextNode_1.PlainTextNode(url));
                    continue;
                }
                var contents = [new PlainTextNode_1.PlainTextNode(urlAfterProtocol)];
                this.nodes.push(new LinkNode_1.LinkNode(contents, url));
                continue;
            }
            if (token.kind === TokenKind_1.TokenKind.LinkStart) {
                var result = this.parse({ untilTokenKind: TokenKind_1.TokenKind.LinkUrlAndEnd });
                var contents = result.nodes;
                var hasContents = isNotPureWhitespace(contents);
                var linkUrlAndEndToken = this.tokens[this.tokenIndex];
                var url = linkUrlAndEndToken.value.trim();
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
            for (var _i = 0, MEDIA_CONVENTIONS_1 = MEDIA_CONVENTIONS; _i < MEDIA_CONVENTIONS_1.length; _i++) {
                var media = MEDIA_CONVENTIONS_1[_i];
                if (token.kind === media.startTokenKind) {
                    var description = this.getNextTokenAndAdvanceIndex().value.trim();
                    var url = this.getNextTokenAndAdvanceIndex().value.trim();
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
            for (var _b = 0, RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES_1 = RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES; _b < RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES_1.length; _b++) {
                var richConvention = RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES_1[_b];
                if (token.kind === richConvention.startTokenKind) {
                    var result = this.parse({ untilTokenKind: richConvention.endTokenKind });
                    if (result.nodes.length) {
                        this.nodes.push(new richConvention.NodeType(result.nodes));
                    }
                    continue LoopTokens;
                }
            }
        }
        var wasTerminatorSpecified = !!untilTokenKind;
        if (wasTerminatorSpecified) {
            throw new Error("Missing terminator token: " + untilTokenKind);
        }
        this.setResult();
        var _a;
    }
    Parser.prototype.getNextTokenAndAdvanceIndex = function () {
        return this.tokens[++this.tokenIndex];
    };
    Parser.prototype.parse = function (args) {
        var result = (new Parser({
            tokens: this.tokens.slice(this.countTokensParsed),
            untilTokenKind: args.untilTokenKind
        })).result;
        this.tokenIndex += result.countTokensParsed;
        return result;
    };
    Parser.prototype.setResult = function () {
        this.result = {
            countTokensParsed: this.countTokensParsed,
            nodes: combineConsecutivePlainTextNodes(this.nodes),
        };
    };
    return Parser;
}());
exports.Parser = Parser;
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

},{"../../CollectionHelpers":1,"../../SyntaxNodes/InlineCodeNode":57,"../../SyntaxNodes/LinkNode":61,"../../SyntaxNodes/PlainTextNode":69,"../../SyntaxNodes/isWhitespace":80,"./MediaConventions":6,"./RichConventions":13,"./TokenKind":15}],8:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Token_1 = require('.././Token');
var TokenKind_1 = require('.././TokenKind');
var RaisedVoiceMarker_1 = require('./RaisedVoiceMarker');
var StartMarker_1 = require('./StartMarker');
var EndMarker = (function (_super) {
    __extends(EndMarker, _super);
    function EndMarker() {
        _super.apply(this, arguments);
    }
    EndMarker.prototype.tokens = function () {
        return this.tokenKinds.map(function (kind) { return new Token_1.Token({ kind: kind }); });
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
        this.tokenKinds.push(TokenKind_1.TokenKind.EmphasisEnd);
        this.tokenKinds.push(TokenKind_1.TokenKind.StressEnd);
        startMarker.startStressAndEmphasisTogether(countAsterisksInCommonWithStartMarker);
    };
    EndMarker.prototype.endStress = function (startMarker) {
        this.payForStress();
        this.tokenKinds.push(TokenKind_1.TokenKind.StressEnd);
        startMarker.startStress();
    };
    EndMarker.prototype.endEmphasis = function (startMarker) {
        this.payForEmphasis();
        this.tokenKinds.push(TokenKind_1.TokenKind.EmphasisEnd);
        startMarker.startEmphasis();
    };
    return EndMarker;
}(RaisedVoiceMarker_1.RaisedVoiceMarker));
exports.EndMarker = EndMarker;

},{".././Token":14,".././TokenKind":15,"./RaisedVoiceMarker":10,"./StartMarker":11}],9:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Token_1 = require('.././Token');
var TokenKind_1 = require('.././TokenKind');
var RaisedVoiceMarker_1 = require('./RaisedVoiceMarker');
var PlainTextMarker = (function (_super) {
    __extends(PlainTextMarker, _super);
    function PlainTextMarker() {
        _super.apply(this, arguments);
    }
    PlainTextMarker.prototype.tokens = function () {
        return [
            new Token_1.Token({ kind: TokenKind_1.TokenKind.PlainText, value: this.originalAsterisks })
        ];
    };
    return PlainTextMarker;
}(RaisedVoiceMarker_1.RaisedVoiceMarker));
exports.PlainTextMarker = PlainTextMarker;

},{".././Token":14,".././TokenKind":15,"./RaisedVoiceMarker":10}],10:[function(require,module,exports){
"use strict";
var EMPHASIS_COST = 1;
var STRESS_COST = 2;
var STRESS_AND_EMPHASIS_TOGETHER_COST = STRESS_COST + EMPHASIS_COST;
var RaisedVoiceMarker = (function () {
    function RaisedVoiceMarker(originalTokenIndex, originalAsterisks) {
        this.originalTokenIndex = originalTokenIndex;
        this.originalAsterisks = originalAsterisks;
        this.tokenKinds = [];
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

},{}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Token_1 = require('.././Token');
var TokenKind_1 = require('.././TokenKind');
var RaisedVoiceMarker_1 = require('./RaisedVoiceMarker');
var StartMarker = (function (_super) {
    __extends(StartMarker, _super);
    function StartMarker() {
        _super.apply(this, arguments);
    }
    StartMarker.prototype.tokens = function () {
        return (this.tokenKinds
            .map(function (kind) { return new Token_1.Token({ kind: kind }); })
            .reverse());
    };
    StartMarker.prototype.startStressAndEmphasisTogether = function (countAsterisksInCommonWithEndMarker) {
        this.payForStressAndEmphasisTogether(countAsterisksInCommonWithEndMarker);
        this.tokenKinds.push(TokenKind_1.TokenKind.EmphasisStart);
        this.tokenKinds.push(TokenKind_1.TokenKind.StressStart);
    };
    StartMarker.prototype.startStress = function () {
        this.payForStress();
        this.tokenKinds.push(TokenKind_1.TokenKind.StressStart);
    };
    StartMarker.prototype.startEmphasis = function () {
        this.payForEmphasis();
        this.tokenKinds.push(TokenKind_1.TokenKind.EmphasisStart);
    };
    return StartMarker;
}(RaisedVoiceMarker_1.RaisedVoiceMarker));
exports.StartMarker = StartMarker;

},{".././Token":14,".././TokenKind":15,"./RaisedVoiceMarker":10}],12:[function(require,module,exports){
"use strict";
var TokenKind_1 = require('.././TokenKind');
var StartMarker_1 = require('./StartMarker');
var EndMarker_1 = require('./EndMarker');
var PlainTextMarker_1 = require('./PlainTextMarker');
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
        var canStartConvention = (token.kind === TokenKind_1.TokenKind.PotentialRaisedVoiceStart
            || token.kind === TokenKind_1.TokenKind.PotentialRaisedVoiceStartOrEnd);
        var canEndConvention = (token.kind === TokenKind_1.TokenKind.PotentialRaisedVoiceEnd
            || token.kind === TokenKind_1.TokenKind.PotentialRaisedVoiceStartOrEnd);
        var isPotentialRaisedVoiceToken = canStartConvention || canEndConvention;
        if (!isPotentialRaisedVoiceToken) {
            continue;
        }
        var asterisks = token.value;
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

},{".././TokenKind":15,"./EndMarker":8,"./PlainTextMarker":9,"./StartMarker":11}],13:[function(require,module,exports){
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
var TokenizerGoal_1 = require('./TokenizerGoal');
var TokenKind_1 = require('./TokenKind');
var EMPHASIS_CONVENTION = {
    NodeType: EmphasisNode_1.EmphasisNode,
    startTokenKind: TokenKind_1.TokenKind.EmphasisStart,
    endTokenKind: TokenKind_1.TokenKind.EmphasisEnd
};
exports.EMPHASIS_CONVENTION = EMPHASIS_CONVENTION;
var STRESS_CONVENTION = {
    NodeType: StressNode_1.StressNode,
    startTokenKind: TokenKind_1.TokenKind.StressStart,
    endTokenKind: TokenKind_1.TokenKind.StressEnd
};
exports.STRESS_CONVENTION = STRESS_CONVENTION;
var REVISION_DELETION_CONVENTION = {
    NodeType: RevisionDeletionNode_1.RevisionDeletionNode,
    startTokenKind: TokenKind_1.TokenKind.RevisionDeletionStart,
    endTokenKind: TokenKind_1.TokenKind.RevisionDeletionEnd,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.RevisionDeletion
};
exports.REVISION_DELETION_CONVENTION = REVISION_DELETION_CONVENTION;
var REVISION_INSERTION_CONVENTION = {
    NodeType: RevisionInsertionNode_1.RevisionInsertionNode,
    startTokenKind: TokenKind_1.TokenKind.RevisionInsertionStart,
    endTokenKind: TokenKind_1.TokenKind.RevisionInsertionEnd,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.RevisionInsertion
};
exports.REVISION_INSERTION_CONVENTION = REVISION_INSERTION_CONVENTION;
var SPOILER_CONVENTION = {
    NodeType: SpoilerNode_1.SpoilerNode,
    startTokenKind: TokenKind_1.TokenKind.SpoilerStart,
    endTokenKind: TokenKind_1.TokenKind.SpoilerEnd,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.Spoiler
};
exports.SPOILER_CONVENTION = SPOILER_CONVENTION;
var FOOTNOTE_CONVENTION = {
    NodeType: FootnoteNode_1.FootnoteNode,
    startTokenKind: TokenKind_1.TokenKind.FootnoteStart,
    endTokenKind: TokenKind_1.TokenKind.FootnoteEnd,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.Footnote
};
exports.FOOTNOTE_CONVENTION = FOOTNOTE_CONVENTION;
var PARENTHESIZED_CONVENTION = {
    NodeType: ParenthesizedNode_1.ParenthesizedNode,
    startTokenKind: TokenKind_1.TokenKind.ParenthesizedStart,
    endTokenKind: TokenKind_1.TokenKind.ParenthesizedEnd,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.Parenthesized
};
exports.PARENTHESIZED_CONVENTION = PARENTHESIZED_CONVENTION;
var SQUARE_BRACKETED_CONVENTION = {
    NodeType: SquareBracketedNode_1.SquareBracketedNode,
    startTokenKind: TokenKind_1.TokenKind.SquareBracketedStart,
    endTokenKind: TokenKind_1.TokenKind.SquareBracketedEnd,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.SquareBracketed
};
exports.SQUARE_BRACKETED_CONVENTION = SQUARE_BRACKETED_CONVENTION;
var ACTION_CONVENTION = {
    NodeType: ActionNode_1.ActionNode,
    startTokenKind: TokenKind_1.TokenKind.ActionStart,
    endTokenKind: TokenKind_1.TokenKind.ActionEnd,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.Action
};
exports.ACTION_CONVENTION = ACTION_CONVENTION;
var LINK_CONVENTION = {
    startTokenKind: TokenKind_1.TokenKind.LinkStart,
    endTokenKind: TokenKind_1.TokenKind.LinkUrlAndEnd,
    tokenizerGoal: TokenizerGoal_1.TokenizerGoal.Link
};
exports.LINK_CONVENTION = LINK_CONVENTION;

},{"../../SyntaxNodes/ActionNode":42,"../../SyntaxNodes/EmphasisNode":51,"../../SyntaxNodes/FootnoteNode":54,"../../SyntaxNodes/ParenthesizedNode":68,"../../SyntaxNodes/RevisionDeletionNode":70,"../../SyntaxNodes/RevisionInsertionNode":71,"../../SyntaxNodes/SpoilerNode":74,"../../SyntaxNodes/SquareBracketedNode":75,"../../SyntaxNodes/StressNode":76,"./TokenKind":15,"./TokenizerGoal":20}],14:[function(require,module,exports){
"use strict";
var Token = (function () {
    function Token(args) {
        this.kind = args.kind;
        this.value = args.value;
        this.correspondsToToken = args.correspondsToToken;
    }
    Token.prototype.associateWith = function (other) {
        this.correspondsToToken = other;
        other.correspondsToToken = this;
    };
    return Token;
}());
exports.Token = Token;

},{}],15:[function(require,module,exports){
"use strict";
(function (TokenKind) {
    TokenKind[TokenKind["ActionEnd"] = 1] = "ActionEnd";
    TokenKind[TokenKind["ActionStart"] = 2] = "ActionStart";
    TokenKind[TokenKind["AudioStart"] = 3] = "AudioStart";
    TokenKind[TokenKind["EmphasisEnd"] = 4] = "EmphasisEnd";
    TokenKind[TokenKind["EmphasisStart"] = 5] = "EmphasisStart";
    TokenKind[TokenKind["FootnoteEnd"] = 6] = "FootnoteEnd";
    TokenKind[TokenKind["FootnoteStart"] = 7] = "FootnoteStart";
    TokenKind[TokenKind["ImageStart"] = 8] = "ImageStart";
    TokenKind[TokenKind["InlineCode"] = 9] = "InlineCode";
    TokenKind[TokenKind["LinkUrlAndEnd"] = 10] = "LinkUrlAndEnd";
    TokenKind[TokenKind["LinkStart"] = 11] = "LinkStart";
    TokenKind[TokenKind["MediaDescription"] = 12] = "MediaDescription";
    TokenKind[TokenKind["MediaUrlAndEnd"] = 13] = "MediaUrlAndEnd";
    TokenKind[TokenKind["NakedUrlAfterProtocolAndEnd"] = 14] = "NakedUrlAfterProtocolAndEnd";
    TokenKind[TokenKind["NakedUrlProtocolAndStart"] = 15] = "NakedUrlProtocolAndStart";
    TokenKind[TokenKind["ParenthesizedEnd"] = 16] = "ParenthesizedEnd";
    TokenKind[TokenKind["ParenthesizedStart"] = 17] = "ParenthesizedStart";
    TokenKind[TokenKind["PlainText"] = 18] = "PlainText";
    TokenKind[TokenKind["PotentialRaisedVoiceEnd"] = 19] = "PotentialRaisedVoiceEnd";
    TokenKind[TokenKind["PotentialRaisedVoiceStartOrEnd"] = 20] = "PotentialRaisedVoiceStartOrEnd";
    TokenKind[TokenKind["PotentialRaisedVoiceStart"] = 21] = "PotentialRaisedVoiceStart";
    TokenKind[TokenKind["RevisionDeletionEnd"] = 22] = "RevisionDeletionEnd";
    TokenKind[TokenKind["RevisionDeletionStart"] = 23] = "RevisionDeletionStart";
    TokenKind[TokenKind["RevisionInsertionEnd"] = 24] = "RevisionInsertionEnd";
    TokenKind[TokenKind["RevisionInsertionStart"] = 25] = "RevisionInsertionStart";
    TokenKind[TokenKind["SpoilerEnd"] = 26] = "SpoilerEnd";
    TokenKind[TokenKind["SpoilerStart"] = 27] = "SpoilerStart";
    TokenKind[TokenKind["SquareBracketedEnd"] = 28] = "SquareBracketedEnd";
    TokenKind[TokenKind["SquareBracketedStart"] = 29] = "SquareBracketedStart";
    TokenKind[TokenKind["StressEnd"] = 30] = "StressEnd";
    TokenKind[TokenKind["StressStart"] = 31] = "StressStart";
    TokenKind[TokenKind["VideoStart"] = 32] = "VideoStart";
})(exports.TokenKind || (exports.TokenKind = {}));
var TokenKind = exports.TokenKind;

},{}],16:[function(require,module,exports){
"use strict";
var Patterns_1 = require('../../Patterns');
var TokenizableBracket = (function () {
    function TokenizableBracket(args) {
        var goal = args.goal, bracket = args.bracket;
        this.goal = goal;
        this.startPattern = Patterns_1.regExpStartingWith(bracket.startPattern);
        this.endPattern = Patterns_1.regExpStartingWith(bracket.endPattern);
        this.open = bracket.start;
        this.close = bracket.end;
    }
    return TokenizableBracket;
}());
exports.TokenizableBracket = TokenizableBracket;

},{"../../Patterns":41}],17:[function(require,module,exports){
"use strict";
var Patterns_1 = require('../../Patterns');
var TokenizableRichSandwich = (function () {
    function TokenizableRichSandwich(args) {
        this.goal = args.richConvention.tokenizerGoal;
        this.startPattern = Patterns_1.regExpStartingWith(args.startPattern, 'i');
        this.endPattern = Patterns_1.regExpStartingWith(args.endPattern);
        this.startTokenKind = args.richConvention.startTokenKind;
        this.endTokenKind = args.richConvention.endTokenKind;
    }
    return TokenizableRichSandwich;
}());
exports.TokenizableRichSandwich = TokenizableRichSandwich;

},{"../../Patterns":41}],18:[function(require,module,exports){
"use strict";
var Patterns_1 = require('../../Patterns');
var RichConventions_1 = require('./RichConventions');
var applyRaisedVoices_1 = require('./RaisedVoices/applyRaisedVoices');
var nestOverlappingConventions_1 = require('./nestOverlappingConventions');
var insertBracketsInsideBracketedConventions_1 = require('./insertBracketsInsideBracketedConventions');
var CollectionHelpers_1 = require('../../CollectionHelpers');
var TokenizerGoal_1 = require('./TokenizerGoal');
var TokenizableRichSandwich_1 = require('./TokenizableRichSandwich');
var Bracket_1 = require('./Bracket');
var TokenizableBracket_1 = require('./TokenizableBracket');
var FailedGoalTracker_1 = require('./FailedGoalTracker');
var TokenizerContext_1 = require('./TokenizerContext');
var TokenizerSnapshot_1 = require('./TokenizerSnapshot');
var InlineConsumer_1 = require('./InlineConsumer');
var TokenKind_1 = require('./TokenKind');
var Token_1 = require('./Token');
var Tokenizer = (function () {
    function Tokenizer(entireText, config) {
        var _this = this;
        this.tokens = [];
        this.openContexts = [];
        this.failedGoalTracker = new FailedGoalTracker_1.FailedGoalTracker();
        this.buffer = '';
        this.inlineCode = {
            goal: TokenizerGoal_1.TokenizerGoal.InlineCode,
            startPattern: INLINE_CODE_DELIMITER_PATTERN,
            endPattern: INLINE_CODE_DELIMITER_PATTERN,
            flushBufferToPlainTextTokenBeforeOpening: true,
            insteadOfTryingToCloseOuterContexts: function () { return _this.bufferCurrentChar(); },
            onCloseFlushBufferTo: TokenKind_1.TokenKind.InlineCode
        };
        this.richBrackets = [
            {
                richConvention: RichConventions_1.PARENTHESIZED_CONVENTION,
                startPattern: PARENTHESIS.startPattern,
                endPattern: PARENTHESIS.endPattern
            }, {
                richConvention: RichConventions_1.SQUARE_BRACKETED_CONVENTION,
                startPattern: SQUARE_BRACKET.startPattern,
                endPattern: SQUARE_BRACKET.endPattern
            }, {
                richConvention: RichConventions_1.ACTION_CONVENTION,
                startPattern: CURLY_BRACKET.startPattern,
                endPattern: CURLY_BRACKET.endPattern
            }
        ].map(function (args) { return new TokenizableRichSandwich_1.TokenizableRichSandwich(args); });
        this.rawBrackets = [
            { goal: TokenizerGoal_1.TokenizerGoal.ParenthesizedInRawText, bracket: PARENTHESIS },
            { goal: TokenizerGoal_1.TokenizerGoal.SquareBracketedInRawText, bracket: SQUARE_BRACKET },
            { goal: TokenizerGoal_1.TokenizerGoal.CurlyBracketedInRawText, bracket: CURLY_BRACKET }
        ].map(function (args) { return new TokenizableBracket_1.TokenizableBracket(args); });
        this.bracketedLinkUrls = [
            { goal: TokenizerGoal_1.TokenizerGoal.ParenthesizedLinkUrl, bracket: PARENTHESIS },
            { goal: TokenizerGoal_1.TokenizerGoal.SquareBracketedLinkUrl, bracket: SQUARE_BRACKET },
            { goal: TokenizerGoal_1.TokenizerGoal.CurlyBracketedLinkUrl, bracket: CURLY_BRACKET }
        ].map(function (args) { return new TokenizableBracket_1.TokenizableBracket(args); });
        this.consumer = new InlineConsumer_1.InlineConsumer(entireText);
        this.configureConventions(config);
        this.tokenize();
    }
    Tokenizer.prototype.configureConventions = function (config) {
        this.richSandwichesExceptRichBrackets = [
            {
                richConvention: RichConventions_1.SPOILER_CONVENTION,
                startPattern: SQUARE_BRACKET.startPattern + Patterns_1.escapeForRegex(config.settings.i18n.terms.spoiler) + ':' + Patterns_1.ANY_WHITESPACE,
                endPattern: SQUARE_BRACKET.endPattern
            }, {
                richConvention: RichConventions_1.FOOTNOTE_CONVENTION,
                startPattern: Patterns_1.ANY_WHITESPACE + Patterns_1.escapeForRegex('(('),
                endPattern: Patterns_1.escapeForRegex('))')
            }, {
                richConvention: RichConventions_1.REVISION_DELETION_CONVENTION,
                startPattern: '~~',
                endPattern: '~~'
            }, {
                richConvention: RichConventions_1.REVISION_INSERTION_CONVENTION,
                startPattern: Patterns_1.escapeForRegex('++'),
                endPattern: Patterns_1.escapeForRegex('++')
            }
        ].map(function (args) { return new TokenizableRichSandwich_1.TokenizableRichSandwich(args); });
    };
    Tokenizer.prototype.tokenize = function () {
        while (!this.isDone()) {
            this.tryToCollectEscapedChar()
                || this.tryToCloseAnyConvention()
                || this.performContextSpecificBehaviorInsteadOfTryingToOpenUsualContexts()
                || this.tryToTokenizeRaisedVoicePlaceholders()
                || this.tryToOpenAnyConvention()
                || this.bufferCurrentChar();
        }
        this.tokens =
            nestOverlappingConventions_1.nestOverlappingConventions(applyRaisedVoices_1.applyRaisedVoices(insertBracketsInsideBracketedConventions_1.insertBracketsInsideBracketedConventions(this.tokens)));
    };
    Tokenizer.prototype.performContextSpecificBehaviorInsteadOfTryingToOpenUsualContexts = function () {
        return CollectionHelpers_1.reversed(this.openContexts)
            .some(function (context) { return context.doInsteadOfTryingToOpenUsualContexts(); });
    };
    Tokenizer.prototype.tryToCollectEscapedChar = function () {
        var ESCAPE_CHAR = '\\';
        if (this.consumer.currentChar !== ESCAPE_CHAR) {
            return false;
        }
        this.consumer.advanceTextIndex(1);
        return this.consumer.reachedEndOfText() || this.bufferCurrentChar();
    };
    Tokenizer.prototype.isDone = function () {
        return this.consumer.reachedEndOfText() && this.resolveUnclosedContexts();
    };
    Tokenizer.prototype.tryToCloseAnyConvention = function () {
        var innerNakedUrlContextIndex = null;
        for (var i = this.openContexts.length - 1; i >= 0; i--) {
            var context_1 = this.openContexts[i];
            if (this.shouldCloseContext(context_1)) {
                if (innerNakedUrlContextIndex != null) {
                    this.flushBufferToNakedUrlEndToken();
                    this.openContexts.splice(i);
                }
                if (context_1.convention.onCloseFlushBufferTo != null) {
                    this.flushBufferToTokenOfKind(context_1.convention.onCloseFlushBufferTo);
                }
                context_1.close();
                if (context_1.convention.closeInnerContextsWhenClosing) {
                    this.openContexts.splice(i);
                }
                else {
                    this.openContexts.splice(i, 1);
                }
                return true;
            }
            if (context_1.doIsteadOfTryingToCloseOuterContexts()) {
                return true;
            }
            if (context_1.convention.goal === TokenizerGoal_1.TokenizerGoal.NakedUrl) {
                innerNakedUrlContextIndex = i;
            }
        }
        return false;
    };
    Tokenizer.prototype.shouldCloseContext = function (context) {
        var _this = this;
        return this.consumer.advanceAfterMatch({
            pattern: context.convention.endPattern,
            then: function (match, isTouchingWordEnd, isTouchingWordStart) {
                var captures = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    captures[_i - 3] = arguments[_i];
                }
                if (context.convention.doNotConsumeEndPattern) {
                    _this.consumer.textIndex -= match.length;
                }
            }
        });
    };
    Tokenizer.prototype.tryToOpenAnyConvention = function () {
        return (this.tryToOpenContext(this.inlineCode)
            || this.tryToOpenAnyRichSandwich()
            || this.tryToOpenAnyLinkUrl()
            || this.tryToOpenAnyRichBracket()
            || this.tryToOpenNakedUrl());
    };
    Tokenizer.prototype.tryToOpenAnyLinkUrl = function () {
        var _this = this;
        return this.bracketedLinkUrls.some(function (bracket) { return _this.tryToOpenLinkUrl(bracket); });
    };
    Tokenizer.prototype.tryToOpenLinkUrl = function (bracketedLinkUrl) {
        var _this = this;
        return this.tryToOpenContext({
            goal: bracketedLinkUrl.goal,
            onlyOpenIf: function () { return _this.isDirectlyFollowingLinkableBrackets(); },
            startPattern: bracketedLinkUrl.startPattern,
            flushBufferToPlainTextTokenBeforeOpening: false,
            insteadOfTryingToCloseOuterContexts: function () { return _this.bufferRawText(); },
            endPattern: bracketedLinkUrl.endPattern,
            closeInnerContextsWhenClosing: true,
            onClose: function () {
                var url = _this.flushBuffer();
                var lastToken = CollectionHelpers_1.last(_this.tokens);
                lastToken.correspondsToToken.kind = RichConventions_1.LINK_CONVENTION.startTokenKind;
                lastToken.kind = RichConventions_1.LINK_CONVENTION.endTokenKind;
                lastToken.value = url;
            }
        });
    };
    Tokenizer.prototype.isDirectlyFollowingLinkableBrackets = function () {
        var linkableBrackets = [
            TokenKind_1.TokenKind.ParenthesizedEnd,
            TokenKind_1.TokenKind.SquareBracketedEnd,
            TokenKind_1.TokenKind.ActionEnd
        ];
        return (this.buffer === ''
            && this.tokens.length
            && CollectionHelpers_1.contains(linkableBrackets, CollectionHelpers_1.last(this.tokens).kind));
    };
    Tokenizer.prototype.tryToOpenAnyRichBracket = function () {
        var _this = this;
        return this.richBrackets.some(function (bracket) { return _this.tryToOpenRichSandwich(bracket); });
    };
    Tokenizer.prototype.tryToOpenAnyRichSandwich = function () {
        var _this = this;
        return this.richSandwichesExceptRichBrackets.some(function (sandwich) { return _this.tryToOpenRichSandwich(sandwich); });
    };
    Tokenizer.prototype.tryToOpenRichSandwich = function (sandwich) {
        var _this = this;
        return this.tryToOpenContext({
            goal: sandwich.goal,
            startPattern: sandwich.startPattern,
            flushBufferToPlainTextTokenBeforeOpening: true,
            endPattern: sandwich.endPattern,
            onCloseFlushBufferTo: TokenKind_1.TokenKind.PlainText,
            onClose: function (context) {
                var startToken = new Token_1.Token({ kind: sandwich.startTokenKind });
                var endToken = new Token_1.Token({ kind: sandwich.endTokenKind });
                startToken.associateWith(endToken);
                _this.insertTokenAtStartOfContext(context, startToken);
                _this.tokens.push(endToken);
            }
        });
    };
    Tokenizer.prototype.tryToOpenAnyRawTextBracket = function () {
        var _this = this;
        return this.rawBrackets.some(function (bracket) { return _this.tryToOpenRawBracket(bracket); });
    };
    Tokenizer.prototype.tryToOpenRawBracket = function (bracket) {
        var _this = this;
        return this.tryToOpenContext({
            goal: bracket.goal,
            startPattern: bracket.startPattern,
            flushBufferToPlainTextTokenBeforeOpening: false,
            onOpen: function () { _this.buffer += bracket.open; },
            endPattern: bracket.endPattern,
            onClose: function () { _this.buffer += bracket.close; },
            resolveWhenLeftUnclosed: function () { return true; }
        });
    };
    Tokenizer.prototype.tryToOpenNakedUrl = function () {
        var _this = this;
        return this.tryToOpenContext({
            goal: TokenizerGoal_1.TokenizerGoal.NakedUrl,
            startPattern: NAKED_URL_PROTOCOL_PATTERN,
            flushBufferToPlainTextTokenBeforeOpening: true,
            onOpen: function (urlProtocol) {
                _this.createTokenAndAppend({ kind: TokenKind_1.TokenKind.NakedUrlProtocolAndStart, value: urlProtocol });
            },
            insteadOfOpeningUsualContexts: function () { return _this.bufferRawText(); },
            endPattern: NAKED_URL_TERMINATOR_PATTERN,
            doNotConsumeEndPattern: true,
            closeInnerContextsWhenClosing: true,
            onCloseFlushBufferTo: TokenKind_1.TokenKind.NakedUrlAfterProtocolAndEnd,
            resolveWhenLeftUnclosed: function () { return _this.flushBufferToNakedUrlEndToken(); }
        });
    };
    Tokenizer.prototype.bufferRawText = function () {
        return this.tryToOpenAnyRawTextBracket() || this.bufferCurrentChar();
    };
    Tokenizer.prototype.tryToOpenContext = function (convention) {
        var _this = this;
        var goal = convention.goal, startPattern = convention.startPattern, onlyOpenIf = convention.onlyOpenIf, flushBufferToPlainTextTokenBeforeOpening = convention.flushBufferToPlainTextTokenBeforeOpening, onOpen = convention.onOpen;
        return (this.canTry(goal)
            && (!onlyOpenIf || onlyOpenIf())
            && this.consumer.advanceAfterMatch({
                pattern: startPattern,
                then: function (match, isTouchingWordEnd, isTouchingWordStart) {
                    var captures = [];
                    for (var _i = 3; _i < arguments.length; _i++) {
                        captures[_i - 3] = arguments[_i];
                    }
                    if (flushBufferToPlainTextTokenBeforeOpening) {
                        _this.flushBufferToPlainTextTokenIfBufferIsNotEmpty();
                    }
                    _this.openContexts.push(new TokenizerContext_1.TokenizerContext(convention, _this.getCurrentSnapshot()));
                    if (onOpen) {
                        onOpen.apply(void 0, [match, isTouchingWordEnd, isTouchingWordStart].concat(captures));
                    }
                }
            }));
    };
    Tokenizer.prototype.getCurrentSnapshot = function () {
        return new TokenizerSnapshot_1.TokenizerSnapshot({
            textIndex: this.consumer.textIndex,
            tokens: this.tokens,
            openContexts: this.openContexts,
            bufferedText: this.buffer
        });
    };
    Tokenizer.prototype.resolveUnclosedContexts = function () {
        while (this.openContexts.length) {
            var context_2 = this.openContexts.pop();
            if (!context_2.resolveWhenLeftUnclosed()) {
                this.resetToBeforeContext(context_2);
                return false;
            }
        }
        this.flushBufferToPlainTextTokenIfBufferIsNotEmpty();
        return true;
    };
    Tokenizer.prototype.resetToBeforeContext = function (context) {
        this.failedGoalTracker.registerFailure(context);
        this.tokens = context.snapshot.tokens;
        this.openContexts = context.snapshot.openContexts;
        this.buffer = context.snapshot.bufferedText;
        this.consumer.textIndex = context.snapshot.textIndex;
        for (var _i = 0, _a = this.openContexts; _i < _a.length; _i++) {
            var context_3 = _a[_i];
            context_3.reset();
        }
    };
    Tokenizer.prototype.flushBufferToNakedUrlEndToken = function () {
        this.flushBufferToTokenOfKind(TokenKind_1.TokenKind.NakedUrlAfterProtocolAndEnd);
    };
    Tokenizer.prototype.flushBuffer = function () {
        var buffer = this.buffer;
        this.buffer = '';
        return buffer;
    };
    Tokenizer.prototype.flushBufferToTokenOfKind = function (kind) {
        this.createTokenAndAppend({ kind: kind, value: this.flushBuffer() });
    };
    Tokenizer.prototype.tryToTokenizeRaisedVoicePlaceholders = function () {
        var _this = this;
        return this.consumer.advanceAfterMatch({
            pattern: RAISED_VOICE_DELIMITER_PATTERN,
            then: function (asterisks, isTouchingWordEnd, isTouchingWordStart) {
                var canCloseConvention = isTouchingWordEnd;
                var canOpenConvention = isTouchingWordStart;
                var asteriskTokenKind = TokenKind_1.TokenKind.PlainText;
                if (canOpenConvention && canCloseConvention) {
                    asteriskTokenKind = TokenKind_1.TokenKind.PotentialRaisedVoiceStartOrEnd;
                }
                else if (canOpenConvention) {
                    asteriskTokenKind = TokenKind_1.TokenKind.PotentialRaisedVoiceStart;
                }
                else if (canCloseConvention) {
                    asteriskTokenKind = TokenKind_1.TokenKind.PotentialRaisedVoiceEnd;
                }
                _this.flushBufferToPlainTextTokenIfBufferIsNotEmpty();
                _this.createTokenAndAppend({ kind: asteriskTokenKind, value: asterisks });
            }
        });
    };
    Tokenizer.prototype.createTokenAndAppend = function (args) {
        this.tokens.push(new Token_1.Token(args));
    };
    Tokenizer.prototype.insertTokenAtStartOfContext = function (context, token) {
        var newTokenIndex = context.initialTokenIndex;
        this.tokens.splice(newTokenIndex, 0, token);
        for (var _i = 0, _a = this.openContexts; _i < _a.length; _i++) {
            var openContext = _a[_i];
            openContext.registerTokenInsertion({ atIndex: newTokenIndex, onBehalfOfContext: context });
        }
    };
    Tokenizer.prototype.bufferCurrentChar = function () {
        this.buffer += this.consumer.currentChar;
        this.consumer.advanceTextIndex(1);
        return true;
    };
    Tokenizer.prototype.flushBufferToPlainTextTokenIfBufferIsNotEmpty = function () {
        if (this.buffer) {
            this.flushBufferToTokenOfKind(TokenKind_1.TokenKind.PlainText);
        }
    };
    Tokenizer.prototype.canTry = function (goal, textIndex) {
        if (textIndex === void 0) { textIndex = this.consumer.textIndex; }
        return !this.failedGoalTracker.hasFailed(goal, textIndex);
    };
    Tokenizer.prototype.hasGoal = function () {
        var goals = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            goals[_i - 0] = arguments[_i];
        }
        return this.openContexts.some(function (context) { return CollectionHelpers_1.contains(goals, context.convention.goal); });
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
var PARENTHESIS = new Bracket_1.Bracket('(', ')');
var SQUARE_BRACKET = new Bracket_1.Bracket('[', ']');
var CURLY_BRACKET = new Bracket_1.Bracket('{', '}');
var INLINE_CODE_DELIMITER_PATTERN = Patterns_1.regExpStartingWith('`');
var RAISED_VOICE_DELIMITER_PATTERN = Patterns_1.regExpStartingWith(Patterns_1.atLeast(1, Patterns_1.escapeForRegex('*')));
var NAKED_URL_PROTOCOL_PATTERN = Patterns_1.regExpStartingWith('http' + Patterns_1.optional('s') + '://');
var NAKED_URL_TERMINATOR_PATTERN = Patterns_1.regExpStartingWith(Patterns_1.WHITESPACE_CHAR);

},{"../../CollectionHelpers":1,"../../Patterns":41,"./Bracket":2,"./FailedGoalTracker":3,"./InlineConsumer":4,"./RaisedVoices/applyRaisedVoices":12,"./RichConventions":13,"./Token":14,"./TokenKind":15,"./TokenizableBracket":16,"./TokenizableRichSandwich":17,"./TokenizerContext":19,"./TokenizerGoal":20,"./TokenizerSnapshot":21,"./insertBracketsInsideBracketedConventions":23,"./nestOverlappingConventions":24}],19:[function(require,module,exports){
"use strict";
var TokenizerContext = (function () {
    function TokenizerContext(convention, snapshot) {
        this.convention = convention;
        this.snapshot = snapshot;
        this.initialTokenIndex = snapshot.textIndex;
        this.snapshot = snapshot;
        this.reset();
    }
    TokenizerContext.prototype.doIsteadOfTryingToCloseOuterContexts = function () {
        if (this.convention.insteadOfTryingToCloseOuterContexts) {
            this.convention.insteadOfTryingToCloseOuterContexts();
            return true;
        }
        return false;
    };
    TokenizerContext.prototype.doInsteadOfTryingToOpenUsualContexts = function () {
        if (this.convention.insteadOfOpeningUsualContexts) {
            this.convention.insteadOfOpeningUsualContexts();
            return true;
        }
        return false;
    };
    TokenizerContext.prototype.close = function () {
        if (this.convention.onClose) {
            this.convention.onClose(this);
        }
    };
    TokenizerContext.prototype.resolveWhenLeftUnclosed = function () {
        if (this.convention.resolveWhenLeftUnclosed) {
            this.convention.resolveWhenLeftUnclosed(this);
            return true;
        }
        return false;
    };
    TokenizerContext.prototype.registerTokenInsertion = function (args) {
        var atIndex = args.atIndex, onBehalfOfContext = args.onBehalfOfContext;
        var mustIncrementInitialIndex = (atIndex < this.initialTokenIndex
            || (atIndex === this.initialTokenIndex
                && onBehalfOfContext.snapshot.textIndex < this.snapshot.textIndex));
        if (mustIncrementInitialIndex) {
            this.initialTokenIndex += 1;
        }
    };
    TokenizerContext.prototype.reset = function () {
        this.initialTokenIndex = this.snapshot.tokens.length;
    };
    return TokenizerContext;
}());
exports.TokenizerContext = TokenizerContext;

},{}],20:[function(require,module,exports){
"use strict";
(function (TokenizerGoal) {
    TokenizerGoal[TokenizerGoal["InlineCode"] = 1] = "InlineCode";
    TokenizerGoal[TokenizerGoal["Footnote"] = 2] = "Footnote";
    TokenizerGoal[TokenizerGoal["Spoiler"] = 3] = "Spoiler";
    TokenizerGoal[TokenizerGoal["Parenthesized"] = 4] = "Parenthesized";
    TokenizerGoal[TokenizerGoal["SquareBracketed"] = 5] = "SquareBracketed";
    TokenizerGoal[TokenizerGoal["Action"] = 6] = "Action";
    TokenizerGoal[TokenizerGoal["ParenthesizedInRawText"] = 7] = "ParenthesizedInRawText";
    TokenizerGoal[TokenizerGoal["SquareBracketedInRawText"] = 8] = "SquareBracketedInRawText";
    TokenizerGoal[TokenizerGoal["CurlyBracketedInRawText"] = 9] = "CurlyBracketedInRawText";
    TokenizerGoal[TokenizerGoal["ParenthesizedLinkUrl"] = 10] = "ParenthesizedLinkUrl";
    TokenizerGoal[TokenizerGoal["SquareBracketedLinkUrl"] = 11] = "SquareBracketedLinkUrl";
    TokenizerGoal[TokenizerGoal["CurlyBracketedLinkUrl"] = 12] = "CurlyBracketedLinkUrl";
    TokenizerGoal[TokenizerGoal["Link"] = 13] = "Link";
    TokenizerGoal[TokenizerGoal["LinkUrl"] = 14] = "LinkUrl";
    TokenizerGoal[TokenizerGoal["RevisionInsertion"] = 15] = "RevisionInsertion";
    TokenizerGoal[TokenizerGoal["RevisionDeletion"] = 16] = "RevisionDeletion";
    TokenizerGoal[TokenizerGoal["Audio"] = 17] = "Audio";
    TokenizerGoal[TokenizerGoal["Image"] = 18] = "Image";
    TokenizerGoal[TokenizerGoal["Video"] = 19] = "Video";
    TokenizerGoal[TokenizerGoal["MediaUrl"] = 20] = "MediaUrl";
    TokenizerGoal[TokenizerGoal["NakedUrl"] = 21] = "NakedUrl";
})(exports.TokenizerGoal || (exports.TokenizerGoal = {}));
var TokenizerGoal = exports.TokenizerGoal;

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
"use strict";
var Tokenizer_1 = require('./Tokenizer');
var Parser_1 = require('./Parser');
function getInlineNodes(text, config) {
    var tokens = (new Tokenizer_1.Tokenizer(text, config)).tokens;
    return new Parser_1.Parser({ tokens: tokens }).result.nodes;
}
exports.getInlineNodes = getInlineNodes;

},{"./Parser":7,"./Tokenizer":18}],23:[function(require,module,exports){
"use strict";
var RichConventions_1 = require('./RichConventions');
var TokenKind_1 = require('./TokenKind');
var Token_1 = require('./Token');
function insertBracketsInsideBracketedConventions(tokens) {
    var resultTokens = [];
    var _loop_1 = function(token) {
        function addBracketIfTokenIs(bracket, kind) {
            if (token.kind === kind) {
                resultTokens.push(new Token_1.Token({ kind: TokenKind_1.TokenKind.PlainText, value: bracket }));
            }
        }
        addBracketIfTokenIs(')', RichConventions_1.PARENTHESIZED_CONVENTION.endTokenKind);
        addBracketIfTokenIs(']', RichConventions_1.SQUARE_BRACKETED_CONVENTION.endTokenKind);
        resultTokens.push(token);
        addBracketIfTokenIs('(', RichConventions_1.PARENTHESIZED_CONVENTION.startTokenKind);
        addBracketIfTokenIs('[', RichConventions_1.SQUARE_BRACKETED_CONVENTION.startTokenKind);
    };
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        _loop_1(token);
    }
    return resultTokens;
}
exports.insertBracketsInsideBracketedConventions = insertBracketsInsideBracketedConventions;

},{"./RichConventions":13,"./Token":14,"./TokenKind":15}],24:[function(require,module,exports){
"use strict";
var RichConventions_1 = require('./RichConventions');
function nestOverlappingConventions(tokens) {
    return new ConventionNester(tokens).tokens;
}
exports.nestOverlappingConventions = nestOverlappingConventions;
var FREELY_SPLITTABLE_CONVENTIONS = [
    RichConventions_1.REVISION_DELETION_CONVENTION,
    RichConventions_1.REVISION_INSERTION_CONVENTION,
    RichConventions_1.PARENTHESIZED_CONVENTION,
    RichConventions_1.SQUARE_BRACKETED_CONVENTION,
];
var CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT = [
    RichConventions_1.LINK_CONVENTION,
    RichConventions_1.ACTION_CONVENTION,
    RichConventions_1.SPOILER_CONVENTION,
    RichConventions_1.FOOTNOTE_CONVENTION
];
var ConventionNester = (function () {
    function ConventionNester(tokens) {
        this.tokens = tokens;
        this.tokens = tokens.slice();
        var splittableConventions = FREELY_SPLITTABLE_CONVENTIONS.slice();
        this.splitConventionsThatStartInsideAnotherConventionAndEndAfter(splittableConventions);
        for (var _i = 0, CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT_1 = CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT; _i < CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT_1.length; _i++) {
            var conventionNotToSplit = CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT_1[_i];
            this.resolveOverlapping(splittableConventions, conventionNotToSplit);
            splittableConventions.push(conventionNotToSplit);
        }
    }
    ConventionNester.prototype.splitConventionsThatStartInsideAnotherConventionAndEndAfter = function (conventions) {
        var unclosedStartTokens = [];
        for (var tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
            var token = this.tokens[tokenIndex];
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
                if (unclosedStartToken.correspondsToToken === token) {
                    unclosedStartTokens.splice(i, 1);
                    break;
                }
                endTokensOfOverlappingConventions.push(unclosedStartToken.correspondsToToken);
            }
            this.closeAndReopenConventionsAroundTokenAtIndex(tokenIndex, endTokensOfOverlappingConventions);
            var countOverlapping = endTokensOfOverlappingConventions.length;
            tokenIndex += (2 * countOverlapping);
        }
    };
    ConventionNester.prototype.resolveOverlapping = function (splittableConventions, conventionNotToSplit) {
        for (var tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
            var potentialHeroStartToken = this.tokens[tokenIndex];
            var isStartTokenForHeroConvention = potentialHeroStartToken.kind === conventionNotToSplit.startTokenKind;
            if (!isStartTokenForHeroConvention) {
                continue;
            }
            var heroStartIndex = tokenIndex;
            var heroEndIndex = void 0;
            for (var i = heroStartIndex + 1; i < this.tokens.length; i++) {
                var potentialHeroEndToken = this.tokens[i];
                var isEndTokenForHeroConvention = potentialHeroEndToken.kind === conventionNotToSplit.endTokenKind;
                if (isEndTokenForHeroConvention) {
                    heroEndIndex = i;
                    break;
                }
            }
            var overlappingStartingBefore = [];
            var overlappingStartingInside = [];
            for (var indexInsideHero = heroStartIndex + 1; indexInsideHero < heroEndIndex; indexInsideHero++) {
                var token = this.tokens[indexInsideHero];
                if (doesTokenStartConvention(token, splittableConventions)) {
                    overlappingStartingInside.push(token.correspondsToToken);
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
        var startTokens = endTokensFromMostRecentToLeast
            .map(function (endToken) { return endToken.correspondsToToken; })
            .reverse();
        this.insertTokens(index + 1, startTokens);
        this.insertTokens(index, endTokensFromMostRecentToLeast);
    };
    ConventionNester.prototype.insertTokens = function (index, contextualizedTokens) {
        (_a = this.tokens).splice.apply(_a, [index, 0].concat(contextualizedTokens));
        var _a;
    };
    return ConventionNester;
}());
function doesTokenStartConvention(token, conventions) {
    return (conventions.some(function (convention) { return token.kind === convention.startTokenKind; }));
}
function doesTokenEndConvention(token, conventions) {
    return (conventions.some(function (convention) { return token.kind === convention.endTokenKind; }));
}

},{"./RichConventions":13}],25:[function(require,module,exports){
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

},{"./getSortedUnderlineChars":30}],26:[function(require,module,exports){
"use strict";
var LineConsumer = (function () {
    function LineConsumer(entireText) {
        this.entireText = entireText;
        this.setTextIndex(0);
    }
    Object.defineProperty(LineConsumer.prototype, "textIndex", {
        get: function () {
            return this._textIndex;
        },
        enumerable: true,
        configurable: true
    });
    LineConsumer.prototype.setTextIndex = function (value) {
        this._textIndex = value;
        this._remainingText = this.entireText.slice(this.textIndex);
    };
    Object.defineProperty(LineConsumer.prototype, "remainingText", {
        get: function () {
            return this._remainingText;
        },
        enumerable: true,
        configurable: true
    });
    LineConsumer.prototype.advanceTextIndex = function (length) {
        this.setTextIndex(this.textIndex + length);
    };
    LineConsumer.prototype.reachedEndOfText = function () {
        return this.textIndex >= this.entireText.length;
    };
    LineConsumer.prototype.consumeLine = function (args) {
        if (this.reachedEndOfText()) {
            return false;
        }
        var fullLine;
        var lineWithoutTerminatingLineBreak;
        for (var i = this.textIndex; i < this.entireText.length; i++) {
            var char = this.entireText[i];
            if (char === '\\') {
                i++;
                continue;
            }
            if (char === '\n') {
                fullLine = this.entireText.substring(this.textIndex, i + 1);
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
        this.advanceTextIndex(fullLine.length);
        if (args.then) {
            args.then.apply(args, [lineWithoutTerminatingLineBreak].concat(captures));
        }
        return true;
    };
    return LineConsumer;
}());
exports.LineConsumer = LineConsumer;

},{}],27:[function(require,module,exports){
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
        args.then([new HeadingNode_1.HeadingNode(getInlineNodes_1.getInlineNodes(rawContent, args.config), headingLevel)], consumer.textIndex);
        return true;
    };
}
exports.getHeadingParser = getHeadingParser;
function isUnderlineConsistentWithOverline(overline, underline) {
    return !overline || (getSortedUnderlineChars_1.getSortedUnderlineChars(overline) === getSortedUnderlineChars_1.getSortedUnderlineChars(underline));
}
var NON_BLANK_PATTERN = new RegExp(Patterns_1.NON_BLANK);
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);

},{"../../Patterns":41,"../../SyntaxNodes/HeadingNode":55,"../Inline/getInlineNodes":22,"./LineConsumer":26,"./getSortedUnderlineChars":30,"./isLineFancyOutlineConvention":31}],28:[function(require,module,exports){
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
    while (!consumer.reachedEndOfText()) {
        for (var _i = 0, outlineParsers_1 = outlineParsers; _i < outlineParsers_1.length; _i++) {
            var parseOutlineConvention = outlineParsers_1[_i];
            var wasConventionFound = parseOutlineConvention({
                text: consumer.remainingText,
                headingLeveler: headingLeveler,
                config: config,
                then: function (newNodes, lengthParsed) {
                    nodes.push.apply(nodes, newNodes);
                    consumer.advanceTextIndex(lengthParsed);
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
var LEADING_BLANK_LINES_PATTERN = Patterns_1.regExpStartingWith(Patterns_1.ANY_WHITESPACE + Patterns_1.LINE_BREAK);
var TRAILIN_BLANK_LINES_PATTERN = Patterns_1.regExpEndingWith(Patterns_1.LINE_BREAK + Patterns_1.ANY_WHITESPACE);

},{"../../CollectionHelpers":1,"../../Patterns":41,"../../SyntaxNodes/SectionSeparatorNode":73,"./LineConsumer":26,"./getHeadingParser":27,"./parseBlankLineSeparation":32,"./parseBlockquote":33,"./parseCodeBlock":34,"./parseDescriptionList":35,"./parseOrderedList":36,"./parseRegularLines":37,"./parseSectionSeparatorStreak":38,"./parseUnorderedList":39}],29:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var Patterns_1 = require('../../Patterns');
function getRemainingLinesOfListItem(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var lines = [];
    var countLinesIncluded = 0;
    var lengthParsed = 0;
    while (!consumer.reachedEndOfText()) {
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
        lengthParsed = consumer.textIndex;
    }
    if (!lines.length) {
        return false;
    }
    var countTrailingBlankLines = lines.length - countLinesIncluded;
    var shouldTerminateList = countTrailingBlankLines >= 2;
    if (!shouldTerminateList) {
        countLinesIncluded = lines.length;
        lengthParsed = consumer.textIndex;
    }
    var resultLines = lines
        .slice(0, countLinesIncluded)
        .map(function (line) { return line.replace(INDENTED_PATTERN, ''); });
    args.then(resultLines, lengthParsed, shouldTerminateList);
    return true;
}
exports.getRemainingLinesOfListItem = getRemainingLinesOfListItem;
var BLANK_PATTERN = new RegExp(Patterns_1.BLANK);
var INDENTED_PATTERN = Patterns_1.regExpStartingWith(Patterns_1.INDENT);

},{"../../Patterns":41,"./LineConsumer":26}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{"./HeadingLeveler":25,"./parseBlockquote":33,"./parseOrderedList":36,"./parseSectionSeparatorStreak":38,"./parseUnorderedList":39}],32:[function(require,module,exports){
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
    args.then(nodes, consumer.textIndex);
    return true;
}
exports.parseBlankLineSeparation = parseBlankLineSeparation;
var BLANK_PATTERN = new RegExp(Patterns_1.BLANK);

},{"../../Patterns":41,"../../SyntaxNodes/SectionSeparatorNode":73,"./LineConsumer":26}],33:[function(require,module,exports){
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
        new BlockquoteNode_1.BlockquoteNode(getOutlineNodes_1.getOutlineNodes(rawBlockquoteContent, headingLeveler, args.config))], consumer.textIndex);
    return true;
}
exports.parseBlockquote = parseBlockquote;
function isLineProperlyBlockquoted(line, delimiters) {
    return TRAILING_SPACE_PATTERN.test(delimiters) || (line === delimiters);
}
var BLOCKQUOTE_DELIMITER = '>' + Patterns_1.optional(Patterns_1.INLINE_WHITESPACE_CHAR);
var ALL_BLOCKQUOTE_DELIMITERS_PATTERN = Patterns_1.regExpStartingWith(Patterns_1.capture(Patterns_1.atLeast(1, BLOCKQUOTE_DELIMITER)));
var FIRST_BLOCKQUOTE_DELIMITER_PATTERN = Patterns_1.regExpStartingWith(BLOCKQUOTE_DELIMITER);
var TRAILING_SPACE_PATTERN = Patterns_1.regExpEndingWith(Patterns_1.INLINE_WHITESPACE_CHAR);

},{"../../Patterns":41,"../../SyntaxNodes/BlockquoteNode":44,"./HeadingLeveler":25,"./LineConsumer":26,"./getOutlineNodes":28}],34:[function(require,module,exports){
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
    while (!consumer.reachedEndOfText()) {
        if (consumer.consumeLine({ pattern: CODE_FENCE_PATTERN })) {
            args.then([new CodeBlockNode_1.CodeBlockNode(codeLines.join('\n'))], consumer.textIndex);
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

},{"../../Patterns":41,"../../SyntaxNodes/CodeBlockNode":45,"./LineConsumer":26}],35:[function(require,module,exports){
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
        while (!consumer.reachedEndOfText()) {
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
                consumer.advanceTextIndex(lengthParsed);
                isListTerminated = shouldTerminateList;
            }
        });
        lengthParsed = consumer.textIndex;
        var terms = rawTerms.map(function (term) { return new DescriptionTerm_1.DescriptionTerm(getInlineNodes_1.getInlineNodes(term, args.config)); });
        var rawDescription = rawDescriptionLines.join('\n');
        var description = new Description_1.Description(getOutlineNodes_1.getOutlineNodes(rawDescription, args.headingLeveler, args.config));
        listItems.push(new DescriptionListItem_1.DescriptionListItem(terms, description));
        if (isListTerminated) {
            return "break";
        }
    };
    while (!consumer.reachedEndOfText()) {
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
var INDENTED_PATTERN = Patterns_1.regExpStartingWith(Patterns_1.INDENT);

},{"../../Patterns":41,"../../SyntaxNodes/Description":46,"../../SyntaxNodes/DescriptionListItem":47,"../../SyntaxNodes/DescriptionListNode":48,"../../SyntaxNodes/DescriptionTerm":49,"../Inline/getInlineNodes":22,"./LineConsumer":26,"./getOutlineNodes":28,"./getRemainingLinesOfListItem":29,"./isLineFancyOutlineConvention":31}],36:[function(require,module,exports){
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
                consumer.advanceTextIndex(lengthParsed);
                isListTerminated = shouldTerminateList;
                var _a;
            }
        });
        rawListItems.push(rawListItem);
        if (isListTerminated) {
            return "break";
        }
    };
    while (!consumer.reachedEndOfText()) {
        var state_1 = _loop_1();
        if (state_1 === "break") break;
    }
    if (!rawListItems.length || isProbablyNotAnOrderedList(rawListItems)) {
        return false;
    }
    var listItems = rawListItems.map(function (rawListItem) {
        return new OrderedListItem_1.OrderedListItem(getOutlineNodes_1.getOutlineNodes(rawListItem.content(), args.headingLeveler, args.config), getExplicitOrdinal(rawListItem));
    });
    args.then([new OrderedListNode_1.OrderedListNode(listItems)], consumer.textIndex);
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
var BULLETED_PATTERN = Patterns_1.regExpStartingWith(Patterns_1.optional(' ') + BULLET + Patterns_1.INLINE_WHITESPACE_CHAR);
var INTEGER_FOLLOWED_BY_PERIOD_PATTERN = new RegExp(Patterns_1.INTEGER + '\\.');
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);
var BLANK_LINE_PATTERN = new RegExp(Patterns_1.BLANK);
var INDENTED_PATTERN = Patterns_1.regExpStartingWith(Patterns_1.INDENT);

},{"../../Patterns":41,"../../SyntaxNodes/OrderedListItem":63,"../../SyntaxNodes/OrderedListNode":64,"./LineConsumer":26,"./getOutlineNodes":28,"./getRemainingLinesOfListItem":29}],37:[function(require,module,exports){
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
    var lengthConsumed = consumer.textIndex;
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

},{"../../Patterns":41,"../../SyntaxNodes/Line":59,"../../SyntaxNodes/LineBlockNode":60,"../../SyntaxNodes/MediaSyntaxNode":62,"../../SyntaxNodes/ParagraphNode":67,"../../SyntaxNodes/isWhitespace":80,"../Inline/getInlineNodes":22,"./LineConsumer":26,"./isLineFancyOutlineConvention":31}],38:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var SectionSeparatorNode_1 = require('../../SyntaxNodes/SectionSeparatorNode');
var Patterns_1 = require('../../Patterns');
function parseSectionSeparatorStreak(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    if (!consumer.consumeLine({ pattern: STREAK_PATTERN })) {
        return false;
    }
    args.then([new SectionSeparatorNode_1.SectionSeparatorNode()], consumer.textIndex);
    return true;
}
exports.parseSectionSeparatorStreak = parseSectionSeparatorStreak;
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);

},{"../../Patterns":41,"../../SyntaxNodes/SectionSeparatorNode":73,"./LineConsumer":26}],39:[function(require,module,exports){
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
                consumer.advanceTextIndex(lengthParsed);
                isListTerminated = shouldTerminateList;
            }
        });
        rawListItemsContents.push(rawListItemLines.join('\n'));
        if (isListTerminated) {
            return "break";
        }
    };
    while (!consumer.reachedEndOfText()) {
        var state_1 = _loop_1();
        if (state_1 === "break") break;
    }
    if (!rawListItemsContents.length) {
        return false;
    }
    var listItems = rawListItemsContents.map(function (rawContents) {
        return new UnorderedListItem_1.UnorderedListItem(getOutlineNodes_1.getOutlineNodes(rawContents, args.headingLeveler, args.config));
    });
    args.then([new UnorderedListNode_1.UnorderedListNode(listItems)], consumer.textIndex);
    return true;
}
exports.parseUnorderedList = parseUnorderedList;
var BULLET_PATTERN = Patterns_1.regExpStartingWith(Patterns_1.optional(' ') + Patterns_1.either('\\*', '-', '\\+') + Patterns_1.INLINE_WHITESPACE_CHAR);
var BLANK_LINE_PATTERN = new RegExp(Patterns_1.BLANK);
var INDENTED_PATTERN = Patterns_1.regExpStartingWith(Patterns_1.INDENT);
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);

},{"../../Patterns":41,"../../SyntaxNodes/UnorderedListItem":77,"../../SyntaxNodes/UnorderedListNode":78,"./LineConsumer":26,"./getOutlineNodes":28,"./getRemainingLinesOfListItem":29}],40:[function(require,module,exports){
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

},{"../SyntaxNodes/DocumentNode":50,"./Outline/HeadingLeveler":25,"./Outline/getOutlineNodes":28}],41:[function(require,module,exports){
"use strict";
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
var NON_BLANK = NON_WHITESPACE_CHAR;
exports.NON_BLANK = NON_BLANK;
function escapeForRegex(text) {
    return text.replace(/[(){}[\].+*?^$\\|-]/g, '\\$&');
}
exports.escapeForRegex = escapeForRegex;
function regExpStartingWith(pattern, flags) {
    return new RegExp(startsWith(pattern), flags);
}
exports.regExpStartingWith = regExpStartingWith;
function regExpEndingWith(pattern, flags) {
    return new RegExp(endsWith(pattern), flags);
}
exports.regExpEndingWith = regExpEndingWith;

},{}],42:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":72}],43:[function(require,module,exports){
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

},{"./MediaSyntaxNode":62}],44:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":66}],45:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":66}],46:[function(require,module,exports){
"use strict";
var Description = (function () {
    function Description(children) {
        this.children = children;
        this.DESCRIPTION = null;
    }
    return Description;
}());
exports.Description = Description;

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":66}],49:[function(require,module,exports){
"use strict";
var DescriptionTerm = (function () {
    function DescriptionTerm(children) {
        this.children = children;
        this.DESCRIPTION_TERM = null;
    }
    return DescriptionTerm;
}());
exports.DescriptionTerm = DescriptionTerm;

},{}],50:[function(require,module,exports){
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

},{"./FootnoteBlockInserter":52}],51:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":72}],52:[function(require,module,exports){
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

},{"../CollectionHelpers":1,"./BlockquoteNode":44,"./DescriptionListNode":48,"./FootnoteBlockNode":53,"./FootnoteNode":54,"./HeadingNode":55,"./LineBlockNode":60,"./OrderedListNode":64,"./ParagraphNode":67,"./UnorderedListNode":78}],53:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":66}],54:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":72}],55:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":66}],56:[function(require,module,exports){
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

},{"./MediaSyntaxNode":62}],57:[function(require,module,exports){
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

},{"./InlineSyntaxNode":58}],58:[function(require,module,exports){
"use strict";
var InlineSyntaxNode = (function () {
    function InlineSyntaxNode() {
    }
    InlineSyntaxNode.prototype.inlineSyntaxNode = function () { };
    return InlineSyntaxNode;
}());
exports.InlineSyntaxNode = InlineSyntaxNode;

},{}],59:[function(require,module,exports){
"use strict";
var Line = (function () {
    function Line(children) {
        this.children = children;
        this.LINE = null;
    }
    return Line;
}());
exports.Line = Line;

},{}],60:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":66}],61:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":72}],62:[function(require,module,exports){
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

},{}],63:[function(require,module,exports){
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

},{}],64:[function(require,module,exports){
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

},{"./OrderedListOrder":65,"./OutlineSyntaxNode":66}],65:[function(require,module,exports){
"use strict";
(function (OrderedListOrder) {
    OrderedListOrder[OrderedListOrder["Ascending"] = 0] = "Ascending";
    OrderedListOrder[OrderedListOrder["Descrending"] = 1] = "Descrending";
})(exports.OrderedListOrder || (exports.OrderedListOrder = {}));
var OrderedListOrder = exports.OrderedListOrder;

},{}],66:[function(require,module,exports){
"use strict";
var OutlineSyntaxNode = (function () {
    function OutlineSyntaxNode() {
    }
    OutlineSyntaxNode.prototype.outlineSyntaxNode = function () { };
    return OutlineSyntaxNode;
}());
exports.OutlineSyntaxNode = OutlineSyntaxNode;

},{}],67:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":66}],68:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":72}],69:[function(require,module,exports){
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

},{"./InlineSyntaxNode":58}],70:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":72}],71:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":72}],72:[function(require,module,exports){
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

},{"../SyntaxNodes/InlineSyntaxNode":58}],73:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":66}],74:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":72}],75:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":72}],76:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":72}],77:[function(require,module,exports){
"use strict";
var UnorderedListItem = (function () {
    function UnorderedListItem(children) {
        this.children = children;
        this.UNORDERED_LIST_ITEM = null;
    }
    return UnorderedListItem;
}());
exports.UnorderedListItem = UnorderedListItem;

},{}],78:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":66}],79:[function(require,module,exports){
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

},{"./MediaSyntaxNode":62}],80:[function(require,module,exports){
"use strict";
var PlainTextNode_1 = require('./PlainTextNode');
function isWhitespace(node) {
    return (node instanceof PlainTextNode_1.PlainTextNode) && !/\S/.test(node.text);
}
exports.isWhitespace = isWhitespace;

},{"./PlainTextNode":69}],81:[function(require,module,exports){
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

},{"./Parsing/parseDocument":40,"./UpConfig":82,"./Writer/HtmlWriter":83}],82:[function(require,module,exports){
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

},{}],83:[function(require,module,exports){
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

},{"../SyntaxNodes/LinkNode":61,"../SyntaxNodes/OrderedListOrder":65,"../SyntaxNodes/PlainTextNode":69,"./Writer":84}],84:[function(require,module,exports){
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

},{"../SyntaxNodes/ActionNode":42,"../SyntaxNodes/AudioNode":43,"../SyntaxNodes/BlockquoteNode":44,"../SyntaxNodes/CodeBlockNode":45,"../SyntaxNodes/DescriptionListNode":48,"../SyntaxNodes/DocumentNode":50,"../SyntaxNodes/EmphasisNode":51,"../SyntaxNodes/FootnoteBlockNode":53,"../SyntaxNodes/FootnoteNode":54,"../SyntaxNodes/HeadingNode":55,"../SyntaxNodes/ImageNode":56,"../SyntaxNodes/InlineCodeNode":57,"../SyntaxNodes/LineBlockNode":60,"../SyntaxNodes/LinkNode":61,"../SyntaxNodes/OrderedListNode":64,"../SyntaxNodes/ParagraphNode":67,"../SyntaxNodes/ParenthesizedNode":68,"../SyntaxNodes/PlainTextNode":69,"../SyntaxNodes/RevisionDeletionNode":70,"../SyntaxNodes/RevisionInsertionNode":71,"../SyntaxNodes/SectionSeparatorNode":73,"../SyntaxNodes/SpoilerNode":74,"../SyntaxNodes/SquareBracketedNode":75,"../SyntaxNodes/StressNode":76,"../SyntaxNodes/UnorderedListNode":78,"../SyntaxNodes/VideoNode":79}],85:[function(require,module,exports){
"use strict";
var index_1 = require('./index');
window.Up = index_1.default;

},{"./index":86}],86:[function(require,module,exports){
"use strict";
var Up_1 = require('./Up');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Up_1.Up;

},{"./Up":81}]},{},[85]);
