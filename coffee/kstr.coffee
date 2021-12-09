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
           
#  0000000  000000000  00000000   000  00000000   
# 000          000     000   000  000  000   000  
# 0000000      000     0000000    000  00000000   
#      000     000     000   000  000  000        
# 0000000      000     000   000  000  000        


str.rstrip = (s, cs=' ') ->
    
    s ?= ''
    s = s[0...s.length-1] while s[-1] in cs
    s

str.lstrip = (s, cs=' ') ->
    
    s ?= ''
    s = s[1..] while s[0] in cs
    s
            
str.strip = (s, cs=' ') -> str.rstrip str.lstrip(s,cs), cs

# 000000000  00000000   000  00     00  
#    000     000   000  000  000   000  
#    000     0000000    000  000000000  
#    000     000   000  000  000 0 000  
#    000     000   000  000  000   000  

str.trim  = str.strip
str.ltrim = str.lstrip
str.rtrim = str.rstrip

#  0000000  000   000  000000000  
# 000       0000  000     000     
# 000       000 0 000     000     
# 000       000  0000     000     
#  0000000  000   000     000     

str.lcnt = (s, c) ->
    s ?= ''
    if typeof s == 'number' and Number.isFinite s then s = String s
    return 0 if typeof s != 'string'
    c ?= ''
    i = -1
    while s[++i] in c then
    i    
    
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
    
str.pad = str.rpad

str.detab = (s) ->
    s = String s
    i = 0
    while i < s.length
        if s[i] == '\t'
            s = s[...i] + (str.lpad '' 4-(i%4)) + s[i+1..]
        i += 1
    s
    
# 000000000  000  00     00  00000000  
#    000     000  000   000  000       
#    000     000  000000000  0000000   
#    000     000  000 0 000  000       
#    000     000  000   000  00000000  

str.time = (t) ->
    switch typeof t 
        when 'number'
            f = 1
            o = 
                ms:     1000
                second: 60
                minute: 60
                hour:   24
                day:    30
                month:  12
                year:   0
            for k in Object.keys o
                num = parseInt t/f
                f *= o[k]
                if k == 'year' or t < f
                    k += 's' if k != 'ms' and num != 1
                    return '' + num + ' ' + k
        when 'bigint'
            thsnd = BigInt 1000
            f = thsnd
            for k in ['ns' 'μs' 'ms' 'second'] 
                if k == 'seconds' or t < f 
                    num = parseInt thsnd * t / f
                    k += 's' if k == 'second' and num != 1
                    return '' + num + ' ' + k
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
    s.replace? STRIPANSI, ''
        
str.ansi2html = (s) ->
    Ansi = require './ansi'
    Ansi.html s
    
str.ansi = require './ansi'
        
module.exports = str
