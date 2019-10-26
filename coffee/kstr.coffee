###
000   000   0000000  000000000  00000000 
000  000   000          000     000   000
0000000    0000000      000     0000000  
000  000        000     000     000   000
000   000  0000000      000     000   000
###

str = (o) ->
    
    return 'null' if not o?
    if typeof(o) == 'object'
        if o._str?
            o._str()
        else
            noon = require 'noon'
            "\n" + noon.stringify o, circular: true
    else
        String o

# 00000000  000   000   0000000   0000000   0000000    00000000
# 000       0000  000  000       000   000  000   000  000     
# 0000000   000 0 000  000       000   000  000   000  0000000 
# 000       000  0000  000       000   000  000   000  000     
# 00000000  000   000   0000000   0000000   0000000    00000000

str.encode = (s, spaces=true) ->
    
    entity = require 'html-entities'
    xmlEntities = new entity.XmlEntities()
    
    if s
        r = xmlEntities.encode s
        if spaces
            r = r.replace /\s/g, '&nbsp;'
        r
    else
        ''
  
ESCAPEREGEXP = /[-\\^$*+?.()|[\]{}\/]/g
str.escapeRegexp = (s) ->
    s.replace ESCAPEREGEXP, '\\$&'
                
# 00000000    0000000   0000000    
# 000   000  000   000  000   000  
# 00000000   000000000  000   000  
# 000        000   000  000   000  
# 000        000   000  0000000    

str.lpad = (s, l, c=' ') ->
    s = String s
    while s.length < l then s = c + s
    s

str.rpad = (s, l, c=' ') ->
    s = String s
    while s.length < l then s += c
    s
    
str.detab = (s) ->
    s = String s
    i = 0
    while i < s.length
        if s[i] == '\t'
            s = s[...i] + (str.lpad '', 4-(i%4)) + s[i+1..]
        i += 1
    s
    
# 000000000  000  00     00  00000000  
#    000     000  000   000  000       
#    000     000  000000000  0000000   
#    000     000  000 0 000  000       
#    000     000  000   000  00000000  

str.time = (t) ->
    if typeof(t) == 'bigint'
        thsnd = BigInt 1000
        f = thsnd
        for u in ['ns''μs''ms''s'] 
            if u == 's' or t < f 
                return '' + (thsnd * t / f) + u 
            f *= thsnd
    else
        String t
        
#  0000000   000   000   0000000  000  
# 000   000  0000  000  000       000  
# 000000000  000 0 000  0000000   000  
# 000   000  000  0000       000  000  
# 000   000  000   000  0000000   000  

STRIPANSI = /\x1B[[(?);]{0,2}(;?\d)*./g
str.stripAnsi = (s) ->
    s.replace STRIPANSI, ''
        
str.ansi2html = (s) ->
    Ansi = require './ansi'
    Ansi.html s
    
str.ansi = require './ansi'
        
module.exports = str
