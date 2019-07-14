// koffee 1.3.0

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

module.exports = str;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3N0ci5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUE7O0FBUUEsR0FBQSxHQUFNLFNBQUMsQ0FBRDtBQUVGLFFBQUE7SUFBQSxJQUFxQixTQUFyQjtBQUFBLGVBQU8sT0FBUDs7SUFDQSxJQUFHLE9BQU8sQ0FBUCxLQUFhLFFBQWhCO1FBQ0ksSUFBRyxjQUFIO21CQUNJLENBQUMsQ0FBQyxJQUFGLENBQUEsRUFESjtTQUFBLE1BQUE7WUFHSSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7bUJBQ1AsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsQ0FBZixFQUFrQjtnQkFBQSxRQUFBLEVBQVUsSUFBVjthQUFsQixFQUpYO1NBREo7S0FBQSxNQUFBO2VBT0ksTUFBQSxDQUFPLENBQVAsRUFQSjs7QUFIRTs7QUFrQk4sR0FBRyxDQUFDLE1BQUosR0FBYSxTQUFDLENBQUQsRUFBSSxNQUFKO0FBRVQsUUFBQTs7UUFGYSxTQUFPOztJQUVwQixNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVI7SUFDVCxXQUFBLEdBQWMsSUFBSSxNQUFNLENBQUMsV0FBWCxDQUFBO0lBRWQsSUFBRyxDQUFIO1FBQ0ksQ0FBQSxHQUFJLFdBQVcsQ0FBQyxNQUFaLENBQW1CLENBQW5CO1FBQ0osSUFBRyxNQUFIO1lBQ0ksQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLENBQVUsS0FBVixFQUFpQixRQUFqQixFQURSOztlQUVBLEVBSko7S0FBQSxNQUFBO2VBTUksR0FOSjs7QUFMUzs7QUFhYixZQUFBLEdBQWU7O0FBQ2YsR0FBRyxDQUFDLFlBQUosR0FBbUIsU0FBQyxDQUFEO1dBQ2YsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxZQUFWLEVBQXdCLE1BQXhCO0FBRGU7O0FBU25CLEdBQUcsQ0FBQyxJQUFKLEdBQVcsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7O1FBQU8sSUFBRTs7SUFDaEIsQ0FBQSxHQUFJLE1BQUEsQ0FBTyxDQUFQO0FBQ0osV0FBTSxDQUFDLENBQUMsTUFBRixHQUFXLENBQWpCO1FBQXdCLENBQUEsR0FBSSxDQUFBLEdBQUk7SUFBaEM7V0FDQTtBQUhPOztBQUtYLEdBQUcsQ0FBQyxJQUFKLEdBQVcsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7O1FBQU8sSUFBRTs7SUFDaEIsQ0FBQSxHQUFJLE1BQUEsQ0FBTyxDQUFQO0FBQ0osV0FBTSxDQUFDLENBQUMsTUFBRixHQUFXLENBQWpCO1FBQXdCLENBQUEsSUFBSztJQUE3QjtXQUNBO0FBSE87O0FBS1gsR0FBRyxDQUFDLEtBQUosR0FBWSxTQUFDLENBQUQ7QUFDUixRQUFBO0lBQUEsQ0FBQSxHQUFJLE1BQUEsQ0FBTyxDQUFQO0lBQ0osQ0FBQSxHQUFJO0FBQ0osV0FBTSxDQUFBLEdBQUksQ0FBQyxDQUFDLE1BQVo7UUFDSSxJQUFHLENBQUUsQ0FBQSxDQUFBLENBQUYsS0FBUSxJQUFYO1lBQ0ksQ0FBQSxHQUFJLENBQUUsWUFBRixHQUFVLENBQUMsR0FBRyxDQUFDLElBQUosQ0FBUyxFQUFULEVBQWEsQ0FBQSxHQUFFLENBQUMsQ0FBQSxHQUFFLENBQUgsQ0FBZixDQUFELENBQVYsR0FBbUMsQ0FBRSxjQUQ3Qzs7UUFFQSxDQUFBLElBQUs7SUFIVDtXQUlBO0FBUFE7O0FBZVosR0FBRyxDQUFDLElBQUosR0FBVyxTQUFDLENBQUQ7QUFDUCxRQUFBO0lBQUEsSUFBRyxPQUFPLENBQVAsS0FBYSxRQUFoQjtRQUNJLEtBQUEsR0FBUSxNQUFBLENBQU8sSUFBUDtRQUNSLENBQUEsR0FBSTtBQUNKO0FBQUEsYUFBQSxxQ0FBQTs7WUFDSSxJQUFHLENBQUEsS0FBSyxHQUFMLElBQVksQ0FBQSxHQUFJLENBQW5CO0FBQ0ksdUJBQU8sRUFBQSxHQUFLLENBQUMsS0FBQSxHQUFRLENBQVIsR0FBWSxDQUFiLENBQUwsR0FBdUIsRUFEbEM7O1lBRUEsQ0FBQSxJQUFLO0FBSFQsU0FISjtLQUFBLE1BQUE7ZUFRSSxNQUFBLENBQU8sQ0FBUCxFQVJKOztBQURPOztBQWlCWCxTQUFBLEdBQVk7O0FBQ1osR0FBRyxDQUFDLFNBQUosR0FBZ0IsU0FBQyxDQUFEO1dBQ1osQ0FBQyxDQUFDLE9BQUYsQ0FBVSxTQUFWLEVBQXFCLEVBQXJCO0FBRFk7O0FBR2hCLEdBQUcsQ0FBQyxTQUFKLEdBQWdCLFNBQUMsQ0FBRDtBQUNaLFFBQUE7SUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7V0FDUCxJQUFJLENBQUMsSUFBTCxDQUFVLENBQVY7QUFGWTs7QUFJaEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbjAwMCAgIDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgXG4wMDAgIDAwMCAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgIDAwMFxuMDAwMDAwMCAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwICBcbjAwMCAgMDAwICAgICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwXG4wMDAgICAwMDAgIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgIDAwMFxuIyMjXG5cbnN0ciA9IChvKSAtPlxuICAgIFxuICAgIHJldHVybiAnbnVsbCcgaWYgbm90IG8/XG4gICAgaWYgdHlwZW9mKG8pID09ICdvYmplY3QnXG4gICAgICAgIGlmIG8uX3N0cj9cbiAgICAgICAgICAgIG8uX3N0cigpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5vb24gPSByZXF1aXJlICdub29uJ1xuICAgICAgICAgICAgXCJcXG5cIiArIG5vb24uc3RyaW5naWZ5IG8sIGNpcmN1bGFyOiB0cnVlXG4gICAgZWxzZVxuICAgICAgICBTdHJpbmcgb1xuXG4jIDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMDBcbiMgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuIyAwMDAwMDAwICAgMDAwIDAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgXG4jIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiMgMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAwMFxuXG5zdHIuZW5jb2RlID0gKHMsIHNwYWNlcz10cnVlKSAtPlxuICAgIFxuICAgIGVudGl0eSA9IHJlcXVpcmUgJ2h0bWwtZW50aXRpZXMnXG4gICAgeG1sRW50aXRpZXMgPSBuZXcgZW50aXR5LlhtbEVudGl0aWVzKClcbiAgICBcbiAgICBpZiBzXG4gICAgICAgIHIgPSB4bWxFbnRpdGllcy5lbmNvZGUgc1xuICAgICAgICBpZiBzcGFjZXNcbiAgICAgICAgICAgIHIgPSByLnJlcGxhY2UgL1xccy9nLCAnJm5ic3A7J1xuICAgICAgICByXG4gICAgZWxzZVxuICAgICAgICAnJ1xuICBcbkVTQ0FQRVJFR0VYUCA9IC9bLVxcXFxeJCorPy4oKXxbXFxde31cXC9dL2dcbnN0ci5lc2NhcGVSZWdleHAgPSAocykgLT5cbiAgICBzLnJlcGxhY2UgRVNDQVBFUkVHRVhQLCAnXFxcXCQmJ1xuICAgICAgICAgICAgICAgIFxuIyAwMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgXG4jIDAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAgICAwMDAgIFxuIyAwMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICBcbiMgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgXG5cbnN0ci5scGFkID0gKHMsIGwsIGM9JyAnKSAtPlxuICAgIHMgPSBTdHJpbmcgc1xuICAgIHdoaWxlIHMubGVuZ3RoIDwgbCB0aGVuIHMgPSBjICsgc1xuICAgIHNcblxuc3RyLnJwYWQgPSAocywgbCwgYz0nICcpIC0+XG4gICAgcyA9IFN0cmluZyBzXG4gICAgd2hpbGUgcy5sZW5ndGggPCBsIHRoZW4gcyArPSBjXG4gICAgc1xuICAgIFxuc3RyLmRldGFiID0gKHMpIC0+XG4gICAgcyA9IFN0cmluZyBzXG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgcy5sZW5ndGhcbiAgICAgICAgaWYgc1tpXSA9PSAnXFx0J1xuICAgICAgICAgICAgcyA9IHNbLi4uaV0gKyAoc3RyLmxwYWQgJycsIDQtKGklNCkpICsgc1tpKzEuLl1cbiAgICAgICAgaSArPSAxXG4gICAgc1xuICAgIFxuIyAwMDAwMDAwMDAgIDAwMCAgMDAgICAgIDAwICAwMDAwMDAwMCAgXG4jICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICBcbiMgICAgMDAwICAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgIFxuIyAgICAwMDAgICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgICAgXG4jICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICBcblxuc3RyLnRpbWUgPSAodCkgLT5cbiAgICBpZiB0eXBlb2YodCkgPT0gJ2JpZ2ludCdcbiAgICAgICAgdGhzbmQgPSBCaWdJbnQgMTAwMFxuICAgICAgICBmID0gdGhzbmRcbiAgICAgICAgZm9yIHUgaW4gWyducycnzrxzJydtcycncyddIFxuICAgICAgICAgICAgaWYgdSA9PSAncycgb3IgdCA8IGYgXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnICsgKHRoc25kICogdCAvIGYpICsgdSBcbiAgICAgICAgICAgIGYgKj0gdGhzbmRcbiAgICBlbHNlXG4gICAgICAgIFN0cmluZyB0XG4gICAgICAgIFxuIyAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgIDAwMCAgXG4jIDAwMCAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgICAgMDAwICBcbiMgMDAwMDAwMDAwICAwMDAgMCAwMDAgIDAwMDAwMDAgICAwMDAgIFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwMCAgICAgICAwMDAgIDAwMCAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwICBcblxuU1RSSVBBTlNJID0gL1xceDFCW1soPyk7XXswLDJ9KDs/XFxkKSouL2dcbnN0ci5zdHJpcEFuc2kgPSAocykgLT5cbiAgICBzLnJlcGxhY2UgU1RSSVBBTlNJLCAnJ1xuICAgICAgICBcbnN0ci5hbnNpMmh0bWwgPSAocykgLT5cbiAgICBBbnNpID0gcmVxdWlyZSAnLi9hbnNpJ1xuICAgIEFuc2kuaHRtbCBzXG4gICAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBzdHJcbiJdfQ==
//# sourceURL=../coffee/kstr.coffee