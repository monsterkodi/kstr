// koffee 1.12.0

/*
000000000  00000000   0000000  000000000
   000     000       000          000   
   000     0000000   0000000      000   
   000     000            000     000   
   000     00000000  0000000      000
 */
var chai, expect, kstr;

kstr = require('../');

chai = require('chai');

chai.should();

expect = chai.expect;

describe('kstr', function() {
    it('escapeRegexp', function() {
        return kstr.escapeRegexp('a/b.txt').should.eql('a\\/b\\.txt');
    });
    it('lstrip', function() {
        kstr.lstrip().should.eql('');
        kstr.lstrip('').should.eql('');
        kstr.lstrip('   y').should.eql('y');
        kstr.lstrip(' ').should.eql('');
        kstr.lstrip('x ', 'x').should.eql(' ');
        return kstr.lstrip(' yxy ', ' y').should.eql('xy ');
    });
    it('rstrip', function() {
        kstr.rstrip().should.eql('');
        kstr.rstrip('').should.eql('');
        kstr.rstrip('   y', 'y').should.eql('   ');
        kstr.rstrip(' ').should.eql('');
        kstr.rstrip(' x', 'x').should.eql(' ');
        return kstr.rstrip(' yxy ', ' y').should.eql(' yx');
    });
    it('strip', function() {
        kstr.strip().should.eql('');
        kstr.strip('').should.eql('');
        kstr.strip('abc').should.eql('abc');
        kstr.strip('123   y  123', '123').should.eql('   y  ');
        kstr.strip(' x y z ', 'xyz ').should.eql('');
        kstr.strip('x x', 'x').should.eql(' ');
        return kstr.strip(' yxy ', ' y').should.eql('x');
    });
    it('lpad', function() {
        kstr.lpad('', 4).should.eql('    ');
        kstr.lpad('x', 4).should.eql('   x');
        return kstr.lpad(' xxx ', 2).should.eql(' xxx ');
    });
    it('rpad', function() {
        kstr.rpad('', 4).should.eql('    ');
        kstr.rpad('x', 4).should.eql('x   ');
        return kstr.rpad(' xxx ', 2).should.eql(' xxx ');
    });
    it('ansi2html', function() {
        var a2h;
        require('klor').kolor.globalize();
        a2h = function(s, r) {
            return kstr.ansi2html(s).should.eql(r);
        };
        a2h('hello', 'hello');
        a2h(r5('red'), '<span style="color:#ff0000;">red</span>');
        a2h((r5('red')) + "\n" + (g5('green')), "<span style=\"color:#ff0000;\">red</span>\n<span style=\"color:#00ff00;\">green</span>");
        return a2h("" + (r5('red')) + (g5('green')), '<span style="color:#ff0000;">red</span><span style="color:#00ff00;">green</span>');
    });
    it('stripAnsi', function() {
        return (kstr.stripAnsi(g5('green'))).should.eql('green');
    });
    it('dissect', function() {
        var ansi, diss;
        ansi = new kstr.ansi;
        diss = ansi.dissect('[48;5;0m..[48;5;15m  [0m');
        diss[0].should.eql('..  ');
        diss[1].length.should.eql(2);
        diss[1][1].match.should.eql('  ');
        return diss[1][1].start.should.eql(2);
    });
    it('detab', function() {
        kstr.detab('\t\t').should.eql('        ');
        return kstr.detab('aa\tbb').should.eql('aa  bb');
    });
    it('time number', function() {
        kstr.time(1).should.eql('1 ms');
        kstr.time(1000).should.eql('1 second');
        kstr.time(1001).should.eql('1 second');
        kstr.time(1999).should.eql('1 second');
        kstr.time(2000).should.eql('2 seconds');
        kstr.time(2001).should.eql('2 seconds');
        kstr.time(59999).should.eql('59 seconds');
        kstr.time(60000).should.eql('1 minute');
        kstr.time(120001).should.eql('2 minutes');
        kstr.time(1000 * 60 * 60).should.eql('1 hour');
        kstr.time(1000 * 60 * 60 * 24).should.eql('1 day');
        kstr.time(1000 * 60 * 60 * 48).should.eql('2 days');
        kstr.time(1000 * 60 * 60 * 24 * 30).should.eql('1 month');
        kstr.time(1000 * 60 * 60 * 24 * 60).should.eql('2 months');
        kstr.time(1000 * 60 * 60 * 24 * 30 * 12).should.eql('1 year');
        return kstr.time(1000 * 60 * 60 * 24 * 30 * 24).should.eql('2 years');
    });
    return it('time bigint', function() {
        kstr.time(BigInt(1)).should.eql('1 ns');
        kstr.time(BigInt(1000)).should.eql('1 μs');
        kstr.time(BigInt(1001)).should.eql('1 μs');
        kstr.time(BigInt(6001)).should.eql('6 μs');
        kstr.time(BigInt(1000000)).should.eql('1 ms');
        kstr.time(BigInt(1000000000)).should.eql('1 second');
        return kstr.time(BigInt(2000000000)).should.eql('2 seconds');
    });
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbInRlc3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLElBQUEsR0FBTyxPQUFBLENBQVEsS0FBUjs7QUFDUCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0FBQ1AsSUFBSSxDQUFDLE1BQUwsQ0FBQTs7QUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDOztBQUVkLFFBQUEsQ0FBUyxNQUFULEVBQWdCLFNBQUE7SUFFWixFQUFBLENBQUcsY0FBSCxFQUFrQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsU0FBbEIsQ0FBNEIsQ0FBQyxNQUFNLENBQUMsR0FBcEMsQ0FBd0MsYUFBeEM7SUFEYyxDQUFsQjtJQVNBLEVBQUEsQ0FBRyxRQUFILEVBQVksU0FBQTtRQUNSLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBYSxDQUFDLE1BQU0sQ0FBQyxHQUFyQixDQUF5QixFQUF6QjtRQUNBLElBQUksQ0FBQyxNQUFMLENBQVksRUFBWixDQUFlLENBQUMsTUFBTSxDQUFDLEdBQXZCLENBQTJCLEVBQTNCO1FBQ0EsSUFBSSxDQUFDLE1BQUwsQ0FBWSxNQUFaLENBQW1CLENBQUMsTUFBTSxDQUFDLEdBQTNCLENBQStCLEdBQS9CO1FBQ0EsSUFBSSxDQUFDLE1BQUwsQ0FBWSxHQUFaLENBQWdCLENBQUMsTUFBTSxDQUFDLEdBQXhCLENBQTRCLEVBQTVCO1FBQ0EsSUFBSSxDQUFDLE1BQUwsQ0FBWSxJQUFaLEVBQWlCLEdBQWpCLENBQXFCLENBQUMsTUFBTSxDQUFDLEdBQTdCLENBQWlDLEdBQWpDO2VBQ0EsSUFBSSxDQUFDLE1BQUwsQ0FBWSxPQUFaLEVBQW9CLElBQXBCLENBQXlCLENBQUMsTUFBTSxDQUFDLEdBQWpDLENBQXFDLEtBQXJDO0lBTlEsQ0FBWjtJQVFBLEVBQUEsQ0FBRyxRQUFILEVBQVksU0FBQTtRQUNSLElBQUksQ0FB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QUFVLE1BQUEsQ0FBTyxJQUFQLENBQVYsQ0FBc0IsQ0FBQyxNQUFNLENBQUMsR0FBOUIsQ0FBa0MsTUFBbEM7UUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQUEsQ0FBTyxPQUFQLENBQVYsQ0FBeUIsQ0FBQyxNQUFNLENBQUMsR0FBakMsQ0FBcUMsTUFBckM7UUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQUEsQ0FBTyxVQUFQLENBQVYsQ0FBNEIsQ0FBQyxNQUFNLENBQUMsR0FBcEMsQ0FBd0MsVUFBeEM7ZUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQUEsQ0FBTyxVQUFQLENBQVYsQ0FBNEIsQ0FBQyxNQUFNLENBQUMsR0FBcEMsQ0FBd0MsV0FBeEM7SUFQYSxDQUFqQjtBQTFIWSxDQUFoQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMFxuICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgIDAwMCAgIFxuICAgMDAwICAgICAwMDAgICAgICAgICAgICAwMDAgICAgIDAwMCAgIFxuICAgMDAwICAgICAwMDAwMDAwMCAgMDAwMDAwMCAgICAgIDAwMCAgIFxuIyMjXG5cbmtzdHIgPSByZXF1aXJlICcuLi8nXG5jaGFpID0gcmVxdWlyZSAnY2hhaSdcbmNoYWkuc2hvdWxkKClcbmV4cGVjdCA9IGNoYWkuZXhwZWN0XG5cbmRlc2NyaWJlICdrc3RyJyAtPlxuICAgICAgICAgICAgICAgICAgICBcbiAgICBpdCAnZXNjYXBlUmVnZXhwJyAtPlxuICAgICAgICBrc3RyLmVzY2FwZVJlZ2V4cCgnYS9iLnR4dCcpLnNob3VsZC5lcWwgJ2FcXFxcL2JcXFxcLnR4dCdcbiAgICAgICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMCAgMDAwMDAwMDAgICBcbiAgICAjIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwICAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgICAgIFxuICAgIFxuICAgIGl0ICdsc3RyaXAnIC0+XG4gICAgICAgIGtzdHIubHN0cmlwKCkuc2hvdWxkLmVxbCAnJ1xuICAgICAgICBrc3RyLmxzdHJpcCgnJykuc2hvdWxkLmVxbCAnJ1xuICAgICAgICBrc3RyLmxzdHJpcCgnICAgeScpLnNob3VsZC5lcWwgJ3knXG4gICAgICAgIGtzdHIubHN0cmlwKCcgJykuc2hvdWxkLmVxbCAnJ1xuICAgICAgICBrc3RyLmxzdHJpcCgneCAnICd4Jykuc2hvdWxkLmVxbCAnICdcbiAgICAgICAga3N0ci5sc3RyaXAoJyB5eHkgJyAnIHknKS5zaG91bGQuZXFsICd4eSAnXG5cbiAgICBpdCAncnN0cmlwJyAtPlxuICAgICAgICBrc3RyLnJzdHJpcCgpLnNob3VsZC5lcWwgJydcbiAgICAgICAga3N0ci5yc3RyaXAoJycpLnNob3VsZC5lcWwgJydcbiAgICAgICAga3N0ci5yc3RyaXAoJyAgIHknICd5Jykuc2hvdWxkLmVxbCAnICAgJ1xuICAgICAgICBrc3RyLnJzdHJpcCgnICcpLnNob3VsZC5lcWwgJydcbiAgICAgICAga3N0ci5yc3RyaXAoJyB4JyAneCcpLnNob3VsZC5lcWwgJyAnXG4gICAgICAgIGtzdHIucnN0cmlwKCcgeXh5ICcgJyB5Jykuc2hvdWxkLmVxbCAnIHl4J1xuXG4gICAgaXQgJ3N0cmlwJyAtPlxuICAgICAgICBrc3RyLnN0cmlwKCkuc2hvdWxkLmVxbCAnJ1xuICAgICAgICBrc3RyLnN0cmlwKCcnKS5zaG91bGQuZXFsICcnXG4gICAgICAgIGtzdHIuc3RyaXAoJ2FiYycpLnNob3VsZC5lcWwgJ2FiYydcbiAgICAgICAga3N0ci5zdHJpcCgnMTIzICAgeSAgMTIzJyAnMTIzJykuc2hvdWxkLmVxbCAnICAgeSAgJ1xuICAgICAgICBrc3RyLnN0cmlwKCcgeCB5IHogJyAneHl6ICcpLnNob3VsZC5lcWwgJydcbiAgICAgICAga3N0ci5zdHJpcCgneCB4JyAneCcpLnNob3VsZC5lcWwgJyAnXG4gICAgICAgIGtzdHIuc3RyaXAoJyB5eHkgJyAnIHknKS5zaG91bGQuZXFsICd4J1xuICAgICAgICBcbiAgICAjIDAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICBcbiAgICAjIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIFxuICAgICMgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgXG4gICAgXG4gICAgaXQgJ2xwYWQnIC0+XG4gICAgICAgIGtzdHIubHBhZCgnJywgNCkuc2hvdWxkLmVxbCAnICAgICdcbiAgICAgICAga3N0ci5scGFkKCd4JywgNCkuc2hvdWxkLmVxbCAnICAgeCdcbiAgICAgICAga3N0ci5scGFkKCcgeHh4ICcsIDIpLnNob3VsZC5lcWwgJyB4eHggJ1xuXG4gICAgaXQgJ3JwYWQnIC0+XG4gICAgICAgIGtzdHIucnBhZCgnJywgNCkuc2hvdWxkLmVxbCAnICAgICdcbiAgICAgICAga3N0ci5ycGFkKCd4JywgNCkuc2hvdWxkLmVxbCAneCAgICdcbiAgICAgICAga3N0ci5ycGFkKCcgeHh4ICcsIDIpLnNob3VsZC5lcWwgJyB4eHggJ1xuIFxuICAgICMgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAwMDAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgICAwMDAgIFxuICAgICMgMDAwMDAwMDAwICAwMDAgMCAwMDAgIDAwMDAwMDAgICAwMDAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMDAgICAgICAgMDAwICAwMDAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAwMDAgIFxuICAgIFxuICAgIGl0ICdhbnNpMmh0bWwnIC0+XG4gICAgICAgIFxuICAgICAgICByZXF1aXJlKCdrbG9yJykua29sb3IuZ2xvYmFsaXplKClcbiAgICAgICAgYTJoID0gKHMscikgLT4ga3N0ci5hbnNpMmh0bWwocykuc2hvdWxkLmVxbCByXG4gICAgICAgIFxuICAgICAgICBhMmggJ2hlbGxvJywgJ2hlbGxvJ1xuICAgICAgICBhMmggcjUoJ3JlZCcpLCAnPHNwYW4gc3R5bGU9XCJjb2xvcjojZmYwMDAwO1wiPnJlZDwvc3Bhbj4nXG4gICAgICAgIGEyaCBcIlwiXCJcbiAgICAgICAgICAgICN7cjUoJ3JlZCcpfVxuICAgICAgICAgICAgI3tnNSgnZ3JlZW4nKX1cbiAgICAgICAgICAgIFwiXCJcIiwgXCJcIlwiXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT1cImNvbG9yOiNmZjAwMDA7XCI+cmVkPC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJjb2xvcjojMDBmZjAwO1wiPmdyZWVuPC9zcGFuPlxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIGEyaCBcIiN7cjUoJ3JlZCcpfSN7ZzUoJ2dyZWVuJyl9XCIsICc8c3BhbiBzdHlsZT1cImNvbG9yOiNmZjAwMDA7XCI+cmVkPC9zcGFuPjxzcGFuIHN0eWxlPVwiY29sb3I6IzAwZmYwMDtcIj5ncmVlbjwvc3Bhbj4nXG4gICAgICAgIFxuICAgIGl0ICdzdHJpcEFuc2knIC0+XG4gICAgICAgIFxuICAgICAgICAoa3N0ci5zdHJpcEFuc2kgZzUoJ2dyZWVuJykpLnNob3VsZC5lcWwgJ2dyZWVuJ1xuICAgICAgICBcbiAgICBpdCAnZGlzc2VjdCcgLT5cbiAgICAgICAgXG4gICAgICAgIGFuc2k9IG5ldyBrc3RyLmFuc2lcbiAgICAgICAgZGlzcyA9IGFuc2kuZGlzc2VjdCAnXHUwMDFiWzQ4OzU7MG0uLlx1MDAxYls0ODs1OzE1bSAgXHUwMDFiWzBtJ1xuICAgICAgICBkaXNzWzBdLnNob3VsZC5lcWwgJy4uICAnXG4gICAgICAgIGRpc3NbMV0ubGVuZ3RoLnNob3VsZC5lcWwgMlxuICAgICAgICBkaXNzWzFdWzFdLm1hdGNoLnNob3VsZC5lcWwgJyAgJ1xuICAgICAgICBkaXNzWzFdWzFdLnN0YXJ0LnNob3VsZC5lcWwgMlxuICAgICAgICBcbiAgICAjIDAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgIFxuICAgICMgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgXG4gICAgIyAgICAwMDAgICAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgICBcbiAgICAjICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIFxuICAgICMgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgXG4gICAgXG4gICAgaXQgJ2RldGFiJyAtPlxuICAgICAgICBrc3RyLmRldGFiKCdcXHRcXHQnKS5zaG91bGQuZXFsICcgICAgICAgICdcbiAgICAgICAga3N0ci5kZXRhYignYWFcXHRiYicpLnNob3VsZC5lcWwgJ2FhICBiYidcbiAgICAgICAgXG4gICAgICAgXG4gICAgIyAwMDAwMDAwMDAgIDAwMCAgMDAgICAgIDAwICAwMDAwMDAwMCAgXG4gICAgIyAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgXG4gICAgIyAgICAwMDAgICAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwICAgXG4gICAgIyAgICAwMDAgICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgICAgXG4gICAgIyAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgXG4gICAgXG4gICAgaXQgJ3RpbWUgbnVtYmVyJyAtPlxuICAgICAgICBrc3RyLnRpbWUoMSAgICAgICAgICAgICAgICAgICAgICkuc2hvdWxkLmVxbCAnMSBtcydcbiAgICAgICAga3N0ci50aW1lKDEwMDAgICAgICAgICAgICAgICAgICApLnNob3VsZC5lcWwgJzEgc2Vjb25kJ1xuICAgICAgICBrc3RyLnRpbWUoMTAwMSAgICAgICAgICAgICAgICAgICkuc2hvdWxkLmVxbCAnMSBzZWNvbmQnXG4gICAgICAgIGtzdHIudGltZSgxOTk5ICAgICAgICAgICAgICAgICAgKS5zaG91bGQuZXFsICcxIHNlY29uZCdcbiAgICAgICAga3N0ci50aW1lKDIwMDAgICAgICAgICAgICAgICAgICApLnNob3VsZC5lcWwgJzIgc2Vjb25kcydcbiAgICAgICAga3N0ci50aW1lKDIwMDEgICAgICAgICAgICAgICAgICApLnNob3VsZC5lcWwgJzIgc2Vjb25kcydcbiAgICAgICAga3N0ci50aW1lKDU5OTk5ICAgICAgICAgICAgICAgICApLnNob3VsZC5lcWwgJzU5IHNlY29uZHMnXG4gICAgICAgIGtzdHIudGltZSg2MDAwMCAgICAgICAgICAgICAgICAgKS5zaG91bGQuZXFsICcxIG1pbnV0ZSdcbiAgICAgICAga3N0ci50aW1lKDEyMDAwMSAgICAgICAgICAgICAgICApLnNob3VsZC5lcWwgJzIgbWludXRlcydcbiAgICAgICAga3N0ci50aW1lKDEwMDAqNjAqNjAgICAgICAgICAgICApLnNob3VsZC5lcWwgJzEgaG91cidcbiAgICAgICAga3N0ci50aW1lKDEwMDAqNjAqNjAqMjQgICAgICAgICApLnNob3VsZC5lcWwgJzEgZGF5J1xuICAgICAgICBrc3RyLnRpbWUoMTAwMCo2MCo2MCo0OCAgICAgICAgICkuc2hvdWxkLmVxbCAnMiBkYXlzJ1xuICAgICAgICBrc3RyLnRpbWUoMTAwMCo2MCo2MCoyNCozMCAgICAgICkuc2hvdWxkLmVxbCAnMSBtb250aCdcbiAgICAgICAga3N0ci50aW1lKDEwMDAqNjAqNjAqMjQqNjAgICAgICApLnNob3VsZC5lcWwgJzIgbW9udGhzJ1xuICAgICAgICBrc3RyLnRpbWUoMTAwMCo2MCo2MCoyNCozMCoxMiAgICkuc2hvdWxkLmVxbCAnMSB5ZWFyJ1xuICAgICAgICBrc3RyLnRpbWUoMTAwMCo2MCo2MCoyNCozMCoyNCAgICkuc2hvdWxkLmVxbCAnMiB5ZWFycydcbiAgICAgICAgXG4gICAgaXQgJ3RpbWUgYmlnaW50JyAtPlxuICAgICAgICBrc3RyLnRpbWUoQmlnSW50IDEgICApLnNob3VsZC5lcWwgJzEgbnMnXG4gICAgICAgIGtzdHIudGltZShCaWdJbnQgMTAwMCkuc2hvdWxkLmVxbCAnMSDOvHMnXG4gICAgICAgIGtzdHIudGltZShCaWdJbnQgMTAwMSkuc2hvdWxkLmVxbCAnMSDOvHMnXG4gICAgICAgIGtzdHIudGltZShCaWdJbnQgNjAwMSkuc2hvdWxkLmVxbCAnNiDOvHMnXG4gICAgICAgIGtzdHIudGltZShCaWdJbnQgMTAwMDAwMCkuc2hvdWxkLmVxbCAnMSBtcydcbiAgICAgICAga3N0ci50aW1lKEJpZ0ludCAxMDAwMDAwMDAwKS5zaG91bGQuZXFsICcxIHNlY29uZCdcbiAgICAgICAga3N0ci50aW1lKEJpZ0ludCAyMDAwMDAwMDAwKS5zaG91bGQuZXFsICcyIHNlY29uZHMnXG4gICAgICAgICJdfQ==
//# sourceURL=../coffee/test.coffee