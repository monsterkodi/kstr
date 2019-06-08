// koffee 0.56.0

/*
 0000000   000   000   0000000  000
000   000  0000  000  000       000
000000000  000 0 000  0000000   000
000   000  000  0000       000  000
000   000  000   000  0000000   000
 */
var Ansi, STYLES, j, pull, results, toHexString,
    indexOf = [].indexOf;

pull = require('lodash.pull');

STYLES = {
    f0: 'color:#000',
    f1: 'color:#F00',
    f2: 'color:#0D0',
    f3: 'color:#DD0',
    f4: 'color:#00F',
    f5: 'color:#D0D',
    f6: 'color:#0DD',
    f7: 'color:#AAA',
    f8: 'color:#555',
    f9: 'color:#F55',
    f10: 'color:#5F5',
    f11: 'color:#FF5',
    f12: 'color:#55F',
    f13: 'color:#F5F',
    f14: 'color:#5FF',
    f15: 'color:#FFF',
    b0: 'background-color:#000',
    b1: 'background-color:#A00',
    b2: 'background-color:#0A0',
    b3: 'background-color:#A50',
    b4: 'background-color:#00A',
    b5: 'background-color:#A0A',
    b6: 'background-color:#0AA',
    b7: 'background-color:#AAA',
    b8: 'background-color:#555',
    b9: 'background-color:#F55',
    b10: 'background-color:#5F5',
    b11: 'background-color:#FF5',
    b12: 'background-color:#55F',
    b13: 'background-color:#F5F',
    b14: 'background-color:#5FF',
    b15: 'background-color:#FFF'
};

toHexString = function(num) {
    num = num.toString(16);
    while (num.length < 2) {
        num = "0" + num;
    }
    return num;
};

[0, 1, 2, 3, 4, 5].forEach(function(red) {
    return [0, 1, 2, 3, 4, 5].forEach(function(green) {
        return [0, 1, 2, 3, 4, 5].forEach(function(blue) {
            var b, c, g, n, r, rgb;
            c = 16 + (red * 36) + (green * 6) + blue;
            r = red > 0 ? red * 40 + 55 : 0;
            g = green > 0 ? green * 40 + 55 : 0;
            b = blue > 0 ? blue * 40 + 55 : 0;
            rgb = ((function() {
                var j, len, ref, results;
                ref = [r, g, b];
                results = [];
                for (j = 0, len = ref.length; j < len; j++) {
                    n = ref[j];
                    results.push(toHexString(n));
                }
                return results;
            })()).join('');
            STYLES["f" + c] = "color:#" + rgb;
            return STYLES["b" + c] = "background-color:#" + rgb;
        });
    });
});

(function() {
    results = [];
    for (j = 0; j <= 23; j++){ results.push(j); }
    return results;
}).apply(this).forEach(function(gray) {
    var c, l;
    c = gray + 232;
    l = toHexString(gray * 10 + 8);
    STYLES["f" + c] = "color:#" + l + l + l;
    return STYLES["b" + c] = "background-color:#" + l + l + l;
});

