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
    f0: '#000',
    f1: '#F00',
    f2: '#0D0',
    f3: '#DD0',
    f4: '#00F',
    f5: '#D0D',
    f6: '#0DD',
    f7: '#AAA',
    f8: '#555',
    f9: '#F55',
    f10: '#5F5',
    f11: '#FF5',
    f12: '#55F',
    f13: '#F5F',
    f14: '#5FF',
    f15: '#FFF',
    b0: '#000',
    b1: '#A00',
    b2: '#0A0',
    b3: '#A50',
    b4: '#00A',
    b5: '#A0A',
    b6: '#0AA',
    b7: '#AAA',
    b8: '#555',
    b9: '#F55',
    b10: '#5F5',
    b11: '#FF5',
    b12: '#55F',
    b13: '#F5F',
    b14: '#5FF',
    b15: '#FFF'
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
            STYLES["f" + c] = "#" + rgb;
            return STYLES["b" + c] = "#" + rgb;
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
    STYLES["f" + c] = "#" + l + l + l;
    return STYLES["b" + c] = "#" + l + l + l;
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
        var addStyle, addText, ansiCode, ansiHandler, ansiMatch, bg, delStyle, fg, handler, i, invert, k, len, length, process, resetStyle, results1, setBG, setFG, st, start, toHighIntensity, tokens;
        start = 0;
        ansiHandler = 2;
        ansiMatch = false;
        invert = false;
        fg = bg = '';
        st = [];
        resetStyle = function() {
            fg = bg = '';
            invert = false;
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
        setFG = function(cs) {
            if (cs.length === 5) {
                return fg = "rgb(" + cs[2] + "," + cs[3] + "," + cs[4] + ")";
            } else {
                return fg = STYLES["f" + cs[2]];
            }
        };
        setBG = function(cs) {
            if (cs.length === 5) {
                return bg = "rgb(" + cs[2] + "," + cs[3] + "," + cs[4] + ")";
            } else {
                return bg = STYLES["b" + cs[2]];
            }
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
                        if (invert) {
                            if (bg.length) {
                                style += "color:" + bg + ";";
                            } else {
                                style += 'color:#000;';
                            }
                            if (fg.length) {
                                style += "background-color:" + fg + ";";
                            } else {
                                style += 'background-color:#fff;';
                            }
                        } else {
                            if (fg.length) {
                                style += "color:" + fg + ";";
                            }
                            if (bg.length) {
                                style += "background-color:" + bg + ";";
                            }
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
                            styl: "background-color:" + bg + ";"
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
                    case code !== 7:
                        invert = true;
                        break;
                    case code !== 27:
                        invert = false;
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
                        setFG(cs);
                        break;
                    case code !== 48:
                        setBG(cs);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zaS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUEsMkNBQUE7SUFBQTs7QUFVQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVI7O0FBRVAsTUFBQSxHQUNJO0lBQUEsRUFBQSxFQUFLLE1BQUw7SUFDQSxFQUFBLEVBQUssTUFETDtJQUVBLEVBQUEsRUFBSyxNQUZMO0lBR0EsRUFBQSxFQUFLLE1BSEw7SUFJQSxFQUFBLEVBQUssTUFKTDtJQUtBLEVBQUEsRUFBSyxNQUxMO0lBTUEsRUFBQSxFQUFLLE1BTkw7SUFPQSxFQUFBLEVBQUssTUFQTDtJQVFBLEVBQUEsRUFBSyxNQVJMO0lBU0EsRUFBQSxFQUFLLE1BVEw7SUFVQSxHQUFBLEVBQUssTUFWTDtJQVdBLEdBQUEsRUFBSyxNQVhMO0lBWUEsR0FBQSxFQUFLLE1BWkw7SUFhQSxHQUFBLEVBQUssTUFiTDtJQWNBLEdBQUEsRUFBSyxNQWRMO0lBZUEsR0FBQSxFQUFLLE1BZkw7SUFnQkEsRUFBQSxFQUFLLE1BaEJMO0lBaUJBLEVBQUEsRUFBSyxNQWpCTDtJQWtCQSxFQUFBLEVBQUssTUFsQkw7SUFtQkEsRUFBQSxFQUFLLE1BbkJMO0lBb0JBLEVBQUEsRUFBSyxNQXBCTDtJQXFCQSxFQUFBLEVBQUssTUFyQkw7SUFzQkEsRUFBQSxFQUFLLE1BdEJMO0lBdUJBLEVBQUEsRUFBSyxNQXZCTDtJQXdCQSxFQUFBLEVBQUssTUF4Qkw7SUF5QkEsRUFBQSxFQUFLLE1BekJMO0lBMEJBLEdBQUEsRUFBSyxNQTFCTDtJQTJCQSxHQUFBLEVBQUssTUEzQkw7SUE0QkEsR0FBQSxFQUFLLE1BNUJMO0lBNkJBLEdBQUEsRUFBSyxNQTdCTDtJQThCQSxHQUFBLEVBQUssTUE5Qkw7SUErQkEsR0FBQSxFQUFLLE1BL0JMOzs7QUFpQ0osV0FBQSxHQUFjLFNBQUMsR0FBRDtJQUNWLEdBQUEsR0FBTSxHQUFHLENBQUMsUUFBSixDQUFh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QkFBQyxPQUFBLEVBQVMsMkJBQVY7Z0JBQXdDLEdBQUEsRUFBSyxRQUE3QzthQUhLLEVBSUw7Z0JBQUMsT0FBQSxFQUFTLG9CQUFWO2dCQUF3QyxHQUFBLEVBQUssRUFBN0M7YUFKSyxFQUtMO2dCQUFDLE9BQUEsRUFBUyxtQkFBVjtnQkFBd0MsR0FBQSxFQUFLLE9BQTdDO2FBTEs7O1FBUVQsT0FBQSxHQUFVLENBQUEsU0FBQSxLQUFBO21CQUFBLFNBQUMsT0FBRCxFQUFVLENBQVY7Z0JBQ04sSUFBVSxDQUFBLEdBQUksV0FBSixJQUFvQixTQUE5QjtBQUFBLDJCQUFBOztnQkFDQSxTQUFBLEdBQVk7dUJBQ1osS0FBQyxDQUFBLEtBQUQsR0FBUyxLQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBZSxPQUFPLENBQUMsT0FBdkIsRUFBZ0MsT0FBTyxDQUFDLEdBQXhDO1lBSEg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO0FBS1Y7ZUFBTSxDQUFDLE1BQUEsR0FBUyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQWpCLENBQUEsR0FBMkIsQ0FBakM7QUFDSSxpQkFBQSxnREFBQTs7Z0JBQUEsT0FBQSxDQUFRLE9BQVIsRUFBaUIsQ0FBakI7QUFBQTtZQUNBLElBQVMsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLEtBQWlCLE1BQTFCO0FBQUEsc0JBQUE7YUFBQSxNQUFBO3NDQUFBOztRQUZKLENBQUE7O0lBMUlNOzs7Ozs7QUE4SWQsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbiAwMDAwMDAwICAgMDAwICAgMDAwICAgMDAwMDAwMCAgMDAwXG4wMDAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgICAgIDAwMFxuMDAwMDAwMDAwICAwMDAgMCAwMDAgIDAwMDAwMDAgICAwMDBcbjAwMCAgIDAwMCAgMDAwICAwMDAwICAgICAgIDAwMCAgMDAwXG4wMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMFxuIyMjXG5cbiMgYmFzZWQgb24gY29kZSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9yYnVybnMvYW5zaS10by1odG1sXG5cbnB1bGwgPSByZXF1aXJlICdsb2Rhc2gucHVsbCdcblxuU1RZTEVTID1cbiAgICBmMDogICcjMDAwJyAjIG5vcm1hbCBpbnRlbnNpdHlcbiAgICBmMTogICcjRjAwJ1xuICAgIGYyOiAgJyMwRDAnXG4gICAgZjM6ICAnI0REMCdcbiAgICBmNDogICcjMDBGJ1xuICAgIGY1OiAgJyNEMEQnXG4gICAgZjY6ICAnIzBERCdcbiAgICBmNzogICcjQUFBJ1xuICAgIGY4OiAgJyM1NTUnICMgaGlnaCBpbnRlbnNpdHlcbiAgICBmOTogICcjRjU1J1xuICAgIGYxMDogJyM1RjUnXG4gICAgZjExOiAnI0ZGNSdcbiAgICBmMTI6ICcjNTVGJ1xuICAgIGYxMzogJyNGNUYnXG4gICAgZjE0OiAnIzVGRidcbiAgICBmMTU6ICcjRkZGJ1xuICAgIGIwOiAgJyMwMDAnICMgbm9ybWFsIGludGVuc2l0eVxuICAgIGIxOiAgJyNBMDAnXG4gICAgYjI6ICAnIzBBMCdcbiAgICBiMzogICcjQTUwJ1xuICAgIGI0OiAgJyMwMEEnXG4gICAgYjU6ICAnI0EwQSdcbiAgICBiNjogICcjMEFBJ1xuICAgIGI3OiAgJyNBQUEnXG4gICAgYjg6ICAnIzU1NScgIyBoaWdoIGludGVuc2l0eVxuICAgIGI5OiAgJyNGNTUnXG4gICAgYjEwOiAnIzVGNSdcbiAgICBiMTE6ICcjRkY1J1xuICAgIGIxMjogJyM1NUYnXG4gICAgYjEzOiAnI0Y1RidcbiAgICBiMTQ6ICcjNUZGJ1xuICAgIGIxNTogJyNGRkYnXG5cbnRvSGV4U3RyaW5nID0gKG51bSkgLT5cbiAgICBudW0gPSBudW0udG9TdHJpbmcoMTYpXG4gICAgd2hpbGUgbnVtLmxlbmd0aCA8IDIgdGhlbiBudW0gPSBcIjAje251bX1cIlxuICAgIG51bVxuXG5bMC4uNV0uZm9yRWFjaCAocmVkKSAtPlxuICAgIFswLi41XS5mb3JFYWNoIChncmVlbikgLT5cbiAgICAgICAgWzAuLjVdLmZvckVhY2ggKGJsdWUpIC0+XG4gICAgICAgICAgICBjID0gMTYgKyAocmVkICogMzYpICsgKGdyZWVuICogNikgKyBibHVlXG4gICAgICAgICAgICByID0gaWYgcmVkICAgPiAwIHRoZW4gcmVkICAgKiA0MCArIDU1IGVsc2UgMFxuICAgICAgICAgICAgZyA9IGlmIGdyZWVuID4gMCB0aGVuIGdyZWVuICogNDAgKyA1NSBlbHNlIDBcbiAgICAgICAgICAgIGIgPSBpZiBibHVlICA+IDAgdGhlbiBibHVlICAqIDQwICsgNTUgZWxzZSAwICAgICAgICAgICAgXG4gICAgICAgICAgICByZ2IgPSAodG9IZXhTdHJpbmcobikgZm9yIG4gaW4gW3IsIGcsIGJdKS5qb2luKCcnKVxuICAgICAgICAgICAgU1RZTEVTW1wiZiN7Y31cIl0gPSBcIiMje3JnYn1cIlxuICAgICAgICAgICAgU1RZTEVTW1wiYiN7Y31cIl0gPSBcIiMje3JnYn1cIlxuXG5bMC4uMjNdLmZvckVhY2ggKGdyYXkpIC0+XG4gICAgYyA9IGdyYXkrMjMyXG4gICAgbCA9IHRvSGV4U3RyaW5nKGdyYXkqMTAgKyA4KVxuICAgIFNUWUxFU1tcImYje2N9XCJdID0gXCIjI3tsfSN7bH0je2x9XCJcbiAgICBTVFlMRVNbXCJiI3tjfVwiXSA9IFwiIyN7bH0je2x9I3tsfVwiXG5cbiMgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAwMDBcbiMgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgICAwMDBcbiMgMDAwMDAwMDAwICAwMDAgMCAwMDAgIDAwMDAwMDAgICAwMDBcbiMgMDAwICAgMDAwICAwMDAgIDAwMDAgICAgICAgMDAwICAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAwMDBcblxuY2xhc3MgQW5zaVxuICAgIFxuICAgIEBodG1sOiAocykgLT4gXG4gICAgXG4gICAgICAgIGFuZGkgPSBuZXcgQW5zaSgpXG4gICAgICAgIGxpbmVzID0gW11cbiAgICAgICAgZm9yIGwgaW4gcz8uc3BsaXQoJ1xcbicpID8gW11cbiAgICAgICAgICAgIGRpc3MgPSBhbmRpLmRpc3NlY3QobClbMV1cbiAgICAgICAgICAgIGh0bWxMaW5lID0gJydcbiAgICAgICAgICAgIGZvciBpIGluIFswLi4uZGlzcy5sZW5ndGhdXG4gICAgICAgICAgICAgICAgZCA9IGRpc3NbaV1cbiAgICAgICAgICAgICAgICBzcGFuID0gZC5zdHlsIGFuZCBcIjxzcGFuIHN0eWxlPVxcXCIje2Quc3R5bH1cXFwiPiN7ZC5tYXRjaH08L3NwYW4+XCIgb3IgZC5tYXRjaFxuICAgICAgICAgICAgICAgIGlmIHBhcnNlSW50IGlcbiAgICAgICAgICAgICAgICAgICAgaWYgZGlzc1tpLTFdLnN0YXJ0ICsgZGlzc1tpLTFdLm1hdGNoLmxlbmd0aCA8IGQuc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWxMaW5lICs9ICcgJ1xuICAgICAgICAgICAgICAgIGh0bWxMaW5lICs9IHNwYW5cbiAgICAgICAgICAgIGxpbmVzLnB1c2ggaHRtbExpbmVcbiAgICAgICAgbGluZXMuam9pbiAnXFxuJ1xuICAgICAgICBcbiAgICBkaXNzZWN0OiAoQGlucHV0KSAtPlxuICAgICAgICBcbiAgICAgICAgQGRpc3MgID0gW11cbiAgICAgICAgQHRleHQgID0gXCJcIlxuICAgICAgICBAdG9rZW5pemUoKVxuICAgICAgICBbQHRleHQsIEBkaXNzXVxuXG4gICAgdG9rZW5pemU6ICgpIC0+XG4gICAgICAgIFxuICAgICAgICBzdGFydCAgICAgICA9IDBcbiAgICAgICAgYW5zaUhhbmRsZXIgPSAyXG4gICAgICAgIGFuc2lNYXRjaCAgID0gZmFsc2VcbiAgICAgICAgXG4gICAgICAgIGludmVydCA9IGZhbHNlXG4gICAgICAgIGZnID0gYmcgPSAnJ1xuICAgICAgICBzdCA9IFtdXG5cbiAgICAgICAgcmVzZXRTdHlsZSA9IC0+XG4gICAgICAgICAgICBmZyA9IGJnID0gJydcbiAgICAgICAgICAgIGludmVydCA9IGZhbHNlXG4gICAgICAgICAgICBzdCA9IFtdXG4gICAgICAgICAgICBcbiAgICAgICAgYWRkU3R5bGUgPSAoc3R5bGUpIC0+IHN0LnB1c2ggc3R5bGUgaWYgc3R5bGUgbm90IGluIHN0XG4gICAgICAgIGRlbFN0eWxlID0gKHN0eWxlKSAtPiBwdWxsIHN0LCBzdHlsZVxuICAgICAgICBcbiAgICAgICAgc2V0RkcgPSAoY3MpIC0+IFxuICAgICAgICAgICAgaWYgY3MubGVuZ3RoID09IDVcbiAgICAgICAgICAgICAgICBmZyA9IFwicmdiKCN7Y3NbMl19LCN7Y3NbM119LCN7Y3NbNF19KVwiXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZmcgPSBTVFlMRVNbXCJmI3tjc1syXX1cIl0gIyBleHRlbmRlZCBmZyAzODs1O1swLTI1NV1cbiAgICAgICAgc2V0QkcgPSAoY3MpIC0+IFxuICAgICAgICAgICAgaWYgY3MubGVuZ3RoID09IDVcbiAgICAgICAgICAgICAgICBiZyA9IFwicmdiKCN7Y3NbMl19LCN7Y3NbM119LCN7Y3NbNF19KVwiXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYmcgPSBTVFlMRVNbXCJiI3tjc1syXX1cIl0gIyBleHRlbmRlZCBiZyA0ODs1O1swLTI1NV1cbiAgICAgICAgXG4gICAgICAgIGFkZFRleHQgPSAodCkgPT5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc3RhcnQgPSBAdGV4dC5sZW5ndGhcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbWF0Y2ggPSAnJ1xuICAgICAgICAgICAgbXN0cnQgPSBzdGFydFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzcGFjZSA9ICcnXG4gICAgICAgICAgICBzc3RydCA9IHN0YXJ0XG5cbiAgICAgICAgICAgIGFkZE1hdGNoID0gPT5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiBtYXRjaC5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUgPSAnJ1xuICAgICAgICAgICAgICAgICAgICBpZiBpbnZlcnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGJnLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlICs9IFwiY29sb3I6I3tiZ307XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSAnY29sb3I6IzAwMDsnIFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBmZy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSBcImJhY2tncm91bmQtY29sb3I6I3tmZ307XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGUgKz0gJ2JhY2tncm91bmQtY29sb3I6I2ZmZjsnICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSBcImNvbG9yOiN7Zmd9O1wiICAgICAgICAgICAgaWYgZmcubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSBcImJhY2tncm91bmQtY29sb3I6I3tiZ307XCIgaWYgYmcubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlICs9IHN0LmpvaW4gJzsnIGlmIHN0Lmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICBAZGlzcy5wdXNoXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaDogbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBtc3RydFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bDogIHN0eWxlXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoID0gJydcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWRkU3BhY2UgPSA9PlxuICAgICAgICAgICAgICAgIGlmIHNwYWNlLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICBAZGlzcy5wdXNoXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaDogc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBzc3RydFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bDogIFwiYmFja2dyb3VuZC1jb2xvcjoje2JnfTtcIlxuICAgICAgICAgICAgICAgICAgICBzcGFjZSA9ICcnXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yIGkgaW4gWzAuLi50Lmxlbmd0aF1cbiAgICAgICAgICAgICAgICBpZiB0W2ldICE9ICcgJ1xuICAgICAgICAgICAgICAgICAgICBtc3RydCA9IHN0YXJ0K2kgaWYgbWF0Y2ggPT0gJydcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2ggKz0gdFtpXVxuICAgICAgICAgICAgICAgICAgICBhZGRTcGFjZSgpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBpZiBiZy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgIHNzdHJ0ID0gc3RhcnQraSBpZiBzcGFjZSA9PSAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2UgKz0gdFtpXVxuICAgICAgICAgICAgICAgICAgICBhZGRNYXRjaCgpXG4gICAgICAgICAgICBhZGRNYXRjaCgpICAgICAgICAgICAgXG4gICAgICAgICAgICBhZGRTcGFjZSgpICAgICAgICAgICAgXG4gICAgICAgICAgICBAdGV4dCArPSB0XG4gICAgICAgICAgICBzdGFydCA9IEB0ZXh0Lmxlbmd0aFxuICAgICAgICAgICAgJydcbiAgICAgICAgXG4gICAgICAgIHRvSGlnaEludGVuc2l0eSA9IChjKSAtPlxuICAgICAgICAgICAgZm9yIGkgaW4gWzAuLjddXG4gICAgICAgICAgICAgICAgaWYgYyA9PSBTVFlMRVNbXCJmI3tpfVwiXVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU1RZTEVTW1wiZiN7OCtpfVwiXVxuICAgICAgICAgICAgY1xuICAgICAgICBcbiAgICAgICAgYW5zaUNvZGUgPSAobSwgYykgLT5cbiAgICAgICAgICAgIGFuc2lNYXRjaCA9IHRydWVcbiAgICAgICAgICAgIGMgPSAnMCcgaWYgYy50cmltKCkubGVuZ3RoIGlzIDAgICAgICAgICAgICBcbiAgICAgICAgICAgIGNzID0gYy50cmltUmlnaHQoJzsnKS5zcGxpdCgnOycpXG4gICAgICAgICAgICBmb3IgY29kZSBpbiBjc1xuICAgICAgICAgICAgICAgIGNvZGUgPSBwYXJzZUludCBjb2RlLCAxMFxuICAgICAgICAgICAgICAgIHN3aXRjaCBcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDAgICAgICAgICAgdGhlbiByZXNldFN0eWxlKClcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDEgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRTdHlsZSAnZm9udC13ZWlnaHQ6Ym9sZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIGZnID0gdG9IaWdoSW50ZW5zaXR5IGZnXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAyICAgICAgICAgIHRoZW4gYWRkU3R5bGUgJ29wYWNpdHk6MC41J1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgNCAgICAgICAgICB0aGVuIGFkZFN0eWxlICd0ZXh0LWRlY29yYXRpb246dW5kZXJsaW5lJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgNyAgICAgICAgICB0aGVuIGludmVydCA9IHRydWUgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDI3ICAgICAgICAgdGhlbiBpbnZlcnQgPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgOCAgICAgICAgICB0aGVuIGFkZFN0eWxlICdkaXNwbGF5Om5vbmUnXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyA5ICAgICAgICAgIHRoZW4gYWRkU3R5bGUgJ3RleHQtZGVjb3JhdGlvbjpsaW5lLXRocm91Z2gnXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAzOSAgICAgICAgIHRoZW4gZmcgPSBTVFlMRVNbXCJmMTVcIl0gIyBkZWZhdWx0IGZvcmVncm91bmRcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDQ5ICAgICAgICAgdGhlbiBiZyA9IFNUWUxFU1tcImIwXCJdICAjIGRlZmF1bHQgYmFja2dyb3VuZFxuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgMzggICAgICAgICB0aGVuIHNldEZHIGNzIFxuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgNDggICAgICAgICB0aGVuIHNldEJHIGNzIFxuICAgICAgICAgICAgICAgICAgICB3aGVuICAzMCA8PSBjb2RlIDw9IDM3ICB0aGVuIGZnID0gU1RZTEVTW1wiZiN7Y29kZSAtIDMwfVwiXSAjIG5vcm1hbCBpbnRlbnNpdHlcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAgNDAgPD0gY29kZSA8PSA0NyAgdGhlbiBiZyA9IFNUWUxFU1tcImIje2NvZGUgLSA0MH1cIl1cbiAgICAgICAgICAgICAgICAgICAgd2hlbiAgOTAgPD0gY29kZSA8PSA5NyAgdGhlbiBmZyA9IFNUWUxFU1tcImYjezgrY29kZSAtIDkwfVwiXSAgIyBoaWdoIGludGVuc2l0eVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDEwMCA8PSBjb2RlIDw9IDEwNyB0aGVuIGJnID0gU1RZTEVTW1wiYiN7OCtjb2RlIC0gMTAwfVwiXVxuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgMjggICAgICAgICB0aGVuIGRlbFN0eWxlICdkaXNwbGF5Om5vbmUnXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAyMiAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsU3R5bGUgJ2ZvbnQtd2VpZ2h0OmJvbGQnXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxTdHlsZSAnb3BhY2l0eTowLjUnXG4gICAgICAgICAgICAgICAgYnJlYWsgaWYgY29kZSBpbiBbMzgsIDQ4XVxuICAgICAgICAgICAgJydcbiAgICAgICAgICAgIFxuICAgICAgICB0b2tlbnMgPSBbXG4gICAgICAgICAgICB7cGF0dGVybjogL15cXHgwOCsvLCAgICAgICAgICAgICAgICAgICAgIHN1YjogJyd9XG4gICAgICAgICAgICB7cGF0dGVybjogL15cXHgxYlxcW1swMTJdP0svLCAgICAgICAgICAgICBzdWI6ICcnfVxuICAgICAgICAgICAge3BhdHRlcm46IC9eXFx4MWJcXFsoKD86XFxkezEsM307PykrfCltLywgIHN1YjogYW5zaUNvZGV9IFxuICAgICAgICAgICAge3BhdHRlcm46IC9eXFx4MWJcXFs/W1xcZDtdezAsM30vLCAgICAgICAgIHN1YjogJyd9XG4gICAgICAgICAgICB7cGF0dGVybjogL14oW15cXHgxYlxceDA4XFxuXSspLywgICAgICAgICAgc3ViOiBhZGRUZXh0fVxuICAgICAgICAgXVxuXG4gICAgICAgIHByb2Nlc3MgPSAoaGFuZGxlciwgaSkgPT5cbiAgICAgICAgICAgIHJldHVybiBpZiBpID4gYW5zaUhhbmRsZXIgYW5kIGFuc2lNYXRjaCAjIGdpdmUgYW5zaUhhbmRsZXIgYW5vdGhlciBjaGFuY2UgaWYgaXQgbWF0Y2hlc1xuICAgICAgICAgICAgYW5zaU1hdGNoID0gZmFsc2VcbiAgICAgICAgICAgIEBpbnB1dCA9IEBpbnB1dC5yZXBsYWNlIGhhbmRsZXIucGF0dGVybiwgaGFuZGxlci5zdWJcblxuICAgICAgICB3aGlsZSAobGVuZ3RoID0gQGlucHV0Lmxlbmd0aCkgPiAwXG4gICAgICAgICAgICBwcm9jZXNzKGhhbmRsZXIsIGkpIGZvciBoYW5kbGVyLCBpIGluIHRva2Vuc1xuICAgICAgICAgICAgYnJlYWsgaWYgQGlucHV0Lmxlbmd0aCA9PSBsZW5ndGhcbiAgICAgICAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBBbnNpXG5cbiJdfQ==
//# sourceURL=../coffee/ansi.coffee