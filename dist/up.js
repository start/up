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
var Tokenize_1 = require('./Tokenize');
var Parse_1 = require('./Parse');
function getInlineNodes(text, config) {
    return Parse_1.parse(Tokenize_1.tokenize(text, config));
}
exports.getInlineNodes = getInlineNodes;

},{"./Parse":6,"./Tokenize":14}],3:[function(require,module,exports){
"use strict";
var LinkStartToken_1 = require('./Tokens/LinkStartToken');
var LinkEndToken_1 = require('./Tokens/LinkEndToken');
var RichConventions_1 = require('./RichConventions');
var ALL_SANDWICHES = [
    RichConventions_1.REVISION_DELETION,
    RichConventions_1.REVISION_INSERTION,
    RichConventions_1.SPOILER,
    RichConventions_1.FOOTNOTE,
    RichConventions_1.STRESS,
    RichConventions_1.EMPHASIS
];
function massageTokensIntoTreeStructure(tokens) {
    return new TokenMasseuse(tokens.slice()).tokens;
}
exports.massageTokensIntoTreeStructure = massageTokensIntoTreeStructure;
var TokenMasseuse = (function () {
    function TokenMasseuse(tokens) {
        this.tokens = tokens;
        this.massageSandwichesIntoTreeStructure();
        this.splitAnySandwichThatOverlapsWithLinks();
    }
    TokenMasseuse.prototype.massageSandwichesIntoTreeStructure = function () {
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
    TokenMasseuse.prototype.splitAnySandwichThatOverlapsWithLinks = function () {
        for (var tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
            if (this.tokens[tokenIndex] instanceof LinkStartToken_1.LinkStartToken) {
                continue;
            }
            var linkStartIndex = tokenIndex;
            var linkEndIndex = void 0;
            for (var i = linkStartIndex + 1; i < this.tokens.length; i++) {
                if (this.tokens[i] instanceof LinkEndToken_1.LinkEndToken) {
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
    TokenMasseuse.prototype.closeAndReopenSandwichesAroundTokenAtIndex = function (index, sandwichesInTheOrderTheyShouldClose) {
        var startTokensToAdd = sandwichesInTheOrderTheyShouldClose
            .map(function (sandwich) { return new sandwich.StartTokenType(); })
            .reverse();
        var endTokensToAdd = sandwichesInTheOrderTheyShouldClose
            .map(function (sandwich) { return new sandwich.EndTokenType(); });
        this.insertTokens(index + 1, startTokensToAdd);
        this.insertTokens(index, endTokensToAdd);
    };
    TokenMasseuse.prototype.insertTokens = function (index, tokens) {
        (_a = this.tokens).splice.apply(_a, [index, 0].concat(tokens));
        var _a;
    };
    return TokenMasseuse;
}());
function getSandwichStartedByThisToken(token) {
    return ALL_SANDWICHES.filter(function (sandwich) {
        return token instanceof sandwich.StartTokenType;
    })[0];
}
function getSandwichEndedByThisToken(token) {
    return ALL_SANDWICHES.filter(function (sandwich) {
        return token instanceof sandwich.EndTokenType;
    })[0];
}

},{"./RichConventions":13,"./Tokens/LinkEndToken":23,"./Tokens/LinkStartToken":24}],4:[function(require,module,exports){
"use strict";
var MediaConvention = (function () {
    function MediaConvention(termForMediaType, NodeType, TokenType) {
        this.termForMediaType = termForMediaType;
        this.NodeType = NodeType;
        this.TokenType = TokenType;
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
var AUDIO = new MediaConvention_1.MediaConvention('audio', AudioNode_1.AudioNode, AudioToken_1.AudioToken);
exports.AUDIO = AUDIO;
var IMAGE = new MediaConvention_1.MediaConvention('image', ImageNode_1.ImageNode, ImageToken_1.ImageToken);
exports.IMAGE = IMAGE;
var VIDEO = new MediaConvention_1.MediaConvention('video', VideoNode_1.VideoNode, VideoToken_1.VideoToken);
exports.VIDEO = VIDEO;

},{"../../SyntaxNodes/AudioNode":57,"../../SyntaxNodes/ImageNode":69,"../../SyntaxNodes/VideoNode":89,"./MediaConvention":4,"./Tokens/AudioToken":16,"./Tokens/ImageToken":21,"./Tokens/VideoToken":39}],6:[function(require,module,exports){
"use strict";
var InlineCodeNode_1 = require('../../SyntaxNodes/InlineCodeNode');
var LinkNode_1 = require('../../SyntaxNodes/LinkNode');
var PlainTextNode_1 = require('../../SyntaxNodes/PlainTextNode');
var CollectionHelpers_1 = require('../CollectionHelpers');
var MediaConventions_1 = require('./MediaConventions');
var RichConventions_1 = require('./RichConventions');
var InlineCodeToken_1 = require('./Tokens/InlineCodeToken');
var LinkStartToken_1 = require('./Tokens/LinkStartToken');
var LinkEndToken_1 = require('./Tokens/LinkEndToken');
var PlainTextToken_1 = require('./Tokens/PlainTextToken');
function parse(tokens) {
    return parseUntil(tokens).nodes;
}
exports.parse = parse;
var SANDWICHES = [
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
function parseUntil(tokens, terminator) {
    var nodes = [];
    var stillNeedsTerminator = !!terminator;
    var countParsed = 0;
    MainParserLoop: for (var index = 0; index < tokens.length; index++) {
        var token = tokens[index];
        countParsed = index + 1;
        if (terminator && token instanceof terminator) {
            stillNeedsTerminator = false;
            break;
        }
        if (token instanceof PlainTextToken_1.PlainTextToken) {
            var lastNode = CollectionHelpers_1.last(nodes);
            if (lastNode instanceof PlainTextNode_1.PlainTextNode) {
                lastNode.text += token.text;
            }
            else {
                nodes.push(new PlainTextNode_1.PlainTextNode(token.text));
            }
            continue;
        }
        if (token instanceof InlineCodeToken_1.InlineCodeToken) {
            if (token.code) {
                nodes.push(new InlineCodeNode_1.InlineCodeNode(token.code));
            }
            continue;
        }
        if (token instanceof LinkStartToken_1.LinkStartToken) {
            var result = parseUntil(tokens.slice(countParsed), LinkEndToken_1.LinkEndToken);
            index += result.countTokensParsed;
            var contents = result.nodes;
            var hasContents = isNotPureWhitespace(contents);
            var linkEndToken = tokens[index];
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
            if (token instanceof sandwich.StartTokenType) {
                var result = parseUntil(tokens.slice(countParsed), sandwich.EndTokenType);
                index += result.countTokensParsed;
                if (result.nodes.length) {
                    nodes.push(new sandwich.NodeType(result.nodes));
                }
                continue MainParserLoop;
            }
        }
    }
    if (stillNeedsTerminator) {
        throw new Error("Missing token: " + terminator);
    }
    return new ParseResult(nodes, countParsed);
}
function isNotPureWhitespace(nodes) {
    return !nodes.every(PlainTextNode_1.isWhitespace);
}
var ParseResult = (function () {
    function ParseResult(nodes, countTokensParsed) {
        this.nodes = nodes;
        this.countTokensParsed = countTokensParsed;
    }
    return ParseResult;
}());

},{"../../SyntaxNodes/InlineCodeNode":70,"../../SyntaxNodes/LinkNode":74,"../../SyntaxNodes/PlainTextNode":80,"../CollectionHelpers":1,"./MediaConventions":5,"./RichConventions":13,"./Tokens/InlineCodeToken":22,"./Tokens/LinkEndToken":23,"./Tokens/LinkStartToken":24,"./Tokens/PlainTextToken":26}],7:[function(require,module,exports){
"use strict";
var RaisedVoiceMarker_1 = require('./RaisedVoiceMarker');
var StartMarker_1 = require('./StartMarker');
var EndMarker_1 = require('./EndMarker');
var PlainTextMarker_1 = require('./PlainTextMarker');
var PotentialRaisedVoiceEndToken_1 = require('../Tokens/PotentialRaisedVoiceEndToken');
var PotentialRaisedVoiceStartOrEndToken_1 = require('../Tokens/PotentialRaisedVoiceStartOrEndToken');
var PotentialRaisedVoiceStartToken_1 = require('../Tokens/PotentialRaisedVoiceStartToken');
function applyRaisedVoicesToRawTokens(tokens) {
    var raisedVoiceMarkers = getRaisedVoiceMarkers(tokens);
    var resultTokens = tokens.slice();
    for (var _i = 0, _a = raisedVoiceMarkers.sort(RaisedVoiceMarker_1.comapreMarkersDescending); _i < _a.length; _i++) {
        var raisedVoiceMarker = _a[_i];
        resultTokens.splice.apply(resultTokens, [raisedVoiceMarker.originalTokenIndex, 1].concat(raisedVoiceMarker.tokens()));
    }
    return resultTokens;
}
exports.applyRaisedVoicesToRawTokens = applyRaisedVoicesToRawTokens;
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

},{"../Tokens/PotentialRaisedVoiceEndToken":27,"../Tokens/PotentialRaisedVoiceStartOrEndToken":28,"../Tokens/PotentialRaisedVoiceStartToken":29,"./EndMarker":8,"./PlainTextMarker":9,"./RaisedVoiceMarker":10,"./StartMarker":11}],8:[function(require,module,exports){
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

},{"../Tokens/EmphasisEndToken":17,"../Tokens/StressEndToken":37,"./RaisedVoiceMarker":10,"./StartMarker":11}],9:[function(require,module,exports){
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

},{"../Tokens/PlainTextToken":26,"./RaisedVoiceMarker":10}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"../Tokens/EmphasisStartToken":18,"../Tokens/StressStartToken":38,"./RaisedVoiceMarker":10}],12:[function(require,module,exports){
"use strict";
var RichConvention = (function () {
    function RichConvention(NodeType, StartTokenType, EndTokenType) {
        this.NodeType = NodeType;
        this.StartTokenType = StartTokenType;
        this.EndTokenType = EndTokenType;
    }
    return RichConvention;
}());
exports.RichConvention = RichConvention;

},{}],13:[function(require,module,exports){
"use strict";
var RichConvention_1 = require('./RichConvention');
var StressNode_1 = require('../../SyntaxNodes/StressNode');
var EmphasisNode_1 = require('../../SyntaxNodes/EmphasisNode');
var SpoilerNode_1 = require('../../SyntaxNodes/SpoilerNode');
var FootnoteNode_1 = require('../../SyntaxNodes/FootnoteNode');
var RevisionDeletionNode_1 = require('../../SyntaxNodes/RevisionDeletionNode');
var RevisionInsertionNode_1 = require('../../SyntaxNodes/RevisionInsertionNode');
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
var STRESS = new RichConvention_1.RichConvention(StressNode_1.StressNode, StressStartToken_1.StressStartToken, StressEndToken_1.StressEndToken);
exports.STRESS = STRESS;
var EMPHASIS = new RichConvention_1.RichConvention(EmphasisNode_1.EmphasisNode, EmphasisStartToken_1.EmphasisStartToken, EmphasisEndToken_1.EmphasisEndToken);
exports.EMPHASIS = EMPHASIS;
var REVISION_DELETION = new RichConvention_1.RichConvention(RevisionDeletionNode_1.RevisionDeletionNode, RevisionDeletionStartToken_1.RevisionDeletionStartToken, RevisionDeletionEndToken_1.RevisionDeletionEndToken);
exports.REVISION_DELETION = REVISION_DELETION;
var REVISION_INSERTION = new RichConvention_1.RichConvention(RevisionInsertionNode_1.RevisionInsertionNode, RevisionInsertionStartToken_1.RevisionInsertionStartToken, RevisionInsertionEndToken_1.RevisionInsertionEndToken);
exports.REVISION_INSERTION = REVISION_INSERTION;
var SPOILER = new RichConvention_1.RichConvention(SpoilerNode_1.SpoilerNode, SpoilerStartToken_1.SpoilerStartToken, SpoilerEndToken_1.SpoilerEndToken);
exports.SPOILER = SPOILER;
var FOOTNOTE = new RichConvention_1.RichConvention(FootnoteNode_1.FootnoteNode, FootnoteStartToken_1.FootnoteStartToken, FootnoteEndToken_1.FootnoteEndToken);
exports.FOOTNOTE = FOOTNOTE;

},{"../../SyntaxNodes/EmphasisNode":65,"../../SyntaxNodes/FootnoteNode":67,"../../SyntaxNodes/RevisionDeletionNode":81,"../../SyntaxNodes/RevisionInsertionNode":82,"../../SyntaxNodes/SpoilerNode":85,"../../SyntaxNodes/StressNode":86,"./RichConvention":12,"./Tokens/EmphasisEndToken":17,"./Tokens/EmphasisStartToken":18,"./Tokens/FootnoteEndToken":19,"./Tokens/FootnoteStartToken":20,"./Tokens/RevisionDeletionEndToken":31,"./Tokens/RevisionDeletionStartToken":32,"./Tokens/RevisionInsertionEndToken":33,"./Tokens/RevisionInsertionStartToken":34,"./Tokens/SpoilerEndToken":35,"./Tokens/SpoilerStartToken":36,"./Tokens/StressEndToken":37,"./Tokens/StressStartToken":38}],14:[function(require,module,exports){
"use strict";
var TokenizerContext_1 = require('./TokenizerContext');
var ApplyRaisedVoicesToRawTokens_1 = require('./RaisedVoices/ApplyRaisedVoicesToRawTokens');
var MassageTokensIntoTreeStructure_1 = require('./MassageTokensIntoTreeStructure');
var FootnoteEndToken_1 = require('./Tokens/FootnoteEndToken');
var InlineCodeToken_1 = require('./Tokens/InlineCodeToken');
var PlainTextToken_1 = require('./Tokens/PlainTextToken');
var PotentialRaisedVoiceEndToken_1 = require('./Tokens/PotentialRaisedVoiceEndToken');
var PotentialRaisedVoiceStartOrEndToken_1 = require('./Tokens/PotentialRaisedVoiceStartOrEndToken');
var PotentialRaisedVoiceStartToken_1 = require('./Tokens/PotentialRaisedVoiceStartToken');
var SpoilerEndToken_1 = require('./Tokens/SpoilerEndToken');
var RevisionInsertionEndToken_1 = require('./Tokens/RevisionInsertionEndToken');
var RevisionDeletionEndToken_1 = require('./Tokens/RevisionDeletionEndToken');
function tokenize(text, config) {
    var result = new Tokenizer(new TokenizerContext_1.TokenizerContext(text), config).result;
    var tokensWithRaisedVoicesApplied = ApplyRaisedVoicesToRawTokens_1.applyRaisedVoicesToRawTokens(result.tokens);
    return MassageTokensIntoTreeStructure_1.massageTokensIntoTreeStructure(tokensWithRaisedVoicesApplied);
}
exports.tokenize = tokenize;
var Tokenizer = (function () {
    function Tokenizer(context, config) {
        this.context = context;
        this.config = config;
        this.tokens = [];
        this.collcetedUnmatchedText = '';
        if (this.context.initialToken) {
            this.tokens.push(this.context.initialToken);
        }
        while (!this.context.done()) {
            if (this.context.currentChar === '\\') {
                this.context.advance(1);
                this.collectCurrentChar();
                continue;
            }
            if (this.context.isInlineCodeOpen) {
                if (this.closeInlineCode()) {
                    return;
                }
            }
            else {
                if (this.context.countSpoilersOpen && this.closeSpoiler() && this.context.isSpoilerInnermostOpenConvention()) {
                    return;
                }
                if (this.context.countFootnotesOpen && this.closeFootnote() && this.context.isFootnoteInnermostOpenConvention()) {
                    return;
                }
                if (this.context.isRevisionInsertionOpen) {
                    if (this.closeRevisionInsertion()) {
                        return;
                    }
                }
                else {
                    if (this.tokenizeRevisionInsertion()) {
                        continue;
                    }
                }
                if (this.context.isRevisionDeletionOpen) {
                    if (this.closeRevisionDeletion()) {
                        return;
                    }
                }
                else {
                    if (this.tokenizeRevisionDeletion()) {
                        continue;
                    }
                }
                var didTokenizeConvention = (this.tokenizeInlineCode()
                    || this.tokenizeRaisedVoicePlaceholders()
                    || this.tokenizeSpoiler()
                    || this.tokenizeFootnote());
                if (didTokenizeConvention) {
                    continue;
                }
            }
            this.collectCurrentChar();
        }
        this.flushUnmatchedTextToPlainTextToken();
        this.result = {
            succeeded: !this.context.failed(),
            lengthAdvanced: this.context.lengthAdvanced,
            tokens: this.tokens
        };
    }
    Tokenizer.prototype.collectCurrentChar = function () {
        this.collcetedUnmatchedText += this.context.currentChar;
        this.context.advance(1);
    };
    Tokenizer.prototype.flushUnmatchedText = function () {
        var unmatchedText = this.collcetedUnmatchedText;
        this.collcetedUnmatchedText = '';
        return unmatchedText;
    };
    Tokenizer.prototype.flushUnmatchedTextToPlainTextToken = function () {
        var unmatchedText = this.flushUnmatchedText();
        if (unmatchedText) {
            this.tokens.push(new PlainTextToken_1.PlainTextToken(unmatchedText));
        }
    };
    Tokenizer.prototype.flushUnmatchedTextToPlainTextTokenThenAddTokens = function () {
        var tokens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tokens[_i - 0] = arguments[_i];
        }
        this.flushUnmatchedTextToPlainTextToken();
        (_a = this.tokens).push.apply(_a, tokens);
        var _a;
    };
    Tokenizer.prototype.tokenizeInlineCode = function () {
        var _this = this;
        return this.tokenizeConvention({
            pattern: /^`/,
            getNewContext: function () { return _this.context.withInlineCodeOpen(); }
        });
    };
    Tokenizer.prototype.closeInlineCode = function () {
        if (this.context.advanceIfMatch({ pattern: /^`/ })) {
            this.context.closeInlineCode();
            this.result = this.getResultFor(new InlineCodeToken_1.InlineCodeToken(this.flushUnmatchedText()));
            return true;
        }
        return false;
    };
    Tokenizer.prototype.tokenizeSpoiler = function () {
        var _this = this;
        return this.tokenizeConvention({
            pattern: new RegExp("^\\[" + this.config.settings.i18n.terms.spoiler + ":\\s*", 'i'),
            getNewContext: function () { return _this.context.withAdditionalSpoilerOpen(); }
        });
    };
    Tokenizer.prototype.closeSpoiler = function () {
        if (this.context.advanceIfMatch({ pattern: /^\]/ })) {
            this.flushUnmatchedTextToPlainTextTokenThenAddTokens(new SpoilerEndToken_1.SpoilerEndToken());
            this.context.closeSpoiler();
            this.result = this.getResult();
            return true;
        }
        return false;
    };
    Tokenizer.prototype.tokenizeRevisionInsertion = function () {
        var _this = this;
        return this.tokenizeConvention({
            pattern: /^\+\+/,
            getNewContext: function () { return _this.context.withRevisionInsertionOpen(); }
        });
    };
    Tokenizer.prototype.closeRevisionInsertion = function () {
        if (this.context.advanceIfMatch({ pattern: /^\+\+/ })) {
            this.flushUnmatchedTextToPlainTextTokenThenAddTokens(new RevisionInsertionEndToken_1.RevisionInsertionEndToken());
            this.context.closeRevisionInsertion();
            this.result = this.getResult();
            return true;
        }
        return false;
    };
    Tokenizer.prototype.tokenizeRevisionDeletion = function () {
        var _this = this;
        return this.tokenizeConvention({
            pattern: /^~~/,
            getNewContext: function () { return _this.context.withRevisionDeletionOpen(); }
        });
    };
    Tokenizer.prototype.closeRevisionDeletion = function () {
        if (this.context.advanceIfMatch({ pattern: /^~~/ })) {
            this.flushUnmatchedTextToPlainTextTokenThenAddTokens(new RevisionDeletionEndToken_1.RevisionDeletionEndToken());
            this.context.closeRevisionDeletion();
            this.result = this.getResult();
            return true;
        }
        return false;
    };
    Tokenizer.prototype.tokenizeFootnote = function () {
        var _this = this;
        return this.tokenizeConvention({
            pattern: /^\s*\(\(/,
            getNewContext: function () { return _this.context.withAdditionalFootnoteOpen(); }
        });
    };
    Tokenizer.prototype.closeFootnote = function () {
        if (this.context.advanceIfMatch({ pattern: /^\)\)/ })) {
            this.flushUnmatchedTextToPlainTextTokenThenAddTokens(new FootnoteEndToken_1.FootnoteEndToken());
            this.context.closeFootnote();
            this.result = this.getResult();
            return true;
        }
        return false;
    };
    Tokenizer.prototype.tokenizeConvention = function (args) {
        var newContext;
        var canOpenPattern = this.context.match({
            pattern: args.pattern,
            then: function (match) {
                newContext = args.getNewContext();
                newContext.advance(match.length);
            }
        });
        if (!canOpenPattern) {
            return false;
        }
        return this.tokenizeRestOfConvention(newContext);
    };
    Tokenizer.prototype.tokenizeRestOfConvention = function (context) {
        var result = new Tokenizer(context, this.config).result;
        if (!result.succeeded) {
            return false;
        }
        this.flushUnmatchedTextToPlainTextTokenThenAddTokens.apply(this, result.tokens);
        this.context.advance(result.lengthAdvanced);
        return true;
    };
    Tokenizer.prototype.getResult = function () {
        return this.getResultFor.apply(this, this.tokens);
    };
    Tokenizer.prototype.getResultFor = function () {
        var tokens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tokens[_i - 0] = arguments[_i];
        }
        return {
            succeeded: true,
            lengthAdvanced: this.context.lengthAdvanced,
            tokens: tokens
        };
    };
    Tokenizer.prototype.tokenizeRaisedVoicePlaceholders = function () {
        var _this = this;
        var ASTERISKS_PATTERN = /^\*+/;
        return this.context.advanceIfMatch({
            pattern: ASTERISKS_PATTERN,
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
                _this.flushUnmatchedTextToPlainTextTokenThenAddTokens(new AsteriskTokenType(asterisks));
            }
        });
    };
    return Tokenizer;
}());

},{"./MassageTokensIntoTreeStructure":3,"./RaisedVoices/ApplyRaisedVoicesToRawTokens":7,"./TokenizerContext":15,"./Tokens/FootnoteEndToken":19,"./Tokens/InlineCodeToken":22,"./Tokens/PlainTextToken":26,"./Tokens/PotentialRaisedVoiceEndToken":27,"./Tokens/PotentialRaisedVoiceStartOrEndToken":28,"./Tokens/PotentialRaisedVoiceStartToken":29,"./Tokens/RevisionDeletionEndToken":31,"./Tokens/RevisionInsertionEndToken":33,"./Tokens/SpoilerEndToken":35}],15:[function(require,module,exports){
"use strict";
var SpoilerStartToken_1 = require('./Tokens/SpoilerStartToken');
var RevisionInsertionStartToken_1 = require('./Tokens/RevisionInsertionStartToken');
var RevisionDeletionStartToken_1 = require('./Tokens/RevisionDeletionStartToken');
var FootnoteStartToken_1 = require('./Tokens/FootnoteStartToken');
var NOT_WHITESPACE_PATTERN = /\S/;
var TokenizerContext = (function () {
    function TokenizerContext(entireText, initialIndex) {
        if (initialIndex === void 0) { initialIndex = 0; }
        this.entireText = entireText;
        this.initialIndex = initialIndex;
        this.isInlineCodeOpen = false;
        this.isLinkOpen = false;
        this.isRevisionDeletionOpen = false;
        this.isRevisionInsertionOpen = false;
        this.countSpoilersOpen = 0;
        this.countFootnotesOpen = 0;
        this.lengthAdvanced = 0;
        this.dirty();
    }
    TokenizerContext.prototype.match = function (args) {
        var pattern = args.pattern, then = args.then;
        var result = pattern.exec(this.remainingText);
        if (!result) {
            return false;
        }
        var match = result[0];
        var captures = result.slice(1);
        var isTouchingWordEnd = this.isTouchingEndOfWord;
        var charAfterMatch = this.entireText[this.currentIndex() + match.length];
        var isTouchingWordStart = NOT_WHITESPACE_PATTERN.test(charAfterMatch);
        if (then) {
            then.apply(void 0, [match, isTouchingWordEnd, isTouchingWordStart].concat(captures));
        }
        return true;
    };
    TokenizerContext.prototype.advanceIfMatch = function (args) {
        var _this = this;
        var originalThen = args.then || (function () { });
        return this.match({
            pattern: args.pattern,
            then: function (match, isTouchingWordEnd, isTouchingWordStart) {
                var captures = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    captures[_i - 3] = arguments[_i];
                }
                _this.advance(match.length);
                originalThen.apply(void 0, [match, isTouchingWordEnd, isTouchingWordStart].concat(captures));
            }
        });
    };
    TokenizerContext.prototype.done = function () {
        return !this.remainingText;
    };
    TokenizerContext.prototype.failed = function () {
        return (this.isInlineCodeOpen
            || this.isLinkOpen
            || this.isRevisionDeletionOpen
            || this.isRevisionInsertionOpen
            || this.countSpoilersOpen > 0
            || this.countFootnotesOpen > 0);
    };
    TokenizerContext.prototype.withInlineCodeOpen = function () {
        var copy = this.copyForNewOpenConvention();
        copy.isInlineCodeOpen = true;
        return copy;
    };
    TokenizerContext.prototype.withLinkOpen = function () {
        var copy = this.copyForNewOpenConvention();
        copy.isLinkOpen = true;
        return copy;
    };
    TokenizerContext.prototype.withRevisionDeletionOpen = function () {
        var copy = this.copyForNewOpenConvention();
        copy.isRevisionDeletionOpen = true;
        copy.initialToken = new RevisionDeletionStartToken_1.RevisionDeletionStartToken();
        return copy;
    };
    TokenizerContext.prototype.withRevisionInsertionOpen = function () {
        var copy = this.copyForNewOpenConvention();
        copy.isRevisionInsertionOpen = true;
        copy.initialToken = new RevisionInsertionStartToken_1.RevisionInsertionStartToken();
        return copy;
    };
    TokenizerContext.prototype.withAdditionalSpoilerOpen = function () {
        var copy = this.copyForNewOpenConvention();
        copy.countSpoilersOpen += 1;
        copy.initialToken = new SpoilerStartToken_1.SpoilerStartToken();
        return copy;
    };
    TokenizerContext.prototype.withAdditionalFootnoteOpen = function () {
        var copy = this.copyForNewOpenConvention();
        copy.countFootnotesOpen += 1;
        copy.initialToken = new FootnoteStartToken_1.FootnoteStartToken();
        return copy;
    };
    TokenizerContext.prototype.closeInlineCode = function () {
        this.isInlineCodeOpen = false;
    };
    TokenizerContext.prototype.closeLink = function () {
        this.isLinkOpen = false;
    };
    TokenizerContext.prototype.closeRevisionDeletion = function () {
        this.isRevisionDeletionOpen = false;
    };
    TokenizerContext.prototype.closeRevisionInsertion = function () {
        this.isRevisionInsertionOpen = false;
    };
    TokenizerContext.prototype.closeSpoiler = function () {
        this.countSpoilersOpen -= 1;
    };
    TokenizerContext.prototype.closeFootnote = function () {
        this.countFootnotesOpen -= 1;
    };
    TokenizerContext.prototype.advance = function (length) {
        this.lengthAdvanced += length;
        this.dirty();
    };
    TokenizerContext.prototype.isSpoilerInnermostOpenConvention = function () {
        return this.initialToken instanceof SpoilerStartToken_1.SpoilerStartToken;
    };
    TokenizerContext.prototype.isFootnoteInnermostOpenConvention = function () {
        return this.initialToken instanceof FootnoteStartToken_1.FootnoteStartToken;
    };
    TokenizerContext.prototype.currentIndex = function () {
        return this.initialIndex + this.lengthAdvanced;
    };
    TokenizerContext.prototype.copyForNewOpenConvention = function () {
        var copy = new TokenizerContext(this.entireText, this.currentIndex());
        copy.isLinkOpen = this.isLinkOpen;
        copy.isRevisionDeletionOpen = this.isRevisionDeletionOpen;
        copy.isRevisionInsertionOpen = this.isRevisionInsertionOpen;
        copy.countSpoilersOpen = this.countSpoilersOpen;
        copy.countFootnotesOpen = this.countFootnotesOpen;
        copy.isInlineCodeOpen = this.isInlineCodeOpen;
        copy.dirty();
        return copy;
    };
    TokenizerContext.prototype.dirty = function () {
        this.remainingText = this.entireText.substr(this.currentIndex());
        this.currentChar = this.remainingText[0];
        var previousChar = this.entireText[this.currentIndex() - 1];
        this.isTouchingEndOfWord = NOT_WHITESPACE_PATTERN.test(previousChar);
    };
    return TokenizerContext;
}());
exports.TokenizerContext = TokenizerContext;

},{"./Tokens/FootnoteStartToken":20,"./Tokens/RevisionDeletionStartToken":32,"./Tokens/RevisionInsertionStartToken":34,"./Tokens/SpoilerStartToken":36}],16:[function(require,module,exports){
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
var PlainTextToken = (function () {
    function PlainTextToken(text) {
        this.text = text;
    }
    PlainTextToken.prototype.token = function () { };
    return PlainTextToken;
}());
exports.PlainTextToken = PlainTextToken;

},{}],27:[function(require,module,exports){
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

},{"./PotentialRaisedVoiceToken":30}],28:[function(require,module,exports){
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

},{"./PotentialRaisedVoiceToken":30}],29:[function(require,module,exports){
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

},{"./PotentialRaisedVoiceToken":30}],30:[function(require,module,exports){
"use strict";
var PotentialRaisedVoiceToken = (function () {
    function PotentialRaisedVoiceToken(asterisks) {
        this.asterisks = asterisks;
    }
    PotentialRaisedVoiceToken.prototype.token = function () { };
    return PotentialRaisedVoiceToken;
}());
exports.PotentialRaisedVoiceToken = PotentialRaisedVoiceToken;

},{}],31:[function(require,module,exports){
"use strict";
var RevisionDeletionEndToken = (function () {
    function RevisionDeletionEndToken() {
    }
    RevisionDeletionEndToken.prototype.token = function () { };
    return RevisionDeletionEndToken;
}());
exports.RevisionDeletionEndToken = RevisionDeletionEndToken;

},{}],32:[function(require,module,exports){
"use strict";
var RevisionDeletionStartToken = (function () {
    function RevisionDeletionStartToken() {
    }
    RevisionDeletionStartToken.prototype.token = function () { };
    return RevisionDeletionStartToken;
}());
exports.RevisionDeletionStartToken = RevisionDeletionStartToken;

},{}],33:[function(require,module,exports){
"use strict";
var RevisionInsertionEndToken = (function () {
    function RevisionInsertionEndToken() {
    }
    RevisionInsertionEndToken.prototype.token = function () { };
    return RevisionInsertionEndToken;
}());
exports.RevisionInsertionEndToken = RevisionInsertionEndToken;

},{}],34:[function(require,module,exports){
"use strict";
var RevisionInsertionStartToken = (function () {
    function RevisionInsertionStartToken() {
    }
    RevisionInsertionStartToken.prototype.token = function () { };
    return RevisionInsertionStartToken;
}());
exports.RevisionInsertionStartToken = RevisionInsertionStartToken;

},{}],35:[function(require,module,exports){
"use strict";
var SpoilerEndToken = (function () {
    function SpoilerEndToken() {
    }
    SpoilerEndToken.prototype.token = function () { };
    return SpoilerEndToken;
}());
exports.SpoilerEndToken = SpoilerEndToken;

},{}],36:[function(require,module,exports){
"use strict";
var SpoilerStartToken = (function () {
    function SpoilerStartToken() {
    }
    SpoilerStartToken.prototype.token = function () { };
    return SpoilerStartToken;
}());
exports.SpoilerStartToken = SpoilerStartToken;

},{}],37:[function(require,module,exports){
"use strict";
var StressEndToken = (function () {
    function StressEndToken() {
    }
    StressEndToken.prototype.token = function () { };
    return StressEndToken;
}());
exports.StressEndToken = StressEndToken;

},{}],38:[function(require,module,exports){
"use strict";
var StressStartToken = (function () {
    function StressStartToken() {
    }
    StressStartToken.prototype.token = function () { };
    return StressStartToken;
}());
exports.StressStartToken = StressStartToken;

},{}],39:[function(require,module,exports){
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

},{"./MediaToken":25}],40:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var HeadingNode_1 = require('../../SyntaxNodes/HeadingNode');
var Patterns_1 = require('./Patterns');
var GetInlineNodes_1 = require('../Inline/GetInlineNodes');
var IsLineFancyOutlineConvention_1 = require('./IsLineFancyOutlineConvention');
var HeadingLeveler_1 = require('./HeadingLeveler');
var NON_BLANK_PATTERN = new RegExp(Patterns_1.NON_BLANK);
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);
function getHeadingParser(headingLeveler) {
    return function parseHeading(args) {
        var consumer = new LineConsumer_1.LineConsumer(args.text);
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
        if (IsLineFancyOutlineConvention_1.isLineFancyOutlineConvention(content, args.config)) {
            return false;
        }
        var headingLevel = headingLeveler.registerUnderlineAndGetLevel(underline);
        args.then([new HeadingNode_1.HeadingNode(GetInlineNodes_1.getInlineNodes(content, args.config), headingLevel)], consumer.lengthConsumed());
        return true;
    };
}
exports.getHeadingParser = getHeadingParser;

},{"../../SyntaxNodes/HeadingNode":68,"../Inline/GetInlineNodes":2,"./HeadingLeveler":43,"./IsLineFancyOutlineConvention":44,"./LineConsumer":45,"./Patterns":54}],41:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var SectionSeparatorNode_1 = require('../../SyntaxNodes/SectionSeparatorNode');
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
function getOutlineNodes(text, config) {
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
    var consumer = new LineConsumer_1.LineConsumer(trimOuterBlankLines(text));
    var nodes = [];
    while (!consumer.done()) {
        for (var _i = 0, outlineParsers_1 = outlineParsers; _i < outlineParsers_1.length; _i++) {
            var parseOutlineConvention = outlineParsers_1[_i];
            var wasConventionFound = parseOutlineConvention({
                text: consumer.remainingText(),
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
var LEADING_BLANK_LINES_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.ANY_WHITESPACE + Patterns_1.LINE_BREAK));
var TRAILIN_BLANK_LINES_PATTERN = new RegExp(Patterns_1.endsWith(Patterns_1.LINE_BREAK + Patterns_1.ANY_WHITESPACE));
function trimOuterBlankLines(text) {
    return (text
        .replace(LEADING_BLANK_LINES_PATTERN, '')
        .replace(TRAILIN_BLANK_LINES_PATTERN, ''));
}

},{"../../SyntaxNodes/SectionSeparatorNode":84,"../CollectionHelpers":1,"./GetHeadingParser":40,"./HeadingLeveler":43,"./LineConsumer":45,"./ParseBlankLineSeparation":46,"./ParseBlockquote":47,"./ParseCodeBlock":48,"./ParseDescriptionList":49,"./ParseOrderedList":50,"./ParseRegularLines":51,"./ParseSectionSeparatorStreak":52,"./ParseUnorderedList":53,"./Patterns":54}],42:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var Patterns_1 = require('./Patterns');
var BLANK_PATTERN = new RegExp(Patterns_1.BLANK);
var INDENTED_PATTERN = new RegExp(Patterns_1.startsWith(Patterns_1.INDENT));
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

},{"./LineConsumer":45,"./Patterns":54}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
"use strict";
var ParseSectionSeparatorStreak_1 = require('./ParseSectionSeparatorStreak');
var ParseBlockquote_1 = require('./ParseBlockquote');
var ParseUnorderedList_1 = require('./ParseUnorderedList');
var ParseOrderedList_1 = require('./ParseOrderedList');
var OUTLINE_CONVENTIONS_POSSIBLY_ONE_LINE_LONG = [
    ParseUnorderedList_1.parseUnorderedList,
    ParseOrderedList_1.parseOrderedList,
    ParseSectionSeparatorStreak_1.parseSectionSeparatorStreak,
    ParseBlockquote_1.parseBlockquote
];
function isLineFancyOutlineConvention(line, config) {
    return OUTLINE_CONVENTIONS_POSSIBLY_ONE_LINE_LONG.some(function (parse) { return parse({
        text: line,
        config: config,
        then: function () { }
    }); });
}
exports.isLineFancyOutlineConvention = isLineFancyOutlineConvention;

},{"./ParseBlockquote":47,"./ParseOrderedList":50,"./ParseSectionSeparatorStreak":52,"./ParseUnorderedList":53}],45:[function(require,module,exports){
"use strict";
var LineConsumer = (function () {
    function LineConsumer(text) {
        this.text = text;
        this.index = 0;
        this.dirty();
    }
    LineConsumer.prototype.done = function () {
        return this.index >= this.text.length;
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
    LineConsumer.prototype.advance = function (countCharacters) {
        this.index += countCharacters;
        this.dirty();
    };
    LineConsumer.prototype.lengthConsumed = function () {
        return this.index;
    };
    LineConsumer.prototype.remainingText = function () {
        return this._remainingText;
    };
    LineConsumer.prototype.dirty = function () {
        this._remainingText = this.text.slice(this.index);
    };
    return LineConsumer;
}());
exports.LineConsumer = LineConsumer;

},{}],46:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var SectionSeparatorNode_1 = require('../../SyntaxNodes/SectionSeparatorNode');
var Patterns_1 = require('./Patterns');
var BLANK_PATTERN = new RegExp(Patterns_1.BLANK);
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

},{"../../SyntaxNodes/SectionSeparatorNode":84,"./LineConsumer":45,"./Patterns":54}],47:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var BlockquoteNode_1 = require('../../SyntaxNodes/BlockquoteNode');
var GetOutlineNodes_1 = require('./GetOutlineNodes');
var Patterns_1 = require('./Patterns');
var BLOCKQUOTE_DELIMITER = '>' + Patterns_1.optional(Patterns_1.INLINE_WHITESPACE_CHAR);
var ALL_BLOCKQUOTE_DELIMITERS_PATTERN = new RegExp(Patterns_1.capture(Patterns_1.startsWith((Patterns_1.atLeast(1, BLOCKQUOTE_DELIMITER)))));
var FIRST_BLOCKQUOTE_DELIMITER_PATTERN = new RegExp(Patterns_1.startsWith(BLOCKQUOTE_DELIMITER));
var TRAILING_SPACE_PATTERN = new RegExp(Patterns_1.endsWith(Patterns_1.INLINE_WHITESPACE_CHAR));
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
    args.then([new BlockquoteNode_1.BlockquoteNode(GetOutlineNodes_1.getOutlineNodes(blockquoteContent, args.config))], consumer.lengthConsumed());
    return true;
}
exports.parseBlockquote = parseBlockquote;
function isLineProperlyBlockquoted(line, delimiters) {
    return TRAILING_SPACE_PATTERN.test(delimiters) || (line === delimiters);
}

},{"../../SyntaxNodes/BlockquoteNode":58,"./GetOutlineNodes":41,"./LineConsumer":45,"./Patterns":54}],48:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var CodeBlockNode_1 = require('../../SyntaxNodes/CodeBlockNode');
var Patterns_1 = require('./Patterns');
var CODE_FENCE_PATTERN = new RegExp(Patterns_1.streakOf('`'));
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

},{"../../SyntaxNodes/CodeBlockNode":59,"./LineConsumer":45,"./Patterns":54}],49:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
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
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var listItemNodes = [];
    var lengthParsed = 0;
    var _loop_1 = function() {
        var rawTerms = [];
        while (!consumer.done()) {
            var isTerm = consumer.consumeLine({
                pattern: NON_BLANK_PATTERN,
                if: function (line) { return !INDENTED_PATTERN.test(line) && !IsLineFancyOutlineConvention_1.isLineFancyOutlineConvention(line, args.config); },
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
                consumer.advance(lengthParsed);
                isListTerminated = shouldTerminateList;
            }
        });
        lengthParsed = consumer.lengthConsumed();
        var terms = rawTerms.map(function (term) { return new DescriptionTerm_1.DescriptionTerm(GetInlineNodes_1.getInlineNodes(term, args.config)); });
        var description = new Description_1.Description(GetOutlineNodes_1.getOutlineNodes(descriptionLines.join('\n'), args.config));
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

},{"../../SyntaxNodes/Description":60,"../../SyntaxNodes/DescriptionListItem":61,"../../SyntaxNodes/DescriptionListNode":62,"../../SyntaxNodes/DescriptionTerm":63,"../Inline/GetInlineNodes":2,"./GetOutlineNodes":41,"./GetRemainingLinesOfListItem":42,"./IsLineFancyOutlineConvention":44,"./LineConsumer":45,"./Patterns":54}],50:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
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
        GetRemainingLinesOfListItem_1.getRemainingLinesOfListItem({
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
        return new OrderedListItem_1.OrderedListItem(GetOutlineNodes_1.getOutlineNodes(rawListItem.content(), args.config), getExplicitOrdinal(rawListItem));
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

},{"../../SyntaxNodes/OrderedListItem":76,"../../SyntaxNodes/OrderedListNode":77,"./GetOutlineNodes":41,"./GetRemainingLinesOfListItem":42,"./LineConsumer":45,"./Patterns":54}],51:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
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
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    var inlineNodesPerRegularLine = [];
    var regularLineNodes = [];
    var terminatingNodes = [];
    var _loop_1 = function() {
        var inlineNodes;
        var wasLineConsumed = consumer.consumeLine({
            pattern: NON_BLANK_LINE_PATTERN,
            if: function (line) { return !IsLineFancyOutlineConvention_1.isLineFancyOutlineConvention(line, args.config); },
            then: function (line) { return inlineNodes = GetInlineNodes_1.getInlineNodes(line, args.config); }
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

},{"../../SyntaxNodes/Line":72,"../../SyntaxNodes/LineBlockNode":73,"../../SyntaxNodes/MediaSyntaxNode":75,"../../SyntaxNodes/ParagraphNode":79,"../../SyntaxNodes/PlainTextNode":80,"../Inline/GetInlineNodes":2,"./IsLineFancyOutlineConvention":44,"./LineConsumer":45,"./Patterns":54}],52:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
var SectionSeparatorNode_1 = require('../../SyntaxNodes/SectionSeparatorNode');
var Patterns_1 = require('./Patterns');
var STREAK_PATTERN = new RegExp(Patterns_1.STREAK);
function parseSectionSeparatorStreak(args) {
    var consumer = new LineConsumer_1.LineConsumer(args.text);
    if (!consumer.consumeLine({ pattern: STREAK_PATTERN })) {
        return false;
    }
    args.then([new SectionSeparatorNode_1.SectionSeparatorNode()], consumer.lengthConsumed());
    return true;
}
exports.parseSectionSeparatorStreak = parseSectionSeparatorStreak;

},{"../../SyntaxNodes/SectionSeparatorNode":84,"./LineConsumer":45,"./Patterns":54}],53:[function(require,module,exports){
"use strict";
var LineConsumer_1 = require('./LineConsumer');
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
        GetRemainingLinesOfListItem_1.getRemainingLinesOfListItem({
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
        return new UnorderedListItem_1.UnorderedListItem(GetOutlineNodes_1.getOutlineNodes(listItemContents, args.config));
    });
    args.then([new UnorderedListNode_1.UnorderedListNode(listItems)], consumer.lengthConsumed());
    return true;
}
exports.parseUnorderedList = parseUnorderedList;

},{"../../SyntaxNodes/UnorderedListItem":87,"../../SyntaxNodes/UnorderedListNode":88,"./GetOutlineNodes":41,"./GetRemainingLinesOfListItem":42,"./LineConsumer":45,"./Patterns":54}],54:[function(require,module,exports){
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

},{}],55:[function(require,module,exports){
"use strict";
var GetOutlineNodes_1 = require('./Outline/GetOutlineNodes');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var ProduceFootnoteBlocks_1 = require('./ProduceFootnoteBlocks');
function parseDocument(text, config) {
    var documentNode = new DocumentNode_1.DocumentNode(GetOutlineNodes_1.getOutlineNodes(text, config));
    ProduceFootnoteBlocks_1.produceFootnoteBlocks(documentNode);
    return documentNode;
}
exports.parseDocument = parseDocument;

},{"../SyntaxNodes/DocumentNode":64,"./Outline/GetOutlineNodes":41,"./ProduceFootnoteBlocks":56}],56:[function(require,module,exports){
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
            var footnotesForNextFootnoteBlock = this.getBlocklessFootnotes(outlineNode);
            if (footnotesForNextFootnoteBlock.length) {
                outlineNodesWithFootnoteBlocks.push(this.getFootnoteBlock(footnotesForNextFootnoteBlock));
            }
        }
        outlineNodeContainer.children = outlineNodesWithFootnoteBlocks;
    };
    FootnoteBlockProducer.prototype.getBlocklessFootnotes = function (node) {
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
    FootnoteBlockProducer.prototype.getFootnotesAndAssignReferenceNumbers = function (nodes) {
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
    FootnoteBlockProducer.prototype.getFootnotesFromInlineContainers = function (containers) {
        var _this = this;
        return CollectionHelpers_1.concat(containers.map(function (container) { return _this.getFootnotesAndAssignReferenceNumbers(container.children); }));
    };
    FootnoteBlockProducer.prototype.getBlocklessFootnotesFromOutlineContainers = function (containers) {
        var _this = this;
        return CollectionHelpers_1.concat(containers.map(function (container) { return _this.getBlocklessFootnotesFromOutlineNodes(container.children); }));
    };
    FootnoteBlockProducer.prototype.getBlocklessFootnotesFromDescriptionList = function (list) {
        var _this = this;
        return CollectionHelpers_1.concat(list.listItems.map(function (item) { return _this.getBlocklessFootnotesFromDescriptionListItem(item); }));
    };
    FootnoteBlockProducer.prototype.getBlocklessFootnotesFromDescriptionListItem = function (item) {
        var footnotesFromTerms = this.getFootnotesFromInlineContainers(item.terms);
        var footnotesFromDescription = this.getBlocklessFootnotesFromOutlineNodes(item.description.children);
        return footnotesFromTerms.concat(footnotesFromDescription);
    };
    FootnoteBlockProducer.prototype.getBlocklessFootnotesFromOutlineNodes = function (nodes) {
        var _this = this;
        return CollectionHelpers_1.concat(nodes.map(function (node) { return _this.getBlocklessFootnotes(node); }));
    };
    FootnoteBlockProducer.prototype.getFootnoteBlock = function (footnotes) {
        var footnoteBlock = new FootnoteBlockNode_1.FootnoteBlockNode(footnotes);
        for (var i = 0; i < footnoteBlock.footnotes.length; i++) {
            var footnote = footnoteBlock.footnotes[i];
            var innerFootnotes = this.getFootnotesAndAssignReferenceNumbers(footnote.children);
            (_a = footnoteBlock.footnotes).push.apply(_a, innerFootnotes);
        }
        return footnoteBlock;
        var _a;
    };
    return FootnoteBlockProducer;
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

},{"../SyntaxNodes/BlockquoteNode":58,"../SyntaxNodes/DescriptionListNode":62,"../SyntaxNodes/FootnoteBlockNode":66,"../SyntaxNodes/FootnoteNode":67,"../SyntaxNodes/HeadingNode":68,"../SyntaxNodes/LineBlockNode":73,"../SyntaxNodes/OrderedListNode":77,"../SyntaxNodes/ParagraphNode":79,"../SyntaxNodes/UnorderedListNode":88,"./CollectionHelpers":1}],57:[function(require,module,exports){
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

},{"./MediaSyntaxNode":75}],58:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":78}],59:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":78}],60:[function(require,module,exports){
"use strict";
var Description = (function () {
    function Description(children) {
        this.children = children;
        this.DESCRIPTION = null;
    }
    return Description;
}());
exports.Description = Description;

},{}],61:[function(require,module,exports){
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

},{}],62:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":78}],63:[function(require,module,exports){
"use strict";
var DescriptionTerm = (function () {
    function DescriptionTerm(children) {
        this.children = children;
        this.DESCRIPTION_TERM = null;
    }
    return DescriptionTerm;
}());
exports.DescriptionTerm = DescriptionTerm;

},{}],64:[function(require,module,exports){
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

},{}],65:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":83}],66:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":78}],67:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":83}],68:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":78}],69:[function(require,module,exports){
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

},{"./MediaSyntaxNode":75}],70:[function(require,module,exports){
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

},{"./InlineSyntaxNode":71}],71:[function(require,module,exports){
"use strict";
var InlineSyntaxNode = (function () {
    function InlineSyntaxNode() {
    }
    InlineSyntaxNode.prototype.inlineSyntaxNode = function () { };
    return InlineSyntaxNode;
}());
exports.InlineSyntaxNode = InlineSyntaxNode;

},{}],72:[function(require,module,exports){
"use strict";
var Line = (function () {
    function Line(children) {
        this.children = children;
        this.LINE = null;
    }
    return Line;
}());
exports.Line = Line;

},{}],73:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":78}],74:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":83}],75:[function(require,module,exports){
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

},{}],76:[function(require,module,exports){
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

},{}],77:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":78}],78:[function(require,module,exports){
"use strict";
var OutlineSyntaxNode = (function () {
    function OutlineSyntaxNode() {
    }
    OutlineSyntaxNode.prototype.outlineSyntaxNode = function () { };
    return OutlineSyntaxNode;
}());
exports.OutlineSyntaxNode = OutlineSyntaxNode;

},{}],79:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":78}],80:[function(require,module,exports){
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
    return (node instanceof PlainTextNode) && !/\S/.test(node.text);
}
exports.isWhitespace = isWhitespace;

},{"./InlineSyntaxNode":71}],81:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":83}],82:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":83}],83:[function(require,module,exports){
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

},{"../SyntaxNodes/InlineSyntaxNode":71}],84:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":78}],85:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":83}],86:[function(require,module,exports){
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

},{"./RichInlineSyntaxNode":83}],87:[function(require,module,exports){
"use strict";
var UnorderedListItem = (function () {
    function UnorderedListItem(children) {
        this.children = children;
        this.UNORDERED_LIST_ITEM = null;
    }
    return UnorderedListItem;
}());
exports.UnorderedListItem = UnorderedListItem;

},{}],88:[function(require,module,exports){
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

},{"./OutlineSyntaxNode":78}],89:[function(require,module,exports){
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

},{"./MediaSyntaxNode":75}],90:[function(require,module,exports){
"use strict";
var ParseDocument_1 = require('./Parsing/ParseDocument');
var HtmlWriter_1 = require('./Writer/HtmlWriter');
var UpConfig_1 = require('./UpConfig');
var Up = (function () {
    function Up(config) {
        this.config = new UpConfig_1.UpConfig(config);
        this.htmlWriter = new HtmlWriter_1.HtmlWriter(this.config);
    }
    Up.prototype.toAst = function (text) {
        return ParseDocument_1.parseDocument(text, this.config);
    };
    Up.prototype.toHtml = function (textOrNode) {
        var node = (typeof textOrNode === 'string'
            ? this.toAst(textOrNode)
            : textOrNode);
        return this.htmlWriter.write(node);
    };
    return Up;
}());
exports.Up = Up;

},{"./Parsing/ParseDocument":55,"./UpConfig":91,"./Writer/HtmlWriter":92}],91:[function(require,module,exports){
"use strict";
var UpConfig = (function () {
    function UpConfig(args) {
        args = args || {};
        var i18n = args.i18n || {};
        var i18nTerms = i18n.terms || {};
        this.settings = {
            documentName: args.documentName || '',
            i18n: {
                idWordDelimiter: i18n.idWordDelimiter || '-',
                terms: {
                    image: i18nTerms.image || 'image',
                    audio: i18nTerms.audio || 'audio',
                    video: i18nTerms.video || 'video',
                    spoiler: i18nTerms.spoiler || 'spoiler',
                    footnote: i18nTerms.footnote || 'footnote',
                    footnoteReference: i18nTerms.footnoteReference || 'footnote reference',
                }
            }
        };
    }
    return UpConfig;
}());
exports.UpConfig = UpConfig;

},{}],92:[function(require,module,exports){
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
            id: this.footnoteReferenceId(node.referenceNumber),
            'data-footnote-reference': null
        });
    };
    HtmlWriter.prototype.footnoteBlock = function (node) {
        var _this = this;
        return htmlElement('dl', node.footnotes.map(function (footnote) { return _this.footnote(footnote); }).join(''), { 'data-footnotes': null });
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

},{"../SyntaxNodes/LinkNode":74,"../SyntaxNodes/OrderedListNode":77,"../SyntaxNodes/PlainTextNode":80,"./Writer":93}],93:[function(require,module,exports){
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

},{"../SyntaxNodes/AudioNode":57,"../SyntaxNodes/BlockquoteNode":58,"../SyntaxNodes/CodeBlockNode":59,"../SyntaxNodes/DescriptionListNode":62,"../SyntaxNodes/DocumentNode":64,"../SyntaxNodes/EmphasisNode":65,"../SyntaxNodes/FootnoteBlockNode":66,"../SyntaxNodes/FootnoteNode":67,"../SyntaxNodes/HeadingNode":68,"../SyntaxNodes/ImageNode":69,"../SyntaxNodes/InlineCodeNode":70,"../SyntaxNodes/LineBlockNode":73,"../SyntaxNodes/LinkNode":74,"../SyntaxNodes/OrderedListNode":77,"../SyntaxNodes/ParagraphNode":79,"../SyntaxNodes/PlainTextNode":80,"../SyntaxNodes/RevisionDeletionNode":81,"../SyntaxNodes/RevisionInsertionNode":82,"../SyntaxNodes/SectionSeparatorNode":84,"../SyntaxNodes/SpoilerNode":85,"../SyntaxNodes/StressNode":86,"../SyntaxNodes/UnorderedListNode":88,"../SyntaxNodes/VideoNode":89}],94:[function(require,module,exports){
"use strict";
var Up_1 = require('./Up');
var up = new Up_1.Up();
function toAst(text) {
    return up.toAst(text);
}
exports.toAst = toAst;
function toHtml(textOrNode) {
    return up.toHtml(textOrNode);
}
exports.toHtml = toHtml;

},{"./Up":90}]},{},[94])(94)
});