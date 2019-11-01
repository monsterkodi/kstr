// koffee 1.4.0

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
                var addMatch, addSpace, i, k, match, mstrt, ref, space, sstrt;
                start = _this.text.length;
                match = '';
                mstrt = start;
                space = '';
                sstrt = start;
                addMatch = function() {
                    var style;
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
                            start: mstrt,
                            styl: style
                        });
                        return match = '';
                    }
                };
                addSpace = function() {
                    if (space.length) {
                        _this.diss.push({
                            match: space,
                            start: sstrt,
                            styl: bg + ';'
                        });
                        return space = '';
                    }
                };
                for (i = k = 0, ref = t.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
                    if (t[i] !== ' ') {
                        if (match === '') {
                            mstrt = start + i;
                        }
                        match += t[i];
                        addSpace();
                    } else {
                        if (bg.length) {
                            if (space === '') {
                                sstrt = start + i;
                            }
                            space += t[i];
                        }
                        addMatch();
                    }
                }
                addMatch();
                addSpace();
                _this.text += t;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zaS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUEsMkNBQUE7SUFBQTs7QUFVQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVI7O0FBRVAsTUFBQSxHQUNJO0lBQUEsRUFBQSxFQUFLLFlBQUw7SUFDQSxFQUFBLEVBQUssWUFETDtJQUVBLEVBQUEsRUFBSyxZQUZMO0lBR0EsRUFBQSxFQUFLLFlBSEw7SUFJQSxFQUFBLEVBQUssWUFKTDtJQUtBLEVBQUEsRUFBSyxZQUxMO0lBTUEsRUFBQSxFQUFLLFlBTkw7SUFPQSxFQUFBLEVBQUssWUFQTDtJQVFBLEVBQUEsRUFBSyxZQVJMO0lBU0EsRUFBQSxFQUFLLFlBVEw7SUFVQSxHQUFBLEVBQUssWUFWTDtJQVdBLEdBQUEsRUFBSyxZQVhMO0lBWUEsR0FBQSxFQUFLLFlBWkw7SUFhQSxHQUFBLEVBQUssWUFiTDtJQWNBLEdBQUEsRUFBSyxZQWRMO0lBZUEsR0FBQSxFQUFLLFlBZkw7SUFnQkEsRUFBQSxFQUFLLHVCQWhCTDtJQWlCQSxFQUFBLEVBQUssdUJBakJMO0lBa0JBLEVBQUEsRUFBSyx1QkFsQkw7SUFtQkEsRUFBQSxFQUFLLHVCQW5CTDtJQW9CQSxFQUFBLEVBQUssdUJBcEJMO0lBcUJBLEVBQUEsRUFBSyx1QkFyQkw7SUFzQkEsRUFBQSxFQUFLLHVCQXRCTDtJQXVCQSxFQUFBLEVBQUssdUJBdkJMO0lBd0JBLEVBQUEsRUFBSyx1QkF4Qkw7SUF5QkEsRUFBQSxFQUFLLHVCQXpCTDtJQTBCQSxHQUFBLEVBQUssdUJBMUJMO0lBMkJBLEdBQUEsRUFBSyx1QkEzQkw7SUE0QkEsR0FBQSxFQUFLLHVCQTVCTDtJQTZCQSxHQUFBLEVBQUssdUJBN0JMO0lBOEJBLEdBQUEsRUFBSyx1QkE5Qkw7SUErQkEsR0FBQSxFQUFLLHVCQS9CTDs7O0FBaUNKLFdBQUEsR0FBYyxTQUFDLEdBQUQ7SUFDVixHQUFBLEdBQU0sR0FB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QyxHQUFBLEVBQUssRUFBN0M7YUFGSyxFQUdMO2dCQUFDLE9BQUEsRUFBUywyQkFBVjtnQkFBd0MsR0FBQSxFQUFLLFFBQTdDO2FBSEssRUFJTDtnQkFBQyxPQUFBLEVBQVMsb0JBQVY7Z0JBQXdDLEdBQUEsRUFBSyxFQUE3QzthQUpLLEVBS0w7Z0JBQUMsT0FBQSxFQUFTLG1CQUFWO2dCQUF3QyxHQUFBLEVBQUssT0FBN0M7YUFMSzs7UUFRVCxPQUFBLEdBQVUsQ0FBQSxTQUFBLEtBQUE7bUJBQUEsU0FBQyxPQUFELEVBQVUsQ0FBVjtnQkFDTixJQUFVLENBQUEsR0FBSSxXQUFKLElBQW9CLFNBQTlCO0FBQUEsMkJBQUE7O2dCQUNBLFNBQUEsR0FBWTt1QkFDWixLQUFDLENBQUEsS0FBRCxHQUFTLEtBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFlLE9BQU8sQ0FBQyxPQUF2QixFQUFnQyxPQUFPLENBQUMsR0FBeEM7WUFISDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7QUFLVjtlQUFNLENBQUMsTUFBQSxHQUFTLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBakIsQ0FBQSxHQUEyQixDQUFqQztBQUNJLGlCQUFBLGdEQUFBOztnQkFBQSxPQUFBLENBQVEsT0FBUixFQUFpQixDQUFqQjtBQUFBO1lBQ0EsSUFBUyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsS0FBaUIsTUFBMUI7QUFBQSxzQkFBQTthQUFBLE1BQUE7c0NBQUE7O1FBRkosQ0FBQTs7SUFoSE07Ozs7OztBQW9IZCxNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAwMDBcbjAwMCAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgICAgMDAwXG4wMDAwMDAwMDAgIDAwMCAwIDAwMCAgMDAwMDAwMCAgIDAwMFxuMDAwICAgMDAwICAwMDAgIDAwMDAgICAgICAgMDAwICAwMDBcbjAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwXG4jIyNcblxuIyBiYXNlZCBvbiBjb2RlIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3JidXJucy9hbnNpLXRvLWh0bWxcblxucHVsbCA9IHJlcXVpcmUgJ2xvZGFzaC5wdWxsJ1xuXG5TVFlMRVMgPVxuICAgIGYwOiAgJ2NvbG9yOiMwMDAnICMgbm9ybWFsIGludGVuc2l0eVxuICAgIGYxOiAgJ2NvbG9yOiNGMDAnXG4gICAgZjI6ICAnY29sb3I6IzBEMCdcbiAgICBmMzogICdjb2xvcjojREQwJ1xuICAgIGY0OiAgJ2NvbG9yOiMwMEYnXG4gICAgZjU6ICAnY29sb3I6I0QwRCdcbiAgICBmNjogICdjb2xvcjojMEREJ1xuICAgIGY3OiAgJ2NvbG9yOiNBQUEnXG4gICAgZjg6ICAnY29sb3I6IzU1NScgIyBoaWdoIGludGVuc2l0eVxuICAgIGY5OiAgJ2NvbG9yOiNGNTUnXG4gICAgZjEwOiAnY29sb3I6IzVGNSdcbiAgICBmMTE6ICdjb2xvcjojRkY1J1xuICAgIGYxMjogJ2NvbG9yOiM1NUYnXG4gICAgZjEzOiAnY29sb3I6I0Y1RidcbiAgICBmMTQ6ICdjb2xvcjojNUZGJ1xuICAgIGYxNTogJ2NvbG9yOiNGRkYnXG4gICAgYjA6ICAnYmFja2dyb3VuZC1jb2xvcjojMDAwJyAjIG5vcm1hbCBpbnRlbnNpdHlcbiAgICBiMTogICdiYWNrZ3JvdW5kLWNvbG9yOiNBMDAnXG4gICAgYjI6ICAnYmFja2dyb3VuZC1jb2xvcjojMEEwJ1xuICAgIGIzOiAgJ2JhY2tncm91bmQtY29sb3I6I0E1MCdcbiAgICBiNDogICdiYWNrZ3JvdW5kLWNvbG9yOiMwMEEnXG4gICAgYjU6ICAnYmFja2dyb3VuZC1jb2xvcjojQTBBJ1xuICAgIGI2OiAgJ2JhY2tncm91bmQtY29sb3I6IzBBQSdcbiAgICBiNzogICdiYWNrZ3JvdW5kLWNvbG9yOiNBQUEnXG4gICAgYjg6ICAnYmFja2dyb3VuZC1jb2xvcjojNTU1JyAjIGhpZ2ggaW50ZW5zaXR5XG4gICAgYjk6ICAnYmFja2dyb3VuZC1jb2xvcjojRjU1J1xuICAgIGIxMDogJ2JhY2tncm91bmQtY29sb3I6IzVGNSdcbiAgICBiMTE6ICdiYWNrZ3JvdW5kLWNvbG9yOiNGRjUnXG4gICAgYjEyOiAnYmFja2dyb3VuZC1jb2xvcjojNTVGJ1xuICAgIGIxMzogJ2JhY2tncm91bmQtY29sb3I6I0Y1RidcbiAgICBiMTQ6ICdiYWNrZ3JvdW5kLWNvbG9yOiM1RkYnXG4gICAgYjE1OiAnYmFja2dyb3VuZC1jb2xvcjojRkZGJ1xuXG50b0hleFN0cmluZyA9IChudW0pIC0+XG4gICAgbnVtID0gbnVtLnRvU3RyaW5nKDE2KVxuICAgIHdoaWxlIG51bS5sZW5ndGggPCAyIHRoZW4gbnVtID0gXCIwI3tudW19XCJcbiAgICBudW1cblxuWzAuLjVdLmZvckVhY2ggKHJlZCkgLT5cbiAgICBbMC4uNV0uZm9yRWFjaCAoZ3JlZW4pIC0+XG4gICAgICAgIFswLi41XS5mb3JFYWNoIChibHVlKSAtPlxuICAgICAgICAgICAgYyA9IDE2ICsgKHJlZCAqIDM2KSArIChncmVlbiAqIDYpICsgYmx1ZVxuICAgICAgICAgICAgciA9IGlmIHJlZCAgID4gMCB0aGVuIHJlZCAgICogNDAgKyA1NSBlbHNlIDBcbiAgICAgICAgICAgIGcgPSBpZiBncmVlbiA+IDAgdGhlbiBncmVlbiAqIDQwICsgNTUgZWxzZSAwXG4gICAgICAgICAgICBiID0gaWYgYmx1ZSAgPiAwIHRoZW4gYmx1ZSAgKiA0MCArIDU1IGVsc2UgMCAgICAgICAgICAgIFxuICAgICAgICAgICAgcmdiID0gKHRvSGV4U3RyaW5nKG4pIGZvciBuIGluIFtyLCBnLCBiXSkuam9pbignJylcbiAgICAgICAgICAgIFNUWUxFU1tcImYje2N9XCJdID0gXCJjb2xvcjojI3tyZ2J9XCJcbiAgICAgICAgICAgIFNUWUxFU1tcImIje2N9XCJdID0gXCJiYWNrZ3JvdW5kLWNvbG9yOiMje3JnYn1cIlxuXG5bMC4uMjNdLmZvckVhY2ggKGdyYXkpIC0+XG4gICAgYyA9IGdyYXkrMjMyXG4gICAgbCA9IHRvSGV4U3RyaW5nKGdyYXkqMTAgKyA4KVxuICAgIFNUWUxFU1tcImYje2N9XCJdID0gXCJjb2xvcjojI3tsfSN7bH0je2x9XCJcbiAgICBTVFlMRVNbXCJiI3tjfVwiXSA9IFwiYmFja2dyb3VuZC1jb2xvcjojI3tsfSN7bH0je2x9XCJcblxuIyAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgICAgIDAwMFxuIyAwMDAwMDAwMDAgIDAwMCAwIDAwMCAgMDAwMDAwMCAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwMCAgICAgICAwMDAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMFxuXG5jbGFzcyBBbnNpXG4gICAgXG4gICAgQGh0bWw6IChzKSAtPiBcbiAgICBcbiAgICAgICAgYW5kaSA9IG5ldyBBbnNpKClcbiAgICAgICAgbGluZXMgPSBbXVxuICAgICAgICBmb3IgbCBpbiBzPy5zcGxpdCgnXFxuJykgPyBbXVxuICAgICAgICAgICAgZGlzcyA9IGFuZGkuZGlzc2VjdChsKVsxXVxuICAgICAgICAgICAgaHRtbExpbmUgPSAnJ1xuICAgICAgICAgICAgZm9yIGkgaW4gWzAuLi5kaXNzLmxlbmd0aF1cbiAgICAgICAgICAgICAgICBkID0gZGlzc1tpXVxuICAgICAgICAgICAgICAgIHNwYW4gPSBkLnN0eWwgYW5kIFwiPHNwYW4gc3R5bGU9XFxcIiN7ZC5zdHlsfVxcXCI+I3tkLm1hdGNofTwvc3Bhbj5cIiBvciBkLm1hdGNoXG4gICAgICAgICAgICAgICAgaWYgcGFyc2VJbnQgaVxuICAgICAgICAgICAgICAgICAgICBpZiBkaXNzW2ktMV0uc3RhcnQgKyBkaXNzW2ktMV0ubWF0Y2gubGVuZ3RoIDwgZC5zdGFydFxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbExpbmUgKz0gJyAnXG4gICAgICAgICAgICAgICAgaHRtbExpbmUgKz0gc3BhblxuICAgICAgICAgICAgbGluZXMucHVzaCBodG1sTGluZVxuICAgICAgICBsaW5lcy5qb2luICdcXG4nXG4gICAgICAgIFxuICAgIGRpc3NlY3Q6IChAaW5wdXQpIC0+XG4gICAgICAgIFxuICAgICAgICBAZGlzcyAgPSBbXVxuICAgICAgICBAdGV4dCAgPSBcIlwiXG4gICAgICAgIEB0b2tlbml6ZSgpXG4gICAgICAgIFtAdGV4dCwgQGRpc3NdXG5cbiAgICB0b2tlbml6ZTogKCkgLT5cbiAgICAgICAgXG4gICAgICAgIHN0YXJ0ICAgICAgID0gMFxuICAgICAgICBhbnNpSGFuZGxlciA9IDJcbiAgICAgICAgYW5zaU1hdGNoICAgPSBmYWxzZVxuICAgICAgICBcbiAgICAgICAgZmcgPSBiZyA9ICcnXG4gICAgICAgIHN0ID0gW11cblxuICAgICAgICByZXNldFN0eWxlID0gKCkgLT5cbiAgICAgICAgICAgIGZnID0gJydcbiAgICAgICAgICAgIGJnID0gJydcbiAgICAgICAgICAgIHN0ID0gW11cbiAgICAgICAgICAgIFxuICAgICAgICBhZGRTdHlsZSA9IChzdHlsZSkgLT4gc3QucHVzaCBzdHlsZSBpZiBzdHlsZSBub3QgaW4gc3RcbiAgICAgICAgZGVsU3R5bGUgPSAoc3R5bGUpIC0+IHB1bGwgc3QsIHN0eWxlXG4gICAgICAgIFxuICAgICAgICBhZGRUZXh0ID0gKHQpID0+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHN0YXJ0ID0gQHRleHQubGVuZ3RoXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG1hdGNoID0gJydcbiAgICAgICAgICAgIG1zdHJ0ID0gc3RhcnRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc3BhY2UgPSAnJ1xuICAgICAgICAgICAgc3N0cnQgPSBzdGFydFxuXG4gICAgICAgICAgICBhZGRNYXRjaCA9ID0+XG4gICAgICAgICAgICAgICAgaWYgbWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlID0gJydcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUgKz0gZmcgKyAnOycgICAgaWYgZmcubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlICs9IGJnICsgJzsnICAgIGlmIGJnLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSBzdC5qb2luICc7JyBpZiBzdC5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgQGRpc3MucHVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2g6IG1hdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbXN0cnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWw6ICBzdHlsZVxuICAgICAgICAgICAgICAgICAgICBtYXRjaCA9ICcnXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFkZFNwYWNlID0gPT5cbiAgICAgICAgICAgICAgICBpZiBzcGFjZS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgQGRpc3MucHVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2g6IHNwYWNlXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogc3N0cnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWw6ICBiZyArICc7J1xuICAgICAgICAgICAgICAgICAgICBzcGFjZSA9ICcnXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yIGkgaW4gWzAuLi50Lmxlbmd0aF1cbiAgICAgICAgICAgICAgICBpZiB0W2ldICE9ICcgJ1xuICAgICAgICAgICAgICAgICAgICBtc3RydCA9IHN0YXJ0K2kgaWYgbWF0Y2ggPT0gJydcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2ggKz0gdFtpXVxuICAgICAgICAgICAgICAgICAgICBhZGRTcGFjZSgpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBpZiBiZy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgIHNzdHJ0ID0gc3RhcnQraSBpZiBzcGFjZSA9PSAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2UgKz0gdFtpXVxuICAgICAgICAgICAgICAgICAgICBhZGRNYXRjaCgpXG4gICAgICAgICAgICBhZGRNYXRjaCgpICAgICAgICAgICAgXG4gICAgICAgICAgICBhZGRTcGFjZSgpICAgICAgICAgICAgXG4gICAgICAgICAgICBAdGV4dCArPSB0XG4gICAgICAgICAgICBzdGFydCA9IEB0ZXh0Lmxlbmd0aFxuICAgICAgICAgICAgJydcbiAgICAgICAgXG4gICAgICAgIHRvSGlnaEludGVuc2l0eSA9IChjKSAtPlxuICAgICAgICAgICAgZm9yIGkgaW4gWzAuLjddXG4gICAgICAgICAgICAgICAgaWYgYyA9PSBTVFlMRVNbXCJmI3tpfVwiXVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU1RZTEVTW1wiZiN7OCtpfVwiXVxuICAgICAgICAgICAgY1xuICAgICAgICBcbiAgICAgICAgYW5zaUNvZGUgPSAobSwgYykgLT5cbiAgICAgICAgICAgIGFuc2lNYXRjaCA9IHRydWVcbiAgICAgICAgICAgIGMgPSAnMCcgaWYgYy50cmltKCkubGVuZ3RoIGlzIDAgICAgICAgICAgICBcbiAgICAgICAgICAgIGNzID0gYy50cmltUmlnaHQoJzsnKS5zcGxpdCgnOycpICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgY29kZSBpbiBjc1xuICAgICAgICAgICAgICAgIGNvZGUgPSBwYXJzZUludCBjb2RlLCAxMFxuICAgICAgICAgICAgICAgIHN3aXRjaCBcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDAgICAgICAgICAgdGhlbiByZXNldFN0eWxlKClcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDEgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRTdHlsZSAnZm9udC13ZWlnaHQ6Ym9sZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIGZnID0gdG9IaWdoSW50ZW5zaXR5IGZnXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAyICAgICAgICAgIHRoZW4gYWRkU3R5bGUgJ29wYWNpdHk6MC41J1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgNCAgICAgICAgICB0aGVuIGFkZFN0eWxlICd0ZXh0LWRlY29yYXRpb246dW5kZXJsaW5lJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgOCAgICAgICAgICB0aGVuIGFkZFN0eWxlICdkaXNwbGF5Om5vbmUnXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyA5ICAgICAgICAgIHRoZW4gYWRkU3R5bGUgJ3RleHQtZGVjb3JhdGlvbjpsaW5lLXRocm91Z2gnXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAzOSAgICAgICAgIHRoZW4gZmcgPSBTVFlMRVNbXCJmMTVcIl0gIyBkZWZhdWx0IGZvcmVncm91bmRcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDQ5ICAgICAgICAgdGhlbiBiZyA9IFNUWUxFU1tcImIwXCJdICAjIGRlZmF1bHQgYmFja2dyb3VuZFxuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgMzggICAgICAgICB0aGVuIGZnID0gU1RZTEVTW1wiZiN7Y3NbMl19XCJdICMgZXh0ZW5kZWQgZmcgMzg7NTtbMC0yNTVdXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyA0OCAgICAgICAgIHRoZW4gYmcgPSBTVFlMRVNbXCJiI3tjc1syXX1cIl0gIyBleHRlbmRlZCBiZyA0ODs1O1swLTI1NV1cbiAgICAgICAgICAgICAgICAgICAgd2hlbiAgMzAgPD0gY29kZSA8PSAzNyAgdGhlbiBmZyA9IFNUWUxFU1tcImYje2NvZGUgLSAzMH1cIl0gIyBub3JtYWwgaW50ZW5zaXR5XG4gICAgICAgICAgICAgICAgICAgIHdoZW4gIDQwIDw9IGNvZGUgPD0gNDcgIHRoZW4gYmcgPSBTVFlMRVNbXCJiI3tjb2RlIC0gNDB9XCJdXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gIDkwIDw9IGNvZGUgPD0gOTcgIHRoZW4gZmcgPSBTVFlMRVNbXCJmI3s4K2NvZGUgLSA5MH1cIl0gICMgaGlnaCBpbnRlbnNpdHlcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAxMDAgPD0gY29kZSA8PSAxMDcgdGhlbiBiZyA9IFNUWUxFU1tcImIjezgrY29kZSAtIDEwMH1cIl1cbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDI4ICAgICAgICAgdGhlbiBkZWxTdHlsZSAnZGlzcGxheTpub25lJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgMjIgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbFN0eWxlICdmb250LXdlaWdodDpib2xkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsU3R5bGUgJ29wYWNpdHk6MC41J1xuICAgICAgICAgICAgICAgIGJyZWFrIGlmIGNvZGUgaW4gWzM4LCA0OF1cbiAgICAgICAgICAgICcnXG4gICAgICAgICAgICBcbiAgICAgICAgdG9rZW5zID0gW1xuICAgICAgICAgICAge3BhdHRlcm46IC9eXFx4MDgrLywgICAgICAgICAgICAgICAgICAgICBzdWI6ICcnfVxuICAgICAgICAgICAge3BhdHRlcm46IC9eXFx4MWJcXFtbMDEyXT9LLywgICAgICAgICAgICAgc3ViOiAnJ31cbiAgICAgICAgICAgIHtwYXR0ZXJuOiAvXlxceDFiXFxbKCg/OlxcZHsxLDN9Oz8pK3wpbS8sICBzdWI6IGFuc2lDb2RlfSBcbiAgICAgICAgICAgIHtwYXR0ZXJuOiAvXlxceDFiXFxbP1tcXGQ7XXswLDN9LywgICAgICAgICBzdWI6ICcnfVxuICAgICAgICAgICAge3BhdHRlcm46IC9eKFteXFx4MWJcXHgwOFxcbl0rKS8sICAgICAgICAgIHN1YjogYWRkVGV4dH1cbiAgICAgICAgIF1cblxuICAgICAgICBwcm9jZXNzID0gKGhhbmRsZXIsIGkpID0+XG4gICAgICAgICAgICByZXR1cm4gaWYgaSA+IGFuc2lIYW5kbGVyIGFuZCBhbnNpTWF0Y2ggIyBnaXZlIGFuc2lIYW5kbGVyIGFub3RoZXIgY2hhbmNlIGlmIGl0IG1hdGNoZXNcbiAgICAgICAgICAgIGFuc2lNYXRjaCA9IGZhbHNlXG4gICAgICAgICAgICBAaW5wdXQgPSBAaW5wdXQucmVwbGFjZSBoYW5kbGVyLnBhdHRlcm4sIGhhbmRsZXIuc3ViXG5cbiAgICAgICAgd2hpbGUgKGxlbmd0aCA9IEBpbnB1dC5sZW5ndGgpID4gMFxuICAgICAgICAgICAgcHJvY2VzcyhoYW5kbGVyLCBpKSBmb3IgaGFuZGxlciwgaSBpbiB0b2tlbnNcbiAgICAgICAgICAgIGJyZWFrIGlmIEBpbnB1dC5sZW5ndGggPT0gbGVuZ3RoXG4gICAgICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gQW5zaVxuXG4iXX0=
//# sourceURL=../coffee/ansi.coffee