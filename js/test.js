var _k_

var a2h, ansi, diss, k, kstr, n, s

kstr = require('../')
k = require('klor').kolor
module.exports["kstr"] = function ()
{
    section("escapeRegexp", function ()
    {
        compare(kstr.escapeRegexp('a/b.txt'),'a\\/b\\.txt')
    })
    section("lstrip", function ()
    {
        compare(kstr.lstrip(),'')
        compare(kstr.lstrip(''),'')
        compare(kstr.lstrip('   y'),'y')
        compare(kstr.lstrip(' '),'')
        compare(kstr.lstrip('x ','x'),' ')
        compare(kstr.lstrip(' yxy ',' y'),'xy ')
    })
    section("rstrip", function ()
    {
        compare(kstr.rstrip(),'')
        compare(kstr.rstrip(''),'')
        compare(kstr.rstrip('   y','y'),'   ')
        compare(kstr.rstrip(' '),'')
        compare(kstr.rstrip(' x','x'),' ')
        compare(kstr.rstrip(' yxy ',' y'),' yx')
    })
    section("strip", function ()
    {
        compare(kstr.strip(),'')
        compare(kstr.strip(''),'')
        compare(kstr.strip('abc'),'abc')
        compare(kstr.strip('123   y  123','123'),'   y  ')
        compare(kstr.strip(' x y z ','xyz '),'')
        compare(kstr.strip('x x','x'),' ')
        compare(kstr.strip(' yxy ',' y'),'x')
    })
    section("trim", function ()
    {
        compare(kstr.trim('123   y  123','123'),'   y  ')
        compare(kstr.ltrim(' yxy ',' y'),'xy ')
        compare(kstr.rtrim('   y','y'),'   ')
    })
    section("lcnt", function ()
    {
        s = 'abc'
        n = 123
        compare(kstr.lcnt(),0)
        compare(kstr.lcnt(null,'n'),0)
        compare(kstr.lcnt(undefined,'u'),0)
        compare(kstr.lcnt(Infinity,'Inf'),0)
        compare(kstr.lcnt({},'{'),0)
        compare(kstr.lcnt([],'['),0)
        compare(kstr.lcnt('',1),0)
        compare(kstr.lcnt('ax',''),0)
        compare(kstr.lcnt('','xy'),0)
        compare(kstr.lcnt('abc',Infinity),0)
        compare(kstr.lcnt('abc',null),0)
        compare(kstr.lcnt('abc',undefined),0)
        compare(kstr.lcnt('abc',{}),0)
        compare(kstr.lcnt('abc',['ab','b']),0)
        compare(kstr.lcnt('abc',['a','b']),2)
        compare(kstr.lcnt(s,'ac'),1)
        compare(kstr.lcnt(n,'13'),1)
        compare(kstr.lcnt(11202,'12'),3)
        compare(kstr.lcnt('   xx',' '),3)
        compare(kstr.lcnt('12345 blub','1234'),4)
    })
    section("lpad", function ()
    {
        compare(kstr.lpad('',4),'    ')
        compare(kstr.lpad('x',4),'   x')
        compare(kstr.lpad(' xxx ',2),' xxx ')
    })
    section("rpad", function ()
    {
        compare(kstr.rpad('',4),'    ')
        compare(kstr.rpad('x',4),'x   ')
        compare(kstr.rpad(' xxx ',2),' xxx ')
    })
    section("ansi2html", function ()
    {
        a2h = function (s, r)
        {
            return compare(kstr.ansi2html(s),r)
        }
        a2h('hello','hello')
        a2h(k.r5('red'),'<span style="color:#ff0000;">red</span>')
        a2h(`${k.r5('red')}
${k.g5('green')}`,`<span style="color:#ff0000;">red</span>
<span style="color:#00ff00;">green</span>`)
        a2h(`${k.r5('red')}${k.g5('green')}`,'<span style="color:#ff0000;">red</span><span style="color:#00ff00;">green</span>')
    })
    section("stripAnsi", function ()
    {
        compare((kstr.stripAnsi(k.g5('green'))),'green')
    })
    section("dissect", function ()
    {
        ansi = new kstr.ansi
        diss = ansi.dissect('[48;5;0m..[48;5;15m  [0m')
        compare(diss[0],'..  ')
        compare(diss[1].length,2)
        compare(diss[1][1].match,'  ')
        compare(diss[1][1].start,2)
    })
    section("detab", function ()
    {
        compare(kstr.detab('\t\t'),'        ')
        compare(kstr.detab('aa\tbb'),'aa  bb')
    })
    section("time number", function ()
    {
        compare(kstr.time(1),'1 ms')
        compare(kstr.time(1000),'1 second')
        compare(kstr.time(1001),'1 second')
        compare(kstr.time(1999),'1 second')
        compare(kstr.time(2000),'2 seconds')
        compare(kstr.time(2001),'2 seconds')
        compare(kstr.time(59999),'59 seconds')
        compare(kstr.time(60000),'1 minute')
        compare(kstr.time(120001),'2 minutes')
        compare(kstr.time(1000 * 60 * 60),'1 hour')
        compare(kstr.time(1000 * 60 * 60 * 24),'1 day')
        compare(kstr.time(1000 * 60 * 60 * 48),'2 days')
        compare(kstr.time(1000 * 60 * 60 * 24 * 30),'1 month')
        compare(kstr.time(1000 * 60 * 60 * 24 * 60),'2 months')
        compare(kstr.time(1000 * 60 * 60 * 24 * 30 * 12),'1 year')
        compare(kstr.time(1000 * 60 * 60 * 24 * 30 * 24),'2 years')
    })
    section("time bigint", function ()
    {
        compare(kstr.time(BigInt(1)),'1 ns')
        compare(kstr.time(BigInt(1000)),'1 μs')
        compare(kstr.time(BigInt(1001)),'1 μs')
        compare(kstr.time(BigInt(6001)),'6 μs')
        compare(kstr.time(BigInt(1000000)),'1 ms')
        compare(kstr.time(BigInt(1000000000)),'1 second')
        compare(kstr.time(BigInt(2000000000)),'2 seconds')
    })
}
module.exports["kstr"]._section_ = true
module.exports._test_ = true
module.exports
