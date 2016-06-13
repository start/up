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
var PatternHelpers_1 = require('../../PatternHelpers');
var Bracket = (function () {
    function Bracket(start, end) {
        this.start = start;
        this.end = end;
        this.startPattern = PatternHelpers_1.escapeForRegex(start);
        this.endPattern = PatternHelpers_1.escapeForRegex(end);
    }
    return Bracket;
}());
exports.Bracket = Bracket;

},{"../../PatternHelpers":38}],3:[function(require,module,exports){
"use strict";
var FailedConventionTracker = (function () {
    function FailedConventionTracker() {
        this.failedConventionsByTextIndex = {};
    }
    FailedConventionTracker.prototype.registerFailure = function (contextOfFailedConvention) {
        var convention = contextOfFailedConvention.convention, snapshot = contextOfFailedConvention.snapshot;
        var textIndex = snapshot.textIndex;
        if (!this.failedConventionsByTextIndex[textIndex]) {
            this.failedConventionsByTextIndex[textIndex] = [];
        }
        this.failedConventionsByTextIndex[textIndex].push(convention);
    };
    FailedConventionTracker.prototype.hasFailed = function (convention, textIndex) {
        var failedConventions = (this.failedConventionsByTextIndex[textIndex] || []);
        return failedConventions.some(function (failedConvention) { return failedConvention === convention; });
    };
    return FailedConventionTracker;
}());
exports.FailedConventionTracker = FailedConventionTracker;

},{}],4:[function(require,module,exports){
"use strict";
var Patterns_1 = require('../../Patterns');
var InlineTextConsumer = (function () {
    function InlineTextConsumer(entireText) {
        this.entireText = entireText;
        this._isFollowingNonWhitespace = false;
        this.textIndex = 0;
    }
    Object.defineProperty(InlineTextConsumer.prototype, "textIndex", {
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
    Object.defineProperty(InlineTextConsumer.prototype, "remainingText", {
        get: function () {
            return this._remainingText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InlineTextConsumer.prototype, "currentChar", {
        get: function () {
            return this._currentChar;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InlineTextConsumer.prototype, "isFollowingNonWhitespace", {
        get: function () {
            return this._isFollowingNonWhitespace;
        },
        enumerable: true,
        configurable: true
    });
    InlineTextConsumer.prototype.advanceTextIndex = function (length) {
        this.textIndex += length;
    };
    InlineTextConsumer.prototype.reachedEndOfText = function () {
        return this._textIndex >= this.entireText.length;
    };
    InlineTextConsumer.prototype.advanceAfterMatch = function (args) {
        var pattern = args.pattern, onlyIfPrecedingNonWhitespace = args.onlyIfPrecedingNonWhitespace, then = args.then;
        var result = pattern.exec(this._remainingText);
        if (!result) {
            return false;
        }
        var match = result[0], captures = result.slice(1);
        var charAfterMatch = this.entireText[this._textIndex + match.length];
        var isPrecedingNonWhitespace = Patterns_1.NON_BLANK_PATTERN.test(charAfterMatch);
        if (onlyIfPrecedingNonWhitespace && !isPrecedingNonWhitespace) {
            return false;
        }
        if (then) {
            then.apply(void 0, [match, isPrecedingNonWhitespace].concat(captures));
        }
        this.advanceTextIndex(match.length);
        return true;
    };
    InlineTextConsumer.prototype.updateComputedTextFields = function () {
        this._remainingText = this.entireText.substr(this._textIndex);
        this._currentChar = this._remainingText[0];
        var previousChar = this.entireText[this._textIndex - 1];
        this._isFollowingNonWhitespace = Patterns_1.NON_BLANK_PATTERN.test(previousChar);
    };
    return InlineTextConsumer;
}());
exports.InlineTextConsumer = InlineTextConsumer;

},{"../../Patterns":40}],5:[function(require,module,exports){
"use strict";
var MediaConvention = (function () {
    function MediaConvention(nonLocalizedTerm, NodeType, descriptionAndStartTokenKind) {
        this.nonLocalizedTerm = nonLocalizedTerm;
        this.NodeType = NodeType;
        this.descriptionAndStartTokenKind = descriptionAndStartTokenKind;
    }
    return MediaConvention;
}());
exports.MediaConvention = MediaConvention;

},{}],6:[function(require,module,exports){
"use strict";
var MediaConvention_1 = require('./MediaConvention');
var TokenKind_1 = require('./TokenKind');
var AudioNode_1 = require('../../SyntaxNodes/AudioNode');
var ImageNode_1 = require('../../SyntaxNodes/ImageNode');
var VideoNode_1 = require('../../SyntaxNodes/VideoNode');
exports.AUDIO = new MediaConvention_1.MediaConvention('audio', AudioNode_1.AudioNode, TokenKind_1.TokenKind.AudioDescriptionAndStart);
exports.IMAGE = new MediaConvention_1.MediaConvention('image', ImageNode_1.ImageNode, TokenKind_1.TokenKind.ImageDescriptionAndStart);
exports.VIDEO = new MediaConvention_1.MediaConvention('video', VideoNode_1.VideoNode, TokenKind_1.TokenKind.VideoDescriptionAndStart);

},{"../../SyntaxNodes/AudioNode":42,"../../SyntaxNodes/ImageNode":55,"../../SyntaxNodes/VideoNode":80,"./MediaConvention":5,"./TokenKind":15}],7:[function(require,module,exports){
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
    RichConventions_1.NSFW_CONVENTION,
    RichConventions_1.NSFL_CONVENTION,
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
            if (token.kind === TokenKind_1.TokenKind.NakedUrlSchemeAndStart) {
                var urlScheme = token.value;
                var nakedUrlAfterSchemeToken = this.getNextTokenAndAdvanceIndex();
                var urlAfterScheme = nakedUrlAfterSchemeToken.value;
                if (!urlAfterScheme) {
                    this.nodes.push(new PlainTextNode_1.PlainTextNode(urlScheme));
                    continue;
                }
                var url = urlScheme + urlAfterScheme;
                var contents = [new PlainTextNode_1.PlainTextNode(urlAfterScheme)];
                this.nodes.push(new LinkNode_1.LinkNode(contents, url));
                continue;
            }
            if (token.kind === RichConventions_1.LINK_CONVENTION.startTokenKind) {
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
                if (token.kind === media.descriptionAndStartTokenKind) {
                    var description = token.value.trim();
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

},{"../../CollectionHelpers":1,"../../SyntaxNodes/InlineCodeNode":56,"../../SyntaxNodes/LinkNode":60,"../../SyntaxNodes/PlainTextNode":70,"../../SyntaxNodes/isWhitespace":81,"./MediaConventions":6,"./RichConventions":13,"./TokenKind":15}],8:[function(require,module,exports){
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
var NsfwNode_1 = require('../../SyntaxNodes/NsfwNode');
var NsflNode_1 = require('../../SyntaxNodes/NsflNode');
var FootnoteNode_1 = require('../../SyntaxNodes/FootnoteNode');
var RevisionDeletionNode_1 = require('../../SyntaxNodes/RevisionDeletionNode');
var RevisionInsertionNode_1 = require('../../SyntaxNodes/RevisionInsertionNode');
var SquareBracketedNode_1 = require('../../SyntaxNodes/SquareBracketedNode');
var ParenthesizedNode_1 = require('../../SyntaxNodes/ParenthesizedNode');
var ActionNode_1 = require('../../SyntaxNodes/ActionNode');
var TokenKind_1 = require('./TokenKind');
exports.EMPHASIS_CONVENTION = {
    NodeType: EmphasisNode_1.EmphasisNode,
    startTokenKind: TokenKind_1.TokenKind.EmphasisStart,
    endTokenKind: TokenKind_1.TokenKind.EmphasisEnd
};
exports.STRESS_CONVENTION = {
    NodeType: StressNode_1.StressNode,
    startTokenKind: TokenKind_1.TokenKind.StressStart,
    endTokenKind: TokenKind_1.TokenKind.StressEnd
};
exports.REVISION_DELETION_CONVENTION = {
    NodeType: RevisionDeletionNode_1.RevisionDeletionNode,
    startTokenKind: TokenKind_1.TokenKind.RevisionDeletionStart,
    endTokenKind: TokenKind_1.TokenKind.RevisionDeletionEnd
};
exports.REVISION_INSERTION_CONVENTION = {
    NodeType: RevisionInsertionNode_1.RevisionInsertionNode,
    startTokenKind: TokenKind_1.TokenKind.RevisionInsertionStart,
    endTokenKind: TokenKind_1.TokenKind.RevisionInsertionEnd
};
exports.SPOILER_CONVENTION = {
    NodeType: SpoilerNode_1.SpoilerNode,
    startTokenKind: TokenKind_1.TokenKind.SpoilerStart,
    endTokenKind: TokenKind_1.TokenKind.SpoilerEnd
};
exports.NSFW_CONVENTION = {
    NodeType: NsfwNode_1.NsfwNode,
    startTokenKind: TokenKind_1.TokenKind.NsfwStart,
    endTokenKind: TokenKind_1.TokenKind.NsfwEnd
};
exports.NSFL_CONVENTION = {
    NodeType: NsflNode_1.NsflNode,
    startTokenKind: TokenKind_1.TokenKind.NsflStart,
    endTokenKind: TokenKind_1.TokenKind.NsflEnd
};
exports.FOOTNOTE_CONVENTION = {
    NodeType: FootnoteNode_1.FootnoteNode,
    startTokenKind: TokenKind_1.TokenKind.FootnoteStart,
    endTokenKind: TokenKind_1.TokenKind.FootnoteEnd
};
exports.PARENTHESIZED_CONVENTION = {
    NodeType: ParenthesizedNode_1.ParenthesizedNode,
    startTokenKind: TokenKind_1.TokenKind.ParenthesizedStart,
    endTokenKind: TokenKind_1.TokenKind.ParenthesizedEnd
};
exports.SQUARE_BRACKETED_CONVENTION = {
    NodeType: SquareBracketedNode_1.SquareBracketedNode,
    startTokenKind: TokenKind_1.TokenKind.SquareBracketedStart,
    endTokenKind: TokenKind_1.TokenKind.SquareBracketedEnd
};
exports.ACTION_CONVENTION = {
    NodeType: ActionNode_1.ActionNode,
    startTokenKind: TokenKind_1.TokenKind.ActionStart,
    endTokenKind: TokenKind_1.TokenKind.ActionEnd
};
exports.LINK_CONVENTION = {
    startTokenKind: TokenKind_1.TokenKind.LinkStart,
    endTokenKind: TokenKind_1.TokenKind.LinkUrlAndEnd
};

},{"../../SyntaxNodes/ActionNode":41,"../../SyntaxNodes/EmphasisNode":50,"../../SyntaxNodes/FootnoteNode":53,"../../SyntaxNodes/NsflNode":62,"../../SyntaxNodes/NsfwNode":63,"../../SyntaxNodes/ParenthesizedNode":69,"../../SyntaxNodes/RevisionDeletionNode":71,"../../SyntaxNodes/RevisionInsertionNode":72,"../../SyntaxNodes/SpoilerNode":75,"../../SyntaxNodes/SquareBracketedNode":76,"../../SyntaxNodes/StressNode":77,"./TokenKind":15}],14:[function(require,module,exports){
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
    TokenKind[TokenKind["AudioDescriptionAndStart"] = 3] = "AudioDescriptionAndStart";
    TokenKind[TokenKind["EmphasisEnd"] = 4] = "EmphasisEnd";
    TokenKind[TokenKind["EmphasisStart"] = 5] = "EmphasisStart";
    TokenKind[TokenKind["FootnoteEnd"] = 6] = "FootnoteEnd";
    TokenKind[TokenKind["FootnoteStart"] = 7] = "FootnoteStart";
    TokenKind[TokenKind["ImageDescriptionAndStart"] = 8] = "ImageDescriptionAndStart";
    TokenKind[TokenKind["InlineCode"] = 9] = "InlineCode";
    TokenKind[TokenKind["LinkUrlAndEnd"] = 10] = "LinkUrlAndEnd";
    TokenKind[TokenKind["LinkStart"] = 11] = "LinkStart";
    TokenKind[TokenKind["MediaUrlAndEnd"] = 12] = "MediaUrlAndEnd";
    TokenKind[TokenKind["NakedUrlAfterSchemeAndEnd"] = 13] = "NakedUrlAfterSchemeAndEnd";
    TokenKind[TokenKind["NakedUrlSchemeAndStart"] = 14] = "NakedUrlSchemeAndStart";
    TokenKind[TokenKind["ParenthesizedEnd"] = 15] = "ParenthesizedEnd";
    TokenKind[TokenKind["ParenthesizedStart"] = 16] = "ParenthesizedStart";
    TokenKind[TokenKind["PlainText"] = 17] = "PlainText";
    TokenKind[TokenKind["PotentialRaisedVoiceEnd"] = 18] = "PotentialRaisedVoiceEnd";
    TokenKind[TokenKind["PotentialRaisedVoiceStartOrEnd"] = 19] = "PotentialRaisedVoiceStartOrEnd";
    TokenKind[TokenKind["PotentialRaisedVoiceStart"] = 20] = "PotentialRaisedVoiceStart";
    TokenKind[TokenKind["RevisionDeletionEnd"] = 21] = "RevisionDeletionEnd";
    TokenKind[TokenKind["RevisionDeletionStart"] = 22] = "RevisionDeletionStart";
    TokenKind[TokenKind["RevisionInsertionEnd"] = 23] = "RevisionInsertionEnd";
    TokenKind[TokenKind["RevisionInsertionStart"] = 24] = "RevisionInsertionStart";
    TokenKind[TokenKind["SpoilerEnd"] = 25] = "SpoilerEnd";
    TokenKind[TokenKind["SpoilerStart"] = 26] = "SpoilerStart";
    TokenKind[TokenKind["NsfwStart"] = 27] = "NsfwStart";
    TokenKind[TokenKind["NsfwEnd"] = 28] = "NsfwEnd";
    TokenKind[TokenKind["NsflStart"] = 29] = "NsflStart";
    TokenKind[TokenKind["NsflEnd"] = 30] = "NsflEnd";
    TokenKind[TokenKind["SquareBracketedEnd"] = 31] = "SquareBracketedEnd";
    TokenKind[TokenKind["SquareBracketedStart"] = 32] = "SquareBracketedStart";
    TokenKind[TokenKind["StressEnd"] = 33] = "StressEnd";
    TokenKind[TokenKind["StressStart"] = 34] = "StressStart";
    TokenKind[TokenKind["VideoDescriptionAndStart"] = 35] = "VideoDescriptionAndStart";
})(exports.TokenKind || (exports.TokenKind = {}));
var TokenKind = exports.TokenKind;

},{}],16:[function(require,module,exports){
"use strict";
var RichConventions_1 = require('./RichConventions');
var PatternHelpers_1 = require('../../PatternHelpers');
var PatternPieces_1 = require('../../PatternPieces');
var MediaConventions_1 = require('./MediaConventions');
var applyRaisedVoices_1 = require('./RaisedVoices/applyRaisedVoices');
var nestOverlappingConventions_1 = require('./nestOverlappingConventions');
var insertBracketsInsideBracketedConventions_1 = require('./insertBracketsInsideBracketedConventions');
var CollectionHelpers_1 = require('../../CollectionHelpers');
var Bracket_1 = require('./Bracket');
var FailedConventionTracker_1 = require('./FailedConventionTracker');
var TokenizerContext_1 = require('./TokenizerContext');
var TokenizerSnapshot_1 = require('./TokenizerSnapshot');
var InlineTextConsumer_1 = require('./InlineTextConsumer');
var TokenKind_1 = require('./TokenKind');
var Token_1 = require('./Token');
var Tokenizer = (function () {
    function Tokenizer(entireText, config) {
        var _this = this;
        this.config = config;
        this.tokens = [];
        this.buffer = '';
        this.openContexts = [];
        this.failedConventionTracker = new FailedConventionTracker_1.FailedConventionTracker();
        this.conventions = [];
        this.rawBracketConventions = this.getRawBracketConventions();
        this.mediaUrlConventions = this.getMediaUrlConventions();
        this.nakedUrlConvention = {
            startPattern: NAKED_URL_SCHEME_PATTERN,
            endPattern: NAKED_URL_TERMINATOR_PATTERN,
            flushBufferToPlainTextTokenBeforeOpening: true,
            onOpen: function (urlScheme) {
                _this.appendNewToken({ kind: TokenKind_1.TokenKind.NakedUrlSchemeAndStart, value: urlScheme });
            },
            insteadOfTryingToOpenUsualConventions: function () { return _this.bufferRawText(); },
            leaveEndPatternForAnotherConventionToConsume: true,
            onCloseFlushBufferTo: TokenKind_1.TokenKind.NakedUrlAfterSchemeAndEnd,
            closeInnerContextsWhenClosing: true,
            resolveWhenLeftUnclosed: function () { return _this.flushBufferToNakedUrlEndToken(); },
        };
        this.consumer = new InlineTextConsumer_1.InlineTextConsumer(entireText);
        this.configureConventions();
        this.tokenize();
    }
    Tokenizer.prototype.configureConventions = function () {
        var _this = this;
        (_a = this.conventions).push.apply(_a, this.getFootnoteConventions());
        (_b = this.conventions).push.apply(_b, CollectionHelpers_1.concat([
            {
                richConvention: RichConventions_1.SPOILER_CONVENTION,
                nonLocalizedTerm: 'spoiler'
            }, {
                richConvention: RichConventions_1.NSFW_CONVENTION,
                nonLocalizedTerm: 'nsfw'
            }, {
                richConvention: RichConventions_1.NSFL_CONVENTION,
                nonLocalizedTerm: 'nsfl'
            }
        ].map(function (args) { return _this.getConventionsForRichBracketedTerm(args); })));
        this.conventions.push({
            startPattern: INLINE_CODE_DELIMITER_PATTERN,
            endPattern: INLINE_CODE_DELIMITER_PATTERN,
            flushBufferToPlainTextTokenBeforeOpening: true,
            insteadOfTryingToCloseOuterContexts: function () { return _this.bufferCurrentChar(); },
            onCloseFlushBufferTo: TokenKind_1.TokenKind.InlineCode
        });
        (_c = this.conventions).push.apply(_c, this.getLinkUrlConventions());
        (_d = this.conventions).push.apply(_d, this.getMediaDescriptionConventions());
        (_e = this.conventions).push.apply(_e, this.getLinkifyingUrlConventions());
        (_f = this.conventions).push.apply(_f, [
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
        ].map(function (args) { return _this.getRichSandwichConvention(args); }));
        (_g = this.conventions).push.apply(_g, [
            {
                richConvention: RichConventions_1.REVISION_DELETION_CONVENTION,
                startPattern: '~~',
                endPattern: '~~'
            }, {
                richConvention: RichConventions_1.REVISION_INSERTION_CONVENTION,
                startPattern: PatternHelpers_1.escapeForRegex('++'),
                endPattern: PatternHelpers_1.escapeForRegex('++')
            }
        ].map(function (args) { return _this.getRichSandwichConvention(args); }));
        this.conventions.push(this.nakedUrlConvention);
        var _a, _b, _c, _d, _e, _f, _g;
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
    Tokenizer.prototype.isDone = function () {
        return this.consumer.reachedEndOfText() && this.resolveUnclosedContexts();
    };
    Tokenizer.prototype.resolveUnclosedContexts = function () {
        while (this.openContexts.length) {
            var context_1 = this.openContexts.pop();
            if (!context_1.resolveWhenLeftUnclosed()) {
                this.resetToBeforeContext(context_1);
                return false;
            }
        }
        this.flushBufferToPlainTextTokenIfBufferIsNotEmpty();
        return true;
    };
    Tokenizer.prototype.tryToCollectEscapedChar = function () {
        var ESCAPE_CHAR = '\\';
        if (this.consumer.currentChar !== ESCAPE_CHAR) {
            return false;
        }
        this.consumer.advanceTextIndex(1);
        return this.consumer.reachedEndOfText() || this.bufferCurrentChar();
    };
    Tokenizer.prototype.tryToCloseAnyConvention = function () {
        var innerNakedUrlContextIndex = null;
        for (var i = this.openContexts.length - 1; i >= 0; i--) {
            var openContext = this.openContexts[i];
            var convention = openContext.convention;
            if (this.shouldCloseContext(openContext)) {
                if (innerNakedUrlContextIndex != null) {
                    this.flushBufferToNakedUrlEndToken();
                    this.openContexts.splice(i);
                }
                if (convention.onCloseFlushBufferTo != null) {
                    this.flushBufferToTokenOfKind(convention.onCloseFlushBufferTo);
                }
                openContext.close();
                if (convention.onCloseFailIfCannotTranformInto) {
                    return this.tryToTransformConvention({ belongingToContextAtIndex: i });
                }
                this.openContexts.splice(i, 1);
                if (convention.closeInnerContextsWhenClosing) {
                    this.openContexts.splice(i);
                }
                return true;
            }
            if (openContext.doIsteadOfTryingToCloseOuterContexts()) {
                return true;
            }
            if (convention === this.nakedUrlConvention) {
                innerNakedUrlContextIndex = i;
            }
        }
        return false;
    };
    Tokenizer.prototype.shouldCloseContext = function (context) {
        var _this = this;
        return this.consumer.advanceAfterMatch({
            pattern: context.convention.endPattern,
            then: function (match) {
                if (context.convention.leaveEndPatternForAnotherConventionToConsume) {
                    _this.consumer.textIndex -= match.length;
                }
            }
        });
    };
    Tokenizer.prototype.tryToTransformConvention = function (args) {
        var _this = this;
        var openContextIndex = args.belongingToContextAtIndex;
        var context = this.openContexts[openContextIndex];
        var couldTransform = context.convention.onCloseFailIfCannotTranformInto.some(function (convention) { return _this.tryToOpen(convention); });
        if (!couldTransform) {
            this.openContexts.splice(openContextIndex);
            this.resetToBeforeContext(context);
            return false;
        }
        context.convention = this.openContexts.pop().convention;
        if (context.convention.closeInnerContextsWhenClosing) {
            this.openContexts.splice(openContextIndex + 1);
        }
        return true;
    };
    Tokenizer.prototype.performContextSpecificBehaviorInsteadOfTryingToOpenUsualContexts = function () {
        return CollectionHelpers_1.reversed(this.openContexts)
            .some(function (context) { return context.doInsteadOfTryingToOpenUsualContexts(); });
    };
    Tokenizer.prototype.tryToOpenAnyConvention = function () {
        var _this = this;
        return this.conventions.some(function (convention) { return _this.tryToOpen(convention); });
    };
    Tokenizer.prototype.isDirectlyFollowingTokenOfKind = function (kinds) {
        return (this.buffer === ''
            && this.tokens.length
            && CollectionHelpers_1.contains(kinds, CollectionHelpers_1.last(this.tokens).kind));
    };
    Tokenizer.prototype.bufferRawText = function () {
        var _this = this;
        return (this.rawBracketConventions.some(function (bracket) { return _this.tryToOpen(bracket); })
            || this.bufferCurrentChar());
    };
    Tokenizer.prototype.bufferCurrentChar = function () {
        this.buffer += this.consumer.currentChar;
        this.consumer.advanceTextIndex(1);
        return true;
    };
    Tokenizer.prototype.tryToOpen = function (convention) {
        var _this = this;
        var startPattern = convention.startPattern, onlyOpenIfDirectlyFollowingTokenOfKind = convention.onlyOpenIfDirectlyFollowingTokenOfKind, onlyOpenIfPrecedingNonWhitespace = convention.onlyOpenIfPrecedingNonWhitespace, flushBufferToPlainTextTokenBeforeOpening = convention.flushBufferToPlainTextTokenBeforeOpening, onOpen = convention.onOpen;
        return (this.canTry(convention)
            && this.consumer.advanceAfterMatch({
                pattern: startPattern,
                onlyIfPrecedingNonWhitespace: onlyOpenIfPrecedingNonWhitespace,
                then: function (match, isDirectlyPrecedingNonWhitespace) {
                    var captures = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        captures[_i - 2] = arguments[_i];
                    }
                    if (flushBufferToPlainTextTokenBeforeOpening) {
                        _this.flushBufferToPlainTextTokenIfBufferIsNotEmpty();
                    }
                    var currentSnapshot = new TokenizerSnapshot_1.TokenizerSnapshot({
                        textIndex: _this.consumer.textIndex,
                        tokens: _this.tokens,
                        openContexts: _this.openContexts,
                        bufferedText: _this.buffer
                    });
                    _this.openContexts.push(new TokenizerContext_1.TokenizerContext(convention, currentSnapshot));
                    if (onOpen) {
                        onOpen.apply(void 0, [match, isDirectlyPrecedingNonWhitespace].concat(captures));
                    }
                }
            }));
    };
    Tokenizer.prototype.canTry = function (convention, textIndex) {
        var _this = this;
        if (textIndex === void 0) { textIndex = this.consumer.textIndex; }
        var conventionsThisOneTransformTo = convention.onCloseFailIfCannotTranformInto;
        var hasFailedAfterTransitioning = (conventionsThisOneTransformTo
            && conventionsThisOneTransformTo.some(function (convention) { return _this.failedConventionTracker.hasFailed(convention, textIndex); }));
        if (hasFailedAfterTransitioning) {
            return false;
        }
        var onlyOpenIfDirectlyFollowingTokenOfKind = convention.onlyOpenIfDirectlyFollowingTokenOfKind;
        return (!this.failedConventionTracker.hasFailed(convention, textIndex)
            && (!onlyOpenIfDirectlyFollowingTokenOfKind || this.isDirectlyFollowingTokenOfKind(onlyOpenIfDirectlyFollowingTokenOfKind)));
    };
    Tokenizer.prototype.resetToBeforeContext = function (context) {
        this.failedConventionTracker.registerFailure(context);
        this.tokens = context.snapshot.tokens;
        this.openContexts = context.snapshot.openContexts;
        this.buffer = context.snapshot.bufferedText;
        this.consumer.textIndex = context.snapshot.textIndex;
        for (var _i = 0, _a = this.openContexts; _i < _a.length; _i++) {
            var context_2 = _a[_i];
            context_2.reset();
        }
    };
    Tokenizer.prototype.appendNewToken = function (args) {
        this.tokens.push(new Token_1.Token(args));
    };
    Tokenizer.prototype.flushBufferToNakedUrlEndToken = function () {
        this.flushBufferToTokenOfKind(TokenKind_1.TokenKind.NakedUrlAfterSchemeAndEnd);
    };
    Tokenizer.prototype.flushBuffer = function () {
        var buffer = this.buffer;
        this.buffer = '';
        return buffer;
    };
    Tokenizer.prototype.flushBufferToTokenOfKind = function (kind) {
        this.appendNewToken({ kind: kind, value: this.flushBuffer() });
    };
    Tokenizer.prototype.insertToken = function (args) {
        var context = args.context, token = args.token, atIndex = args.atIndex;
        this.tokens.splice(atIndex, 0, token);
        for (var _i = 0, _a = this.openContexts; _i < _a.length; _i++) {
            var openContext = _a[_i];
            openContext.registerTokenInsertion({ atIndex: atIndex, onBehalfOfContext: context });
        }
    };
    Tokenizer.prototype.flushBufferToPlainTextTokenIfBufferIsNotEmpty = function () {
        if (this.buffer) {
            this.flushBufferToTokenOfKind(TokenKind_1.TokenKind.PlainText);
        }
    };
    Tokenizer.prototype.applyConfigSettingsToUrl = function (url) {
        url = url.trim();
        if (!url) {
            return url;
        }
        if (url[0] === '/') {
            return this.config.settings.baseForUrlsStartingWithSlash + url;
        }
        if (!URL_SCHEME_PATTERN.test(url)) {
            return this.config.settings.defaultUrlScheme + url;
        }
        return url;
    };
    Tokenizer.prototype.tryToTokenizeRaisedVoicePlaceholders = function () {
        var _this = this;
        return this.consumer.advanceAfterMatch({
            pattern: RAISED_VOICE_DELIMITER_PATTERN,
            then: function (asterisks, isPrecedingNonWhitespace) {
                var canCloseConvention = _this.consumer.isFollowingNonWhitespace;
                var canOpenConvention = isPrecedingNonWhitespace;
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
                _this.appendNewToken({ kind: asteriskTokenKind, value: asterisks });
            }
        });
    };
    Tokenizer.prototype.getLinkUrlConventions = function () {
        var _this = this;
        return BRACKETS.map(function (bracket) { return ({
            startPattern: PatternHelpers_1.regExpStartingWith(bracket.startPattern),
            endPattern: PatternHelpers_1.regExpStartingWith(bracket.endPattern),
            onlyOpenIfDirectlyFollowingTokenOfKind: [
                TokenKind_1.TokenKind.ParenthesizedEnd,
                TokenKind_1.TokenKind.SquareBracketedEnd,
                TokenKind_1.TokenKind.ActionEnd
            ],
            insteadOfTryingToCloseOuterContexts: function () { return _this.bufferRawText(); },
            closeInnerContextsWhenClosing: true,
            onClose: function () {
                var url = _this.applyConfigSettingsToUrl(_this.flushBuffer());
                var originalEndToken = CollectionHelpers_1.last(_this.tokens);
                originalEndToken.value = url;
                originalEndToken.kind = RichConventions_1.LINK_CONVENTION.endTokenKind;
                originalEndToken.correspondsToToken.kind = RichConventions_1.LINK_CONVENTION.startTokenKind;
            }
        }); });
    };
    Tokenizer.prototype.getLinkifyingUrlConventions = function () {
        var _this = this;
        return BRACKETS.map(function (bracket) { return ({
            startPattern: PatternHelpers_1.regExpStartingWith(bracket.startPattern),
            endPattern: PatternHelpers_1.regExpStartingWith(bracket.endPattern),
            onlyOpenIfDirectlyFollowingTokenOfKind: [
                TokenKind_1.TokenKind.SpoilerEnd,
                TokenKind_1.TokenKind.NsfwEnd,
                TokenKind_1.TokenKind.NsflEnd,
                TokenKind_1.TokenKind.FootnoteEnd,
            ],
            insteadOfTryingToCloseOuterContexts: function () { return _this.bufferRawText(); },
            closeInnerContextsWhenClosing: true,
            onClose: function (context) {
                var url = _this.applyConfigSettingsToUrl(_this.flushBuffer());
                var linkEndToken = new Token_1.Token({ kind: RichConventions_1.LINK_CONVENTION.endTokenKind, value: url });
                var linkStartToken = new Token_1.Token({ kind: RichConventions_1.LINK_CONVENTION.startTokenKind });
                linkStartToken.associateWith(linkEndToken);
                var indexOfOriginalEndToken = _this.tokens.length - 1;
                _this.insertToken({ token: linkEndToken, atIndex: indexOfOriginalEndToken, context: context });
                var originalStartToken = CollectionHelpers_1.last(_this.tokens).correspondsToToken;
                var indexAfterOriginalStartToken = _this.tokens.indexOf(originalStartToken) + 1;
                _this.insertToken({ token: linkStartToken, atIndex: indexAfterOriginalStartToken, context: context });
            }
        }); });
    };
    Tokenizer.prototype.getFootnoteConventions = function () {
        var _this = this;
        return BRACKETS.map(function (bracket) {
            return _this.getRichSandwichConvention({
                richConvention: RichConventions_1.FOOTNOTE_CONVENTION,
                startPattern: PatternPieces_1.ANY_WHITESPACE + PatternHelpers_1.exactly(2, bracket.startPattern),
                endPattern: PatternHelpers_1.exactly(2, bracket.endPattern)
            });
        });
    };
    Tokenizer.prototype.getConventionsForRichBracketedTerm = function (args) {
        var _this = this;
        var richConvention = args.richConvention, nonLocalizedTerm = args.nonLocalizedTerm;
        return BRACKETS.map(function (bracket) {
            return _this.getRichSandwichConvention({
                richConvention: richConvention,
                startPattern: _this.getBracketedTermStartPattern(nonLocalizedTerm, bracket),
                endPattern: bracket.endPattern,
                startPatternContainsATerm: true
            });
        });
    };
    Tokenizer.prototype.getBracketedTermStartPattern = function (nonLocalizedTerm, bracket) {
        return (bracket.startPattern
            + PatternHelpers_1.escapeForRegex(this.config.localizeTerm(nonLocalizedTerm)) + ':'
            + PatternPieces_1.ANY_WHITESPACE);
    };
    Tokenizer.prototype.getRichSandwichConvention = function (args) {
        var _this = this;
        var richConvention = args.richConvention, startPattern = args.startPattern, endPattern = args.endPattern, startPatternContainsATerm = args.startPatternContainsATerm;
        return {
            startPattern: PatternHelpers_1.regExpStartingWith(startPattern, (startPatternContainsATerm ? 'i' : undefined)),
            endPattern: PatternHelpers_1.regExpStartingWith(endPattern),
            flushBufferToPlainTextTokenBeforeOpening: true,
            onCloseFlushBufferTo: TokenKind_1.TokenKind.PlainText,
            onClose: function (context) {
                var startToken = new Token_1.Token({ kind: richConvention.startTokenKind });
                var endToken = new Token_1.Token({ kind: richConvention.endTokenKind });
                startToken.associateWith(endToken);
                _this.insertToken({ token: startToken, atIndex: context.initialTokenIndex, context: context });
                _this.tokens.push(endToken);
            }
        };
    };
    Tokenizer.prototype.getMediaDescriptionConventions = function () {
        var _this = this;
        return CollectionHelpers_1.concat([MediaConventions_1.IMAGE, MediaConventions_1.VIDEO, MediaConventions_1.AUDIO].map(function (media) {
            return BRACKETS.map(function (bracket) { return ({
                startPattern: PatternHelpers_1.regExpStartingWith(_this.getBracketedTermStartPattern(media.nonLocalizedTerm, bracket), 'i'),
                endPattern: PatternHelpers_1.regExpStartingWith(bracket.endPattern),
                flushBufferToPlainTextTokenBeforeOpening: true,
                insteadOfTryingToCloseOuterContexts: function () { return _this.bufferRawText(); },
                closeInnerContextsWhenClosing: true,
                onCloseFailIfCannotTranformInto: _this.mediaUrlConventions,
                onCloseFlushBufferTo: media.descriptionAndStartTokenKind,
            }); });
        }));
    };
    Tokenizer.prototype.getMediaUrlConventions = function () {
        var _this = this;
        return BRACKETS.map(function (bracket) { return ({
            startPattern: PatternHelpers_1.regExpStartingWith(bracket.startPattern),
            endPattern: PatternHelpers_1.regExpStartingWith(bracket.endPattern),
            flushBufferToPlainTextTokenBeforeOpening: true,
            insteadOfTryingToCloseOuterContexts: function () { return _this.bufferRawText(); },
            closeInnerContextsWhenClosing: true,
            onClose: function () {
                var url = _this.applyConfigSettingsToUrl(_this.flushBuffer());
                _this.appendNewToken({ kind: TokenKind_1.TokenKind.MediaUrlAndEnd, value: url });
            }
        }); });
    };
    Tokenizer.prototype.getRawBracketConventions = function () {
        var _this = this;
        return BRACKETS.map(function (bracket) { return ({
            startPattern: PatternHelpers_1.regExpStartingWith(bracket.startPattern),
            endPattern: PatternHelpers_1.regExpStartingWith(bracket.endPattern),
            onOpen: function () { _this.buffer += bracket.start; },
            onClose: function () { _this.buffer += bracket.end; },
            resolveWhenLeftUnclosed: function () { return true; }
        }); });
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
var PARENTHESIS = new Bracket_1.Bracket('(', ')');
var SQUARE_BRACKET = new Bracket_1.Bracket('[', ']');
var CURLY_BRACKET = new Bracket_1.Bracket('{', '}');
var BRACKETS = [
    PARENTHESIS,
    SQUARE_BRACKET,
    CURLY_BRACKET
];
var INLINE_CODE_DELIMITER_PATTERN = PatternHelpers_1.regExpStartingWith('`');
var RAISED_VOICE_DELIMITER_PATTERN = PatternHelpers_1.regExpStartingWith(PatternHelpers_1.atLeast(1, PatternHelpers_1.escapeForRegex('*')));
var NAKED_URL_SCHEME_PATTERN = PatternHelpers_1.regExpStartingWith('http' + PatternHelpers_1.optional('s') + '://');
var URL_SCHEME_PATTERN = PatternHelpers_1.regExpStartingWith(PatternPieces_1.LETTER + PatternHelpers_1.all(PatternHelpers_1.either(PatternPieces_1.LETTER, PatternPieces_1.DIGIT, '-', PatternHelpers_1.escapeForRegex('+'), PatternHelpers_1.escapeForRegex('.'))) + ':');
var NAKED_URL_TERMINATOR_PATTERN = PatternHelpers_1.regExpStartingWith(PatternPieces_1.WHITESPACE_CHAR);

},{"../../CollectionHelpers":1,"../../PatternHelpers":38,"../../PatternPieces":39,"./Bracket":2,"./FailedConventionTracker":3,"./InlineTextConsumer":4,"./MediaConventions":6,"./RaisedVoices/applyRaisedVoices":12,"./RichConventions":13,"./Token":14,"./TokenKind":15,"./TokenizerContext":17,"./TokenizerSnapshot":18,"./insertBracketsInsideBracketedConventions":20,"./nestOverlappingConventions":21}],17:[function(require,module,exports){
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
        if (this.convention.insteadOfTryingToOpenUsualConventions) {
            this.convention.insteadOfTryingToOpenUsualConventions();
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
"use strict";
var Tokenizer_1 = require('./Tokenizer');
var Parser_1 = require('./Parser');
function getInlineNodes(text, config) {
    var tokens = (new Tokenizer_1.Tokenizer(text, config)).tokens;
    return new Parser_1.Parser({ tokens: tokens }).result.nodes;
}
exports.getInlineNodes = getInlineNodes;

},{"./Parser":7,"./Tokenizer":16}],20:[function(require,module,exports){
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

},{"./RichConventions":13,"./Token":14,"./TokenKind":15}],21:[function(require,module,exports){
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
    RichConventions_1.NSFW_CONVENTION,
    RichConventions_1.NSFL_CONVENTION,
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

},{"./RichConventions":13}],22:[function(require,module,exports){
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

},{"./getSortedUnderlineChars":27}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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
            pattern: Patterns_1.DIVIDER_STREAK_PATTERN,
            then: function (line) { optionalOverline = line; }
        });
        var rawContent;
        var underline;
        var hasContentAndUnderline = (consumer.consumeLine({
            pattern: Patterns_1.NON_BLANK_PATTERN,
            then: function (line) { rawContent = line; }
        })
            && consumer.consumeLine({
                if: function (line) { return (Patterns_1.DIVIDER_STREAK_PATTERN.test(line)
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

},{"../../Patterns":40,"../../SyntaxNodes/HeadingNode":54,"../Inline/getInlineNodes":19,"./LineConsumer":23,"./getSortedUnderlineChars":27,"./isLineFancyOutlineConvention":28}],25:[function(require,module,exports){
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
var PatternHelpers_1 = require('../../PatternHelpers');
var PatternPieces_1 = require('../../PatternPieces');
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
var LEADING_BLANK_LINES_PATTERN = PatternHelpers_1.regExpStartingWith(PatternPieces_1.ANY_WHITESPACE + PatternPieces_1.LINE_BREAK);
var TRAILIN_BLANK_LINES_PATTERN = PatternHelpers_1.regExpEndingWith(PatternPieces_1.LINE_BREAK + PatternPieces_1.ANY_WHITESPACE);

},{"../../CollectionHelpers":1,"../../PatternHelpers":38,"../../PatternPieces":39,"../../SyntaxNodes/SectionSeparatorNode":74,"./LineConsumer":23,"./getHeadingParser":24,"./parseBlankLineSeparation":29,"./parseBlockquote":30,"./parseCodeBlock":31,"./parseDescriptionList":32,"./parseOrderedList":33,"./parseRegularLines":34,"./parseSectionSeparatorStreak":35,"./parseUnorderedList":36}],26:[function(require,module,exports){
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
            pattern: Patterns_1.BLANK_PATTERN,
            then: function (line) { return lines.push(line); }
        });
        if (wasLineBlank) {
            continue;
        }
        var wasLineIndented = consumer.consumeLine({
            pattern: Patterns_1.INDENTED_PATTERN,
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
        .map(function (line) { return line.replace(Patterns_1.INDENTED_PATTERN, ''); });
    args.then(resultLines, lengthParsed, shouldTerminateList);
    return true;
}
exports.getRemainingLinesOfListItem = getRemainingLinesOfListItem;

},{"../../Patterns":40,"./LineConsumer":23}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{"./HeadingLeveler":22,"./parseBlockquote":30,"./parseOrderedList":33,"./parseSectionSeparatorStreak":35,"./parseUnorderedList":36}],29:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var SectionSeparatorNode_1 = require('../../SyntaxNodes/SectionSeparatorNode');
var Patterns_1 = require('../../Patterns');
function parseBlankLineSeparation(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var countBlankLines = 0;
    while (consumer.consumeLine({ pattern: Patterns_1.BLANK_PATTERN })) {
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

},{"../../Patterns":40,"../../SyntaxNodes/SectionSeparatorNode":74,"./LineConsumer":23}],30:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var BlockquoteNode_1 = require('../../SyntaxNodes/BlockquoteNode');
var getOutlineNodes_1 = require('./getOutlineNodes');
var HeadingLeveler_1 = require('./HeadingLeveler');
var PatternHelpers_1 = require('../../PatternHelpers');
var PatternPieces_1 = require('../../PatternPieces');
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
var BLOCKQUOTE_DELIMITER = '>' + PatternHelpers_1.optional(PatternPieces_1.INLINE_WHITESPACE_CHAR);
var ALL_BLOCKQUOTE_DELIMITERS_PATTERN = PatternHelpers_1.regExpStartingWith(PatternHelpers_1.capture(PatternHelpers_1.atLeast(1, BLOCKQUOTE_DELIMITER)));
var FIRST_BLOCKQUOTE_DELIMITER_PATTERN = PatternHelpers_1.regExpStartingWith(BLOCKQUOTE_DELIMITER);
var TRAILING_SPACE_PATTERN = PatternHelpers_1.regExpEndingWith(PatternPieces_1.INLINE_WHITESPACE_CHAR);

},{"../../PatternHelpers":38,"../../PatternPieces":39,"../../SyntaxNodes/BlockquoteNode":43,"./HeadingLeveler":22,"./LineConsumer":23,"./getOutlineNodes":25}],31:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var CodeBlockNode_1 = require('../../SyntaxNodes/CodeBlockNode');
var PatternHelpers_1 = require('../../PatternHelpers');
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
var CODE_FENCE_PATTERN = new RegExp(PatternHelpers_1.streakOf('`'));

},{"../../PatternHelpers":38,"../../SyntaxNodes/CodeBlockNode":44,"./LineConsumer":23}],32:[function(require,module,exports){
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
                pattern: Patterns_1.NON_BLANK_PATTERN,
                if: function (line) { return !Patterns_1.INDENTED_PATTERN.test(line) && !isLineFancyOutlineConvention_1.isLineFancyOutlineConvention(line, args.config); },
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
            pattern: Patterns_1.INDENTED_PATTERN,
            if: function (line) { return !Patterns_1.BLANK_PATTERN.test(line); },
            then: function (line) { return rawDescriptionLines.push(line.replace(Patterns_1.INDENTED_PATTERN, '')); }
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

},{"../../Patterns":40,"../../SyntaxNodes/Description":45,"../../SyntaxNodes/DescriptionListItem":46,"../../SyntaxNodes/DescriptionListNode":47,"../../SyntaxNodes/DescriptionTerm":48,"../Inline/getInlineNodes":19,"./LineConsumer":23,"./getOutlineNodes":25,"./getRemainingLinesOfListItem":26,"./isLineFancyOutlineConvention":28}],33:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var OrderedListNode_1 = require('../../SyntaxNodes/OrderedListNode');
var OrderedListItem_1 = require('../../SyntaxNodes/OrderedListItem');
var getOutlineNodes_1 = require('./getOutlineNodes');
var PatternHelpers_1 = require('../../PatternHelpers');
var PatternPieces_1 = require('../../PatternPieces');
var Patterns_1 = require('../../Patterns');
var getRemainingLinesOfListItem_1 = require('./getRemainingLinesOfListItem');
function parseOrderedList(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var rawListItems = [];
    var _loop_1 = function() {
        var rawListItem = new RawListItem();
        var isLineBulleted = consumer.consumeLine({
            pattern: BULLETED_PATTERN,
            if: function (line) { return !Patterns_1.DIVIDER_STREAK_PATTERN.test(line); },
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
var INTEGER_PATTERN = new RegExp(PatternHelpers_1.capture(PatternPieces_1.INTEGER));
var BULLET = PatternHelpers_1.either('#', PatternHelpers_1.capture(PatternHelpers_1.either(PatternPieces_1.INTEGER, '#') + PatternHelpers_1.either('\\.', '\\)')));
var BULLETED_PATTERN = PatternHelpers_1.regExpStartingWith(PatternHelpers_1.optional(' ') + BULLET + PatternPieces_1.INLINE_WHITESPACE_CHAR);
var INTEGER_FOLLOWED_BY_PERIOD_PATTERN = new RegExp(PatternPieces_1.INTEGER + '\\.');

},{"../../PatternHelpers":38,"../../PatternPieces":39,"../../Patterns":40,"../../SyntaxNodes/OrderedListItem":64,"../../SyntaxNodes/OrderedListNode":65,"./LineConsumer":23,"./getOutlineNodes":25,"./getRemainingLinesOfListItem":26}],34:[function(require,module,exports){
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
            pattern: Patterns_1.NON_BLANK_PATTERN,
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

},{"../../Patterns":40,"../../SyntaxNodes/Line":58,"../../SyntaxNodes/LineBlockNode":59,"../../SyntaxNodes/MediaSyntaxNode":61,"../../SyntaxNodes/ParagraphNode":68,"../../SyntaxNodes/isWhitespace":81,"../Inline/getInlineNodes":19,"./LineConsumer":23,"./isLineFancyOutlineConvention":28}],35:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var SectionSeparatorNode_1 = require('../../SyntaxNodes/SectionSeparatorNode');
var Patterns_1 = require('../../Patterns');
function parseSectionSeparatorStreak(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    if (!consumer.consumeLine({ pattern: Patterns_1.DIVIDER_STREAK_PATTERN })) {
        return false;
    }
    args.then([new SectionSeparatorNode_1.SectionSeparatorNode()], consumer.textIndex);
    return true;
}
exports.parseSectionSeparatorStreak = parseSectionSeparatorStreak;

},{"../../Patterns":40,"../../SyntaxNodes/SectionSeparatorNode":74,"./LineConsumer":23}],36:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var UnorderedListNode_1 = require('../../SyntaxNodes/UnorderedListNode');
var UnorderedListItem_1 = require('../../SyntaxNodes/UnorderedListItem');
var getOutlineNodes_1 = require('./getOutlineNodes');
var getRemainingLinesOfListItem_1 = require('./getRemainingLinesOfListItem');
var PatternHelpers_1 = require('../../PatternHelpers');
var PatternPieces_1 = require('../../PatternPieces');
var Patterns_1 = require('../../Patterns');
function parseUnorderedList(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var rawListItemsContents = [];
    var _loop_1 = function() {
        var rawListItemLines = [];
        var isLineBulleted = consumer.consumeLine({
            pattern: BULLET_PATTERN,
            if: function (line) { return !Patterns_1.DIVIDER_STREAK_PATTERN.test(line); },
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
var BULLET_PATTERN = PatternHelpers_1.regExpStartingWith(PatternHelpers_1.optional(' ') + PatternHelpers_1.either('\\*', '-', '\\+') + PatternPieces_1.INLINE_WHITESPACE_CHAR);

},{"../../PatternHelpers":38,"../../PatternPieces":39,"../../Patterns":40,"../../SyntaxNodes/UnorderedListItem":78,"../../SyntaxNodes/UnorderedListNode":79,"./LineConsumer":23,"./getOutlineNodes":25,"./getRemainingLinesOfListItem":26}],37:[function(require,module,exports){
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

},{"../SyntaxNodes/DocumentNode":49,"./Outline/HeadingLeveler":22,"./Outline/getOutlineNodes":25}],38:[function(require,module,exports){
"use strict";
function group(pattern) {
    return "(?:" + pattern + ")";
}
exports.group = group;
function capture(pattern) {
    return "(" + pattern + ")";
}
exports.capture = capture;
function optional(pattern) {
    return group(pattern) + '?';
}
exports.optional = optional;
function all(pattern) {
    return group(pattern) + '*';
}
exports.all = all;
function atLeast(count, pattern) {
    return group(pattern) + ("{" + count + ",}");
}
exports.atLeast = atLeast;
function exactly(count, pattern) {
    return group(pattern) + ("{" + count + "}");
}
exports.exactly = exactly;
function either() {
    var patterns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        patterns[_i - 0] = arguments[_i];
    }
    return group(patterns.join('|'));
}
exports.either = either;
function streakOf(charPattern) {
    return solely(atLeast(3, charPattern));
}
exports.streakOf = streakOf;
function escapeForRegex(text) {
    return text.replace(/[(){}[\].+*?^$\\|-]/g, '\\$&');
}
exports.escapeForRegex = escapeForRegex;
function regExpStartingWith(pattern, flags) {
    return new RegExp('^' + pattern, flags);
}
exports.regExpStartingWith = regExpStartingWith;
function regExpEndingWith(pattern, flags) {
    return new RegExp(pattern + '$', flags);
}
exports.regExpEndingWith = regExpEndingWith;
var PatternPieces_1 = require('./PatternPieces');
function solely(pattern) {
    return '^' + pattern + all(PatternPieces_1.INLINE_WHITESPACE_CHAR) + '$';
}
exports.solely = solely;

},{"./PatternPieces":39}],39:[function(require,module,exports){
"use strict";
var PatternHelpers_1 = require('./PatternHelpers');
exports.INLINE_WHITESPACE_CHAR = '[^\\S\\n]';
exports.WHITESPACE_CHAR = '\\s';
exports.ANY_WHITESPACE = PatternHelpers_1.all('\\s');
exports.LINE_BREAK = '\n';
exports.INTEGER = '\\d+';
exports.LETTER = '[a-zA-Z]';
exports.DIGIT = '\\d';

},{"./PatternHelpers":38}],40:[function(require,module,exports){
"use strict";
var PatternHelpers_1 = require('./PatternHelpers');
var PatternPieces_1 = require('./PatternPieces');
var DIVIDER_STREAK_CHAR = PatternHelpers_1.either('#', '=', '-', '\\+', '~', '\\*', '\\^', '@', ':', '_');
var INDENT = PatternHelpers_1.either('  ', '\t');
exports.INDENTED_PATTERN = PatternHelpers_1.regExpStartingWith(INDENT);
exports.DIVIDER_STREAK_PATTERN = new RegExp(PatternHelpers_1.streakOf(DIVIDER_STREAK_CHAR + PatternPieces_1.ANY_WHITESPACE));
exports.BLANK_PATTERN = new RegExp(PatternHelpers_1.solely(''));
exports.NON_BLANK_PATTERN = /\S/;

},{"./PatternHelpers":38,"./PatternPieces":39}],41:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":73}],42:[function(require,module,exports){
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

},{"./MediaSyntaxNode":61}],43:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":67}],44:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":67}],45:[function(require,module,exports){
"use strict";
var Description = (function () {
    function Description(children) {
        this.children = children;
        this.DESCRIPTION = null;
    }
    return Description;
}());
exports.Description = Description;

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":67}],48:[function(require,module,exports){
"use strict";
var DescriptionTerm = (function () {
    function DescriptionTerm(children) {
        this.children = children;
        this.DESCRIPTION_TERM = null;
    }
    return DescriptionTerm;
}());
exports.DescriptionTerm = DescriptionTerm;

},{}],49:[function(require,module,exports){
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

},{"./FootnoteBlockInserter":51}],50:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":73}],51:[function(require,module,exports){
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
        this.currentFootnoteReferenceNumber = 1;
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
                node.referenceNumber = this.currentFootnoteReferenceNumber++;
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

},{"../CollectionHelpers":1,"./BlockquoteNode":43,"./DescriptionListNode":47,"./FootnoteBlockNode":52,"./FootnoteNode":53,"./HeadingNode":54,"./LineBlockNode":59,"./OrderedListNode":65,"./ParagraphNode":68,"./UnorderedListNode":79}],52:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":67}],53:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":73}],54:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":67}],55:[function(require,module,exports){
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

},{"./MediaSyntaxNode":61}],56:[function(require,module,exports){
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

},{"./InlineSyntaxNode":57}],57:[function(require,module,exports){
"use strict";
var InlineSyntaxNode = (function () {
    function InlineSyntaxNode() {
    }
    InlineSyntaxNode.prototype.inlineSyntaxNode = function () { };
    return InlineSyntaxNode;
}());
exports.InlineSyntaxNode = InlineSyntaxNode;

},{}],58:[function(require,module,exports){
"use strict";
var Line = (function () {
    function Line(children) {
        this.children = children;
        this.LINE = null;
    }
    return Line;
}());
exports.Line = Line;

},{}],59:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":67}],60:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":73}],61:[function(require,module,exports){
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

},{}],62:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RichInlineSyntaxNode_1 = require('./RichInlineSyntaxNode');
var NsflNode = (function (_super) {
    __extends(NsflNode, _super);
    function NsflNode() {
        _super.apply(this, arguments);
        this.NOT_SAFE_FOR_LIFE = null;
    }
    return NsflNode;
}(RichInlineSyntaxNode_1.RichInlineSyntaxNode));
exports.NsflNode = NsflNode;

},{"./RichInlineSyntaxNode":73}],63:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RichInlineSyntaxNode_1 = require('./RichInlineSyntaxNode');
var NsfwNode = (function (_super) {
    __extends(NsfwNode, _super);
    function NsfwNode() {
        _super.apply(this, arguments);
        this.NOT_SAFE_FOR_WORK = null;
    }
    return NsfwNode;
}(RichInlineSyntaxNode_1.RichInlineSyntaxNode));
exports.NsfwNode = NsfwNode;

},{"./RichInlineSyntaxNode":73}],64:[function(require,module,exports){
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

},{}],65:[function(require,module,exports){
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

},{"./OrderedListOrder":66,"./OutlineSyntaxNode":67}],66:[function(require,module,exports){
"use strict";
(function (OrderedListOrder) {
    OrderedListOrder[OrderedListOrder["Ascending"] = 0] = "Ascending";
    OrderedListOrder[OrderedListOrder["Descrending"] = 1] = "Descrending";
})(exports.OrderedListOrder || (exports.OrderedListOrder = {}));
var OrderedListOrder = exports.OrderedListOrder;

},{}],67:[function(require,module,exports){
"use strict";
var OutlineSyntaxNode = (function () {
    function OutlineSyntaxNode() {
    }
    OutlineSyntaxNode.prototype.outlineSyntaxNode = function () { };
    return OutlineSyntaxNode;
}());
exports.OutlineSyntaxNode = OutlineSyntaxNode;

},{}],68:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":67}],69:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":73}],70:[function(require,module,exports){
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

},{"./InlineSyntaxNode":57}],71:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":73}],72:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":73}],73:[function(require,module,exports){
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

},{"../SyntaxNodes/InlineSyntaxNode":57}],74:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":67}],75:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":73}],76:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":73}],77:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":73}],78:[function(require,module,exports){
"use strict";
var UnorderedListItem = (function () {
    function UnorderedListItem(children) {
        this.children = children;
        this.UNORDERED_LIST_ITEM = null;
    }
    return UnorderedListItem;
}());
exports.UnorderedListItem = UnorderedListItem;

},{}],79:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":67}],80:[function(require,module,exports){
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

},{"./MediaSyntaxNode":61}],81:[function(require,module,exports){
"use strict";
var PlainTextNode_1 = require('./PlainTextNode');
function isWhitespace(node) {
    return (node instanceof PlainTextNode_1.PlainTextNode) && !/\S/.test(node.text);
}
exports.isWhitespace = isWhitespace;

},{"./PlainTextNode":70}],82:[function(require,module,exports){
"use strict";
var parseDocument_1 = require('./Parsing/parseDocument');
var HtmlWriter_1 = require('./Writers//Html/HtmlWriter');
var UpConfig_1 = require('./UpConfig');
var Up = (function () {
    function Up(settings) {
        this.config = new UpConfig_1.UpConfig(settings);
    }
    Up.toAst = function (text, changedSettings) {
        return this.defaultUp.toAst(text, changedSettings);
    };
    Up.toHtml = function (textOrNode, changedSettings) {
        return this.defaultUp.toHtml(textOrNode, changedSettings);
    };
    Up.prototype.toAst = function (text, changedSettings) {
        return toAst(text, this.config.withChanges(changedSettings));
    };
    Up.prototype.toHtml = function (textOrNode, changedSettings) {
        return toHtml(textOrNode, this.config.withChanges(changedSettings));
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

},{"./Parsing/parseDocument":37,"./UpConfig":83,"./Writers//Html/HtmlWriter":85}],83:[function(require,module,exports){
"use strict";
var DEFAULT_CONFIG = {
    documentName: 'up',
    defaultUrlScheme: 'https://',
    baseForUrlsStartingWithSlash: '',
    i18n: {
        idWordDelimiter: '-',
        terms: {
            image: 'image',
            audio: 'audio',
            video: 'video',
            spoiler: 'spoiler',
            toggleSpoiler: 'toggle spoiler',
            nsfw: 'nsfw',
            toggleNsfw: 'toggle nsfw',
            nsfl: 'nsfl',
            toggleNsfl: 'toggle nsfl',
            footnote: 'footnote',
            footnoteReference: 'footnote reference'
        }
    }
};
var UpConfig = (function () {
    function UpConfig(settings, defaultSettings) {
        if (defaultSettings === void 0) { defaultSettings = DEFAULT_CONFIG; }
        this.settings = merge(defaultSettings, settings);
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

},{}],84:[function(require,module,exports){
"use strict";
function escapeHtmlContent(content) {
    return htmlEscape(content, /[&<]/g);
}
exports.escapeHtmlContent = escapeHtmlContent;
function escapeHtmlAttrValue(attrValue) {
    return htmlEscape(String(attrValue), /[&"]/g);
}
exports.escapeHtmlAttrValue = escapeHtmlAttrValue;
function htmlEscape(html, charsToEscape) {
    return html.replace(charsToEscape, function (char) { return ESCAPED_HTML_ENTITIES_BY_CHAR[char]; });
}
var ESCAPED_HTML_ENTITIES_BY_CHAR = {
    '&': '&amp;',
    '<': '&lt;',
    '"': '&quot;',
};

},{}],85:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinkNode_1 = require('../../SyntaxNodes/LinkNode');
var PlainTextNode_1 = require('../../SyntaxNodes/PlainTextNode');
var OrderedListOrder_1 = require('../../SyntaxNodes/OrderedListOrder');
var Writer_1 = require('.././Writer');
var WritingHelpers_1 = require('./WritingHelpers');
var EscapingHelpers_1 = require('./EscapingHelpers');
var HtmlWriter = (function (_super) {
    __extends(HtmlWriter, _super);
    function HtmlWriter(config) {
        _super.call(this, config);
        this.isInsideLink = false;
        this.spoilerCount = 0;
        this.nsfwCount = 0;
        this.nsflCount = 0;
    }
    HtmlWriter.prototype.document = function (node) {
        return this.htmlElements(node.children).join('');
    };
    HtmlWriter.prototype.blockquote = function (node) {
        return this.htmlElementWithAlreadyEscapedChildren('blockquote', node.children);
    };
    HtmlWriter.prototype.unorderedList = function (node) {
        var _this = this;
        return WritingHelpers_1.htmlElementWithAlreadyEscapedChildren('ul', node.listItems.map(function (listItem) { return _this.unorderedListItem(listItem); }));
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
        return WritingHelpers_1.htmlElementWithAlreadyEscapedChildren('ol', node.listItems.map(function (listItem) { return _this.orderedListItem(listItem); }), attrs);
    };
    HtmlWriter.prototype.descriptionList = function (node) {
        var _this = this;
        return WritingHelpers_1.htmlElementWithAlreadyEscapedChildren('dl', node.listItems.map(function (listItem) { return _this.descriptionListItem(listItem); }));
    };
    HtmlWriter.prototype.lineBlock = function (node) {
        var _this = this;
        return WritingHelpers_1.htmlElementWithAlreadyEscapedChildren('div', node.lines.map(function (line) { return _this.line(line); }), { class: WritingHelpers_1.classAttrValue('lines') });
    };
    HtmlWriter.prototype.codeBlock = function (node) {
        return WritingHelpers_1.htmlElementWithAlreadyEscapedChildren('pre', [WritingHelpers_1.htmlElement('code', node.text)]);
    };
    HtmlWriter.prototype.paragraph = function (node) {
        return this.htmlElementWithAlreadyEscapedChildren('p', node.children);
    };
    HtmlWriter.prototype.heading = function (node) {
        return this.htmlElementWithAlreadyEscapedChildren('h' + Math.min(6, node.level), node.children);
    };
    HtmlWriter.prototype.sectionSeparator = function (node) {
        return WritingHelpers_1.singleTagHtmlElement('hr');
    };
    HtmlWriter.prototype.emphasis = function (node) {
        return this.htmlElementWithAlreadyEscapedChildren('em', node.children);
    };
    HtmlWriter.prototype.stress = function (node) {
        return this.htmlElementWithAlreadyEscapedChildren('strong', node.children);
    };
    HtmlWriter.prototype.inlineCode = function (node) {
        return WritingHelpers_1.htmlElement('code', node.text);
    };
    HtmlWriter.prototype.revisionInsertion = function (node) {
        return this.htmlElementWithAlreadyEscapedChildren('ins', node.children);
    };
    HtmlWriter.prototype.revisionDeletion = function (node) {
        return this.htmlElementWithAlreadyEscapedChildren('del', node.children);
    };
    HtmlWriter.prototype.parenthesized = function (node) {
        return this.bracketed(node, 'parenthesized');
    };
    HtmlWriter.prototype.squareBracketed = function (node) {
        return this.bracketed(node, 'square-bracketed');
    };
    HtmlWriter.prototype.action = function (node) {
        return this.htmlElementWithAlreadyEscapedChildren('span', node.children, { class: WritingHelpers_1.classAttrValue('action') });
    };
    HtmlWriter.prototype.spoiler = function (node) {
        return this.revealableConvent({
            nonLocalizedConventionTerm: 'spoiler',
            termForTogglingVisibility: this.config.settings.i18n.terms.toggleSpoiler,
            conventionCount: ++this.spoilerCount,
            revealableChildren: node.children
        });
    };
    HtmlWriter.prototype.nsfw = function (node) {
        return this.revealableConvent({
            nonLocalizedConventionTerm: 'nsfw',
            termForTogglingVisibility: this.config.settings.i18n.terms.toggleNsfw,
            conventionCount: ++this.nsfwCount,
            revealableChildren: node.children
        });
    };
    HtmlWriter.prototype.nsfl = function (node) {
        return this.revealableConvent({
            nonLocalizedConventionTerm: 'nsfl',
            termForTogglingVisibility: this.config.settings.i18n.terms.toggleNsfl,
            conventionCount: ++this.nsflCount,
            revealableChildren: node.children
        });
    };
    HtmlWriter.prototype.footnoteReference = function (node) {
        var innerLinkNode = this.footnoteReferenceInnerLink(node);
        return this.htmlElementWithAlreadyEscapedChildren('sup', [innerLinkNode], {
            id: this.footnoteReferenceId(node.referenceNumber),
            class: WritingHelpers_1.classAttrValue('footnote-reference')
        });
    };
    HtmlWriter.prototype.footnoteBlock = function (node) {
        var _this = this;
        return WritingHelpers_1.htmlElementWithAlreadyEscapedChildren('dl', node.footnotes.map(function (footnote) { return _this.footnote(footnote); }), { class: WritingHelpers_1.classAttrValue('footnotes') });
    };
    HtmlWriter.prototype.link = function (node) {
        var _this = this;
        if (this.isInsideLink) {
            return node.children.map(function (child) { return _this.write(child); }).join('');
        }
        this.isInsideLink = true;
        var html = this.htmlElementWithAlreadyEscapedChildren('a', node.children, { href: node.url });
        this.isInsideLink = false;
        return html;
    };
    HtmlWriter.prototype.image = function (node) {
        return WritingHelpers_1.singleTagHtmlElement('img', { src: node.url, alt: node.description, title: node.description });
    };
    HtmlWriter.prototype.audio = function (node) {
        var description = node.description, url = node.url;
        return this.htmlElementWithAlreadyEscapedChildren('audio', this.mediaFallback(description, url), { src: url, title: description });
    };
    HtmlWriter.prototype.video = function (node) {
        var description = node.description, url = node.url;
        return this.htmlElementWithAlreadyEscapedChildren('video', this.mediaFallback(description, url), { src: url, title: description });
    };
    HtmlWriter.prototype.plainText = function (node) {
        return EscapingHelpers_1.escapeHtmlContent(node.text);
    };
    HtmlWriter.prototype.bracketed = function (bracketed, bracketName) {
        return this.htmlElementWithAlreadyEscapedChildren('span', bracketed.children, { class: WritingHelpers_1.classAttrValue(bracketName) });
    };
    HtmlWriter.prototype.unorderedListItem = function (listItem) {
        return this.htmlElementWithAlreadyEscapedChildren('li', listItem.children);
    };
    HtmlWriter.prototype.orderedListItem = function (listItem) {
        var attrs = {};
        if (listItem.ordinal != null) {
            attrs.value = listItem.ordinal;
        }
        return this.htmlElementWithAlreadyEscapedChildren('li', listItem.children, attrs);
    };
    HtmlWriter.prototype.descriptionListItem = function (listItem) {
        var _this = this;
        return (listItem.terms.map(function (term) { return _this.descriptionTerm(term); }).join('')
            + this.description(listItem.description));
    };
    HtmlWriter.prototype.descriptionTerm = function (term) {
        return this.htmlElementWithAlreadyEscapedChildren('dt', term.children);
    };
    HtmlWriter.prototype.description = function (description) {
        return this.htmlElementWithAlreadyEscapedChildren('dd', description.children);
    };
    HtmlWriter.prototype.line = function (line) {
        return this.htmlElementWithAlreadyEscapedChildren('div', line.children);
    };
    HtmlWriter.prototype.footnoteReferenceInnerLink = function (footnoteReference) {
        var referenceNumber = footnoteReference.referenceNumber;
        return new LinkNode_1.LinkNode([new PlainTextNode_1.PlainTextNode(referenceNumber.toString())], WritingHelpers_1.internalFragmentUrl(this.footnoteId(referenceNumber)));
    };
    HtmlWriter.prototype.footnote = function (footnote) {
        var termHtml = this.htmlElementWithAlreadyEscapedChildren('dt', [this.footnoteLinkBackToReference(footnote)], { id: this.footnoteId(footnote.referenceNumber) });
        var descriptionHtml = this.htmlElementWithAlreadyEscapedChildren('dd', footnote.children);
        return termHtml + descriptionHtml;
    };
    HtmlWriter.prototype.footnoteLinkBackToReference = function (footnote) {
        var referenceNumber = footnote.referenceNumber;
        return new LinkNode_1.LinkNode([new PlainTextNode_1.PlainTextNode(referenceNumber.toString())], WritingHelpers_1.internalFragmentUrl(this.footnoteReferenceId(referenceNumber)));
    };
    HtmlWriter.prototype.mediaFallback = function (content, url) {
        return [new LinkNode_1.LinkNode([new PlainTextNode_1.PlainTextNode(content)], url)];
    };
    HtmlWriter.prototype.revealableConvent = function (args) {
        var nonLocalizedConventionTerm = args.nonLocalizedConventionTerm, conventionCount = args.conventionCount, termForTogglingVisibility = args.termForTogglingVisibility, revealableChildren = args.revealableChildren;
        var localizedTerm = this.config.localizeTerm(nonLocalizedConventionTerm);
        var checkboxId = this.getId(localizedTerm, conventionCount);
        return WritingHelpers_1.htmlElementWithAlreadyEscapedChildren('span', [
            WritingHelpers_1.htmlElement('label', termForTogglingVisibility, { for: checkboxId }),
            WritingHelpers_1.singleTagHtmlElement('input', { id: checkboxId, type: 'checkbox' }),
            this.htmlElementWithAlreadyEscapedChildren('span', revealableChildren)], { class: WritingHelpers_1.classAttrValue(nonLocalizedConventionTerm, 'revealable') });
    };
    HtmlWriter.prototype.htmlElementWithAlreadyEscapedChildren = function (tagName, children, attrs) {
        if (attrs === void 0) { attrs = {}; }
        return WritingHelpers_1.htmlElementWithAlreadyEscapedChildren(tagName, this.htmlElements(children), attrs);
    };
    HtmlWriter.prototype.htmlElements = function (nodes) {
        var _this = this;
        return nodes.map(function (node) { return _this.write(node); });
    };
    HtmlWriter.prototype.footnoteId = function (referenceNumber) {
        return this.getId(this.config.settings.i18n.terms.footnote, referenceNumber);
    };
    HtmlWriter.prototype.footnoteReferenceId = function (referenceNumber) {
        return this.getId(this.config.settings.i18n.terms.footnoteReference, referenceNumber);
    };
    return HtmlWriter;
}(Writer_1.Writer));
exports.HtmlWriter = HtmlWriter;

},{"../../SyntaxNodes/LinkNode":60,"../../SyntaxNodes/OrderedListOrder":66,"../../SyntaxNodes/PlainTextNode":70,".././Writer":87,"./EscapingHelpers":84,"./WritingHelpers":86}],86:[function(require,module,exports){
"use strict";
var EscapingHelpers_1 = require('./EscapingHelpers');
function htmlElement(tagName, content, attrs) {
    if (attrs === void 0) { attrs = {}; }
    return htmlElementWithAlreadyEscapedChildren(tagName, [EscapingHelpers_1.escapeHtmlContent(content)], attrs);
}
exports.htmlElement = htmlElement;
function htmlElementWithAlreadyEscapedChildren(tagName, escapedChildren, attrs) {
    if (attrs === void 0) { attrs = {}; }
    return htmlStartTag(tagName, attrs) + escapedChildren.join('') + ("</" + tagName + ">");
}
exports.htmlElementWithAlreadyEscapedChildren = htmlElementWithAlreadyEscapedChildren;
function singleTagHtmlElement(tagName, attrs) {
    if (attrs === void 0) { attrs = {}; }
    return htmlStartTag(tagName, attrs);
}
exports.singleTagHtmlElement = singleTagHtmlElement;
function classAttrValue() {
    var names = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        names[_i - 0] = arguments[_i];
    }
    return names
        .map(function (name) { return 'up-' + name; })
        .join(' ');
}
exports.classAttrValue = classAttrValue;
function internalFragmentUrl(id) {
    return '#' + id;
}
exports.internalFragmentUrl = internalFragmentUrl;
function htmlStartTag(tagName, attrs) {
    var tagNameWithAttrs = [tagName].concat(htmlAttrs(attrs)).join(' ');
    return "<" + tagNameWithAttrs + ">";
}
function htmlAttrs(attrs) {
    return Object.keys(attrs).map(function (attrName) { return htmlAttr(attrs, attrName); });
}
function htmlAttr(attrs, attrName) {
    var value = attrs[attrName];
    return (value == null
        ? attrName
        : attrName + "=\"" + EscapingHelpers_1.escapeHtmlAttrValue(value) + "\"");
}

},{"./EscapingHelpers":84}],87:[function(require,module,exports){
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
var NsfwNode_1 = require('../SyntaxNodes/NsfwNode');
var NsflNode_1 = require('../SyntaxNodes/NsflNode');
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
    Writer.prototype.getId = function () {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i - 0] = arguments[_i];
        }
        var rawId = [this.config.settings.documentName].concat(parts).join(' ');
        return (rawId
            .trim()
            .replace(/\s+/g, this.config.settings.i18n.idWordDelimiter));
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
        if (node instanceof NsfwNode_1.NsfwNode) {
            return this.nsfw(node);
        }
        if (node instanceof NsflNode_1.NsflNode) {
            return this.nsfl(node);
        }
        if (node instanceof PlainTextNode_1.PlainTextNode) {
            return this.plainText(node);
        }
        throw new Error("Unrecognized syntax node");
    };
    return Writer;
}());
exports.Writer = Writer;

},{"../SyntaxNodes/ActionNode":41,"../SyntaxNodes/AudioNode":42,"../SyntaxNodes/BlockquoteNode":43,"../SyntaxNodes/CodeBlockNode":44,"../SyntaxNodes/DescriptionListNode":47,"../SyntaxNodes/DocumentNode":49,"../SyntaxNodes/EmphasisNode":50,"../SyntaxNodes/FootnoteBlockNode":52,"../SyntaxNodes/FootnoteNode":53,"../SyntaxNodes/HeadingNode":54,"../SyntaxNodes/ImageNode":55,"../SyntaxNodes/InlineCodeNode":56,"../SyntaxNodes/LineBlockNode":59,"../SyntaxNodes/LinkNode":60,"../SyntaxNodes/NsflNode":62,"../SyntaxNodes/NsfwNode":63,"../SyntaxNodes/OrderedListNode":65,"../SyntaxNodes/ParagraphNode":68,"../SyntaxNodes/ParenthesizedNode":69,"../SyntaxNodes/PlainTextNode":70,"../SyntaxNodes/RevisionDeletionNode":71,"../SyntaxNodes/RevisionInsertionNode":72,"../SyntaxNodes/SectionSeparatorNode":74,"../SyntaxNodes/SpoilerNode":75,"../SyntaxNodes/SquareBracketedNode":76,"../SyntaxNodes/StressNode":77,"../SyntaxNodes/UnorderedListNode":79,"../SyntaxNodes/VideoNode":80}],88:[function(require,module,exports){
"use strict";
var index_1 = require('./index');
window.Up = index_1.default;

},{"./index":89}],89:[function(require,module,exports){
"use strict";
var Up_1 = require('./Up');
exports.default = Up_1.Up;

},{"./Up":82}]},{},[88]);
