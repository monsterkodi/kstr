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
                var match, style, txt;
                _this.text += t;
                txt = _this.text.slice(start);
                if (!bg.length && !fg.length) {
                    txt = txt.trim();
                }
                match = txt;
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
                        start: start,
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zaS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUEsMkNBQUE7SUFBQTs7QUFVQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVI7O0FBRVAsTUFBQSxHQUNJO0lBQUEsRUFBQSxFQUFLLFlBQUw7SUFDQSxFQUFBLEVBQUssWUFETDtJQUVBLEVBQUEsRUFBSyxZQUZMO0lBR0EsRUFBQSxFQUFLLFlBSEw7SUFJQSxFQUFBLEVBQUssWUFKTDtJQUtBLEVBQUEsRUFBSyxZQUxMO0lBTUEsRUFBQSxFQUFLLFlBTkw7SUFPQSxFQUFBLEVBQUssWUFQTDtJQVFBLEVBQUEsRUFBSyxZQVJMO0lBU0EsRUFBQSxFQUFLLFlBVEw7SUFVQSxHQUFBLEVBQUssWUFWTDtJQVdBLEdBQUEsRUFBSyxZQVhMO0lBWUEsR0FBQSxFQUFLLFlBWkw7SUFhQSxHQUFBLEVBQUssWUFiTDtJQWNBLEdBQUEsRUFBSyxZQWRMO0lBZUEsR0FBQSxFQUFLLFlBZkw7SUFnQkEsRUFBQSxFQUFLLHVCQWhCTDtJQWlCQSxFQUFBLEVBQUssdUJBakJMO0lBa0JBLEVBQUEsRUFBSyx1QkFsQkw7SUFtQkEsRUFBQSxFQUFLLHVCQW5CTDtJQW9CQSxFQUFBLEVBQUssdUJBcEJMO0lBcUJBLEVBQUEsRUFBSyx1QkFyQkw7SUFzQkEsRUFBQSxFQUFLLHVCQXRCTDtJQXVCQSxFQUFBLEVBQUssdUJBdkJMO0lBd0JBLEVBQUEsRUFBSyx1QkF4Qkw7SUF5QkEsRUFBQSxFQUFLLHVCQXpCTDtJQTBCQSxHQUFBLEVBQUssdUJBMUJMO0lBMkJBLEdBQUEsRUFBSyx1QkEzQkw7SUE0QkEsR0FBQSxFQUFLLHVCQTVCTDtJQTZCQSxHQUFBLEVBQUssdUJBN0JMO0lBOEJBLEdBQUEsRUFBSyx1QkE5Qkw7SUErQkEsR0FBQSxFQUFLLHVCQS9CTDs7O0FBaUNKLFdBQUEsR0FBYyxTQUFDLEdBQUQ7SUFDVixHQUFBLEdBQU0sR0FB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UixFQUFpQixDQUFqQjtBQUFBO1lBQ0EsSUFBUyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsS0FBaUIsTUFBMUI7QUFBQSxzQkFBQTthQUFBLE1BQUE7c0NBQUE7O1FBRkosQ0FBQTs7SUFuRk07Ozs7OztBQXVGZCxNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAwMDBcbjAwMCAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgICAgMDAwXG4wMDAwMDAwMDAgIDAwMCAwIDAwMCAgMDAwMDAwMCAgIDAwMFxuMDAwICAgMDAwICAwMDAgIDAwMDAgICAgICAgMDAwICAwMDBcbjAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwXG4jIyNcblxuIyBiYXNlZCBvbiBjb2RlIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3JidXJucy9hbnNpLXRvLWh0bWxcblxucHVsbCA9IHJlcXVpcmUgJ2xvZGFzaC5wdWxsJ1xuXG5TVFlMRVMgPVxuICAgIGYwOiAgJ2NvbG9yOiMwMDAnICMgbm9ybWFsIGludGVuc2l0eVxuICAgIGYxOiAgJ2NvbG9yOiNGMDAnXG4gICAgZjI6ICAnY29sb3I6IzBEMCdcbiAgICBmMzogICdjb2xvcjojREQwJ1xuICAgIGY0OiAgJ2NvbG9yOiMwMEYnXG4gICAgZjU6ICAnY29sb3I6I0QwRCdcbiAgICBmNjogICdjb2xvcjojMEREJ1xuICAgIGY3OiAgJ2NvbG9yOiNBQUEnXG4gICAgZjg6ICAnY29sb3I6IzU1NScgIyBoaWdoIGludGVuc2l0eVxuICAgIGY5OiAgJ2NvbG9yOiNGNTUnXG4gICAgZjEwOiAnY29sb3I6IzVGNSdcbiAgICBmMTE6ICdjb2xvcjojRkY1J1xuICAgIGYxMjogJ2NvbG9yOiM1NUYnXG4gICAgZjEzOiAnY29sb3I6I0Y1RidcbiAgICBmMTQ6ICdjb2xvcjojNUZGJ1xuICAgIGYxNTogJ2NvbG9yOiNGRkYnXG4gICAgYjA6ICAnYmFja2dyb3VuZC1jb2xvcjojMDAwJyAjIG5vcm1hbCBpbnRlbnNpdHlcbiAgICBiMTogICdiYWNrZ3JvdW5kLWNvbG9yOiNBMDAnXG4gICAgYjI6ICAnYmFja2dyb3VuZC1jb2xvcjojMEEwJ1xuICAgIGIzOiAgJ2JhY2tncm91bmQtY29sb3I6I0E1MCdcbiAgICBiNDogICdiYWNrZ3JvdW5kLWNvbG9yOiMwMEEnXG4gICAgYjU6ICAnYmFja2dyb3VuZC1jb2xvcjojQTBBJ1xuICAgIGI2OiAgJ2JhY2tncm91bmQtY29sb3I6IzBBQSdcbiAgICBiNzogICdiYWNrZ3JvdW5kLWNvbG9yOiNBQUEnXG4gICAgYjg6ICAnYmFja2dyb3VuZC1jb2xvcjojNTU1JyAjIGhpZ2ggaW50ZW5zaXR5XG4gICAgYjk6ICAnYmFja2dyb3VuZC1jb2xvcjojRjU1J1xuICAgIGIxMDogJ2JhY2tncm91bmQtY29sb3I6IzVGNSdcbiAgICBiMTE6ICdiYWNrZ3JvdW5kLWNvbG9yOiNGRjUnXG4gICAgYjEyOiAnYmFja2dyb3VuZC1jb2xvcjojNTVGJ1xuICAgIGIxMzogJ2JhY2tncm91bmQtY29sb3I6I0Y1RidcbiAgICBiMTQ6ICdiYWNrZ3JvdW5kLWNvbG9yOiM1RkYnXG4gICAgYjE1OiAnYmFja2dyb3VuZC1jb2xvcjojRkZGJ1xuXG50b0hleFN0cmluZyA9IChudW0pIC0+XG4gICAgbnVtID0gbnVtLnRvU3RyaW5nKDE2KVxuICAgIHdoaWxlIG51bS5sZW5ndGggPCAyIHRoZW4gbnVtID0gXCIwI3tudW19XCJcbiAgICBudW1cblxuWzAuLjVdLmZvckVhY2ggKHJlZCkgLT5cbiAgICBbMC4uNV0uZm9yRWFjaCAoZ3JlZW4pIC0+XG4gICAgICAgIFswLi41XS5mb3JFYWNoIChibHVlKSAtPlxuICAgICAgICAgICAgYyA9IDE2ICsgKHJlZCAqIDM2KSArIChncmVlbiAqIDYpICsgYmx1ZVxuICAgICAgICAgICAgciA9IGlmIHJlZCAgID4gMCB0aGVuIHJlZCAgICogNDAgKyA1NSBlbHNlIDBcbiAgICAgICAgICAgIGcgPSBpZiBncmVlbiA+IDAgdGhlbiBncmVlbiAqIDQwICsgNTUgZWxzZSAwXG4gICAgICAgICAgICBiID0gaWYgYmx1ZSAgPiAwIHRoZW4gYmx1ZSAgKiA0MCArIDU1IGVsc2UgMCAgICAgICAgICAgIFxuICAgICAgICAgICAgcmdiID0gKHRvSGV4U3RyaW5nKG4pIGZvciBuIGluIFtyLCBnLCBiXSkuam9pbignJylcbiAgICAgICAgICAgIFNUWUxFU1tcImYje2N9XCJdID0gXCJjb2xvcjojI3tyZ2J9XCJcbiAgICAgICAgICAgIFNUWUxFU1tcImIje2N9XCJdID0gXCJiYWNrZ3JvdW5kLWNvbG9yOiMje3JnYn1cIlxuXG5bMC4uMjNdLmZvckVhY2ggKGdyYXkpIC0+XG4gICAgYyA9IGdyYXkrMjMyXG4gICAgbCA9IHRvSGV4U3RyaW5nKGdyYXkqMTAgKyA4KVxuICAgIFNUWUxFU1tcImYje2N9XCJdID0gXCJjb2xvcjojI3tsfSN7bH0je2x9XCJcbiAgICBTVFlMRVNbXCJiI3tjfVwiXSA9IFwiYmFja2dyb3VuZC1jb2xvcjojI3tsfSN7bH0je2x9XCJcblxuIyAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgICAgIDAwMFxuIyAwMDAwMDAwMDAgIDAwMCAwIDAwMCAgMDAwMDAwMCAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwMCAgICAgICAwMDAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMFxuXG5jbGFzcyBBbnNpXG4gICAgXG4gICAgQGh0bWw6IChzKSAtPiBcbiAgICBcbiAgICAgICAgYW5kaSA9IG5ldyBBbnNpKClcbiAgICAgICAgbGluZXMgPSBbXVxuICAgICAgICBmb3IgbCBpbiBzPy5zcGxpdCgnXFxuJykgPyBbXVxuICAgICAgICAgICAgZGlzcyA9IGFuZGkuZGlzc2VjdChsKVsxXVxuICAgICAgICAgICAgaHRtbExpbmUgPSAnJ1xuICAgICAgICAgICAgZm9yIGkgaW4gWzAuLi5kaXNzLmxlbmd0aF1cbiAgICAgICAgICAgICAgICBkID0gZGlzc1tpXVxuICAgICAgICAgICAgICAgIHNwYW4gPSBkLnN0eWwgYW5kIFwiPHNwYW4gc3R5bGU9XFxcIiN7ZC5zdHlsfVxcXCI+I3tkLm1hdGNofTwvc3Bhbj5cIiBvciBkLm1hdGNoXG4gICAgICAgICAgICAgICAgaWYgcGFyc2VJbnQgaVxuICAgICAgICAgICAgICAgICAgICBpZiBkaXNzW2ktMV0uc3RhcnQgKyBkaXNzW2ktMV0ubWF0Y2gubGVuZ3RoIDwgZC5zdGFydFxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbExpbmUgKz0gJyAnXG4gICAgICAgICAgICAgICAgaHRtbExpbmUgKz0gc3BhblxuICAgICAgICAgICAgbGluZXMucHVzaCBodG1sTGluZVxuICAgICAgICBsaW5lcy5qb2luICdcXG4nXG4gICAgICAgIFxuICAgIGRpc3NlY3Q6IChAaW5wdXQpIC0+XG4gICAgICAgIFxuICAgICAgICBAZGlzcyAgPSBbXVxuICAgICAgICBAdGV4dCAgPSBcIlwiXG4gICAgICAgIEB0b2tlbml6ZSgpXG4gICAgICAgIFtAdGV4dCwgQGRpc3NdXG5cbiAgICB0b2tlbml6ZTogKCkgLT5cbiAgICAgICAgXG4gICAgICAgIHN0YXJ0ICAgICAgID0gMFxuICAgICAgICBhbnNpSGFuZGxlciA9IDJcbiAgICAgICAgYW5zaU1hdGNoICAgPSBmYWxzZVxuICAgICAgICBcbiAgICAgICAgZmcgPSBiZyA9ICcnXG4gICAgICAgIHN0ID0gW11cblxuICAgICAgICByZXNldFN0eWxlID0gKCkgLT5cbiAgICAgICAgICAgIGZnID0gJydcbiAgICAgICAgICAgIGJnID0gJydcbiAgICAgICAgICAgIHN0ID0gW11cbiAgICAgICAgICAgIFxuICAgICAgICBhZGRTdHlsZSA9IChzdHlsZSkgLT4gc3QucHVzaCBzdHlsZSBpZiBzdHlsZSBub3QgaW4gc3RcbiAgICAgICAgZGVsU3R5bGUgPSAoc3R5bGUpIC0+IHB1bGwgc3QsIHN0eWxlXG4gICAgICAgIFxuICAgICAgICBhZGRUZXh0ID0gKHQpID0+XG4gICAgICAgICAgICBAdGV4dCArPSB0XG4gICAgICAgICAgICB0eHQgPSBAdGV4dC5zbGljZSBzdGFydFxuICAgICAgICAgICAgdHh0ID0gdHh0LnRyaW0oKSBpZiBub3QgYmcubGVuZ3RoIGFuZCBub3QgZmcubGVuZ3RoXG4gICAgICAgICAgICBtYXRjaCA9IHR4dFxuICAgICAgICAgICAgaWYgbWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICAgICAgc3R5bGUgPSAnJ1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGZnICsgJzsnICAgIGlmIGZnLmxlbmd0aFxuICAgICAgICAgICAgICAgIHN0eWxlICs9IGJnICsgJzsnICAgIGlmIGJnLmxlbmd0aFxuICAgICAgICAgICAgICAgIHN0eWxlICs9IHN0LmpvaW4gJzsnIGlmIHN0Lmxlbmd0aFxuICAgICAgICAgICAgICAgIEBkaXNzLnB1c2hcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2g6IG1hdGNoXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBzdGFydCAjKyB0eHQuc2VhcmNoIC9bXlxcc10vXG4gICAgICAgICAgICAgICAgICAgIHN0eWw6ICBzdHlsZVxuICAgICAgICAgICAgc3RhcnQgPSBAdGV4dC5sZW5ndGhcbiAgICAgICAgICAgICcnXG4gICAgICAgIFxuICAgICAgICB0b0hpZ2hJbnRlbnNpdHkgPSAoYykgLT5cbiAgICAgICAgICAgIGZvciBpIGluIFswLi43XVxuICAgICAgICAgICAgICAgIGlmIGMgPT0gU1RZTEVTW1wiZiN7aX1cIl1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNUWUxFU1tcImYjezgraX1cIl1cbiAgICAgICAgICAgIGNcbiAgICAgICAgXG4gICAgICAgIGFuc2lDb2RlID0gKG0sIGMpIC0+XG4gICAgICAgICAgICBhbnNpTWF0Y2ggPSB0cnVlXG4gICAgICAgICAgICBjID0gJzAnIGlmIGMudHJpbSgpLmxlbmd0aCBpcyAwICAgICAgICAgICAgXG4gICAgICAgICAgICBjcyA9IGMudHJpbVJpZ2h0KCc7Jykuc3BsaXQoJzsnKSAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yIGNvZGUgaW4gY3NcbiAgICAgICAgICAgICAgICBjb2RlID0gcGFyc2VJbnQgY29kZSwgMTBcbiAgICAgICAgICAgICAgICBzd2l0Y2ggXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAwICAgICAgICAgIHRoZW4gcmVzZXRTdHlsZSgpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAxICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkU3R5bGUgJ2ZvbnQtd2VpZ2h0OmJvbGQnXG4gICAgICAgICAgICAgICAgICAgICAgICBmZyA9IHRvSGlnaEludGVuc2l0eSBmZ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgMiAgICAgICAgICB0aGVuIGFkZFN0eWxlICdvcGFjaXR5OjAuNSdcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDQgICAgICAgICAgdGhlbiBhZGRTdHlsZSAndGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZSdcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDggICAgICAgICAgdGhlbiBhZGRTdHlsZSAnZGlzcGxheTpub25lJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgOSAgICAgICAgICB0aGVuIGFkZFN0eWxlICd0ZXh0LWRlY29yYXRpb246bGluZS10aHJvdWdoJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgMzkgICAgICAgICB0aGVuIGZnID0gU1RZTEVTW1wiZjE1XCJdICMgZGVmYXVsdCBmb3JlZ3JvdW5kXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyA0OSAgICAgICAgIHRoZW4gYmcgPSBTVFlMRVNbXCJiMFwiXSAgIyBkZWZhdWx0IGJhY2tncm91bmRcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDM4ICAgICAgICAgdGhlbiBmZyA9IFNUWUxFU1tcImYje2NzWzJdfVwiXSAjIGV4dGVuZGVkIGZnIDM4OzU7WzAtMjU1XVxuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgNDggICAgICAgICB0aGVuIGJnID0gU1RZTEVTW1wiYiN7Y3NbMl19XCJdICMgZXh0ZW5kZWQgYmcgNDg7NTtbMC0yNTVdXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gIDMwIDw9IGNvZGUgPD0gMzcgIHRoZW4gZmcgPSBTVFlMRVNbXCJmI3tjb2RlIC0gMzB9XCJdICMgbm9ybWFsIGludGVuc2l0eVxuICAgICAgICAgICAgICAgICAgICB3aGVuICA0MCA8PSBjb2RlIDw9IDQ3ICB0aGVuIGJnID0gU1RZTEVTW1wiYiN7Y29kZSAtIDQwfVwiXVxuICAgICAgICAgICAgICAgICAgICB3aGVuICA5MCA8PSBjb2RlIDw9IDk3ICB0aGVuIGZnID0gU1RZTEVTW1wiZiN7OCtjb2RlIC0gOTB9XCJdICAjIGhpZ2ggaW50ZW5zaXR5XG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMTAwIDw9IGNvZGUgPD0gMTA3IHRoZW4gYmcgPSBTVFlMRVNbXCJiI3s4K2NvZGUgLSAxMDB9XCJdXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAyOCAgICAgICAgIHRoZW4gZGVsU3R5bGUgJ2Rpc3BsYXk6bm9uZSdcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDIyICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxTdHlsZSAnZm9udC13ZWlnaHQ6Ym9sZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbFN0eWxlICdvcGFjaXR5OjAuNSdcbiAgICAgICAgICAgICAgICBicmVhayBpZiBjb2RlIGluIFszOCwgNDhdXG4gICAgICAgICAgICAnJ1xuICAgICAgICAgICAgXG4gICAgICAgIHRva2VucyA9IFtcbiAgICAgICAgICAgIHtwYXR0ZXJuOiAvXlxceDA4Ky8sICAgICAgICAgICAgICAgICAgICAgc3ViOiAnJ31cbiAgICAgICAgICAgIHtwYXR0ZXJuOiAvXlxceDFiXFxbWzAxMl0/Sy8sICAgICAgICAgICAgIHN1YjogJyd9XG4gICAgICAgICAgICB7cGF0dGVybjogL15cXHgxYlxcWygoPzpcXGR7MSwzfTs/KSt8KW0vLCAgc3ViOiBhbnNpQ29kZX0gXG4gICAgICAgICAgICB7cGF0dGVybjogL15cXHgxYlxcWz9bXFxkO117MCwzfS8sICAgICAgICAgc3ViOiAnJ31cbiAgICAgICAgICAgIHtwYXR0ZXJuOiAvXihbXlxceDFiXFx4MDhcXG5dKykvLCAgICAgICAgICBzdWI6IGFkZFRleHR9XG4gICAgICAgICBdXG5cbiAgICAgICAgcHJvY2VzcyA9IChoYW5kbGVyLCBpKSA9PlxuICAgICAgICAgICAgcmV0dXJuIGlmIGkgPiBhbnNpSGFuZGxlciBhbmQgYW5zaU1hdGNoICMgZ2l2ZSBhbnNpSGFuZGxlciBhbm90aGVyIGNoYW5jZSBpZiBpdCBtYXRjaGVzXG4gICAgICAgICAgICBhbnNpTWF0Y2ggPSBmYWxzZVxuICAgICAgICAgICAgQGlucHV0ID0gQGlucHV0LnJlcGxhY2UgaGFuZGxlci5wYXR0ZXJuLCBoYW5kbGVyLnN1YlxuXG4gICAgICAgIHdoaWxlIChsZW5ndGggPSBAaW5wdXQubGVuZ3RoKSA+IDBcbiAgICAgICAgICAgIHByb2Nlc3MoaGFuZGxlciwgaSkgZm9yIGhhbmRsZXIsIGkgaW4gdG9rZW5zXG4gICAgICAgICAgICBicmVhayBpZiBAaW5wdXQubGVuZ3RoID09IGxlbmd0aFxuICAgICAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IEFuc2lcblxuIl19
//# sourceURL=../coffee/ansi.coffee