// koffee 0.56.0

/*
000   000   0000000  000000000  00000000 
000  000   000          000     000   000
0000000    0000000      000     0000000  
000  000        000     000     000   000
000   000  0000000      000     000   000
 */
var ESCAPEREGEXP, STRIPANSI, str;

str = function(o) {
    var noon;
    if (o == null) {
        return 'null';
    }
    if (typeof o === 'object') {
        if (o._str != null) {
            return o._str();
        } else {
            noon = require('noon');
            return "\n" + noon.stringify(o, {
                circular: true
            });
        }
    } else {
        return String(o);
    }
};

str.encode = function(s, spaces) {
    var entity, r, xmlEntities;
    if (spaces == null) {
        spaces = true;
    }
    entity = require('html-entities');
    xmlEntities = new entity.XmlEntities();
    if (s) {
        r = xmlEntities.encode(s);
        if (spaces) {
            r = r.replace(/\s/g, '&nbsp;');
        }
        return r;
    } else {
        return '';
    }
};

ESCAPEREGEXP = /[-\\^$*+?.()|[\]{}\/]/g;

str.escapeRegexp = function(s) {
    return s.replace(ESCAPEREGEXP, '\\$&');
};

str.lpad = function(s, l) {
    s = String(s);
    while (s.length < l) {
        s = ' ' + s;
    }
    return s;
};

str.rpad = function(s, l) {
    s = String(s);
    while (s.length < l) {
        s += ' ';
    }
    return s;
};

str.detab = function(s) {
    var i;
    s = String(s);
    i = 0;
    while (i < s.length) {
        if (s[i] === '\t') {
            s = s.slice(0, i) + (str.lpad('', 4 - (i % 4))) + s.slice(i + 1);
        }
        i += 1;
    }
    return s;
};

str.time = function(t) {
    var f, j, len, ref, u;
    if (typeof t === 'bigint') {
        f = 1000n;
        ref = ['ns', 'μs', 'ms', 's'];
        for (j = 0, len = ref.length; j < len; j++) {
            u = ref[j];
            if (u === 's' || t < f) {
                return '' + (1000n * t / f) + u;
            }
            f *= 1000n;
        }
    } else {
        return String(t);
    }
};

