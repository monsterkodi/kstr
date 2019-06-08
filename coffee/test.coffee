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

describe 'kstr', ->
                    
    it 'escapeRegexp' ->
        kstr.escapeRegexp('a/b.txt').should.eql 'a\\/b\\.txt'
        
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
        
    # 000000000   0000000   0000000    
    #    000     000   000  000   000  
    #    000     000000000  0000000    
    #    000     000   000  000   000  
    #    000     000   000  0000000    
    
    it 'detab' ->
        kstr.detab('\t\t').should.eql '        '
        kstr.detab('aa\tbb').should.eql 'aa  bb'
        
        