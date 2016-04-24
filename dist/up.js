(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Up = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict";
var CollectionHelpers_1 = require('../CollectionHelpers');
var Convention = (function () {
    function Convention() {
        var meanings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            meanings[_i - 0] = arguments[_i];
        }
        this.tokenMeanings = meanings;
    }
    Convention.prototype.startTokenMeaning = function () {
        return this.tokenMeanings[0];
    };
    Convention.prototype.endTokenMeaning = function () {
        return CollectionHelpers_1.last(this.tokenMeanings);
    };
    return Convention;
}());
exports.Convention = Convention;

},{"../CollectionHelpers":1}],3:[function(require,module,exports){
"use strict";
var FailureTracker = (function () {
    function FailureTracker() {
        this.failures = [];
    }
    FailureTracker.prototype.registerConventionFailure = function (convention, textIndex) {
        var startTokenMeaning = convention.startTokenMeaning();
        if (this.hasNoFailuresAt(textIndex)) {
            this.failures[textIndex] = [startTokenMeaning];
        }
        else {
            this.failures[textIndex].push(startTokenMeaning);
        }
    };
    FailureTracker.prototype.registerFailure = function (startTokenMeaning, textIndex) {
        if (this.hasNoFailuresAt(textIndex)) {
            this.failures[textIndex] = [startTokenMeaning];
        }
        else {
            this.failures[textIndex].push(startTokenMeaning);
        }
    };
    FailureTracker.prototype.hasConventionFailed = function (convention, textIndex) {
        if (this.hasNoFailuresAt(textIndex)) {
            return false;
        }
        return -1 !== this.failures[textIndex].indexOf(convention.startTokenMeaning());
    };
    FailureTracker.prototype.hasFailed = function (startTokenMeaning, textIndex) {
        if (this.hasNoFailuresAt(textIndex)) {
            return false;
        }
        return -1 !== this.failures[textIndex].indexOf(startTokenMeaning);
    };
    FailureTracker.prototype.hasNoFailuresAt = function (textIndex) {
        return !this.failures[textIndex];
    };
    return FailureTracker;
}());
exports.FailureTracker = FailureTracker;

},{}],4:[function(require,module,exports){
"use strict";
var Tokenize_1 = require('./Tokenize');
var Parse_1 = require('./Parse');
function getInlineNodes(text) {
    return Parse_1.parse(Tokenize_1.tokenize(text));
}
exports.getInlineNodes = getInlineNodes;

},{"./Parse":8,"./Tokenize":17}],5:[function(require,module,exports){
"use strict";
var TextConsumer_1 = require('../TextConsumer');
var Token_1 = require('./Token');
var TextHelpers_1 = require('../TextHelpers');
function getMediaTokenizer(mediaConvention) {
    var tokenMeaningForStartAndDescription = mediaConvention.tokenMeaningForStartAndDescription, tokenMeaningForUrlAndEnd = mediaConvention.tokenMeaningForUrlAndEnd;
    var mediaStartPattern = new RegExp("^\\[" + mediaConvention.facePattern + ":");
    return function tokenizeMedia(args) {
        var consumer = new TextConsumer_1.TextConsumer(args.text);
        var doesSatisfyStartPattern = consumer.consumeIfMatchesPattern({ pattern: mediaStartPattern });
        if (!doesSatisfyStartPattern) {
            return false;
        }
        var description;
        var didFindUrlArrow = consumer.consume({
            upTo: ' -> ',
            then: function (match) { return description = TextHelpers_1.applyBackslashEscaping(match); }
        });
        if (!didFindUrlArrow) {
            return false;
        }
        var url;
        var didFindClosingBracket = consumer.consume({
            upTo: ']',
            then: function (match) { return url = TextHelpers_1.applyBackslashEscaping(match); }
        });
        if (!didFindClosingBracket) {
            return false;
        }
        var tokens = [
            new Token_1.Token(tokenMeaningForStartAndDescription, description),
            new Token_1.Token(tokenMeaningForUrlAndEnd, url)
        ];
        args.then(consumer.lengthConsumed(), tokens);
        return true;
    };
}
exports.getMediaTokenizer = getMediaTokenizer;

},{"../TextConsumer":34,"../TextHelpers":35,"./Token":16}],6:[function(require,module,exports){
"use strict";
var MediaConvention = (function () {
    function MediaConvention(facePattern, NodeType, tokenMeaningForStartAndDescription, tokenMeaningForUrlAndEnd) {
        this.facePattern = facePattern;
        this.NodeType = NodeType;
        this.tokenMeaningForStartAndDescription = tokenMeaningForStartAndDescription;
        this.tokenMeaningForUrlAndEnd = tokenMeaningForUrlAndEnd;
    }
    return MediaConvention;
}());
exports.MediaConvention = MediaConvention;

},{}],7:[function(require,module,exports){
"use strict";
var Token_1 = require('./Token');
var MediaConvention_1 = require('./MediaConvention');
var AudioNode_1 = require('../../SyntaxNodes/AudioNode');
var ImageNode_1 = require('../../SyntaxNodes/ImageNode');
var VideoNode_1 = require('../../SyntaxNodes/VideoNode');
var AUDIO = new MediaConvention_1.MediaConvention('-_-', AudioNode_1.AudioNode, Token_1.TokenMeaning.AudioStartAndAudioDescription, Token_1.TokenMeaning.AudioUrlAndAudioEnd);
exports.AUDIO = AUDIO;
var IMAGE = new MediaConvention_1.MediaConvention('o_o', ImageNode_1.ImageNode, Token_1.TokenMeaning.ImageStartAndAudioDescription, Token_1.TokenMeaning.ImageUrlAndAudioEnd);
exports.IMAGE = IMAGE;
var VIDEO = new MediaConvention_1.MediaConvention('(?:-_o|o_-)', VideoNode_1.VideoNode, Token_1.TokenMeaning.VideoStartAndAudioDescription, Token_1.TokenMeaning.VideoUrlAndAudioEnd);
exports.VIDEO = VIDEO;

},{"../../SyntaxNodes/AudioNode":36,"../../SyntaxNodes/ImageNode":48,"../../SyntaxNodes/VideoNode":68,"./MediaConvention":6,"./Token":16}],8:[function(require,module,exports){
"use strict";
var InlineCodeNode_1 = require('../../SyntaxNodes/InlineCodeNode');
var LinkNode_1 = require('../../SyntaxNodes/LinkNode');
var PlainTextNode_1 = require('../../SyntaxNodes/PlainTextNode');
var CollectionHelpers_1 = require('../CollectionHelpers');
var Token_1 = require('./Token');
var MediaConventions_1 = require('./MediaConventions');
var SandwichConventions_1 = require('./SandwichConventions');
var ParseResult = (function () {
    function ParseResult(nodes, countTokensParsed) {
        this.nodes = nodes;
        this.countTokensParsed = countTokensParsed;
    }
    return ParseResult;
}());
exports.ParseResult = ParseResult;
function parse(tokens) {
    return parseUntil(tokens).nodes;
}
exports.parse = parse;
var SANDWICHES = [
    SandwichConventions_1.STRESS,
    SandwichConventions_1.EMPHASIS,
    SandwichConventions_1.REVISION_DELETION,
    SandwichConventions_1.REVISION_INSERTION,
    SandwichConventions_1.SPOILER,
    SandwichConventions_1.FOOTNOTE
];
var MEDIA_CONVENTIONS = [
    MediaConventions_1.AUDIO,
    MediaConventions_1.IMAGE,
    MediaConventions_1.VIDEO
];
function parseUntil(tokens, terminator) {
    var nodes = [];
    var stillNeedsTerminator = !!terminator;
    var countParsed = 0;
    MainParserLoop: for (var index = 0; index < tokens.length; index++) {
        var token = tokens[index];
        countParsed = index + 1;
        if (token.meaning === terminator) {
            stillNeedsTerminator = false;
            break;
        }
        switch (token.meaning) {
            case Token_1.TokenMeaning.PlainText: {
                var lastNode = CollectionHelpers_1.last(nodes);
                if (lastNode instanceof PlainTextNode_1.PlainTextNode) {
                    lastNode.text += token.value;
                }
                else {
                    nodes.push(new PlainTextNode_1.PlainTextNode(token.value));
                }
                continue;
            }
            case Token_1.TokenMeaning.InlineCode: {
                if (token.value) {
                    nodes.push(new InlineCodeNode_1.InlineCodeNode(token.value));
                }
                continue;
            }
            case Token_1.TokenMeaning.LinkStart: {
                var result = parseUntil(tokens.slice(countParsed), Token_1.TokenMeaning.LinkUrlAndLinkEnd);
                index += result.countTokensParsed;
                var contents = result.nodes;
                var hasContents = isNotPureWhitespace(contents);
                var url = tokens[index].value.trim();
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
        }
        for (var _i = 0, MEDIA_CONVENTIONS_1 = MEDIA_CONVENTIONS; _i < MEDIA_CONVENTIONS_1.length; _i++) {
            var media = MEDIA_CONVENTIONS_1[_i];
            if (token.meaning === media.tokenMeaningForStartAndDescription) {
                var description = token.value.trim();
                index += 1;
                var url = tokens[index].value.trim();
                if (!url) {
                    continue MainParserLoop;
                }
                if (!description) {
                    description = url;
                }
                nodes.push(new media.NodeType(description, url));
                continue MainParserLoop;
            }
        }
        for (var _a = 0, SANDWICHES_1 = SANDWICHES; _a < SANDWICHES_1.length; _a++) {
            var sandwich = SANDWICHES_1[_a];
            if (token.meaning === sandwich.convention.startTokenMeaning()) {
                var result = parseUntil(tokens.slice(countParsed), sandwich.convention.endTokenMeaning());
                index += result.countTokensParsed;
                if (result.nodes.length) {
                    nodes.push(new sandwich.NodeType(result.nodes));
                }
                continue MainParserLoop;
            }
        }
    }
    if (stillNeedsTerminator) {
        throw new Error('Missing token');
    }
    return new ParseResult(nodes, countParsed);
}
function isNotPureWhitespace(nodes) {
    return !nodes.every(PlainTextNode_1.isWhitespace);
}

},{"../../SyntaxNodes/InlineCodeNode":49,"../../SyntaxNodes/LinkNode":53,"../../SyntaxNodes/PlainTextNode":59,"../CollectionHelpers":1,"./MediaConventions":7,"./SandwichConventions":15,"./Token":16}],9:[function(require,module,exports){
"use strict";
var Token_1 = require('.././Token');
var RaisedVoiceMarker_1 = require('./RaisedVoiceMarker');
var StartMarker_1 = require('./StartMarker');
var EndMarker_1 = require('./EndMarker');
var PlainTextMarker_1 = require('./PlainTextMarker');
function applyRaisedVoices(tokens) {
    var markers = getMarkers(tokens);
    return replacePlaceholderTokens(tokens, markers);
}
exports.applyRaisedVoices = applyRaisedVoices;
function getMarkers(tokens) {
    var markers = [];
    for (var tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
        var token = tokens[tokenIndex];
        var meaning = token.meaning, value = token.value;
        var canStartConvention = (meaning === Token_1.TokenMeaning.PotentialRaisedVoiceStart
            || meaning === Token_1.TokenMeaning.PotentialRaisedVoiceStartOrEnd);
        var canEndConvention = (meaning === Token_1.TokenMeaning.PotentialRaisedVoiceEnd
            || meaning === Token_1.TokenMeaning.PotentialRaisedVoiceStartOrEnd);
        var isTokenRelevant = canStartConvention || canEndConvention;
        if (!isTokenRelevant) {
            continue;
        }
        if (canEndConvention) {
            var endMarker = new EndMarker_1.EndMarker(tokenIndex, value);
            endMarker.matchAnyApplicableStartMarkers(markers);
            if (!endMarker.providesNoTokens()) {
                markers.push(endMarker);
                continue;
            }
        }
        if (canStartConvention) {
            markers.push(new StartMarker_1.StartMarker(tokenIndex, value));
        }
        else {
            markers.push(new PlainTextMarker_1.PlainTextMarker(tokenIndex, value));
        }
    }
    var withFailedMarkersTreatedAsPlainText = markers.map(function (marker) {
        return marker.providesNoTokens()
            ? new PlainTextMarker_1.PlainTextMarker(marker.originalTokenIndex, marker.originalValue)
            : marker;
    });
    return withFailedMarkersTreatedAsPlainText;
}
function replacePlaceholderTokens(tokens, markers) {
    var resultTokens = tokens.slice();
    for (var _i = 0, _a = markers.sort(RaisedVoiceMarker_1.comapreMarkersDescending); _i < _a.length; _i++) {
        var marker = _a[_i];
        resultTokens.splice.apply(resultTokens, [marker.originalTokenIndex, 1].concat(marker.tokens()));
    }
    return resultTokens;
}

},{".././Token":16,"./EndMarker":10,"./PlainTextMarker":11,"./RaisedVoiceMarker":12,"./StartMarker":13}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Token_1 = require('.././Token');
var RaisedVoiceMarker_1 = require('./RaisedVoiceMarker');
var StartMarker_1 = require('./StartMarker');
var EndMarker = (function (_super) {
    __extends(EndMarker, _super);
    function EndMarker() {
        _super.apply(this, arguments);
    }
    EndMarker.prototype.tokens = function () {
        return this.tokenMeanings.map(function (meaning) { return new Token_1.Token(meaning); });
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
        var countAsterisksStartMarkerHasInCommon = Math.min(this.countSurplusAsterisks, startMarker.countSurplusAsterisks);
        this.payForStressAndEmphasisTogether(countAsterisksStartMarkerHasInCommon);
        this.tokenMeanings.push(Token_1.TokenMeaning.EmphasisEnd);
        this.tokenMeanings.push(Token_1.TokenMeaning.StressEnd);
        startMarker.startStressAndEmphasisTogether(countAsterisksStartMarkerHasInCommon);
    };
    EndMarker.prototype.endStress = function (startMarker) {
        this.payForStress();
        this.tokenMeanings.push(Token_1.TokenMeaning.StressEnd);
        startMarker.startStress();
    };
    EndMarker.prototype.endEmphasis = function (startMarker) {
        this.payForEmphasis();
        this.tokenMeanings.push(Token_1.TokenMeaning.EmphasisEnd);
        startMarker.startEmphasis();
    };
    return EndMarker;
}(RaisedVoiceMarker_1.RaisedVoiceMarker));
exports.EndMarker = EndMarker;

},{".././Token":16,"./RaisedVoiceMarker":12,"./StartMarker":13}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Token_1 = require('.././Token');
var RaisedVoiceMarker_1 = require('./RaisedVoiceMarker');
var PlainTextMarker = (function (_super) {
    __extends(PlainTextMarker, _super);
    function PlainTextMarker() {
        _super.apply(this, arguments);
    }
    PlainTextMarker.prototype.tokens = function () {
        return [new Token_1.Token(Token_1.TokenMeaning.PlainText, this.originalValue)];
    };
    return PlainTextMarker;
}(RaisedVoiceMarker_1.RaisedVoiceMarker));
exports.PlainTextMarker = PlainTextMarker;

},{".././Token":16,"./RaisedVoiceMarker":12}],12:[function(require,module,exports){
"use strict";
var SandwichConventions_1 = require('../SandwichConventions');
var STRESS_COST = SandwichConventions_1.STRESS.start.length;
var EMPHASIS_COST = SandwichConventions_1.EMPHASIS.start.length;
var STRESS_AND_EMPHASIS_TOGETHER_COST = STRESS_COST + EMPHASIS_COST;
var RaisedVoiceMarker = (function () {
    function RaisedVoiceMarker(originalTokenIndex, originalValue) {
        this.originalTokenIndex = originalTokenIndex;
        this.originalValue = originalValue;
        this.tokenMeanings = [];
        this.countSurplusAsterisks = originalValue.length;
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
    RaisedVoiceMarker.prototype.payForStressAndEmphasisTogether = function (countAsterisksMatchingDelimiterHasInCommon) {
        if (countAsterisksMatchingDelimiterHasInCommon < STRESS_AND_EMPHASIS_TOGETHER_COST) {
            throw new Error("Delimiter at index " + this.originalTokenIndex + " only spent " + countAsterisksMatchingDelimiterHasInCommon + " to open stress and emphasis");
        }
        this.pay(countAsterisksMatchingDelimiterHasInCommon);
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

},{"../SandwichConventions":15}],13:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Token_1 = require('.././Token');
var RaisedVoiceMarker_1 = require('./RaisedVoiceMarker');
var StartMarker = (function (_super) {
    __extends(StartMarker, _super);
    function StartMarker() {
        _super.apply(this, arguments);
    }
    StartMarker.prototype.tokens = function () {
        return (this.tokenMeanings
            .map(function (meaning) { return new Token_1.Token(meaning); })
            .reverse());
    };
    StartMarker.prototype.startStressAndEmphasisTogether = function (countAsterisksEndMarkerHasInCommon) {
        this.payForStressAndEmphasisTogether(countAsterisksEndMarkerHasInCommon);
        this.tokenMeanings.push(Token_1.TokenMeaning.EmphasisStart);
        this.tokenMeanings.push(Token_1.TokenMeaning.StressStart);
    };
    StartMarker.prototype.startStress = function () {
        this.payForStress();
        this.tokenMeanings.push(Token_1.TokenMeaning.StressStart);
    };
    StartMarker.prototype.startEmphasis = function () {
        this.payForEmphasis();
        this.tokenMeanings.push(Token_1.TokenMeaning.EmphasisStart);
    };
    return StartMarker;
}(RaisedVoiceMarker_1.RaisedVoiceMarker));
exports.StartMarker = StartMarker;

},{".././Token":16,"./RaisedVoiceMarker":12}],14:[function(require,module,exports){
"use strict";
var SandwichConvention = (function () {
    function SandwichConvention(start, end, NodeType, convention) {
        this.start = start;
        this.end = end;
        this.NodeType = NodeType;
        this.convention = convention;
    }
    return SandwichConvention;
}());
exports.SandwichConvention = SandwichConvention;

},{}],15:[function(require,module,exports){
"use strict";
var SandwichConvention_1 = require('./SandwichConvention');
var Token_1 = require('./Token');
var Convention_1 = require('./Convention');
var StressNode_1 = require('../../SyntaxNodes/StressNode');
var EmphasisNode_1 = require('../../SyntaxNodes/EmphasisNode');
var SpoilerNode_1 = require('../../SyntaxNodes/SpoilerNode');
var FootnoteNode_1 = require('../../SyntaxNodes/FootnoteNode');
var RevisionDeletionNode_1 = require('../../SyntaxNodes/RevisionDeletionNode');
var RevisionInsertionNode_1 = require('../../SyntaxNodes/RevisionInsertionNode');
function sandwich(start, end, NodeType, startMeaning, endMeaning) {
    return new SandwichConvention_1.SandwichConvention(start, end, NodeType, new Convention_1.Convention(startMeaning, endMeaning));
}
var STRESS = sandwich('**', '**', StressNode_1.StressNode, Token_1.TokenMeaning.StressStart, Token_1.TokenMeaning.StressEnd);
exports.STRESS = STRESS;
var EMPHASIS = sandwich('*', '*', EmphasisNode_1.EmphasisNode, Token_1.TokenMeaning.EmphasisStart, Token_1.TokenMeaning.EmphasisEnd);
exports.EMPHASIS = EMPHASIS;
var REVISION_DELETION = sandwich('~~', '~~', RevisionDeletionNode_1.RevisionDeletionNode, Token_1.TokenMeaning.RevisionDeletionStart, Token_1.TokenMeaning.RevisionDeletionEnd);
exports.REVISION_DELETION = REVISION_DELETION;
var REVISION_INSERTION = sandwich('++', '++', RevisionInsertionNode_1.RevisionInsertionNode, Token_1.TokenMeaning.RevisionInserionStart, Token_1.TokenMeaning.RevisionInsertionEnd);
exports.REVISION_INSERTION = REVISION_INSERTION;
var SPOILER = sandwich('[<_<]', '[>_>]', SpoilerNode_1.SpoilerNode, Token_1.TokenMeaning.SpoilerStart, Token_1.TokenMeaning.SpoilerEnd);
exports.SPOILER = SPOILER;
var FOOTNOTE = sandwich(' ((', '))', FootnoteNode_1.FootnoteNode, Token_1.TokenMeaning.FootnoteReferenceStart, Token_1.TokenMeaning.FootnoteReferenceEnd);
exports.FOOTNOTE = FOOTNOTE;

},{"../../SyntaxNodes/EmphasisNode":44,"../../SyntaxNodes/FootnoteNode":46,"../../SyntaxNodes/RevisionDeletionNode":60,"../../SyntaxNodes/RevisionInsertionNode":61,"../../SyntaxNodes/SpoilerNode":64,"../../SyntaxNodes/StressNode":65,"./Convention":2,"./SandwichConvention":14,"./Token":16}],16:[function(require,module,exports){
"use strict";
(function (TokenMeaning) {
    TokenMeaning[TokenMeaning["PlainText"] = 0] = "PlainText";
    TokenMeaning[TokenMeaning["EmphasisStart"] = 1] = "EmphasisStart";
    TokenMeaning[TokenMeaning["EmphasisEnd"] = 2] = "EmphasisEnd";
    TokenMeaning[TokenMeaning["StressStart"] = 3] = "StressStart";
    TokenMeaning[TokenMeaning["StressEnd"] = 4] = "StressEnd";
    TokenMeaning[TokenMeaning["InlineCode"] = 5] = "InlineCode";
    TokenMeaning[TokenMeaning["RevisionDeletionStart"] = 6] = "RevisionDeletionStart";
    TokenMeaning[TokenMeaning["RevisionDeletionEnd"] = 7] = "RevisionDeletionEnd";
    TokenMeaning[TokenMeaning["RevisionInserionStart"] = 8] = "RevisionInserionStart";
    TokenMeaning[TokenMeaning["RevisionInsertionEnd"] = 9] = "RevisionInsertionEnd";
    TokenMeaning[TokenMeaning["SpoilerStart"] = 10] = "SpoilerStart";
    TokenMeaning[TokenMeaning["SpoilerEnd"] = 11] = "SpoilerEnd";
    TokenMeaning[TokenMeaning["FootnoteReferenceStart"] = 12] = "FootnoteReferenceStart";
    TokenMeaning[TokenMeaning["FootnoteReferenceEnd"] = 13] = "FootnoteReferenceEnd";
    TokenMeaning[TokenMeaning["LinkStart"] = 14] = "LinkStart";
    TokenMeaning[TokenMeaning["LinkUrlAndLinkEnd"] = 15] = "LinkUrlAndLinkEnd";
    TokenMeaning[TokenMeaning["AudioStartAndAudioDescription"] = 16] = "AudioStartAndAudioDescription";
    TokenMeaning[TokenMeaning["AudioUrlAndAudioEnd"] = 17] = "AudioUrlAndAudioEnd";
    TokenMeaning[TokenMeaning["ImageStartAndAudioDescription"] = 18] = "ImageStartAndAudioDescription";
    TokenMeaning[TokenMeaning["ImageUrlAndAudioEnd"] = 19] = "ImageUrlAndAudioEnd";
    TokenMeaning[TokenMeaning["VideoStartAndAudioDescription"] = 20] = "VideoStartAndAudioDescription";
    TokenMeaning[TokenMeaning["VideoUrlAndAudioEnd"] = 21] = "VideoUrlAndAudioEnd";
    TokenMeaning[TokenMeaning["PotentialRaisedVoiceStart"] = 22] = "PotentialRaisedVoiceStart";
    TokenMeaning[TokenMeaning["PotentialRaisedVoiceEnd"] = 23] = "PotentialRaisedVoiceEnd";
    TokenMeaning[TokenMeaning["PotentialRaisedVoiceStartOrEnd"] = 24] = "PotentialRaisedVoiceStartOrEnd";
})(exports.TokenMeaning || (exports.TokenMeaning = {}));
var TokenMeaning = exports.TokenMeaning;
var Token = (function () {
    function Token(meaning, valueOrConsumerBefore) {
        this.meaning = meaning;
        if (typeof valueOrConsumerBefore === 'string') {
            this.value = valueOrConsumerBefore;
        }
        else {
            this.consumerBefore = valueOrConsumerBefore;
        }
    }
    Token.prototype.textIndex = function () {
        return this.consumerBefore.lengthConsumed();
    };
    return Token;
}());
exports.Token = Token;

},{}],17:[function(require,module,exports){
"use strict";
var Convention_1 = require('./Convention');
var TextConsumer_1 = require('../TextConsumer');
var CollectionHelpers_1 = require('../CollectionHelpers');
var Token_1 = require('./Token');
var FailureTracker_1 = require('./FailureTracker');
var TextHelpers_1 = require('../TextHelpers');
var ApplyRaisedVoices_1 = require('./RaisedVoices/ApplyRaisedVoices');
var GetMediaTokenizer_1 = require('./GetMediaTokenizer');
var MediaConventions_1 = require('./MediaConventions');
var SandwichConventions_1 = require('./SandwichConventions');
function tokenize(text) {
    return new Tokenizer(text).tokens;
}
exports.tokenize = tokenize;
var LINK = new Convention_1.Convention(Token_1.TokenMeaning.LinkStart, Token_1.TokenMeaning.LinkUrlAndLinkEnd);
var REGULAR_SANDWICHES = [
    SandwichConventions_1.REVISION_DELETION,
    SandwichConventions_1.REVISION_INSERTION,
    SandwichConventions_1.SPOILER,
    SandwichConventions_1.FOOTNOTE
];
var ALL_SANDWICHES = REGULAR_SANDWICHES.concat(SandwichConventions_1.STRESS, SandwichConventions_1.EMPHASIS);
var POTENTIALLY_UNCLOSED_CONVENTIONS = [LINK].concat(REGULAR_SANDWICHES.map(function (sandwich) { return sandwich.convention; }));
var MEDIA_TOKENIZERS = [
    MediaConventions_1.AUDIO,
    MediaConventions_1.IMAGE,
    MediaConventions_1.VIDEO
].map(function (mediaConvention) { return GetMediaTokenizer_1.getMediaTokenizer(mediaConvention); });
var Tokenizer = (function () {
    function Tokenizer(text) {
        this.tokens = [];
        this.failureTracker = new FailureTracker_1.FailureTracker();
        this.consumer = new TextConsumer_1.TextConsumer(text);
        while (true) {
            if (this.consumer.done()) {
                if (this.backtrackIfAnyConventionsAreUnclosed()) {
                    continue;
                }
                break;
            }
            var wasAnythingDiscovered = (this.tokenizeInlineCode()
                || this.tokenizeRaisedVoicePlaceholders()
                || this.handleRegularSandwiches()
                || this.tokenizeMedia()
                || this.handleLink());
            if (wasAnythingDiscovered) {
                continue;
            }
            this.addPlainTextToken(this.consumer.escapedCurrentChar());
            this.consumer.moveNext();
        }
        this.tokens = ApplyRaisedVoices_1.applyRaisedVoices(this.tokens);
        this.massageTokensIntoTreeStructure();
    }
    Tokenizer.prototype.massageTokensIntoTreeStructure = function () {
        this.massageSandwichesIntoTreeStructure();
        this.splitAnySandwichThatOverlapsWithLinks();
    };
    Tokenizer.prototype.massageSandwichesIntoTreeStructure = function () {
        var unclosedSandwiches = [];
        for (var tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
            var token = this.tokens[tokenIndex];
            var sandwichStartedByThisToken = getSandwichStartedByThisToken(token);
            if (sandwichStartedByThisToken) {
                unclosedSandwiches.push(sandwichStartedByThisToken);
                continue;
            }
            var sandwichEndedByThisToken = getSandwichEndedByThisToken(token);
            if (!sandwichEndedByThisToken) {
                continue;
            }
            var overlappingFromMostRecentToLeast = [];
            for (var sandwichIndex = unclosedSandwiches.length - 1; sandwichIndex >= 0; sandwichIndex--) {
                var unclosedSandwich = unclosedSandwiches[sandwichIndex];
                if (unclosedSandwich === sandwichEndedByThisToken) {
                    unclosedSandwiches.splice(sandwichIndex, 1);
                    break;
                }
                overlappingFromMostRecentToLeast.push(unclosedSandwich);
            }
            this.closeAndReopenSandwichesAroundTokenAtIndex(tokenIndex, overlappingFromMostRecentToLeast);
            var countOverlapping = overlappingFromMostRecentToLeast.length;
            tokenIndex += (2 * countOverlapping);
        }
    };
    Tokenizer.prototype.splitAnySandwichThatOverlapsWithLinks = function () {
        for (var tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
            if (this.tokens[tokenIndex].meaning !== Token_1.TokenMeaning.LinkStart) {
                continue;
            }
            var linkStartIndex = tokenIndex;
            var linkEndIndex = void 0;
            for (var i = linkStartIndex + 1; i < this.tokens.length; i++) {
                if (this.tokens[i].meaning === Token_1.TokenMeaning.LinkUrlAndLinkEnd) {
                    linkEndIndex = i;
                    break;
                }
            }
            var overlappingStartingBefore = [];
            var overlappingStartingInside = [];
            for (var insideLinkIndex = linkStartIndex + 1; insideLinkIndex < linkEndIndex; insideLinkIndex++) {
                var token = this.tokens[insideLinkIndex];
                var sandwichStartedByThisToken = getSandwichStartedByThisToken(token);
                if (sandwichStartedByThisToken) {
                    overlappingStartingInside.push(sandwichStartedByThisToken);
                    continue;
                }
                var sandwichEndedByThisToken = getSandwichEndedByThisToken(token);
                if (sandwichEndedByThisToken) {
                    if (overlappingStartingInside.length) {
                        overlappingStartingInside.pop();
                        continue;
                    }
                    overlappingStartingBefore.push(sandwichEndedByThisToken);
                }
            }
            this.closeAndReopenSandwichesAroundTokenAtIndex(linkEndIndex, overlappingStartingInside);
            this.closeAndReopenSandwichesAroundTokenAtIndex(linkStartIndex, overlappingStartingBefore);
            var countTokensAdded = (2 * overlappingStartingBefore.length) + (2 * overlappingStartingInside.length);
            tokenIndex = linkEndIndex + countTokensAdded;
        }
    };
    Tokenizer.prototype.closeAndReopenSandwichesAroundTokenAtIndex = function (index, sandwichesInTheOrderTheyShouldClose) {
        var startTokensToAdd = sandwichesInTheOrderTheyShouldClose
            .map(function (sandwich) { return new Token_1.Token(sandwich.convention.startTokenMeaning()); })
            .reverse();
        var endTokensToAdd = sandwichesInTheOrderTheyShouldClose
            .map(function (sandwich) { return new Token_1.Token(sandwich.convention.endTokenMeaning()); });
        this.insertTokens(index + 1, startTokensToAdd);
        this.insertTokens(index, endTokensToAdd);
    };
    Tokenizer.prototype.backtrackIfAnyConventionsAreUnclosed = function () {
        for (var i = 0; i < this.tokens.length; i++) {
            if (this.isTokenStartOfUnclosedConvention(i)) {
                this.backtrack(i);
                return true;
            }
        }
        return false;
    };
    Tokenizer.prototype.tokenizeInlineCode = function () {
        var _this = this;
        return this.consumer.consume({
            from: '`',
            upTo: '`',
            then: function (code) { return _this.addToken(Token_1.TokenMeaning.InlineCode, TextHelpers_1.applyBackslashEscaping(code)); }
        });
    };
    Tokenizer.prototype.tokenizeMedia = function () {
        var _this = this;
        for (var _i = 0, MEDIA_TOKENIZERS_1 = MEDIA_TOKENIZERS; _i < MEDIA_TOKENIZERS_1.length; _i++) {
            var tokenizeMedia = MEDIA_TOKENIZERS_1[_i];
            var wasMediaFound = tokenizeMedia({
                text: this.consumer.remainingText(),
                then: function (lengthConsumed, tokens) {
                    _this.consumer.skip(lengthConsumed);
                    (_a = _this.tokens).push.apply(_a, tokens);
                    var _a;
                }
            });
            if (wasMediaFound) {
                return true;
            }
        }
        return false;
    };
    Tokenizer.prototype.tokenizeRaisedVoicePlaceholders = function () {
        var originalTextIndex = this.consumer.lengthConsumed();
        var raisedVoiceDelimiter;
        var didMatchRaisedVoiceDelimiter = this.consumer.consumeIfMatchesPattern({
            pattern: /^\*+/,
            then: function (match) { raisedVoiceDelimiter = match; }
        });
        if (!didMatchRaisedVoiceDelimiter) {
            return false;
        }
        var prevRawCharacter = this.consumer.at(originalTextIndex - 1);
        var NON_WHITESPACE = /\S/;
        var canCloseConvention = NON_WHITESPACE.test(prevRawCharacter);
        var nextRawChar = this.consumer.currentChar();
        var canOpenConvention = NON_WHITESPACE.test(nextRawChar);
        var meaning;
        if (canOpenConvention && canCloseConvention) {
            meaning = Token_1.TokenMeaning.PotentialRaisedVoiceStartOrEnd;
        }
        else if (canOpenConvention) {
            meaning = Token_1.TokenMeaning.PotentialRaisedVoiceStart;
        }
        else if (canCloseConvention) {
            meaning = Token_1.TokenMeaning.PotentialRaisedVoiceEnd;
        }
        else {
            this.addPlainTextToken(raisedVoiceDelimiter);
            return true;
        }
        this.addToken(meaning, raisedVoiceDelimiter);
        return true;
    };
    Tokenizer.prototype.handleRegularSandwiches = function () {
        var textIndex = this.consumer.lengthConsumed();
        for (var _i = 0, REGULAR_SANDWICHES_1 = REGULAR_SANDWICHES; _i < REGULAR_SANDWICHES_1.length; _i++) {
            var sandwich = REGULAR_SANDWICHES_1[_i];
            if (this.isInside(sandwich.convention) && this.consumer.consumeIfMatches(sandwich.end)) {
                this.addToken(sandwich.convention.endTokenMeaning());
                return true;
            }
            var foundStartToken = (!this.failureTracker.hasConventionFailed(sandwich.convention, textIndex)
                && this.consumer.consumeIfMatches(sandwich.start));
            if (foundStartToken) {
                this.addToken(sandwich.convention.startTokenMeaning(), this.consumer.asBeforeMatch(sandwich.start.length));
                return true;
            }
        }
        return false;
    };
    Tokenizer.prototype.handleLink = function () {
        var _this = this;
        var textIndex = this.consumer.lengthConsumed();
        if (this.failureTracker.hasConventionFailed(LINK, textIndex)) {
            return false;
        }
        if (!this.isInside(LINK)) {
            var LINK_START = '[';
            if (this.consumer.consumeIfMatches(LINK_START)) {
                this.addToken(Token_1.TokenMeaning.LinkStart, this.consumer.asBeforeMatch(LINK_START.length));
                this.countUnclosedSquareBracketsAtLinkStart = this.consumer.countUnclosedSquareBracket;
                return true;
            }
            return false;
        }
        if (this.consumer.consumeIfMatches(' -> ')) {
            if (this.consumer.countUnclosedSquareBracket !== this.countUnclosedSquareBracketsAtLinkStart) {
                this.undoLatest(LINK);
                return true;
            }
            var didFindClosingBracket = this.consumer.consume({
                upTo: ']',
                then: function (url) { return _this.addToken(Token_1.TokenMeaning.LinkUrlAndLinkEnd, TextHelpers_1.applyBackslashEscaping(url)); }
            });
            if (!didFindClosingBracket) {
                this.undoLatest(LINK);
            }
            return true;
        }
        if (this.consumer.consumeIfMatches(']')) {
            this.undoLatest(LINK);
            return true;
        }
        return false;
    };
    Tokenizer.prototype.addToken = function (meaning, valueOrConsumerBefore) {
        this.tokens.push(new Token_1.Token(meaning, valueOrConsumerBefore));
    };
    Tokenizer.prototype.addPlainTextToken = function (text) {
        var lastToken = CollectionHelpers_1.last(this.tokens);
        if (lastToken && (lastToken.meaning === Token_1.TokenMeaning.PlainText)) {
            lastToken.value += text;
        }
        else {
            this.tokens.push(new Token_1.Token(Token_1.TokenMeaning.PlainText, text));
        }
    };
    Tokenizer.prototype.undoLatest = function (convention) {
        this.backtrack(this.indexOfStartOfLatestInstanceOfConvention(convention));
    };
    Tokenizer.prototype.backtrack = function (indexOfEarliestTokenToUndo) {
        var token = this.tokens[indexOfEarliestTokenToUndo];
        var meaning = token.meaning;
        this.failureTracker.registerFailure(token.meaning, token.textIndex());
        this.consumer = token.consumerBefore;
        this.tokens.splice(indexOfEarliestTokenToUndo);
    };
    Tokenizer.prototype.isTokenStartOfUnclosedConvention = function (index) {
        var token = this.tokens[index];
        for (var _i = 0, POTENTIALLY_UNCLOSED_CONVENTIONS_1 = POTENTIALLY_UNCLOSED_CONVENTIONS; _i < POTENTIALLY_UNCLOSED_CONVENTIONS_1.length; _i++) {
            var convention = POTENTIALLY_UNCLOSED_CONVENTIONS_1[_i];
            if (token.meaning === convention.startTokenMeaning()) {
                return this.isConventionAtIndexUnclosed(convention, index);
            }
        }
        return false;
    };
    Tokenizer.prototype.isInside = function (convention) {
        var excessStartTokens = 0;
        for (var _i = 0, _a = this.tokens; _i < _a.length; _i++) {
            var token = _a[_i];
            if (token.meaning === convention.startTokenMeaning()) {
                excessStartTokens += 1;
            }
            else if (token.meaning === convention.endTokenMeaning()) {
                excessStartTokens -= 1;
            }
        }
        return excessStartTokens > 0;
    };
    Tokenizer.prototype.isConventionAtIndexUnclosed = function (convention, index) {
        var excessStartTokens = 1;
        var startIndex = index + 1;
        for (var i = startIndex; i < this.tokens.length; i++) {
            var token = this.tokens[i];
            if (token.meaning === convention.startTokenMeaning()) {
                excessStartTokens += 1;
            }
            else if (token.meaning === convention.endTokenMeaning()) {
                excessStartTokens -= 1;
            }
            if (excessStartTokens === 0) {
                return false;
            }
        }
        return true;
    };
    Tokenizer.prototype.indexOfStartOfLatestInstanceOfConvention = function (convention) {
        return this.indexOfLastTokenWithMeaning(convention.startTokenMeaning());
    };
    Tokenizer.prototype.indexOfLastTokenWithMeaning = function (meaning) {
        for (var i = this.tokens.length - 1; i >= 0; i--) {
            if (this.tokens[i].meaning === meaning) {
                return i;
            }
        }
        throw new Error('Missing token');
    };
    Tokenizer.prototype.insertTokens = function (index, tokens) {
        (_a = this.tokens).splice.apply(_a, [index, 0].concat(tokens));
        var _a;
    };
    return Tokenizer;
}());
function getSandwichStartedByThisToken(token) {
    return ALL_SANDWICHES.filter(function (sandwich) {
        return sandwich.convention.startTokenMeaning() === token.meaning;
    })[0];
}
function getSandwichEndedByThisToken(token) {
    return ALL_SANDWICHES.filter(function (sandwich) {
        return sandwich.convention.endTokenMeaning() === token.meaning;
    })[0];
}

},{"../CollectionHelpers":1,"../TextConsumer":34,"../TextHelpers":35,"./Convention":2,"./FailureTracker":3,"./GetMediaTokenizer":5,"./MediaConventions":7,"./RaisedVoices/ApplyRaisedVoices":9,"./SandwichConventions":15,"./Token":16}],18:[function(require,module,exports){
"use strict";
var TextConsumer_1 = require('../TextConsumer');
var HeadingNode_1 = require('../../SyntaxNodes/HeadingNode');
var Patterns_1 = require('./Patterns');
var GetInlineNodes_1 = require('../Inline/GetInlineNodes');
var IsLineFancyOutlineConvention_1 = require('./IsLineFancyOutlineConvention');
var HeadingLeveler_1 = require('./HeadingLeveler');
var NON_BLANK_PATTERN = new RegExp(Patterns_1.NON_BLANK);
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);
function getHeadingParser(headingLeveler) {
    return function parseHeading(args) {
        var consumer = new TextConsumer_1.TextConsumer(args.text);
        var optionalOverline;
        consumer.consumeLine({
            pattern: STREAK_PATTERN,
            then: function (line) { return optionalOverline = line; }
        });
        var content;
        var underline;
        var hasContentAndUnderline = (consumer.consumeLine({
            pattern: NON_BLANK_PATTERN,
            then: function (line) { return content = line; }
        })
            && consumer.consumeLine({
                if: function (line) { return (STREAK_PATTERN.test(line)
                    && HeadingLeveler_1.isUnderlineConsistentWithOverline(optionalOverline, line)); },
                then: function (line) { return underline = line; }
            }));
        if (!hasContentAndUnderline) {
            return false;
        }
        if (IsLineFancyOutlineConvention_1.isLineFancyOutlineConvention(content)) {
            return false;
        }
        var headingLevel = headingLeveler.registerUnderlineAndGetLevel(underline);
        args.then([new HeadingNode_1.HeadingNode(GetInlineNodes_1.getInlineNodes(content), headingLevel)], consumer.lengthConsumed());
        return true;
    };
}
exports.getHeadingParser = getHeadingParser;

},{"../../SyntaxNodes/HeadingNode":47,"../Inline/GetInlineNodes":4,"../TextConsumer":34,"./HeadingLeveler":21,"./IsLineFancyOutlineConvention":22,"./Patterns":31}],19:[function(require,module,exports){
"use strict";
var SectionSeparatorNode_1 = require('../../SyntaxNodes/SectionSeparatorNode');
var TextConsumer_1 = require('../TextConsumer');
var ParseSectionSeparatorStreak_1 = require('./ParseSectionSeparatorStreak');
var GetHeadingParser_1 = require('./GetHeadingParser');
var ParseBlankLineSeparation_1 = require('./ParseBlankLineSeparation');
var ParseRegularLines_1 = require('./ParseRegularLines');
var ParseCodeBlock_1 = require('./ParseCodeBlock');
var ParseBlockquote_1 = require('./ParseBlockquote');
var ParseUnorderedList_1 = require('./ParseUnorderedList');
var ParseOrderedList_1 = require('./ParseOrderedList');
var ParseDescriptionList_1 = require('./ParseDescriptionList');
var Patterns_1 = require('./Patterns');
var CollectionHelpers_1 = require('../CollectionHelpers');
var HeadingLeveler_1 = require('./HeadingLeveler');
var LEADING_BLANK_LINES_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.ANY_WHITESPACE + '\n'));
var TRAILING_WHITESPACE_PATTERN = new RegExp(Patterns_1.endsWith(Patterns_1.ANY_WHITESPACE));
function getOutlineNodes(text) {
    var headingParser = GetHeadingParser_1.getHeadingParser(new HeadingLeveler_1.HeadingLeveler());
    var outlineParsers = [
        ParseBlankLineSeparation_1.parseBlankLineSeparation,
        headingParser,
        ParseUnorderedList_1.parseUnorderedList,
        ParseOrderedList_1.parseOrderedList,
        ParseSectionSeparatorStreak_1.parseSectionSeparatorStreak,
        ParseCodeBlock_1.parseCodeBlock,
        ParseBlockquote_1.parseBlockquote,
        ParseDescriptionList_1.parseDescriptionList,
        ParseRegularLines_1.parseRegularLines,
    ];
    var trimmedText = text
        .replace(LEADING_BLANK_LINES_PATTERN, '')
        .replace(TRAILING_WHITESPACE_PATTERN, '');
    var consumer = new TextConsumer_1.TextConsumer(trimmedText);
    var nodes = [];
    while (!consumer.done()) {
        for (var _i = 0, outlineParsers_1 = outlineParsers; _i < outlineParsers_1.length; _i++) {
            var parseOutlineConvention = outlineParsers_1[_i];
            var didConventionParseSuccessfully = parseOutlineConvention({
                text: consumer.remainingText(),
                then: function (resultNodes, lengthParsed) {
                    nodes.push.apply(nodes, resultNodes);
                    consumer.skip(lengthParsed);
                }
            });
            if (didConventionParseSuccessfully) {
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

},{"../../SyntaxNodes/SectionSeparatorNode":63,"../CollectionHelpers":1,"../TextConsumer":34,"./GetHeadingParser":18,"./HeadingLeveler":21,"./ParseBlankLineSeparation":23,"./ParseBlockquote":24,"./ParseCodeBlock":25,"./ParseDescriptionList":26,"./ParseOrderedList":27,"./ParseRegularLines":28,"./ParseSectionSeparatorStreak":29,"./ParseUnorderedList":30,"./Patterns":31}],20:[function(require,module,exports){
"use strict";
var TextConsumer_1 = require('../TextConsumer');
var Patterns_1 = require('./Patterns');
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);
var BLANK_PATTERN = new RegExp(Patterns_1.BLANK);
var INDENTED_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.INDENT));
function getRemainingLinesOfListItem(args) {
    var consumer = new TextConsumer_1.TextConsumer(args.text);
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

},{"../TextConsumer":34,"./Patterns":31}],21:[function(require,module,exports){
"use strict";
var HeadingLeveler = (function () {
    function HeadingLeveler() {
        this.registeredUnderlineChars = [];
    }
    HeadingLeveler.prototype.registerUnderlineAndGetLevel = function (underline) {
        var underlineChars = getDistinctStreakChars(underline);
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
function isUnderlineConsistentWithOverline(overline, underline) {
    return !overline || (getDistinctStreakChars(overline) === getDistinctStreakChars(underline));
}
exports.isUnderlineConsistentWithOverline = isUnderlineConsistentWithOverline;
function getDistinctStreakChars(streak) {
    var allStreakChars = streak.trim().split('');
    var distinctUnderlineChars = allStreakChars
        .reduce(function (distinctChars, char) {
        var haveAlreadySeenChar = distinctChars.some(function (distinctChar) { return distinctChar === char; });
        return (haveAlreadySeenChar
            ? distinctChars
            : distinctChars.concat([char]));
    }, []);
    return distinctUnderlineChars.sort().join('');
}

},{}],22:[function(require,module,exports){
"use strict";
var ParseSectionSeparatorStreak_1 = require('./ParseSectionSeparatorStreak');
var ParseBlockquote_1 = require('./ParseBlockquote');
var ParseUnorderedList_1 = require('./ParseUnorderedList');
var ParseOrderedList_1 = require('./ParseOrderedList');
var SINGLE_LINE_OUTLINE_PARSERS = [
    ParseUnorderedList_1.parseUnorderedList,
    ParseOrderedList_1.parseOrderedList,
    ParseSectionSeparatorStreak_1.parseSectionSeparatorStreak,
    ParseBlockquote_1.parseBlockquote
];
function isLineFancyOutlineConvention(line) {
    return SINGLE_LINE_OUTLINE_PARSERS.some(function (parse) { return parse({ text: line, then: function () { } }); });
}
exports.isLineFancyOutlineConvention = isLineFancyOutlineConvention;

},{"./ParseBlockquote":24,"./ParseOrderedList":27,"./ParseSectionSeparatorStreak":29,"./ParseUnorderedList":30}],23:[function(require,module,exports){
"use strict";
var TextConsumer_1 = require('../TextConsumer');
var SectionSeparatorNode_1 = require('../../SyntaxNodes/SectionSeparatorNode');
var Patterns_1 = require('./Patterns');
var BLANK_PATTERN = new RegExp(Patterns_1.BLANK);
function parseBlankLineSeparation(args) {
    var consumer = new TextConsumer_1.TextConsumer(args.text);
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

},{"../../SyntaxNodes/SectionSeparatorNode":63,"../TextConsumer":34,"./Patterns":31}],24:[function(require,module,exports){
"use strict";
var TextConsumer_1 = require('../TextConsumer');
var BlockquoteNode_1 = require('../../SyntaxNodes/BlockquoteNode');
var GetOutlineNodes_1 = require('./GetOutlineNodes');
var Patterns_1 = require('./Patterns');
var BLOCKQUOTE_DELIMITER = '>' + Patterns_1.optional(Patterns_1.INLINE_WHITESPACE_CHAR);
var ALL_BLOCKQUOTE_DELIMITERS_PATTERN = new RegExp(Patterns_1.capture(Patterns_1.startsWith((Patterns_1.atLeast(1, BLOCKQUOTE_DELIMITER)))));
var FIRST_BLOCKQUOTE_DELIMITER_PATTERN = new RegExp(Patterns_1.startsWith(BLOCKQUOTE_DELIMITER));
var TRAILING_SPACE_PATTERN = new RegExp(Patterns_1.endsWith(Patterns_1.INLINE_WHITESPACE_CHAR));
function parseBlockquote(args) {
    var consumer = new TextConsumer_1.TextConsumer(args.text);
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
    args.then([new BlockquoteNode_1.BlockquoteNode(GetOutlineNodes_1.getOutlineNodes(blockquoteContent))], consumer.lengthConsumed());
    return true;
}
exports.parseBlockquote = parseBlockquote;
function isLineProperlyBlockquoted(line, delimiters) {
    return TRAILING_SPACE_PATTERN.test(delimiters) || (line === delimiters);
}

},{"../../SyntaxNodes/BlockquoteNode":37,"../TextConsumer":34,"./GetOutlineNodes":19,"./Patterns":31}],25:[function(require,module,exports){
"use strict";
var TextConsumer_1 = require('../TextConsumer');
var CodeBlockNode_1 = require('../../SyntaxNodes/CodeBlockNode');
var Patterns_1 = require('./Patterns');
var CODE_FENCE_PATTERN = new RegExp(Patterns_1.streakOf('`'));
function parseCodeBlock(args) {
    var consumer = new TextConsumer_1.TextConsumer(args.text);
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

},{"../../SyntaxNodes/CodeBlockNode":38,"../TextConsumer":34,"./Patterns":31}],26:[function(require,module,exports){
"use strict";
var TextConsumer_1 = require('../TextConsumer');
var DescriptionListItem_1 = require('../../SyntaxNodes/DescriptionListItem');
var DescriptionListNode_1 = require('../../SyntaxNodes/DescriptionListNode');
var DescriptionTerm_1 = require('../../SyntaxNodes/DescriptionTerm');
var Description_1 = require('../../SyntaxNodes/Description');
var GetInlineNodes_1 = require('../Inline/GetInlineNodes');
var GetOutlineNodes_1 = require('./GetOutlineNodes');
var IsLineFancyOutlineConvention_1 = require('./IsLineFancyOutlineConvention');
var Patterns_1 = require('./Patterns');
var GetRemainingLinesOfListItem_1 = require('./GetRemainingLinesOfListItem');
var NON_BLANK_PATTERN = new RegExp(Patterns_1.NON_BLANK);
var BLANK_PATTERN = new RegExp(Patterns_1.BLANK);
var INDENTED_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.INDENT));
function parseDescriptionList(args) {
    var consumer = new TextConsumer_1.TextConsumer(args.text);
    var listItemNodes = [];
    var lengthParsed = 0;
    var _loop_1 = function() {
        var rawTerms = [];
        while (!consumer.done()) {
            var isTerm = consumer.consumeLine({
                pattern: NON_BLANK_PATTERN,
                if: function (line) { return !INDENTED_PATTERN.test(line) && !IsLineFancyOutlineConvention_1.isLineFancyOutlineConvention(line); },
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
        GetRemainingLinesOfListItem_1.getRemainingLinesOfListItem({
            text: consumer.remainingText(),
            then: function (lines, lengthParsed, shouldTerminateList) {
                descriptionLines.push.apply(descriptionLines, lines);
                consumer.skip(lengthParsed);
                isListTerminated = shouldTerminateList;
            }
        });
        lengthParsed = consumer.lengthConsumed();
        var terms = rawTerms.map(function (term) { return new DescriptionTerm_1.DescriptionTerm(GetInlineNodes_1.getInlineNodes(term)); });
        var description = new Description_1.Description(GetOutlineNodes_1.getOutlineNodes(descriptionLines.join('\n')));
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

},{"../../SyntaxNodes/Description":39,"../../SyntaxNodes/DescriptionListItem":40,"../../SyntaxNodes/DescriptionListNode":41,"../../SyntaxNodes/DescriptionTerm":42,"../Inline/GetInlineNodes":4,"../TextConsumer":34,"./GetOutlineNodes":19,"./GetRemainingLinesOfListItem":20,"./IsLineFancyOutlineConvention":22,"./Patterns":31}],27:[function(require,module,exports){
"use strict";
var TextConsumer_1 = require('../TextConsumer');
var OrderedListNode_1 = require('../../SyntaxNodes/OrderedListNode');
var OrderedListItem_1 = require('../../SyntaxNodes/OrderedListItem');
var GetOutlineNodes_1 = require('./GetOutlineNodes');
var Patterns_1 = require('./Patterns');
var GetRemainingLinesOfListItem_1 = require('./GetRemainingLinesOfListItem');
var BULLETED_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.optional(' ')
    + Patterns_1.either('#', Patterns_1.capture(Patterns_1.either(Patterns_1.INTEGER, '#') + Patterns_1.either('\\.', '\\)')))
    + Patterns_1.INLINE_WHITESPACE_CHAR));
var INTEGER_FOLLOWED_BY_PERIOD_PATTERN = new RegExp(Patterns_1.INTEGER + '\\.');
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);
var BLANK_LINE_PATTERN = new RegExp(Patterns_1.BLANK);
var INDENTED_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.INDENT));
function parseOrderedList(args) {
    var consumer = new TextConsumer_1.TextConsumer(args.text);
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
        GetRemainingLinesOfListItem_1.getRemainingLinesOfListItem({
            text: consumer.remainingText(),
            then: function (lines, lengthParsed, shouldTerminateList) {
                (_a = rawListItem.lines).push.apply(_a, lines);
                consumer.skip(lengthParsed);
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
        return new OrderedListItem_1.OrderedListItem(GetOutlineNodes_1.getOutlineNodes(rawListItem.content()), getExplicitOrdinal(rawListItem));
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
var INTEGER_PATTERN = new RegExp(Patterns_1.capture(Patterns_1.INTEGER));
function getExplicitOrdinal(rawListItem) {
    var result = INTEGER_PATTERN.exec(rawListItem.bullet);
    return (result ? parseInt(result[1]) : null);
}

},{"../../SyntaxNodes/OrderedListItem":55,"../../SyntaxNodes/OrderedListNode":56,"../TextConsumer":34,"./GetOutlineNodes":19,"./GetRemainingLinesOfListItem":20,"./Patterns":31}],28:[function(require,module,exports){
"use strict";
var TextConsumer_1 = require('../TextConsumer');
var PlainTextNode_1 = require('../../SyntaxNodes/PlainTextNode');
var MediaSyntaxNode_1 = require('../../SyntaxNodes/MediaSyntaxNode');
var ParagraphNode_1 = require('../../SyntaxNodes/ParagraphNode');
var LineBlockNode_1 = require('../../SyntaxNodes/LineBlockNode');
var Line_1 = require('../../SyntaxNodes/Line');
var GetInlineNodes_1 = require('../Inline/GetInlineNodes');
var Patterns_1 = require('./Patterns');
var IsLineFancyOutlineConvention_1 = require('./IsLineFancyOutlineConvention');
var NON_BLANK_LINE_PATTERN = new RegExp(Patterns_1.NON_BLANK);
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);
function parseRegularLines(args) {
    var consumer = new TextConsumer_1.TextConsumer(args.text);
    var inlineNodesPerRegularLine = [];
    var regularLineNodes = [];
    var terminatingNodes = [];
    var _loop_1 = function() {
        var inlineNodes;
        var wasLineConsumed = consumer.consumeLine({
            pattern: NON_BLANK_LINE_PATTERN,
            if: function (line) { return !IsLineFancyOutlineConvention_1.isLineFancyOutlineConvention(line); },
            then: function (line) { return inlineNodes = GetInlineNodes_1.getInlineNodes(line); }
        });
        if (!wasLineConsumed || !inlineNodes.length) {
            return "break";
        }
        var doesLineConsistSolelyOfMediaConventions = (inlineNodes.every(function (node) { return PlainTextNode_1.isWhitespace(node) || isMediaSyntaxNode(node); })
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

},{"../../SyntaxNodes/Line":51,"../../SyntaxNodes/LineBlockNode":52,"../../SyntaxNodes/MediaSyntaxNode":54,"../../SyntaxNodes/ParagraphNode":58,"../../SyntaxNodes/PlainTextNode":59,"../Inline/GetInlineNodes":4,"../TextConsumer":34,"./IsLineFancyOutlineConvention":22,"./Patterns":31}],29:[function(require,module,exports){
"use strict";
var TextConsumer_1 = require('../TextConsumer');
var SectionSeparatorNode_1 = require('../../SyntaxNodes/SectionSeparatorNode');
var Patterns_1 = require('./Patterns');
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);
function parseSectionSeparatorStreak(args) {
    var consumer = new TextConsumer_1.TextConsumer(args.text);
    if (!consumer.consumeLine({ pattern: STREAK_PATTERN })) {
        return false;
    }
    args.then([new SectionSeparatorNode_1.SectionSeparatorNode()], consumer.lengthConsumed());
    return true;
}
exports.parseSectionSeparatorStreak = parseSectionSeparatorStreak;

},{"../../SyntaxNodes/SectionSeparatorNode":63,"../TextConsumer":34,"./Patterns":31}],30:[function(require,module,exports){
"use strict";
var TextConsumer_1 = require('../TextConsumer');
var UnorderedListNode_1 = require('../../SyntaxNodes/UnorderedListNode');
var UnorderedListItem_1 = require('../../SyntaxNodes/UnorderedListItem');
var GetOutlineNodes_1 = require('./GetOutlineNodes');
var GetRemainingLinesOfListItem_1 = require('./GetRemainingLinesOfListItem');
var Patterns_1 = require('./Patterns');
var BULLET_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.optional(' ') + Patterns_1.either('\\*', '-', '\\+') + Patterns_1.INLINE_WHITESPACE_CHAR));
var BLANK_LINE_PATTERN = new RegExp(Patterns_1.BLANK);
var INDENTED_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.INDENT));
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);
function parseUnorderedList(args) {
    var consumer = new TextConsumer_1.TextConsumer(args.text);
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
        GetRemainingLinesOfListItem_1.getRemainingLinesOfListItem({
            text: consumer.remainingText(),
            then: function (lines, lengthParsed, shouldTerminateList) {
                listItemLines.push.apply(listItemLines, lines);
                consumer.skip(lengthParsed);
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
        return new UnorderedListItem_1.UnorderedListItem(GetOutlineNodes_1.getOutlineNodes(listItemContents));
    });
    args.then([new UnorderedListNode_1.UnorderedListNode(listItems)], consumer.lengthConsumed());
    return true;
}
exports.parseUnorderedList = parseUnorderedList;

},{"../../SyntaxNodes/UnorderedListItem":66,"../../SyntaxNodes/UnorderedListNode":67,"../TextConsumer":34,"./GetOutlineNodes":19,"./GetRemainingLinesOfListItem":20,"./Patterns":31}],31:[function(require,module,exports){
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
var INLINE_WHITESPACE_CHAR = '[^\\S\\n]';
exports.INLINE_WHITESPACE_CHAR = INLINE_WHITESPACE_CHAR;
var ANY_WHITESPACE = any('\\s');
exports.ANY_WHITESPACE = ANY_WHITESPACE;
var INLINE_WHITESPACE = any('[^\\S\\n]');
var solely = function (pattern) { return '^' + pattern + INLINE_WHITESPACE + '$'; };
exports.solely = solely;
var streakOf = function (charPattern) { return solely(atLeast(3, charPattern)); };
exports.streakOf = streakOf;
var startsWith = function (pattern) { return '^' + pattern; };
exports.startsWith = startsWith;
var endsWith = function (pattern) { return pattern + '$'; };
exports.endsWith = endsWith;
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

},{}],32:[function(require,module,exports){
"use strict";
var GetOutlineNodes_1 = require('./Outline/GetOutlineNodes');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var ProduceFootnoteBlocks_1 = require('./ProduceFootnoteBlocks');
function parseDocument(text) {
    var documentNode = new DocumentNode_1.DocumentNode(GetOutlineNodes_1.getOutlineNodes(text));
    ProduceFootnoteBlocks_1.produceFootnoteBlocks(documentNode);
    return documentNode;
}
exports.parseDocument = parseDocument;

},{"../SyntaxNodes/DocumentNode":43,"./Outline/GetOutlineNodes":19,"./ProduceFootnoteBlocks":33}],33:[function(require,module,exports){
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
var CollectionHelpers_1 = require('./CollectionHelpers');
function produceFootnoteBlocks(documentNode) {
    new FootnoteBlockProducer(documentNode);
}
exports.produceFootnoteBlocks = produceFootnoteBlocks;
var Sequence = (function () {
    function Sequence(args) {
        this.nextValue = args.start;
    }
    Sequence.prototype.next = function () {
        return this.nextValue++;
    };
    return Sequence;
}());
var FootnoteBlockProducer = (function () {
    function FootnoteBlockProducer(documentNode) {
        this.footnoteReferenceNumberSequence = new Sequence({ start: 1 });
        this.produceFootnoteBlocks(documentNode);
    }
    FootnoteBlockProducer.prototype.produceFootnoteBlocks = function (outlineNodeContainer) {
        var outlineNodesWithFootnoteBlocks = [];
        for (var _i = 0, _a = outlineNodeContainer.children; _i < _a.length; _i++) {
            var outlineNode = _a[_i];
            outlineNodesWithFootnoteBlocks.push(outlineNode);
            var footnotes = this.getBlocklessFootnotes(outlineNode);
            if (footnotes.length) {
                outlineNodesWithFootnoteBlocks.push(this.getFootnoteBlock(footnotes));
            }
        }
        outlineNodeContainer.children = outlineNodesWithFootnoteBlocks;
    };
    FootnoteBlockProducer.prototype.getBlocklessFootnotes = function (node) {
        if ((node instanceof ParagraphNode_1.ParagraphNode) || (node instanceof HeadingNode_1.HeadingNode)) {
            return this.getFootnotes(node.children);
        }
        if ((node instanceof UnorderedListNode_1.UnorderedListNode) || (node instanceof OrderedListNode_1.OrderedListNode)) {
            return this.getBlocklessFootnotesFromOutlineContainers(node.listItems);
        }
        if (node instanceof LineBlockNode_1.LineBlockNode) {
            return this.getFootnotesFromInlineContainers(node.lines);
        }
        if (node instanceof DescriptionListNode_1.DescriptionListNode) {
            return this.getBlocklessFootnotesFromDescriptionListItems(node.listItems);
        }
        if (node instanceof BlockquoteNode_1.BlockquoteNode) {
            this.produceFootnoteBlocks(node);
            return [];
        }
        return [];
    };
    FootnoteBlockProducer.prototype.getFootnotes = function (inlineNodes) {
        var footnotes = [];
        for (var _i = 0, inlineNodes_1 = inlineNodes; _i < inlineNodes_1.length; _i++) {
            var node = inlineNodes_1[_i];
            if (node instanceof FootnoteNode_1.FootnoteNode) {
                node.referenceNumber = this.footnoteReferenceNumberSequence.next();
                footnotes.push(node);
            }
        }
        return footnotes;
    };
    FootnoteBlockProducer.prototype.getBlocklessFootnotesFromOutlineContainers = function (containers) {
        var footnotes = [];
        for (var _i = 0, containers_1 = containers; _i < containers_1.length; _i++) {
            var container = containers_1[_i];
            var footnotesForThisContainer = this.getBlocklessFootnotesFromOutlineNodes(container.children);
            footnotes.push.apply(footnotes, footnotesForThisContainer);
        }
        return footnotes;
    };
    FootnoteBlockProducer.prototype.getFootnotesFromInlineContainers = function (containers) {
        var _this = this;
        return CollectionHelpers_1.concat(containers.map(function (container) { return _this.getFootnotes(container.children); }));
    };
    FootnoteBlockProducer.prototype.getFootnoteBlock = function (footnotes) {
        var footnoteBlock = new FootnoteBlockNode_1.FootnoteBlockNode(footnotes);
        for (var footnoteIndex = 0; footnoteIndex < footnoteBlock.footnoteReferences.length; footnoteIndex++) {
            var footnote = footnoteBlock.footnoteReferences[footnoteIndex];
            var nestedFootnotes = this.getFootnotes(footnoteBlock.footnoteReferences[footnoteIndex].children);
            (_a = footnoteBlock.footnoteReferences).push.apply(_a, nestedFootnotes);
        }
        return footnoteBlock;
        var _a;
    };
    FootnoteBlockProducer.prototype.getBlocklessFootnotesFromOutlineNodes = function (outlineNodes) {
        var _this = this;
        return CollectionHelpers_1.concat(outlineNodes.map(function (node) { return _this.getBlocklessFootnotes(node); }));
    };
    FootnoteBlockProducer.prototype.getBlocklessFootnotesFromDescriptionListItems = function (listItems) {
        var footnotes = [];
        for (var _i = 0, listItems_1 = listItems; _i < listItems_1.length; _i++) {
            var listItem = listItems_1[_i];
            var footnotesForTerms = this.getFootnotesFromInlineContainers(listItem.terms);
            footnotes.push.apply(footnotes, footnotesForTerms);
            var descriptionResult = this.getBlocklessFootnotesFromOutlineNodes(listItem.description.children);
            footnotes.push.apply(footnotes, descriptionResult);
        }
        return footnotes;
    };
    return FootnoteBlockProducer;
}());

},{"../SyntaxNodes/BlockquoteNode":37,"../SyntaxNodes/DescriptionListNode":41,"../SyntaxNodes/FootnoteBlockNode":45,"../SyntaxNodes/FootnoteNode":46,"../SyntaxNodes/HeadingNode":47,"../SyntaxNodes/LineBlockNode":52,"../SyntaxNodes/OrderedListNode":56,"../SyntaxNodes/ParagraphNode":58,"../SyntaxNodes/UnorderedListNode":67,"./CollectionHelpers":1}],34:[function(require,module,exports){
"use strict";
var TextConsumer = (function () {
    function TextConsumer(text) {
        this.text = text;
        this.countUnclosedParen = 0;
        this.countUnclosedSquareBracket = 0;
        this.index = 0;
    }
    TextConsumer.prototype.done = function () {
        return (this.index >= this.text.length
            || this.isOnTrailingBackslash());
    };
    TextConsumer.prototype.consumeIfMatches = function (needle) {
        if (!this.match(needle)) {
            return false;
        }
        this.skip(needle.length);
        return true;
    };
    TextConsumer.prototype.consumeLine = function (args) {
        if (this.done()) {
            return false;
        }
        var consumer = new TextConsumer(this.remainingText());
        var line;
        var wasAbleToConsumeUpToLineBreak = consumer.consume({
            upTo: '\n',
            then: function (upToLineBreak) { line = upToLineBreak; }
        });
        if (!wasAbleToConsumeUpToLineBreak) {
            line = consumer.remainingText();
            consumer.skipToEnd();
        }
        var captures = [];
        if (args.pattern) {
            var results = args.pattern.exec(line);
            if (!results) {
                return false;
            }
            captures = results.slice(1);
        }
        if (args.if && !args.if.apply(args, [line].concat(captures))) {
            return false;
        }
        this.skip(consumer.lengthConsumed());
        if (args.then) {
            args.then.apply(args, [line].concat(captures));
        }
        return true;
    };
    TextConsumer.prototype.consume = function (args) {
        var upTo = args.upTo, then = args.then;
        var from = args.from || '';
        var consumer = new TextConsumer(this.remainingText());
        if (from && !consumer.consumeIfMatches(from)) {
            return false;
        }
        while (!consumer.done()) {
            if (consumer.consumeIfMatches(upTo)) {
                this.skip(consumer.lengthConsumed());
                if (then) {
                    var text = consumer.consumedText().slice(from.length, -upTo.length);
                    then(text);
                }
                return true;
            }
            consumer.moveNext();
        }
        return false;
    };
    TextConsumer.prototype.consumeIfMatchesPattern = function (args) {
        var pattern = args.pattern, then = args.then;
        var result = pattern.exec(this.remainingText());
        if (!result) {
            return false;
        }
        var match = result[0];
        var captures = result.slice(1);
        this.skip(match.length);
        if (then) {
            then.apply(void 0, [match].concat(captures));
        }
        return true;
    };
    TextConsumer.prototype.moveNext = function () {
        this.updateUnclosedBracketCounts();
        this.skip((this.isCurrentCharEscaped() ? 2 : 1));
    };
    TextConsumer.prototype.skip = function (count) {
        this.index += count;
    };
    TextConsumer.prototype.lengthConsumed = function () {
        return this.index;
    };
    TextConsumer.prototype.remainingText = function () {
        return this.text.slice(this.index);
    };
    TextConsumer.prototype.consumedText = function () {
        return this.text.substr(0, this.index);
    };
    TextConsumer.prototype.escapedCurrentChar = function () {
        if (this.done()) {
            throw new Error('There is no more text!');
        }
        return (this.isCurrentCharEscaped()
            ? this.at(this.index + 1)
            : this.currentChar());
    };
    TextConsumer.prototype.currentChar = function () {
        return this.at(this.index);
    };
    TextConsumer.prototype.at = function (index) {
        return this.text[index];
    };
    TextConsumer.prototype.asBeforeMatch = function (matchLength) {
        var copy = new TextConsumer('');
        copy.text = this.text;
        copy.index = this.index - matchLength;
        copy.countUnclosedParen = this.countUnclosedParen;
        copy.countUnclosedSquareBracket = this.countUnclosedSquareBracket;
        return copy;
    };
    TextConsumer.prototype.match = function (needle) {
        return (needle === this.text.substr(this.index, needle.length)
            && this.areRelevantBracketsClosed(needle));
    };
    TextConsumer.prototype.isCurrentCharEscaped = function () {
        return this.currentChar() === '\\';
    };
    TextConsumer.prototype.isOnTrailingBackslash = function () {
        return (this.index === this.text.length - 1
            && this.isCurrentCharEscaped());
    };
    TextConsumer.prototype.skipToEnd = function () {
        this.index = this.text.length;
    };
    TextConsumer.prototype.updateUnclosedBracketCounts = function () {
        switch (this.currentChar()) {
            case '(':
                this.countUnclosedParen += 1;
                break;
            case ')':
                this.countUnclosedParen = Math.max(0, this.countUnclosedParen - 1);
                break;
            case '[':
                this.countUnclosedSquareBracket += 1;
                break;
            case ']':
                this.countUnclosedSquareBracket = Math.max(0, this.countUnclosedSquareBracket - 1);
                break;
        }
    };
    TextConsumer.prototype.areRelevantBracketsClosed = function (needle) {
        return ((!this.countUnclosedSquareBracket || !appearsToCloseAnyPreceedingBrackets(needle, '[', ']'))
            && (!this.countUnclosedParen || !appearsToCloseAnyPreceedingBrackets(needle, '(', ')')));
    };
    return TextConsumer;
}());
exports.TextConsumer = TextConsumer;
function appearsToCloseAnyPreceedingBrackets(text, openingBracketChar, closingBracketChar) {
    var countSurplusOpened = 0;
    for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
        var char = text_1[_i];
        switch (char) {
            case openingBracketChar:
                countSurplusOpened += 1;
                break;
            case closingBracketChar:
                if (!countSurplusOpened) {
                    return true;
                }
                countSurplusOpened -= 1;
                break;
        }
    }
    return false;
}

},{}],35:[function(require,module,exports){
"use strict";
function applyBackslashEscaping(text) {
    return text.replace(/\\(.?)/g, '$1');
}
exports.applyBackslashEscaping = applyBackslashEscaping;

},{}],36:[function(require,module,exports){
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

},{"./MediaSyntaxNode":54}],37:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":57}],38:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":57}],39:[function(require,module,exports){
"use strict";
var Description = (function () {
    function Description(children) {
        this.children = children;
        this.DESCRIPTION = null;
    }
    return Description;
}());
exports.Description = Description;

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":57}],42:[function(require,module,exports){
"use strict";
var DescriptionTerm = (function () {
    function DescriptionTerm(children) {
        this.children = children;
        this.DESCRIPTION_TERM = null;
    }
    return DescriptionTerm;
}());
exports.DescriptionTerm = DescriptionTerm;

},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":62}],45:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutlineSyntaxNode_1 = require('./OutlineSyntaxNode');
var FootnoteBlockNode = (function (_super) {
    __extends(FootnoteBlockNode, _super);
    function FootnoteBlockNode(footnoteReferences) {
        if (footnoteReferences === void 0) { footnoteReferences = []; }
        _super.call(this);
        this.footnoteReferences = footnoteReferences;
        this.FOOTNOTE_BLOCK = null;
    }
    return FootnoteBlockNode;
}(OutlineSyntaxNode_1.OutlineSyntaxNode));
exports.FootnoteBlockNode = FootnoteBlockNode;

},{"./OutlineSyntaxNode":57}],46:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":62}],47:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":57}],48:[function(require,module,exports){
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

},{"./MediaSyntaxNode":54}],49:[function(require,module,exports){
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

},{"./InlineSyntaxNode":50}],50:[function(require,module,exports){
"use strict";
var InlineSyntaxNode = (function () {
    function InlineSyntaxNode() {
    }
    InlineSyntaxNode.prototype.inlineSyntaxNode = function () { };
    return InlineSyntaxNode;
}());
exports.InlineSyntaxNode = InlineSyntaxNode;

},{}],51:[function(require,module,exports){
"use strict";
var Line = (function () {
    function Line(children) {
        this.children = children;
        this.LINE = null;
    }
    return Line;
}());
exports.Line = Line;

},{}],52:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":57}],53:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":62}],54:[function(require,module,exports){
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

},{}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutlineSyntaxNode_1 = require('./OutlineSyntaxNode');
(function (ListOrder) {
    ListOrder[ListOrder["Ascending"] = 0] = "Ascending";
    ListOrder[ListOrder["Descrending"] = 1] = "Descrending";
})(exports.ListOrder || (exports.ListOrder = {}));
var ListOrder = exports.ListOrder;
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
        var withExplicitOrdinals = this.listItems.filter(function (listItem) { return listItem.ordinal != null; });
        if (withExplicitOrdinals.length < 2) {
            return ListOrder.Ascending;
        }
        return (withExplicitOrdinals[0].ordinal > withExplicitOrdinals[1].ordinal
            ? ListOrder.Descrending
            : ListOrder.Ascending);
    };
    return OrderedListNode;
}(OutlineSyntaxNode_1.OutlineSyntaxNode));
exports.OrderedListNode = OrderedListNode;

},{"./OutlineSyntaxNode":57}],57:[function(require,module,exports){
"use strict";
var OutlineSyntaxNode = (function () {
    function OutlineSyntaxNode() {
    }
    OutlineSyntaxNode.prototype.outlineSyntaxNode = function () { };
    return OutlineSyntaxNode;
}());
exports.OutlineSyntaxNode = OutlineSyntaxNode;

},{}],58:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":57}],59:[function(require,module,exports){
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
function isWhitespace(node) {
    return (node instanceof PlainTextNode) && !node.text.trim();
}
exports.isWhitespace = isWhitespace;

},{"./InlineSyntaxNode":50}],60:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":62}],61:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":62}],62:[function(require,module,exports){
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

},{"../SyntaxNodes/InlineSyntaxNode":50}],63:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":57}],64:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":62}],65:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":62}],66:[function(require,module,exports){
"use strict";
var UnorderedListItem = (function () {
    function UnorderedListItem(children) {
        this.children = children;
        this.UNORDERED_LIST_ITEM = null;
    }
    return UnorderedListItem;
}());
exports.UnorderedListItem = UnorderedListItem;

},{}],67:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":57}],68:[function(require,module,exports){
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

},{"./MediaSyntaxNode":54}],69:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinkNode_1 = require('../SyntaxNodes/LinkNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var OrderedListNode_1 = require('../SyntaxNodes/OrderedListNode');
var Writer_1 = require('./Writer');
var HtmlWriter = (function (_super) {
    __extends(HtmlWriter, _super);
    function HtmlWriter(config) {
        _super.call(this, config);
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
        if (node.order() === OrderedListNode_1.ListOrder.Descrending) {
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
            id: this.config.footnoteReferenceId(node.referenceNumber),
            'data-footnote-reference': null
        });
    };
    HtmlWriter.prototype.footnoteBlock = function (node) {
        var _this = this;
        return htmlElement('dl', node.footnoteReferences.map(function (footnote) { return _this.footnote(footnote); }).join(''), { 'data-footnotes': null });
    };
    HtmlWriter.prototype.link = function (node) {
        return this.htmlElement('a', node.children, { href: node.url });
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
        return new LinkNode_1.LinkNode([new PlainTextNode_1.PlainTextNode(referenceNumber.toString())], internalUrl(this.config.footnoteId(referenceNumber)));
    };
    HtmlWriter.prototype.footnote = function (footnote) {
        var termHtml = this.htmlElement('dt', [this.footnoteLinkBackToReference(footnote)], {
            id: this.config.footnoteId(footnote.referenceNumber),
            'data-footnote': null
        });
        var descriptionHtml = this.htmlElement('dd', footnote.children);
        return termHtml + descriptionHtml;
    };
    HtmlWriter.prototype.footnoteLinkBackToReference = function (footnote) {
        var referenceNumber = footnote.referenceNumber;
        return new LinkNode_1.LinkNode([new PlainTextNode_1.PlainTextNode(referenceNumber.toString())], internalUrl(this.config.footnoteReferenceId(referenceNumber)));
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

},{"../SyntaxNodes/LinkNode":53,"../SyntaxNodes/OrderedListNode":56,"../SyntaxNodes/PlainTextNode":59,"./Writer":70}],70:[function(require,module,exports){
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
var WriterConfig_1 = require('./WriterConfig');
var Writer = (function () {
    function Writer(config) {
        this.config = new WriterConfig_1.WriterConfig(config);
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
    return Writer;
}());
exports.Writer = Writer;

},{"../SyntaxNodes/AudioNode":36,"../SyntaxNodes/BlockquoteNode":37,"../SyntaxNodes/CodeBlockNode":38,"../SyntaxNodes/DescriptionListNode":41,"../SyntaxNodes/DocumentNode":43,"../SyntaxNodes/EmphasisNode":44,"../SyntaxNodes/FootnoteBlockNode":45,"../SyntaxNodes/FootnoteNode":46,"../SyntaxNodes/HeadingNode":47,"../SyntaxNodes/ImageNode":48,"../SyntaxNodes/InlineCodeNode":49,"../SyntaxNodes/LineBlockNode":52,"../SyntaxNodes/LinkNode":53,"../SyntaxNodes/OrderedListNode":56,"../SyntaxNodes/ParagraphNode":58,"../SyntaxNodes/PlainTextNode":59,"../SyntaxNodes/RevisionDeletionNode":60,"../SyntaxNodes/RevisionInsertionNode":61,"../SyntaxNodes/SectionSeparatorNode":63,"../SyntaxNodes/SpoilerNode":64,"../SyntaxNodes/StressNode":65,"../SyntaxNodes/UnorderedListNode":67,"../SyntaxNodes/VideoNode":68,"./WriterConfig":71}],71:[function(require,module,exports){
"use strict";
var WriterConfig = (function () {
    function WriterConfig(args) {
        args = args || {};
        var i18n = args.i18n || {};
        var i18nTerms = i18n.terms || {};
        this.config = {
            documentName: args.documentName || '',
            i18n: {
                idWordDelimiter: i18n.idWordDelimiter || '-',
                terms: {
                    footnote: i18nTerms.footnote || 'footnote',
                    footnoteReference: i18nTerms.footnoteReference || 'footnote reference',
                }
            }
        };
    }
    WriterConfig.prototype.getId = function () {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i - 0] = arguments[_i];
        }
        var allParts = [this.config.documentName].concat(parts);
        var rawId = allParts.join(' ');
        return (rawId
            .trim()
            .replace(/\s+/g, this.config.i18n.idWordDelimiter));
    };
    WriterConfig.prototype.footnoteId = function (referenceNumber) {
        return this.getId(this.config.i18n.terms.footnote, referenceNumber.toString());
    };
    WriterConfig.prototype.footnoteReferenceId = function (referenceNumber) {
        return this.getId(this.config.i18n.terms.footnoteReference, referenceNumber.toString());
    };
    return WriterConfig;
}());
exports.WriterConfig = WriterConfig;

},{}],72:[function(require,module,exports){
"use strict";
var ParseDocument_1 = require('./Parsing/ParseDocument');
var HtmlWriter_1 = require('./Writer/HtmlWriter');
function toAst(text) {
    return ParseDocument_1.parseDocument(text);
}
exports.toAst = toAst;
var htmlWriter = new HtmlWriter_1.HtmlWriter();
function toHtml(textOrNode) {
    var node = (typeof textOrNode === 'string'
        ? toAst(textOrNode)
        : textOrNode);
    return htmlWriter.write(node);
}
exports.toHtml = toHtml;

},{"./Parsing/ParseDocument":32,"./Writer/HtmlWriter":69}]},{},[72])(72)
});