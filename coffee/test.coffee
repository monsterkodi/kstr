###
000000000  00000000   0000000  000000000
   000     000       000          000   
   000     0000000   0000000      000   
   000     000            000     000   
   000     00000000  0000000      000   
###

kstr = require '../'
chai = require 'chai'
chai.should()
expect = chai.expect

describe 'kstr' ->
                    
    it 'escapeRegexp' ->
        kstr.escapeRegexp('a/b.txt').should.eql 'a\\/b\\.txt'
        
    #  0000000  000000000  00000000   000  00000000   
    # 000          000     000   000  000  000   000  
    # 0000000      000     0000000    000  00000000   
    #      000     000     000   000  000  000        
    # 0000000      000     000   000  000  000        
    
    it 'lstrip' ->
        kstr.lstrip().should.eql ''
        kstr.lstrip('').should.eql ''
        kstr.lstrip('   y').should.eql 'y'
        kstr.lstrip(' ').should.eql ''
        kstr.lstrip('x ' 'x').should.eql ' '
        kstr.lstrip(' yxy ' ' y').should.eql 'xy '

    it 'rstrip' ->
        kstr.rstrip().should.eql ''
        kstr.rstrip('').should.eql ''
        kstr.rstrip('   y' 'y').should.eql '   '
        kstr.rstrip(' ').should.eql ''
        kstr.rstrip(' x' 'x').should.eql ' '
        kstr.rstrip(' yxy ' ' y').should.eql ' yx'

    it 'strip' ->
        kstr.strip().should.eql ''
        kstr.strip('').should.eql ''
        kstr.strip('abc').should.eql 'abc'
        kstr.strip('123   y  123' '123').should.eql '   y  '
        kstr.strip(' x y z ' 'xyz ').should.eql ''
        kstr.strip('x x' 'x').should.eql ' '
        kstr.strip(' yxy ' ' y').should.eql 'x'

    it 'trim' ->
        kstr.trim('123   y  123' '123').should.eql '   y  '
        kstr.ltrim(' yxy ' ' y').should.eql 'xy '
        kstr.rtrim('   y' 'y').should.eql '   '
        
    # 000       0000000  000   000  000000000  
    # 000      000       0000  000     000     
    # 000      000       000 0 000     000     
    # 000      000       000  0000     000     
    # 0000000   0000000  000   000     000     
    
    it 'lcnt' ->
        s = 'abc'
        n = 123
        kstr.lcnt()                     .should.eql 0
        kstr.lcnt(null, 'n')            .should.eql 0
        kstr.lcnt(undefined, 'u')       .should.eql 0
        kstr.lcnt(Infinity, 'Inf')      .should.eql 0
        kstr.lcnt({}, '{')              .should.eql 0
        kstr.lcnt([], '[')              .should.eql 0
        kstr.lcnt('' 1)                 .should.eql 0
        kstr.lcnt('ax' '')              .should.eql 0
        kstr.lcnt('' 'xy')              .should.eql 0
        kstr.lcnt('abc', Infinity)      .should.eql 0
        kstr.lcnt('abc' null)           .should.eql 0
        kstr.lcnt('abc' undefined)      .should.eql 0
        kstr.lcnt('abc' {})             .should.eql 0
        kstr.lcnt('abc' ['ab''b'])      .should.eql 0
        kstr.lcnt('abc' ['a''b'])       .should.eql 2
        kstr.lcnt(s, 'ac')              .should.eql 1
        kstr.lcnt(n, '13')              .should.eql 1
        kstr.lcnt(11202, '12')          .should.eql 3
        kstr.lcnt('   xx' ' ')          .should.eql 3
        kstr.lcnt('12345 blub' '1234')  .should.eql 4
    
    # 00000000    0000000   0000000    
    # 000   000  000   000  000   000  
    # 00000000   000000000  000   000  
    # 000        000   000  000   000  
    # 000        000   000  0000000    
    
    it 'lpad' ->
        kstr.lpad('', 4).should.eql '    '
        kstr.lpad('x', 4).should.eql '   x'
        kstr.lpad(' xxx ', 2).should.eql ' xxx '

    it 'rpad' ->
        kstr.rpad('', 4).should.eql '    '
        kstr.rpad('x', 4).should.eql 'x   '
        kstr.rpad(' xxx ', 2).should.eql ' xxx '
 
    #  0000000   000   000   0000000  000  
    # 000   000  0000  000  000       000  
    # 000000000  000 0 000  0000000   000  
    # 000   000  000  0000       000  000  
    # 000   000  000   000  0000000   000  
    
    it 'ansi2html' ->
        
        require('klor').kolor.globalize()
        a2h = (s,r) -> kstr.ansi2html(s).should.eql r
        
        a2h 'hello', 'hello'
        a2h r5('red'), '<span style="color:#ff0000;">red</span>'
        a2h """
            #{r5('red')}
            #{g5('green')}
            """, """
            <span style="color:#ff0000;">red</span>
            <span style="color:#00ff00;">green</span>
            """
        a2h "#{r5('red')}#{g5('green')}", '<span style="color:#ff0000;">red</span><span style="color:#00ff00;">green</span>'
        
    it 'stripAnsi' ->
        
        (kstr.stripAnsi g5('green')).should.eql 'green'
        
    it 'dissect' ->
        
        ansi= new kstr.ansi
        diss = ansi.dissect '[48;5;0m..[48;5;15m  [0m'
        diss[0].should.eql '..  '
        diss[1].length.should.eql 2
        diss[1][1].match.should.eql '  '
        diss[1][1].start.should.eql 2
        
    # 000000000   0000000   0000000    
    #    000     000   000  000   000  
    #    000     000000000  0000000    
    #    000     000   000  000   000  
    #    000     000   000  0000000    
    
    it 'detab' ->
        kstr.detab('\t\t').should.eql '        '
        kstr.detab('aa\tbb').should.eql 'aa  bb'
        
       
    # 000000000  000  00     00  00000000  
    #    000     000  000   000  000       
    #    000     000  000000000  0000000   
    #    000     000  000 0 000  000       
    #    000     000  000   000  00000000  
    
    it 'time number' ->
        kstr.time(1                     ).should.eql '1 ms'
        kstr.time(1000                  ).should.eql '1 second'
        kstr.time(1001                  ).should.eql '1 second'
        kstr.time(1999                  ).should.eql '1 second'
        kstr.time(2000                  ).should.eql '2 seconds'
        kstr.time(2001                  ).should.eql '2 seconds'
        kstr.time(59999                 ).should.eql '59 seconds'
        kstr.time(60000                 ).should.eql '1 minute'
        kstr.time(120001                ).should.eql '2 minutes'
        kstr.time(1000*60*60            ).should.eql '1 hour'
        kstr.time(1000*60*60*24         ).should.eql '1 day'
        kstr.time(1000*60*60*48         ).should.eql '2 days'
        kstr.time(1000*60*60*24*30      ).should.eql '1 month'
        kstr.time(1000*60*60*24*60      ).should.eql '2 months'
        kstr.time(1000*60*60*24*30*12   ).should.eql '1 year'
        kstr.time(1000*60*60*24*30*24   ).should.eql '2 years'
        
    it 'time bigint' ->
        kstr.time(BigInt 1   ).should.eql '1 ns'
        kstr.time(BigInt 1000).should.eql '1 μs'
        kstr.time(BigInt 1001).should.eql '1 μs'
        kstr.time(BigInt 6001).should.eql '6 μs'
        kstr.time(BigInt 1000000).should.eql '1 ms'
        kstr.time(BigInt 1000000000).should.eql '1 second'
        kstr.time(BigInt 2000000000).should.eql '2 seconds'
        