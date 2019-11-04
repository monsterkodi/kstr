// koffee 1.4.0

/*
000   000   0000000  000000000  00000000 
000  000   000          000     000   000
0000000    0000000      000     0000000  
000  000        000     000     000   000
000   000  0000000      000     000   000
 */
var ESCAPEREGEXP, STRIPANSI, str,
    indexOf = [].indexOf;

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

str.rstrip = function(s, cs) {
    var ref;
    if (cs == null) {
        cs = ' ';
    }
    if (s != null) {
        s;
    } else {
        s = '';
    }
    while (ref = s.slice(-1)[0], indexOf.call(cs, ref) >= 0) {
        s = s.slice(0, s.length - 1);
    }
    return s;
};

str.lstrip = function(s, cs) {
    var ref;
    if (cs == null) {
        cs = ' ';
    }
    if (s != null) {
        s;
    } else {
        s = '';
    }
    while (ref = s[0], indexOf.call(cs, ref) >= 0) {
        s = s.slice(1);
    }
    return s;
};

str.strip = function(s, cs) {
    if (cs == null) {
        cs = ' ';
    }
    return str.rstrip(str.lstrip(s, cs), cs);
};

str.lpad = function(s, l, c) {
    if (c == null) {
        c = ' ';
    }
    s = String(s);
    while (s.length < l) {
        s = c + s;
    }
    return s;
};

str.rpad = function(s, l, c) {
    if (c == null) {
        c = ' ';
    }
    s = String(s);
    while (s.length < l) {
        s += c;
    }
    return s;
};

