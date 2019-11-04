###
 0000000   000   000   0000000  000
000   000  0000  000  000       000
000000000  000 0 000  0000000   000
000   000  000  0000       000  000
000   000  000   000  0000000   000
###

# based on code from https://github.com/rburns/ansi-to-html

pull = require 'lodash.pull'

STYLES =
    f0:  '#000' # normal intensity
    f1:  '#F00'
    f2:  '#0D0'
    f3:  '#DD0'
    f4:  '#00F'
    f5:  '#D0D'
    f6:  '#0DD'
    f7:  '#AAA'
    f8:  '#555' # high intensity
    f9:  '#F55'
    f10: '#5F5'
    f11: '#FF5'
    f12: '#55F'
    f13: '#F5F'
    f14: '#5FF'
    f15: '#FFF'
    b0:  '#000' # normal intensity
    b1:  '#A00'
    b2:  '#0A0'
    b3:  '#A50'
    b4:  '#00A'
    b5:  '#A0A'
    b6:  '#0AA'
    b7:  '#AAA'
    b8:  '#555' # high intensity
    b9:  '#F55'
    b10: '#5F5'
    b11: '#FF5'
    b12: '#55F'
    b13: '#F5F'
    b14: '#5FF'
    b15: '#FFF'

toHexString = (num) ->
    num = num.toString(16)
    while num.length < 2 then num = "0#{num}"
    num

[0..5].forEach (red) ->
    [0..5].forEach (green) ->
        [0..5].forEach (blue) ->
            c = 16 + (red * 36) + (green * 6) + blue
            r = if red   > 0 then red   * 40 + 55 else 0
            g = if green > 0 then green * 40 + 55 else 0
            b = if blue  > 0 then blue  * 40 + 55 else 0            
            rgb = (toHexString(n) for n in [r, g, b]).join('')
            STYLES["f#{c}"] = "##{rgb}"
            STYLES["b#{c}"] = "##{rgb}"

[0..23].forEach (gray) ->
    c = gray+232
    l = toHexString(gray*10 + 8)
    STYLES["f#{c}"] = "##{l}#{l}#{l}"
    STYLES["b#{c}"] = "##{l}#{l}#{l}"

#  0000000   000   000   0000000  000
# 000   000  0000  000  000       000
# 000000000  000 0 000  0000000   000
# 000   000  000  0000       000  000
# 000   000  000   000  0000000   000

class Ansi
    
    @html: (s) -> 
    
        andi = new Ansi()
        lines = []
        for l in s?.split('\n') ? []
            diss = andi.dissect(l)[1]
            htmlLine = ''
            for i in [0...diss.length]
                d = diss[i]
                span = d.styl and "<span style=\"#{d.styl}\">#{d.match}</span>" or d.match
                if parseInt i
                    if diss[i-1].start + diss[i-1].match.length < d.start
                        htmlLine += ' '
                htmlLine += span
            lines.push htmlLine
        lines.join '\n'
        
    dissect: (@input) ->
        
        @diss  = []
        @text  = ""
        @tokenize()
        [@text, @diss]

    tokenize: () ->
        
        start       = 0
        ansiHandler = 2
        ansiMatch   = false
        
        invert = false
        fg = bg = ''
        st = []

        resetStyle = ->
            fg = bg = ''
            invert = false
            st = []
            
        addStyle = (style) -> st.push style if style not in st
        delStyle = (style) -> pull st, style
        
        setFG = (cs) -> 
            if cs.length == 5
                fg = "rgb(#{cs[2]},#{cs[3]},#{cs[4]})"
            else
                fg = STYLES["f#{cs[2]}"] # extended fg 38;5;[0-255]
        setBG = (cs) -> 
            if cs.length == 5
                bg = "rgb(#{cs[2]},#{cs[3]},#{cs[4]})"
            else
                bg = STYLES["b#{cs[2]}"] # extended bg 48;5;[0-255]
        
        addText = (t) =>
            
            start = @text.length
            
            match = ''
            mstrt = start
            
            space = ''
            sstrt = start

            addMatch = =>
                
                if match.length
                    style = ''
                    if invert
                        if bg.length
                            style += "color:#{bg};"
                        else
                            style += 'color:#000;' 
                        
                        if fg.length
                            style += "background-color:#{fg};" 
                        else
                            style += 'background-color:#fff;'                            
                    else
                        style += "color:#{fg};"            if fg.length
                        style += "background-color:#{bg};" if bg.length
                    style += st.join ';' if st.length
                    @diss.push
                        match: match
                        start: mstrt
                        styl:  style
                    match = ''
            
            addSpace = =>
                if space.length
                    @diss.push
                        match: space
                        start: sstrt
                        styl:  "background-color:#{bg};"
                    space = ''
                    
            for i in [0...t.length]
                if t[i] != ' '
                    mstrt = start+i if match == ''
                    match += t[i]
                    addSpace()
                else
                    if bg.length
                        sstrt = start+i if space == ''
                        space += t[i]
                    addMatch()
            addMatch()            
            addSpace()            
            @text += t
            start = @text.length
            ''
        
        toHighIntensity = (c) ->
            for i in [0..7]
                if c == STYLES["f#{i}"]
                    return STYLES["f#{8+i}"]
            c
        
        ansiCode = (m, c) ->
            ansiMatch = true
            c = '0' if c.trim().length is 0            
            cs = c.trimRight(';').split(';')
            for code in cs
                code = parseInt code, 10
                switch 
                    when code is 0          then resetStyle()
                    when code is 1          
                        addStyle 'font-weight:bold'
                        fg = toHighIntensity fg
                    when code is 2          then addStyle 'opacity:0.5'
                    when code is 4          then addStyle 'text-decoration:underline'
                    when code is 7          then invert = true            
                    when code is 27         then invert = false
                    when code is 8          then addStyle 'display:none'
                    when code is 9          then addStyle 'text-decoration:line-through'
                    when code is 39         then fg = STYLES["f15"] # default foreground
                    when code is 49         then bg = STYLES["b0"]  # default background
                    when code is 38         then setFG cs 
                    when code is 48         then setBG cs 
                    when  30 <= code <= 37  then fg = STYLES["f#{code - 30}"] # normal intensity
                    when  40 <= code <= 47  then bg = STYLES["b#{code - 40}"]
                    when  90 <= code <= 97  then fg = STYLES["f#{8+code - 90}"]  # high intensity
                    when 100 <= code <= 107 then bg = STYLES["b#{8+code - 100}"]
                    when code is 28         then delStyle 'display:none'
                    when code is 22         
                        delStyle 'font-weight:bold'
                        delStyle 'opacity:0.5'
                break if code in [38, 48]
            ''
            
        tokens = [
            {pattern: /^\x08+/,                     sub: ''}
            {pattern: /^\x1b\[[012]?K/,             sub: ''}
            {pattern: /^\x1b\[((?:\d{1,3};?)+|)m/,  sub: ansiCode} 
            {pattern: /^\x1b\[?[\d;]{0,3}/,         sub: ''}
            {pattern: /^([^\x1b\x08\n]+)/,          sub: addText}
         ]

        process = (handler, i) =>
            return if i > ansiHandler and ansiMatch # give ansiHandler another chance if it matches
            ansiMatch = false
            @input = @input.replace handler.pattern, handler.sub

        while (length = @input.length) > 0
            process(handler, i) for handler, i in tokens
            break if @input.length == length
            
module.exports = Ansi