STRIPANSI = /\x1B[[(?);]{0,2}(;?\d)*./g;

str.stripAnsi = function(s) {
    return s.replace(STRIPANSI, '');
};

str.ansi2html = function(s) {
    var Ansi;
    Ansi = require('./ansi');
    return Ansi.html(s);
};

module.exports = str;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3N0ci5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUE7O0FBUUEsR0FBQSxHQUFNLFNBQUMsQ0FBRDtBQUVGLFFBQUE7SUFBQSxJQUFxQixTQUFyQjtBQUFBLGVBQU8sT0FBUDs7SUFDQSxJQUFHLE9BQU8sQ0FBUCxLQUFhLFFBQWhCO1FBQ0ksSUFBRyxjQUFIO21CQUNJLENBQUMsQ0FBQyxJQUFGLENBQUEsRUFESjtTQUFBLE1BQUE7WUFHSSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7bUJBQ1AsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsQ0FBZixFQUFrQjtnQkFBQSxRQUFBLEVBQVUsSUFBVjthQUFsQixFQUpYO1NBREo7S0FBQSxNQUFBO2VBT0ksTUFBQSxDQUFPLENBQVAsRUFQSjs7QUFIRTs7QUFrQk4sR0FBRyxDQUFDLE1BQUosR0FBYSxTQUFDLENBQUQsRUFBSSxNQUFKO0FBRVQsUUFBQTs7UUFGYSxTQUFPOztJQUVwQixNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVI7SUFDVCxXQUFBLEdBQWMsSUFBSSxNQUFNLENBQUMsV0FBWCxDQUFBO0lBRWQsSUFBRyxDQUFIO1FBQ0ksQ0FBQSxHQUFJLFdBQVcsQ0FBQyxNQUFaLENBQW1CLENBQW5CO1FBQ0osSUFBRyxNQUFIO1lBQ0ksQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLENBQVUsS0FBVixFQUFpQixRQUFqQixFQURSOztlQUVBLEVBSko7S0FBQSxNQUFBO2VBTUksR0FOSjs7QUFMUzs7QUFhYixZQUFBLEdBQWU7O0FBQ2YsR0FBRyxDQUFDLFlBQUosR0FBbUIsU0FBQyxDQUFEO1dBQ2YsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxZQUFWLEVBQXdCLE1BQXhCO0FBRGU7O0FBU25CLEdBQUcsQ0FBQyxJQUFKLEdBQVcsU0FBQyxDQUFELEVBQUksQ0FBSjtJQUNQLENBQUEsR0FBSSxNQUFBLENBQU8sQ0FBUDtBQUNKLFdBQU0sQ0FBQyxDQUFDLE1BQUYsR0FBVyxDQUFqQjtRQUF3QixDQUFBLEdBQUksR0FBQSxHQUFNO0lBQWxDO1dBQ0E7QUFITzs7QUFLWCxHQUFHLENBQUMsSUFBSixHQUFXLFNBQUMsQ0FBRCxFQUFJLENBQUo7SUFDUCxDQUFBLEdBQUksTUFBQSxDQUFPLENBQVA7QUFDSixXQUFNLENBQUMsQ0FBQyxNQUFGLEdBQVcsQ0FBakI7UUFBd0IsQ0FBQSxJQUFLO0lBQTdCO1dBQ0E7QUFITzs7QUFLWCxHQUFHLENBQUMsS0FBSixHQUFZLFNBQUMsQ0FBRDtBQUNSLFFBQUE7SUFBQSxDQUFBLEdBQUksTUFBQSxDQUFPLENBQVA7SUFDSixDQUFBLEdBQUk7QUFDSixXQUFNLENBQUEsR0FBSSxDQUFDLENBQUMsTUFBWjtRQUNJLElBQUcsQ0FBRSxDQUFBLENBQUEsQ0FBRixLQUFRLElBQVg7WUFDSSxDQUFBLEdBQUksQ0FBRSxZQUFGLEdBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSixDQUFTLEVBQVQsRUFBYSxDQUFBLEdBQUUsQ0FBQyxDQUFBLEdBQUUsQ0FBSCxDQUFmLENBQUQsQ0FBVixHQUFtQyxDQUFFLGNBRDdDOztRQUVBLENBQUEsSUFBSztJQUhUO1dBSUE7QUFQUTs7QUFlWixHQUFHLENBQUMsSUFBSixHQUFXLFNBQUMsQ0FBRDtBQUNQLFFBQUE7SUFBQSxJQUFHLE9BQU8sQ0FBUCxLQUFhLFFBQWhCO1FBQ0ksQ0FBQSxHQUFJO0FBQ0o7QUFBQSxhQUFBLHFDQUFBOztZQUNJLElBQUcsQ0FBQSxLQUFLLEdBQUwsSUFBWSxDQUFBLEdBQUksQ0FBbkI7QUFDSSx1QkFBTyxFQUFBLEdBQUssQ0FBQyxLQUFBLEdBQVEsQ0FBUixHQUFZLENBQWIsQ0FBTCxHQUF1QixFQURsQzs7WUFFQSxDQUFBLElBQUs7QUFIVCxTQUZKO0tBQUEsTUFBQTtlQU9JLE1BQUEsQ0FBTyxDQUFQLEVBUEo7O0FBRE87O0FBZ0JYLFNBQUEsR0FBWTs7QUFDWixHQUFHLENBQUMsU0FBSixHQUFnQixTQUFDLENBQUQ7V0FDWixDQUFDLENBQUMsT0FBRixDQUFVLFNBQVYsRUFBcUIsRUFBckI7QUFEWTs7QUFHaEIsR0FBRyxDQUFDLFNBQUosR0FBZ0IsU0FBQyxDQUFEO0FBQ1osUUFBQTtJQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjtXQUNQLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBVjtBQUZZOztBQUloQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwICAgMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCBcbjAwMCAgMDAwICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwXG4wMDAwMDAwICAgIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgIFxuMDAwICAwMDAgICAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDBcbjAwMCAgIDAwMCAgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgMDAwXG4jIyNcblxuc3RyID0gKG8pIC0+XG4gICAgXG4gICAgcmV0dXJuICdudWxsJyBpZiBub3Qgbz9cbiAgICBpZiB0eXBlb2YobykgPT0gJ29iamVjdCdcbiAgICAgICAgaWYgby5fc3RyP1xuICAgICAgICAgICAgby5fc3RyKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbm9vbiA9IHJlcXVpcmUgJ25vb24nXG4gICAgICAgICAgICBcIlxcblwiICsgbm9vbi5zdHJpbmdpZnkgbywgY2lyY3VsYXI6IHRydWVcbiAgICBlbHNlXG4gICAgICAgIFN0cmluZyBvXG5cbiMgMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAwMFxuIyAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4jIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCBcbiMgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuIyAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMDAwMDAwXG5cbnN0ci5lbmNvZGUgPSAocywgc3BhY2VzPXRydWUpIC0+XG4gICAgXG4gICAgZW50aXR5ID0gcmVxdWlyZSAnaHRtbC1lbnRpdGllcydcbiAgICB4bWxFbnRpdGllcyA9IG5ldyBlbnRpdHkuWG1sRW50aXRpZXMoKVxuICAgIFxuICAgIGlmIHNcbiAgICAgICAgciA9IHhtbEVudGl0aWVzLmVuY29kZSBzXG4gICAgICAgIGlmIHNwYWNlc1xuICAgICAgICAgICAgciA9IHIucmVwbGFjZSAvXFxzL2csICcmbmJzcDsnXG4gICAgICAgIHJcbiAgICBlbHNlXG4gICAgICAgICcnXG4gIFxuRVNDQVBFUkVHRVhQID0gL1stXFxcXF4kKis/LigpfFtcXF17fVxcL10vZ1xuc3RyLmVzY2FwZVJlZ2V4cCA9IChzKSAtPlxuICAgIHMucmVwbGFjZSBFU0NBUEVSRUdFWFAsICdcXFxcJCYnXG4gICAgICAgICAgICAgICAgXG4jIDAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICBcbiMgMDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgXG4jIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIFxuIyAwMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICBcblxuc3RyLmxwYWQgPSAocywgbCkgLT5cbiAgICBzID0gU3RyaW5nIHNcbiAgICB3aGlsZSBzLmxlbmd0aCA8IGwgdGhlbiBzID0gJyAnICsgc1xuICAgIHNcblxuc3RyLnJwYWQgPSAocywgbCkgLT5cbiAgICBzID0gU3RyaW5nIHNcbiAgICB3aGlsZSBzLmxlbmd0aCA8IGwgdGhlbiBzICs9ICcgJ1xuICAgIHNcbiAgICBcbnN0ci5kZXRhYiA9IChzKSAtPlxuICAgIHMgPSBTdHJpbmcgc1xuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IHMubGVuZ3RoXG4gICAgICAgIGlmIHNbaV0gPT0gJ1xcdCdcbiAgICAgICAgICAgIHMgPSBzWy4uLmldICsgKHN0ci5scGFkICcnLCA0LShpJTQpKSArIHNbaSsxLi5dXG4gICAgICAgIGkgKz0gMVxuICAgIHNcbiAgICBcbiMgMDAwMDAwMDAwICAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDAgIFxuIyAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgXG4jICAgIDAwMCAgICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAgICBcbiMgICAgMDAwICAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICAgIFxuIyAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgXG5cbnN0ci50aW1lID0gKHQpIC0+XG4gICAgaWYgdHlwZW9mKHQpID09ICdiaWdpbnQnXG4gICAgICAgIGYgPSAxMDAwbiBcbiAgICAgICAgZm9yIHUgaW4gWyducycnzrxzJydtcycncyddIFxuICAgICAgICAgICAgaWYgdSA9PSAncycgb3IgdCA8IGYgXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnICsgKDEwMDBuICogdCAvIGYpICsgdSBcbiAgICAgICAgICAgIGYgKj0gMTAwMG4gICAgXG4gICAgZWxzZVxuICAgICAgICBTdHJpbmcgdFxuICAgICAgICBcbiMgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAwMDAgIFxuIyAwMDAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgXG4jIDAwMDAwMDAwMCAgMDAwIDAgMDAwICAwMDAwMDAwICAgMDAwICBcbiMgMDAwICAgMDAwICAwMDAgIDAwMDAgICAgICAgMDAwICAwMDAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgXG5cblNUUklQQU5TSSA9IC9cXHgxQltbKD8pO117MCwyfSg7P1xcZCkqLi9nXG5zdHIuc3RyaXBBbnNpID0gKHMpIC0+XG4gICAgcy5yZXBsYWNlIFNUUklQQU5TSSwgJydcbiAgICAgICAgXG5zdHIuYW5zaTJodG1sID0gKHMpIC0+XG4gICAgQW5zaSA9IHJlcXVpcmUgJy4vYW5zaSdcbiAgICBBbnNpLmh0bWwgc1xuICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gc3RyXG4iXX0=
//# sourceURL=../coffee/kstr.coffee