str.pad = str.rpad;

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
    var f, j, len, ref, thsnd, u;
    if (typeof t === 'bigint') {
        thsnd = BigInt(1000);
        f = thsnd;
        ref = ['ns', 'μs', 'ms', 's'];
        for (j = 0, len = ref.length; j < len; j++) {
            u = ref[j];
            if (u === 's' || t < f) {
                return '' + (thsnd * t / f) + u;
            }
            f *= thsnd;
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

str.ansi = require('./ansi');

module.exports = str;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3N0ci5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUEsNEJBQUE7SUFBQTs7QUFRQSxHQUFBLEdBQU0sU0FBQyxDQUFEO0FBRUYsUUFBQTtJQUFBLElBQXFCLFNBQXJCO0FBQUEsZUFBTyxPQUFQOztJQUNBLElBQUcsT0FBTyxDQUFQLEtBQWEsUUFBaEI7UUFDSSxJQUFHLGNBQUg7bUJBQ0ksQ0FBQyxDQUFDLElBQUYsQ0FBQSxFQURKO1NBQUEsTUFBQTtZQUdJLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjttQkFDUCxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQUwsQ0FBZSxDQUFmLEVBQWtCO2dCQUFBLFFBQUEsRUFBVSxJQUFWO2FBQWxCLEVBSlg7U0FESjtLQUFBLE1BQUE7ZUFPSSxNQUFBLENBQU8sQ0FBUCxFQVBKOztBQUhFOztBQWtCTixHQUFHLENBQUMsTUFBSixHQUFhLFNBQUMsQ0FBRCxFQUFJLE1BQUo7QUFFVCxRQUFBOztRQUZhLFNBQU87O0lBRXBCLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUjtJQUNULFdBQUEsR0FBYyxJQUFJLE1BQU0sQ0FBQyxXQUFYLENBQUE7SUFFZCxJQUFHLENBQUg7UUFDSSxDQUFBLEdBQUksV0FBVyxDQUFDLE1BQVosQ0FBbUIsQ0FBbkI7UUFDSixJQUFHLE1BQUg7WUFDSSxDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsQ0FBVSxLQUFWLEVBQWlCLFFBQWpCLEVBRFI7O2VBRUEsRUFKSjtLQUFBLE1BQUE7ZUFNSSxHQU5KOztBQUxTOztBQWFiLFlBQUEsR0FBZTs7QUFFZixHQUFHLENBQUMsWUFBSixHQUFtQixTQUFDLENBQUQ7V0FFZixDQUFDLENBQUMsT0FBRixDQUFVLFlBQVYsRUFBd0IsTUFBeEI7QUFGZTs7QUFXbkIsR0FBRyxDQUFDLE1BQUosR0FBYSxTQUFDLENBQUQsRUFBSSxFQUFKO0FBRVQsUUFBQTs7UUFGYSxL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IDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgXG4wMDAgIDAwMCAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgIDAwMFxuMDAwMDAwMCAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwICBcbjAwMCAgMDAwICAgICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwXG4wMDAgICAwMDAgIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgIDAwMFxuIyMjXG5cbnN0ciA9IChvKSAtPlxuICAgIFxuICAgIHJldHVybiAnbnVsbCcgaWYgbm90IG8/XG4gICAgaWYgdHlwZW9mKG8pID09ICdvYmplY3QnXG4gICAgICAgIGlmIG8uX3N0cj9cbiAgICAgICAgICAgIG8uX3N0cigpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5vb24gPSByZXF1aXJlICdub29uJ1xuICAgICAgICAgICAgXCJcXG5cIiArIG5vb24uc3RyaW5naWZ5IG8sIGNpcmN1bGFyOiB0cnVlXG4gICAgZWxzZVxuICAgICAgICBTdHJpbmcgb1xuXG4jIDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMDBcbiMgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuIyAwMDAwMDAwICAgMDAwIDAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgXG4jIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiMgMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAwMFxuXG5zdHIuZW5jb2RlID0gKHMsIHNwYWNlcz10cnVlKSAtPlxuICAgIFxuICAgIGVudGl0eSA9IHJlcXVpcmUgJ2h0bWwtZW50aXRpZXMnXG4gICAgeG1sRW50aXRpZXMgPSBuZXcgZW50aXR5LlhtbEVudGl0aWVzKClcbiAgICBcbiAgICBpZiBzXG4gICAgICAgIHIgPSB4bWxFbnRpdGllcy5lbmNvZGUgc1xuICAgICAgICBpZiBzcGFjZXNcbiAgICAgICAgICAgIHIgPSByLnJlcGxhY2UgL1xccy9nLCAnJm5ic3A7J1xuICAgICAgICByXG4gICAgZWxzZVxuICAgICAgICAnJ1xuICBcbkVTQ0FQRVJFR0VYUCA9IC9bLVxcXFxeJCorPy4oKXxbXFxde31cXC9dL2dcblxuc3RyLmVzY2FwZVJlZ2V4cCA9IChzKSAtPlxuICAgIFxuICAgIHMucmVwbGFjZSBFU0NBUEVSRUdFWFAsICdcXFxcJCYnXG4gICAgICAgICAgIFxuIyAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMCAgMDAwMDAwMDAgICBcbiMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgXG4jIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgICAgMDAwICAwMDAwMDAwMCAgIFxuIyAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgICBcbiMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgICAgXG5cblxuc3RyLnJzdHJpcCA9IChzLCBjcz0nICcpIC0+XG4gICAgXG4gICAgcyA/PSAnJ1xuICAgIHMgPSBzWzAuLi5zLmxlbmd0aC0xXSB3aGlsZSBzWy0xXSBpbiBjc1xuICAgIHNcblxuc3RyLmxzdHJpcCA9IChzLCBjcz0nICcpIC0+XG4gICAgXG4gICAgcyA/PSAnJ1xuICAgIHMgPSBzWzEuLl0gd2hpbGUgc1swXSBpbiBjc1xuICAgIHNcbiAgICAgICAgICAgIFxuc3RyLnN0cmlwID0gKHMsIGNzPScgJykgLT4gc3RyLnJzdHJpcCBzdHIubHN0cmlwKHMsY3MpLCBjc1xuICAgIFxuIyAwMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgXG4jIDAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAgICAwMDAgIFxuIyAwMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICBcbiMgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgXG5cbnN0ci5scGFkID0gKHMsIGwsIGM9JyAnKSAtPlxuICAgIHMgPSBTdHJpbmcgc1xuICAgIHdoaWxlIHMubGVuZ3RoIDwgbCB0aGVuIHMgPSBjICsgc1xuICAgIHNcblxuc3RyLnJwYWQgPSAocywgbCwgYz0nICcpIC0+XG4gICAgcyA9IFN0cmluZyBzXG4gICAgd2hpbGUgcy5sZW5ndGggPCBsIHRoZW4gcyArPSBjXG4gICAgc1xuICAgIFxuc3RyLnBhZCA9IHN0ci5ycGFkXG5cbnN0ci5kZXRhYiA9IChzKSAtPlxuICAgIHMgPSBTdHJpbmcgc1xuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IHMubGVuZ3RoXG4gICAgICAgIGlmIHNbaV0gPT0gJ1xcdCdcbiAgICAgICAgICAgIHMgPSBzWy4uLmldICsgKHN0ci5scGFkICcnLCA0LShpJTQpKSArIHNbaSsxLi5dXG4gICAgICAgIGkgKz0gMVxuICAgIHNcbiAgICBcbiMgMDAwMDAwMDAwICAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDAgIFxuIyAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgXG4jICAgIDAwMCAgICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAgICBcbiMgICAgMDAwICAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICAgIFxuIyAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgXG5cbnN0ci50aW1lID0gKHQpIC0+XG4gICAgaWYgdHlwZW9mKHQpID09ICdiaWdpbnQnXG4gICAgICAgIHRoc25kID0gQmlnSW50IDEwMDBcbiAgICAgICAgZiA9IHRoc25kXG4gICAgICAgIGZvciB1IGluIFsnbnMnJ868cycnbXMnJ3MnXSBcbiAgICAgICAgICAgIGlmIHUgPT0gJ3MnIG9yIHQgPCBmIFxuICAgICAgICAgICAgICAgIHJldHVybiAnJyArICh0aHNuZCAqIHQgLyBmKSArIHUgXG4gICAgICAgICAgICBmICo9IHRoc25kXG4gICAgZWxzZVxuICAgICAgICBTdHJpbmcgdFxuICAgICAgICBcbiMgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAwMDAgIFxuIyAwMDAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgXG4jIDAwMDAwMDAwMCAgMDAwIDAgMDAwICAwMDAwMDAwICAgMDAwICBcbiMgMDAwICAgMDAwICAwMDAgIDAwMDAgICAgICAgMDAwICAwMDAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgXG5cblNUUklQQU5TSSA9IC9cXHgxQltbKD8pO117MCwyfSg7P1xcZCkqLi9nXG5zdHIuc3RyaXBBbnNpID0gKHMpIC0+XG4gICAgcy5yZXBsYWNlIFNUUklQQU5TSSwgJydcbiAgICAgICAgXG5zdHIuYW5zaTJodG1sID0gKHMpIC0+XG4gICAgQW5zaSA9IHJlcXVpcmUgJy4vYW5zaSdcbiAgICBBbnNpLmh0bWwgc1xuICAgIFxuc3RyLmFuc2kgPSByZXF1aXJlICcuL2Fuc2knXG4gICAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBzdHJcbiJdfQ==
//# sourceURL=../coffee/kstr.coffee