Ansi = (function() {
    function Ansi() {}

    Ansi.html = function(s) {
        var andi, d, diss, htmlLine, i, k, l, len, lines, o, ref, ref1, ref2, span;
        andi = new Ansi();
        lines = [];
        ref1 = (ref = s != null ? s.split('\n') : void 0) != null ? ref : [];
        for (k = 0, len = ref1.length; k < len; k++) {
            l = ref1[k];
            diss = andi.dissect(l)[1];
            htmlLine = '';
            for (i = o = 0, ref2 = diss.length; 0 <= ref2 ? o < ref2 : o > ref2; i = 0 <= ref2 ? ++o : --o) {
                d = diss[i];
                span = d.styl && ("<span style=\"" + d.styl + "\">" + d.match + "</span>") || d.match;
                if (parseInt(i)) {
                    if (diss[i - 1].start + diss[i - 1].match.length < d.start) {
                        htmlLine += ' ';
                    }
                }
                htmlLine += span;
            }
            lines.push(htmlLine);
        }
        return lines.join('\n');
    };

    Ansi.prototype.dissect = function(input) {
        this.input = input;
        this.diss = [];
        this.text = "";
        this.tokenize();
        return [this.text, this.diss];
    };

    Ansi.prototype.tokenize = function() {
        var addStyle, addText, ansiCode, ansiHandler, ansiMatch, bg, delStyle, fg, handler, i, k, len, length, process, resetStyle, results1, st, start, toHighIntensity, tokens;
        start = 0;
        ansiHandler = 2;
        ansiMatch = false;
        fg = bg = '';
        st = [];
        resetStyle = function() {
            fg = '';
            bg = '';
            return st = [];
        };
        addStyle = function(style) {
            if (indexOf.call(st, style) < 0) {
                return st.push(style);
            }
        };
        delStyle = function(style) {
            return pull(st, style);
        };
        addText = (function(_this) {
            return function(t) {
                var match, style, txt;
                _this.text += t;
                txt = _this.text.slice(start);
                match = txt.trim();
                if (match.length) {
                    style = '';
                    if (fg.length) {
                        style += fg + ';';
                    }
                    if (bg.length) {
                        style += bg + ';';
                    }
                    if (st.length) {
                        style += st.join(';');
                    }
                    _this.diss.push({
                        match: match,
                        start: start + txt.search(/[^\s]/),
                        styl: style
                    });
                }
                start = _this.text.length;
                return '';
            };
        })(this);
        toHighIntensity = function(c) {
            var i, k;
            for (i = k = 0; k <= 7; i = ++k) {
                if (c === STYLES["f" + i]) {
                    return STYLES["f" + (8 + i)];
                }
            }
            return c;
        };
        ansiCode = function(m, c) {
            var code, cs, k, len;
            ansiMatch = true;
            if (c.trim().length === 0) {
                c = '0';
            }
            cs = c.trimRight(';').split(';');
            for (k = 0, len = cs.length; k < len; k++) {
                code = cs[k];
                code = parseInt(code, 10);
                switch (false) {
                    case code !== 0:
                        resetStyle();
                        break;
                    case code !== 1:
                        addStyle('font-weight:bold');
                        fg = toHighIntensity(fg);
                        break;
                    case code !== 2:
                        addStyle('opacity:0.5');
                        break;
                    case code !== 4:
                        addStyle('text-decoration:underline');
                        break;
                    case code !== 8:
                        addStyle('display:none');
                        break;
                    case code !== 9:
                        addStyle('text-decoration:line-through');
                        break;
                    case code !== 39:
                        fg = STYLES["f15"];
                        break;
                    case code !== 49:
                        bg = STYLES["b0"];
                        break;
                    case code !== 38:
                        fg = STYLES["f" + cs[2]];
                        break;
                    case code !== 48:
                        bg = STYLES["b" + cs[2]];
                        break;
                    case !((30 <= code && code <= 37)):
                        fg = STYLES["f" + (code - 30)];
                        break;
                    case !((40 <= code && code <= 47)):
                        bg = STYLES["b" + (code - 40)];
                        break;
                    case !((90 <= code && code <= 97)):
                        fg = STYLES["f" + (8 + code - 90)];
                        break;
                    case !((100 <= code && code <= 107)):
                        bg = STYLES["b" + (8 + code - 100)];
                        break;
                    case code !== 28:
                        delStyle('display:none');
                        break;
                    case code !== 22:
                        delStyle('font-weight:bold');
                        delStyle('opacity:0.5');
                }
                if (code === 38 || code === 48) {
                    break;
                }
            }
            return '';
        };
        tokens = [
            {
                pattern: /^\x08+/,
                sub: ''
            }, {
                pattern: /^\x1b\[[012]?K/,
                sub: ''
            }, {
                pattern: /^\x1b\[((?:\d{1,3};?)+|)m/,
                sub: ansiCode
            }, {
                pattern: /^\x1b\[?[\d;]{0,3}/,
                sub: ''
            }, {
                pattern: /^([^\x1b\x08\n]+)/,
                sub: addText
            }
        ];
        process = (function(_this) {
            return function(handler, i) {
                if (i > ansiHandler && ansiMatch) {
                    return;
                }
                ansiMatch = false;
                return _this.input = _this.input.replace(handler.pattern, handler.sub);
            };
        })(this);
        results1 = [];
        while ((length = this.input.length) > 0) {
            for (i = k = 0, len = tokens.length; k < len; i = ++k) {
                handler = tokens[i];
                process(handler, i);
            }
            if (this.input.length === length) {
                break;
            } else {
                results1.push(void 0);
            }
        }
        return results1;
    };

    return Ansi;

})();

module.exports = Ansi;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zaS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUEsMkNBQUE7SUFBQTs7QUFVQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVI7O0FBRVAsTUFBQSxHQUNJO0lBQUEsRUFBQSxFQUFLLFlBQUw7SUFDQSxFQUFBLEVBQUssWUFETDtJQUVBLEVBQUEsRUFBSyxZQUZMO0lBR0EsRUFBQSxFQUFLLFlBSEw7SUFJQSxFQUFBLEVBQUssWUFKTDtJQUtBLEVBQUEsRUFBSyxZQUxMO0lBTUEsRUFBQSxFQUFLLFlBTkw7SUFPQSxFQUFBLEVBQUssWUFQTDtJQVFBLEVBQUEsRUFBSyxZQVJMO0lBU0EsRUFBQSxFQUFLLFlBVEw7SUFVQSxHQUFBLEVBQUssWUFWTDtJQVdBLEdBQUEsRUFBSyxZQVhMO0lBWUEsR0FBQSxFQUFLLFlBWkw7SUFhQSxHQUFBLEVBQUssWUFiTDtJQWNBLEdBQUEsRUFBSyxZQWRMO0lBZUEsR0FBQSxFQUFLLFlBZkw7SUFnQkEsRUFBQSxFQUFLLHVCQWhCTDtJQWlCQSxFQUFBLEVBQUssdUJBakJMO0lBa0JBLEVBQUEsRUFBSyx1QkFsQkw7SUFtQkEsRUFBQSxFQUFLLHVCQW5CTDtJQW9CQSxFQUFBLEVBQUssdUJBcEJMO0lBcUJBLEVBQUEsRUFBSyx1QkFyQkw7SUFzQkEsRUFBQSxFQUFLLHVCQXRCTDtJQXVCQSxFQUFBLEVBQUssdUJBdkJMO0lBd0JBLEVBQUEsRUFBSyx1QkF4Qkw7SUF5QkEsRUFBQSxFQUFLLHVCQXpCTDtJQTBCQSxHQUFBLEVBQUssdUJBMUJMO0lBMkJBLEdBQUEsRUFBSyx1QkEzQkw7SUE0QkEsR0FBQSxFQUFLLHVCQTVCTDtJQTZCQSxHQUFBLEVBQUssdUJBN0JMO0lBOEJBLEdBQUEsRUFBSyx1QkE5Qkw7SUErQkEsR0FBQSxFQUFLLHVCQS9CTDs7O0FBaUNKLFdBQUEsR0FBYyxTQUFDLEdBQUQ7SUFDVixHQUFBLEdBQU0sR0FB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QUMsTUFBUCxLQUFpQixNQUExQjtBQUFBLHNCQUFBO2FBQUEsTUFBQTtzQ0FBQTs7UUFGSixDQUFBOztJQWxGTTs7Ozs7O0FBc0ZkLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4gMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgIDAwMFxuMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgICAwMDBcbjAwMDAwMDAwMCAgMDAwIDAgMDAwICAwMDAwMDAwICAgMDAwXG4wMDAgICAwMDAgIDAwMCAgMDAwMCAgICAgICAwMDAgIDAwMFxuMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAwMDBcbiMjI1xuXG4jIGJhc2VkIG9uIGNvZGUgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vcmJ1cm5zL2Fuc2ktdG8taHRtbFxuXG5wdWxsID0gcmVxdWlyZSAnbG9kYXNoLnB1bGwnXG5cblNUWUxFUyA9XG4gICAgZjA6ICAnY29sb3I6IzAwMCcgIyBub3JtYWwgaW50ZW5zaXR5XG4gICAgZjE6ICAnY29sb3I6I0YwMCdcbiAgICBmMjogICdjb2xvcjojMEQwJ1xuICAgIGYzOiAgJ2NvbG9yOiNERDAnXG4gICAgZjQ6ICAnY29sb3I6IzAwRidcbiAgICBmNTogICdjb2xvcjojRDBEJ1xuICAgIGY2OiAgJ2NvbG9yOiMwREQnXG4gICAgZjc6ICAnY29sb3I6I0FBQSdcbiAgICBmODogICdjb2xvcjojNTU1JyAjIGhpZ2ggaW50ZW5zaXR5XG4gICAgZjk6ICAnY29sb3I6I0Y1NSdcbiAgICBmMTA6ICdjb2xvcjojNUY1J1xuICAgIGYxMTogJ2NvbG9yOiNGRjUnXG4gICAgZjEyOiAnY29sb3I6IzU1RidcbiAgICBmMTM6ICdjb2xvcjojRjVGJ1xuICAgIGYxNDogJ2NvbG9yOiM1RkYnXG4gICAgZjE1OiAnY29sb3I6I0ZGRidcbiAgICBiMDogICdiYWNrZ3JvdW5kLWNvbG9yOiMwMDAnICMgbm9ybWFsIGludGVuc2l0eVxuICAgIGIxOiAgJ2JhY2tncm91bmQtY29sb3I6I0EwMCdcbiAgICBiMjogICdiYWNrZ3JvdW5kLWNvbG9yOiMwQTAnXG4gICAgYjM6ICAnYmFja2dyb3VuZC1jb2xvcjojQTUwJ1xuICAgIGI0OiAgJ2JhY2tncm91bmQtY29sb3I6IzAwQSdcbiAgICBiNTogICdiYWNrZ3JvdW5kLWNvbG9yOiNBMEEnXG4gICAgYjY6ICAnYmFja2dyb3VuZC1jb2xvcjojMEFBJ1xuICAgIGI3OiAgJ2JhY2tncm91bmQtY29sb3I6I0FBQSdcbiAgICBiODogICdiYWNrZ3JvdW5kLWNvbG9yOiM1NTUnICMgaGlnaCBpbnRlbnNpdHlcbiAgICBiOTogICdiYWNrZ3JvdW5kLWNvbG9yOiNGNTUnXG4gICAgYjEwOiAnYmFja2dyb3VuZC1jb2xvcjojNUY1J1xuICAgIGIxMTogJ2JhY2tncm91bmQtY29sb3I6I0ZGNSdcbiAgICBiMTI6ICdiYWNrZ3JvdW5kLWNvbG9yOiM1NUYnXG4gICAgYjEzOiAnYmFja2dyb3VuZC1jb2xvcjojRjVGJ1xuICAgIGIxNDogJ2JhY2tncm91bmQtY29sb3I6IzVGRidcbiAgICBiMTU6ICdiYWNrZ3JvdW5kLWNvbG9yOiNGRkYnXG5cbnRvSGV4U3RyaW5nID0gKG51bSkgLT5cbiAgICBudW0gPSBudW0udG9TdHJpbmcoMTYpXG4gICAgd2hpbGUgbnVtLmxlbmd0aCA8IDIgdGhlbiBudW0gPSBcIjAje251bX1cIlxuICAgIG51bVxuXG5bMC4uNV0uZm9yRWFjaCAocmVkKSAtPlxuICAgIFswLi41XS5mb3JFYWNoIChncmVlbikgLT5cbiAgICAgICAgWzAuLjVdLmZvckVhY2ggKGJsdWUpIC0+XG4gICAgICAgICAgICBjID0gMTYgKyAocmVkICogMzYpICsgKGdyZWVuICogNikgKyBibHVlXG4gICAgICAgICAgICByID0gaWYgcmVkICAgPiAwIHRoZW4gcmVkICAgKiA0MCArIDU1IGVsc2UgMFxuICAgICAgICAgICAgZyA9IGlmIGdyZWVuID4gMCB0aGVuIGdyZWVuICogNDAgKyA1NSBlbHNlIDBcbiAgICAgICAgICAgIGIgPSBpZiBibHVlICA+IDAgdGhlbiBibHVlICAqIDQwICsgNTUgZWxzZSAwICAgICAgICAgICAgXG4gICAgICAgICAgICByZ2IgPSAodG9IZXhTdHJpbmcobikgZm9yIG4gaW4gW3IsIGcsIGJdKS5qb2luKCcnKVxuICAgICAgICAgICAgU1RZTEVTW1wiZiN7Y31cIl0gPSBcImNvbG9yOiMje3JnYn1cIlxuICAgICAgICAgICAgU1RZTEVTW1wiYiN7Y31cIl0gPSBcImJhY2tncm91bmQtY29sb3I6IyN7cmdifVwiXG5cblswLi4yM10uZm9yRWFjaCAoZ3JheSkgLT5cbiAgICBjID0gZ3JheSsyMzJcbiAgICBsID0gdG9IZXhTdHJpbmcoZ3JheSoxMCArIDgpXG4gICAgU1RZTEVTW1wiZiN7Y31cIl0gPSBcImNvbG9yOiMje2x9I3tsfSN7bH1cIlxuICAgIFNUWUxFU1tcImIje2N9XCJdID0gXCJiYWNrZ3JvdW5kLWNvbG9yOiMje2x9I3tsfSN7bH1cIlxuXG4jICAwMDAwMDAwICAgMDAwICAgMDAwICAgMDAwMDAwMCAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgICAgMDAwXG4jIDAwMDAwMDAwMCAgMDAwIDAgMDAwICAwMDAwMDAwICAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAwICAgICAgIDAwMCAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwXG5cbmNsYXNzIEFuc2lcbiAgICBcbiAgICBAaHRtbDogKHMpIC0+IFxuICAgIFxuICAgICAgICBhbmRpID0gbmV3IEFuc2koKVxuICAgICAgICBsaW5lcyA9IFtdXG4gICAgICAgIGZvciBsIGluIHM/LnNwbGl0KCdcXG4nKSA/IFtdXG4gICAgICAgICAgICBkaXNzID0gYW5kaS5kaXNzZWN0KGwpWzFdXG4gICAgICAgICAgICBodG1sTGluZSA9ICcnXG4gICAgICAgICAgICBmb3IgaSBpbiBbMC4uLmRpc3MubGVuZ3RoXVxuICAgICAgICAgICAgICAgIGQgPSBkaXNzW2ldXG4gICAgICAgICAgICAgICAgc3BhbiA9IGQuc3R5bCBhbmQgXCI8c3BhbiBzdHlsZT1cXFwiI3tkLnN0eWx9XFxcIj4je2QubWF0Y2h9PC9zcGFuPlwiIG9yIGQubWF0Y2hcbiAgICAgICAgICAgICAgICBpZiBwYXJzZUludCBpXG4gICAgICAgICAgICAgICAgICAgIGlmIGRpc3NbaS0xXS5zdGFydCArIGRpc3NbaS0xXS5tYXRjaC5sZW5ndGggPCBkLnN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sTGluZSArPSAnICdcbiAgICAgICAgICAgICAgICBodG1sTGluZSArPSBzcGFuXG4gICAgICAgICAgICBsaW5lcy5wdXNoIGh0bWxMaW5lXG4gICAgICAgIGxpbmVzLmpvaW4gJ1xcbidcbiAgICAgICAgXG4gICAgZGlzc2VjdDogKEBpbnB1dCkgLT5cbiAgICAgICAgXG4gICAgICAgIEBkaXNzICA9IFtdXG4gICAgICAgIEB0ZXh0ICA9IFwiXCJcbiAgICAgICAgQHRva2VuaXplKClcbiAgICAgICAgW0B0ZXh0LCBAZGlzc11cblxuICAgIHRva2VuaXplOiAoKSAtPlxuICAgICAgICBcbiAgICAgICAgc3RhcnQgICAgICAgPSAwXG4gICAgICAgIGFuc2lIYW5kbGVyID0gMlxuICAgICAgICBhbnNpTWF0Y2ggICA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICBmZyA9IGJnID0gJydcbiAgICAgICAgc3QgPSBbXVxuXG4gICAgICAgIHJlc2V0U3R5bGUgPSAoKSAtPlxuICAgICAgICAgICAgZmcgPSAnJ1xuICAgICAgICAgICAgYmcgPSAnJ1xuICAgICAgICAgICAgc3QgPSBbXVxuICAgICAgICAgICAgXG4gICAgICAgIGFkZFN0eWxlID0gKHN0eWxlKSAtPiBzdC5wdXNoIHN0eWxlIGlmIHN0eWxlIG5vdCBpbiBzdFxuICAgICAgICBkZWxTdHlsZSA9IChzdHlsZSkgLT4gcHVsbCBzdCwgc3R5bGVcbiAgICAgICAgXG4gICAgICAgIGFkZFRleHQgPSAodCkgPT5cbiAgICAgICAgICAgIEB0ZXh0ICs9IHRcbiAgICAgICAgICAgIHR4dCA9IEB0ZXh0LnNsaWNlIHN0YXJ0XG4gICAgICAgICAgICBtYXRjaCA9IHR4dC50cmltKClcbiAgICAgICAgICAgIGlmIG1hdGNoLmxlbmd0aFxuICAgICAgICAgICAgICAgIHN0eWxlID0gJydcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBmZyArICc7JyAgICBpZiBmZy5sZW5ndGhcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBiZyArICc7JyAgICBpZiBiZy5sZW5ndGhcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBzdC5qb2luICc7JyBpZiBzdC5sZW5ndGhcbiAgICAgICAgICAgICAgICBAZGlzcy5wdXNoXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoOiBtYXRjaFxuICAgICAgICAgICAgICAgICAgICBzdGFydDogc3RhcnQgKyB0eHQuc2VhcmNoIC9bXlxcc10vXG4gICAgICAgICAgICAgICAgICAgIHN0eWw6ICBzdHlsZVxuICAgICAgICAgICAgc3RhcnQgPSBAdGV4dC5sZW5ndGhcbiAgICAgICAgICAgICcnXG4gICAgICAgIFxuICAgICAgICB0b0hpZ2hJbnRlbnNpdHkgPSAoYykgLT5cbiAgICAgICAgICAgIGZvciBpIGluIFswLi43XVxuICAgICAgICAgICAgICAgIGlmIGMgPT0gU1RZTEVTW1wiZiN7aX1cIl1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNUWUxFU1tcImYjezgraX1cIl1cbiAgICAgICAgICAgIGNcbiAgICAgICAgXG4gICAgICAgIGFuc2lDb2RlID0gKG0sIGMpIC0+XG4gICAgICAgICAgICBhbnNpTWF0Y2ggPSB0cnVlXG4gICAgICAgICAgICBjID0gJzAnIGlmIGMudHJpbSgpLmxlbmd0aCBpcyAwICAgICAgICAgICAgXG4gICAgICAgICAgICBjcyA9IGMudHJpbVJpZ2h0KCc7Jykuc3BsaXQoJzsnKSAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yIGNvZGUgaW4gY3NcbiAgICAgICAgICAgICAgICBjb2RlID0gcGFyc2VJbnQgY29kZSwgMTBcbiAgICAgICAgICAgICAgICBzd2l0Y2ggXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAwICAgICAgICAgIHRoZW4gcmVzZXRTdHlsZSgpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAxICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkU3R5bGUgJ2ZvbnQtd2VpZ2h0OmJvbGQnXG4gICAgICAgICAgICAgICAgICAgICAgICBmZyA9IHRvSGlnaEludGVuc2l0eSBmZ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgMiAgICAgICAgICB0aGVuIGFkZFN0eWxlICdvcGFjaXR5OjAuNSdcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDQgICAgICAgICAgdGhlbiBhZGRTdHlsZSAndGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZSdcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDggICAgICAgICAgdGhlbiBhZGRTdHlsZSAnZGlzcGxheTpub25lJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgOSAgICAgICAgICB0aGVuIGFkZFN0eWxlICd0ZXh0LWRlY29yYXRpb246bGluZS10aHJvdWdoJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgMzkgICAgICAgICB0aGVuIGZnID0gU1RZTEVTW1wiZjE1XCJdICMgZGVmYXVsdCBmb3JlZ3JvdW5kXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyA0OSAgICAgICAgIHRoZW4gYmcgPSBTVFlMRVNbXCJiMFwiXSAgIyBkZWZhdWx0IGJhY2tncm91bmRcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDM4ICAgICAgICAgdGhlbiBmZyA9IFNUWUxFU1tcImYje2NzWzJdfVwiXSAjIGV4dGVuZGVkIGZnIDM4OzU7WzAtMjU1XVxuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgNDggICAgICAgICB0aGVuIGJnID0gU1RZTEVTW1wiYiN7Y3NbMl19XCJdICMgZXh0ZW5kZWQgYmcgNDg7NTtbMC0yNTVdXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gIDMwIDw9IGNvZGUgPD0gMzcgIHRoZW4gZmcgPSBTVFlMRVNbXCJmI3tjb2RlIC0gMzB9XCJdICMgbm9ybWFsIGludGVuc2l0eVxuICAgICAgICAgICAgICAgICAgICB3aGVuICA0MCA8PSBjb2RlIDw9IDQ3ICB0aGVuIGJnID0gU1RZTEVTW1wiYiN7Y29kZSAtIDQwfVwiXVxuICAgICAgICAgICAgICAgICAgICB3aGVuICA5MCA8PSBjb2RlIDw9IDk3ICB0aGVuIGZnID0gU1RZTEVTW1wiZiN7OCtjb2RlIC0gOTB9XCJdICAjIGhpZ2ggaW50ZW5zaXR5XG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMTAwIDw9IGNvZGUgPD0gMTA3IHRoZW4gYmcgPSBTVFlMRVNbXCJiI3s4K2NvZGUgLSAxMDB9XCJdXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAyOCAgICAgICAgIHRoZW4gZGVsU3R5bGUgJ2Rpc3BsYXk6bm9uZSdcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDIyICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxTdHlsZSAnZm9udC13ZWlnaHQ6Ym9sZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbFN0eWxlICdvcGFjaXR5OjAuNSdcbiAgICAgICAgICAgICAgICBicmVhayBpZiBjb2RlIGluIFszOCwgNDhdXG4gICAgICAgICAgICAnJ1xuICAgICAgICAgICAgXG4gICAgICAgIHRva2VucyA9IFtcbiAgICAgICAgICAgIHtwYXR0ZXJuOiAvXlxceDA4Ky8sICAgICAgICAgICAgICAgICAgICAgc3ViOiAnJ31cbiAgICAgICAgICAgIHtwYXR0ZXJuOiAvXlxceDFiXFxbWzAxMl0/Sy8sICAgICAgICAgICAgIHN1YjogJyd9XG4gICAgICAgICAgICB7cGF0dGVybjogL15cXHgxYlxcWygoPzpcXGR7MSwzfTs/KSt8KW0vLCAgc3ViOiBhbnNpQ29kZX0gXG4gICAgICAgICAgICB7cGF0dGVybjogL15cXHgxYlxcWz9bXFxkO117MCwzfS8sICAgICAgICAgc3ViOiAnJ31cbiAgICAgICAgICAgIHtwYXR0ZXJuOiAvXihbXlxceDFiXFx4MDhcXG5dKykvLCAgICAgICAgICBzdWI6IGFkZFRleHR9XG4gICAgICAgICBdXG5cbiAgICAgICAgcHJvY2VzcyA9IChoYW5kbGVyLCBpKSA9PlxuICAgICAgICAgICAgcmV0dXJuIGlmIGkgPiBhbnNpSGFuZGxlciBhbmQgYW5zaU1hdGNoICMgZ2l2ZSBhbnNpSGFuZGxlciBhbm90aGVyIGNoYW5jZSBpZiBpdCBtYXRjaGVzXG4gICAgICAgICAgICBhbnNpTWF0Y2ggPSBmYWxzZVxuICAgICAgICAgICAgQGlucHV0ID0gQGlucHV0LnJlcGxhY2UgaGFuZGxlci5wYXR0ZXJuLCBoYW5kbGVyLnN1YlxuXG4gICAgICAgIHdoaWxlIChsZW5ndGggPSBAaW5wdXQubGVuZ3RoKSA+IDBcbiAgICAgICAgICAgIHByb2Nlc3MoaGFuZGxlciwgaSkgZm9yIGhhbmRsZXIsIGkgaW4gdG9rZW5zXG4gICAgICAgICAgICBicmVhayBpZiBAaW5wdXQubGVuZ3RoID09IGxlbmd0aFxuICAgICAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IEFuc2lcblxuIl19
//# sourceURL=../coffee/ansi.coffee