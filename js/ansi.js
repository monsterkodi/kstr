// koffee 1.19.0

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zaS5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbImFuc2kuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBLDJDQUFBO0lBQUE7O0FBVUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSOztBQUVQLE1BQUEsR0FDSTtJQUFBLEVBQUEsRUFBSyxNQUFMO0lBQ0EsRUFBQSxFQUFLLE1BREw7SUFFQSxFQUFBLEVBQUssTUFGTDtJQUdBLEVBQUEsRUFBSyxNQUhMO0lBSUEsRUFBQSxFQUFLLE1BSkw7SUFLQSxFQUFBLEVBQUssTUFMTDtJQU1BLEVBQUEsRUFBSyxNQU5MO0lBT0EsRUFBQSxFQUFLLE1BUEw7SUFRQSxFQUFBLEVBQUssTUFSTDtJQVNBLEVBQUEsRUFBSyxNQVRMO0lBVUEsR0FBQSxFQUFLLE1BVkw7SUFXQSxHQUFBLEVBQUssTUFYTDtJQVlBLEdBQUEsRUFBSyxNQVpMO0lBYUEsR0FBQSxFQUFLLE1BYkw7SUFjQSxHQUFBLEVBQUssTUFkTDtJQWVBLEdBQUEsRUFBSyxNQWZMO0lBZ0JBLEVBQUEsRUFBSyxNQWhCTDtJQWlCQSxFQUFBLEVBQUssTUFqQkw7SUFrQkEsRUFBQSxFQUFLLE1BbEJMO0lBbUJBLEVBQUEsRUFBSyxNQW5CTDtJQW9CQSxFQUFBLEVBQUssTUFwQkw7SUFxQkEsRUFBQSxFQUFLLE1BckJMO0lBc0JBLEVBQUEsRUFBSyxNQXRCTDtJQXVCQSxFQUFBLEVBQUssTUF2Qkw7SUF3QkEsRUFBQSxFQUFLLE1BeEJMO0lBeUJBLEVBQUEsRUFBSyxNQXpCTDtJQTBCQSxHQUFBLEVBQUssTUExQkw7SUEyQkEsR0FBQSxFQUFLLE1BM0JMO0lBNEJBLEdBQUEsRUFBSyxNQTVCTDtJQTZCQSxHQUFBLEVBQUssTUE3Qkw7SUE4QkEsR0FBQSxFQUFLLE1BOUJMO0lBK0JBLEdBQUEsRUFBSyxNQS9CTDs7O0FBaUNKLFdBQUEsR0FBYyxTQUFDLEdBQUQ7SUFDVixHQUFBLEdBQU0s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SyxFQUE3QzthQUZLLEVBR0w7Z0JBQUMsT0FBQSxFQUFTLDJCQUFWO2dCQUF3QyxHQUFBLEVBQUssUUFBN0M7YUFISyxFQUlMO2dCQUFDLE9BQUEsRUFBUyxvQkFBVjtnQkFBd0MsR0FBQSxFQUFLLEVBQTdDO2FBSkssRUFLTDtnQkFBQyxPQUFBLEVBQVMsbUJBQVY7Z0JBQXdDLEdBQUEsRUFBSyxPQUE3QzthQUxLOztRQVFULE9BQUEsR0FBVSxDQUFBLFNBQUEsS0FBQTttQkFBQSxTQUFDLE9BQUQsRUFBVSxDQUFWO2dCQUNOLElBQVUsQ0FBQSxHQUFJLFdBQUosSUFBb0IsU0FBOUI7QUFBQSwyQkFBQTs7Z0JBQ0EsU0FBQSxHQUFZO3VCQUNaLEtBQUMsQ0FBQSxLQUFELEdBQVMsS0FBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQWUsT0FBTyxDQUFDLE9BQXZCLEVBQWdDLE9BQU8sQ0FBQyxHQUF4QztZQUhIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtBQUtWO2VBQU0sQ0FBQyxNQUFBLEdBQVMsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFqQixDQUFBLEdBQTJCLENBQWpDO0FBQ0ksaUJBQUEsZ0RBQUE7O2dCQUFBLE9BQUEsQ0FBUSxPQUFSLEVBQWlCLENBQWpCO0FBQUE7WUFDQSxJQUFTLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxLQUFpQixNQUExQjtBQUFBLHNCQUFBO2FBQUEsTUFBQTtzQ0FBQTs7UUFGSixDQUFBOztJQTFJTTs7Ozs7O0FBOElkLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4gMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgIDAwMFxuMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgICAwMDBcbjAwMDAwMDAwMCAgMDAwIDAgMDAwICAwMDAwMDAwICAgMDAwXG4wMDAgICAwMDAgIDAwMCAgMDAwMCAgICAgICAwMDAgIDAwMFxuMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAwMDBcbiMjI1xuXG4jIGJhc2VkIG9uIGNvZGUgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vcmJ1cm5zL2Fuc2ktdG8taHRtbFxuXG5wdWxsID0gcmVxdWlyZSAnbG9kYXNoLnB1bGwnXG5cblNUWUxFUyA9XG4gICAgZjA6ICAnIzAwMCcgIyBub3JtYWwgaW50ZW5zaXR5XG4gICAgZjE6ICAnI0YwMCdcbiAgICBmMjogICcjMEQwJ1xuICAgIGYzOiAgJyNERDAnXG4gICAgZjQ6ICAnIzAwRidcbiAgICBmNTogICcjRDBEJ1xuICAgIGY2OiAgJyMwREQnXG4gICAgZjc6ICAnI0FBQSdcbiAgICBmODogICcjNTU1JyAjIGhpZ2ggaW50ZW5zaXR5XG4gICAgZjk6ICAnI0Y1NSdcbiAgICBmMTA6ICcjNUY1J1xuICAgIGYxMTogJyNGRjUnXG4gICAgZjEyOiAnIzU1RidcbiAgICBmMTM6ICcjRjVGJ1xuICAgIGYxNDogJyM1RkYnXG4gICAgZjE1OiAnI0ZGRidcbiAgICBiMDogICcjMDAwJyAjIG5vcm1hbCBpbnRlbnNpdHlcbiAgICBiMTogICcjQTAwJ1xuICAgIGIyOiAgJyMwQTAnXG4gICAgYjM6ICAnI0E1MCdcbiAgICBiNDogICcjMDBBJ1xuICAgIGI1OiAgJyNBMEEnXG4gICAgYjY6ICAnIzBBQSdcbiAgICBiNzogICcjQUFBJ1xuICAgIGI4OiAgJyM1NTUnICMgaGlnaCBpbnRlbnNpdHlcbiAgICBiOTogICcjRjU1J1xuICAgIGIxMDogJyM1RjUnXG4gICAgYjExOiAnI0ZGNSdcbiAgICBiMTI6ICcjNTVGJ1xuICAgIGIxMzogJyNGNUYnXG4gICAgYjE0OiAnIzVGRidcbiAgICBiMTU6ICcjRkZGJ1xuXG50b0hleFN0cmluZyA9IChudW0pIC0+XG4gICAgbnVtID0gbnVtLnRvU3RyaW5nKDE2KVxuICAgIHdoaWxlIG51bS5sZW5ndGggPCAyIHRoZW4gbnVtID0gXCIwI3tudW19XCJcbiAgICBudW1cblxuWzAuLjVdLmZvckVhY2ggKHJlZCkgLT5cbiAgICBbMC4uNV0uZm9yRWFjaCAoZ3JlZW4pIC0+XG4gICAgICAgIFswLi41XS5mb3JFYWNoIChibHVlKSAtPlxuICAgICAgICAgICAgYyA9IDE2ICsgKHJlZCAqIDM2KSArIChncmVlbiAqIDYpICsgYmx1ZVxuICAgICAgICAgICAgciA9IGlmIHJlZCAgID4gMCB0aGVuIHJlZCAgICogNDAgKyA1NSBlbHNlIDBcbiAgICAgICAgICAgIGcgPSBpZiBncmVlbiA+IDAgdGhlbiBncmVlbiAqIDQwICsgNTUgZWxzZSAwXG4gICAgICAgICAgICBiID0gaWYgYmx1ZSAgPiAwIHRoZW4gYmx1ZSAgKiA0MCArIDU1IGVsc2UgMCAgICAgICAgICAgIFxuICAgICAgICAgICAgcmdiID0gKHRvSGV4U3RyaW5nKG4pIGZvciBuIGluIFtyLCBnLCBiXSkuam9pbignJylcbiAgICAgICAgICAgIFNUWUxFU1tcImYje2N9XCJdID0gXCIjI3tyZ2J9XCJcbiAgICAgICAgICAgIFNUWUxFU1tcImIje2N9XCJdID0gXCIjI3tyZ2J9XCJcblxuWzAuLjIzXS5mb3JFYWNoIChncmF5KSAtPlxuICAgIGMgPSBncmF5KzIzMlxuICAgIGwgPSB0b0hleFN0cmluZyhncmF5KjEwICsgOClcbiAgICBTVFlMRVNbXCJmI3tjfVwiXSA9IFwiIyN7bH0je2x9I3tsfVwiXG4gICAgU1RZTEVTW1wiYiN7Y31cIl0gPSBcIiMje2x9I3tsfSN7bH1cIlxuXG4jICAwMDAwMDAwICAgMDAwICAgMDAwICAgMDAwMDAwMCAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgICAgMDAwXG4jIDAwMDAwMDAwMCAgMDAwIDAgMDAwICAwMDAwMDAwICAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAwICAgICAgIDAwMCAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwXG5cbmNsYXNzIEFuc2lcbiAgICBcbiAgICBAaHRtbDogKHMpIC0+IFxuICAgIFxuICAgICAgICBhbmRpID0gbmV3IEFuc2koKVxuICAgICAgICBsaW5lcyA9IFtdXG4gICAgICAgIGZvciBsIGluIHM/LnNwbGl0KCdcXG4nKSA/IFtdXG4gICAgICAgICAgICBkaXNzID0gYW5kaS5kaXNzZWN0KGwpWzFdXG4gICAgICAgICAgICBodG1sTGluZSA9ICcnXG4gICAgICAgICAgICBmb3IgaSBpbiBbMC4uLmRpc3MubGVuZ3RoXVxuICAgICAgICAgICAgICAgIGQgPSBkaXNzW2ldXG4gICAgICAgICAgICAgICAgc3BhbiA9IGQuc3R5bCBhbmQgXCI8c3BhbiBzdHlsZT1cXFwiI3tkLnN0eWx9XFxcIj4je2QubWF0Y2h9PC9zcGFuPlwiIG9yIGQubWF0Y2hcbiAgICAgICAgICAgICAgICBpZiBwYXJzZUludCBpXG4gICAgICAgICAgICAgICAgICAgIGlmIGRpc3NbaS0xXS5zdGFydCArIGRpc3NbaS0xXS5tYXRjaC5sZW5ndGggPCBkLnN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sTGluZSArPSAnICdcbiAgICAgICAgICAgICAgICBodG1sTGluZSArPSBzcGFuXG4gICAgICAgICAgICBsaW5lcy5wdXNoIGh0bWxMaW5lXG4gICAgICAgIGxpbmVzLmpvaW4gJ1xcbidcbiAgICAgICAgXG4gICAgZGlzc2VjdDogKEBpbnB1dCkgLT5cbiAgICAgICAgXG4gICAgICAgIEBkaXNzICA9IFtdXG4gICAgICAgIEB0ZXh0ICA9IFwiXCJcbiAgICAgICAgQHRva2VuaXplKClcbiAgICAgICAgW0B0ZXh0LCBAZGlzc11cblxuICAgIHRva2VuaXplOiAoKSAtPlxuICAgICAgICBcbiAgICAgICAgc3RhcnQgICAgICAgPSAwXG4gICAgICAgIGFuc2lIYW5kbGVyID0gMlxuICAgICAgICBhbnNpTWF0Y2ggICA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICBpbnZlcnQgPSBmYWxzZVxuICAgICAgICBmZyA9IGJnID0gJydcbiAgICAgICAgc3QgPSBbXVxuXG4gICAgICAgIHJlc2V0U3R5bGUgPSAtPlxuICAgICAgICAgICAgZmcgPSBiZyA9ICcnXG4gICAgICAgICAgICBpbnZlcnQgPSBmYWxzZVxuICAgICAgICAgICAgc3QgPSBbXVxuICAgICAgICAgICAgXG4gICAgICAgIGFkZFN0eWxlID0gKHN0eWxlKSAtPiBzdC5wdXNoIHN0eWxlIGlmIHN0eWxlIG5vdCBpbiBzdFxuICAgICAgICBkZWxTdHlsZSA9IChzdHlsZSkgLT4gcHVsbCBzdCwgc3R5bGVcbiAgICAgICAgXG4gICAgICAgIHNldEZHID0gKGNzKSAtPiBcbiAgICAgICAgICAgIGlmIGNzLmxlbmd0aCA9PSA1XG4gICAgICAgICAgICAgICAgZmcgPSBcInJnYigje2NzWzJdfSwje2NzWzNdfSwje2NzWzRdfSlcIlxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGZnID0gU1RZTEVTW1wiZiN7Y3NbMl19XCJdICMgZXh0ZW5kZWQgZmcgMzg7NTtbMC0yNTVdXG4gICAgICAgIHNldEJHID0gKGNzKSAtPiBcbiAgICAgICAgICAgIGlmIGNzLmxlbmd0aCA9PSA1XG4gICAgICAgICAgICAgICAgYmcgPSBcInJnYigje2NzWzJdfSwje2NzWzNdfSwje2NzWzRdfSlcIlxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGJnID0gU1RZTEVTW1wiYiN7Y3NbMl19XCJdICMgZXh0ZW5kZWQgYmcgNDg7NTtbMC0yNTVdXG4gICAgICAgIFxuICAgICAgICBhZGRUZXh0ID0gKHQpID0+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHN0YXJ0ID0gQHRleHQubGVuZ3RoXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG1hdGNoID0gJydcbiAgICAgICAgICAgIG1zdHJ0ID0gc3RhcnRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc3BhY2UgPSAnJ1xuICAgICAgICAgICAgc3N0cnQgPSBzdGFydFxuXG4gICAgICAgICAgICBhZGRNYXRjaCA9ID0+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgbWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlID0gJydcbiAgICAgICAgICAgICAgICAgICAgaWYgaW52ZXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBiZy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSBcImNvbG9yOiN7Ymd9O1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGUgKz0gJ2NvbG9yOiMwMDA7JyBcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgZmcubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGUgKz0gXCJiYWNrZ3JvdW5kLWNvbG9yOiN7Zmd9O1wiIFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlICs9ICdiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7JyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGUgKz0gXCJjb2xvcjoje2ZnfTtcIiAgICAgICAgICAgIGlmIGZnLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGUgKz0gXCJiYWNrZ3JvdW5kLWNvbG9yOiN7Ymd9O1wiIGlmIGJnLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSBzdC5qb2luICc7JyBpZiBzdC5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgQGRpc3MucHVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2g6IG1hdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbXN0cnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWw6ICBzdHlsZVxuICAgICAgICAgICAgICAgICAgICBtYXRjaCA9ICcnXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFkZFNwYWNlID0gPT5cbiAgICAgICAgICAgICAgICBpZiBzcGFjZS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgQGRpc3MucHVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2g6IHNwYWNlXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogc3N0cnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWw6ICBcImJhY2tncm91bmQtY29sb3I6I3tiZ307XCJcbiAgICAgICAgICAgICAgICAgICAgc3BhY2UgPSAnJ1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciBpIGluIFswLi4udC5sZW5ndGhdXG4gICAgICAgICAgICAgICAgaWYgdFtpXSAhPSAnICdcbiAgICAgICAgICAgICAgICAgICAgbXN0cnQgPSBzdGFydCtpIGlmIG1hdGNoID09ICcnXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoICs9IHRbaV1cbiAgICAgICAgICAgICAgICAgICAgYWRkU3BhY2UoKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgaWYgYmcubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICBzc3RydCA9IHN0YXJ0K2kgaWYgc3BhY2UgPT0gJydcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlICs9IHRbaV1cbiAgICAgICAgICAgICAgICAgICAgYWRkTWF0Y2goKVxuICAgICAgICAgICAgYWRkTWF0Y2goKSAgICAgICAgICAgIFxuICAgICAgICAgICAgYWRkU3BhY2UoKSAgICAgICAgICAgIFxuICAgICAgICAgICAgQHRleHQgKz0gdFxuICAgICAgICAgICAgc3RhcnQgPSBAdGV4dC5sZW5ndGhcbiAgICAgICAgICAgICcnXG4gICAgICAgIFxuICAgICAgICB0b0hpZ2hJbnRlbnNpdHkgPSAoYykgLT5cbiAgICAgICAgICAgIGZvciBpIGluIFswLi43XVxuICAgICAgICAgICAgICAgIGlmIGMgPT0gU1RZTEVTW1wiZiN7aX1cIl1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNUWUxFU1tcImYjezgraX1cIl1cbiAgICAgICAgICAgIGNcbiAgICAgICAgXG4gICAgICAgIGFuc2lDb2RlID0gKG0sIGMpIC0+XG4gICAgICAgICAgICBhbnNpTWF0Y2ggPSB0cnVlXG4gICAgICAgICAgICBjID0gJzAnIGlmIGMudHJpbSgpLmxlbmd0aCBpcyAwICAgICAgICAgICAgXG4gICAgICAgICAgICBjcyA9IGMudHJpbVJpZ2h0KCc7Jykuc3BsaXQoJzsnKVxuICAgICAgICAgICAgZm9yIGNvZGUgaW4gY3NcbiAgICAgICAgICAgICAgICBjb2RlID0gcGFyc2VJbnQgY29kZSwgMTBcbiAgICAgICAgICAgICAgICBzd2l0Y2ggXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAwICAgICAgICAgIHRoZW4gcmVzZXRTdHlsZSgpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAxICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkU3R5bGUgJ2ZvbnQtd2VpZ2h0OmJvbGQnXG4gICAgICAgICAgICAgICAgICAgICAgICBmZyA9IHRvSGlnaEludGVuc2l0eSBmZ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgMiAgICAgICAgICB0aGVuIGFkZFN0eWxlICdvcGFjaXR5OjAuNSdcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDQgICAgICAgICAgdGhlbiBhZGRTdHlsZSAndGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZSdcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDcgICAgICAgICAgdGhlbiBpbnZlcnQgPSB0cnVlICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAyNyAgICAgICAgIHRoZW4gaW52ZXJ0ID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDggICAgICAgICAgdGhlbiBhZGRTdHlsZSAnZGlzcGxheTpub25lJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgOSAgICAgICAgICB0aGVuIGFkZFN0eWxlICd0ZXh0LWRlY29yYXRpb246bGluZS10aHJvdWdoJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgMzkgICAgICAgICB0aGVuIGZnID0gU1RZTEVTW1wiZjE1XCJdICMgZGVmYXVsdCBmb3JlZ3JvdW5kXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyA0OSAgICAgICAgIHRoZW4gYmcgPSBTVFlMRVNbXCJiMFwiXSAgIyBkZWZhdWx0IGJhY2tncm91bmRcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDM4ICAgICAgICAgdGhlbiBzZXRGRyBjcyBcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDQ4ICAgICAgICAgdGhlbiBzZXRCRyBjcyBcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAgMzAgPD0gY29kZSA8PSAzNyAgdGhlbiBmZyA9IFNUWUxFU1tcImYje2NvZGUgLSAzMH1cIl0gIyBub3JtYWwgaW50ZW5zaXR5XG4gICAgICAgICAgICAgICAgICAgIHdoZW4gIDQwIDw9IGNvZGUgPD0gNDcgIHRoZW4gYmcgPSBTVFlMRVNbXCJiI3tjb2RlIC0gNDB9XCJdXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gIDkwIDw9IGNvZGUgPD0gOTcgIHRoZW4gZmcgPSBTVFlMRVNbXCJmI3s4K2NvZGUgLSA5MH1cIl0gICMgaGlnaCBpbnRlbnNpdHlcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAxMDAgPD0gY29kZSA8PSAxMDcgdGhlbiBiZyA9IFNUWUxFU1tcImIjezgrY29kZSAtIDEwMH1cIl1cbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDI4ICAgICAgICAgdGhlbiBkZWxTdHlsZSAnZGlzcGxheTpub25lJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgMjIgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbFN0eWxlICdmb250LXdlaWdodDpib2xkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsU3R5bGUgJ29wYWNpdHk6MC41J1xuICAgICAgICAgICAgICAgIGJyZWFrIGlmIGNvZGUgaW4gWzM4LCA0OF1cbiAgICAgICAgICAgICcnXG4gICAgICAgICAgICBcbiAgICAgICAgdG9rZW5zID0gW1xuICAgICAgICAgICAge3BhdHRlcm46IC9eXFx4MDgrLywgICAgICAgICAgICAgICAgICAgICBzdWI6ICcnfVxuICAgICAgICAgICAge3BhdHRlcm46IC9eXFx4MWJcXFtbMDEyXT9LLywgICAgICAgICAgICAgc3ViOiAnJ31cbiAgICAgICAgICAgIHtwYXR0ZXJuOiAvXlxceDFiXFxbKCg/OlxcZHsxLDN9Oz8pK3wpbS8sICBzdWI6IGFuc2lDb2RlfSBcbiAgICAgICAgICAgIHtwYXR0ZXJuOiAvXlxceDFiXFxbP1tcXGQ7XXswLDN9LywgICAgICAgICBzdWI6ICcnfVxuICAgICAgICAgICAge3BhdHRlcm46IC9eKFteXFx4MWJcXHgwOFxcbl0rKS8sICAgICAgICAgIHN1YjogYWRkVGV4dH1cbiAgICAgICAgIF1cblxuICAgICAgICBwcm9jZXNzID0gKGhhbmRsZXIsIGkpID0+XG4gICAgICAgICAgICByZXR1cm4gaWYgaSA+IGFuc2lIYW5kbGVyIGFuZCBhbnNpTWF0Y2ggIyBnaXZlIGFuc2lIYW5kbGVyIGFub3RoZXIgY2hhbmNlIGlmIGl0IG1hdGNoZXNcbiAgICAgICAgICAgIGFuc2lNYXRjaCA9IGZhbHNlXG4gICAgICAgICAgICBAaW5wdXQgPSBAaW5wdXQucmVwbGFjZSBoYW5kbGVyLnBhdHRlcm4sIGhhbmRsZXIuc3ViXG5cbiAgICAgICAgd2hpbGUgKGxlbmd0aCA9IEBpbnB1dC5sZW5ndGgpID4gMFxuICAgICAgICAgICAgcHJvY2VzcyhoYW5kbGVyLCBpKSBmb3IgaGFuZGxlciwgaSBpbiB0b2tlbnNcbiAgICAgICAgICAgIGJyZWFrIGlmIEBpbnB1dC5sZW5ndGggPT0gbGVuZ3RoXG4gICAgICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gQW5zaVxuXG4iXX0=
//# sourceURL=../coffee/ansi.coffee