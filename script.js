let textBox = document.getElementById("text")
let keyBox = document.getElementById("key")
let outputBox = document.getElementById("output")

let copy = document.getElementById('copy')
copy.addEventListener('click', function() {
    navigator.clipboard.writeText(outputBox.value)
    copy.style = ''
    copy.style = 'animation-name: spin; animation-duration: 500ms; animation-timing-function: linear;'
    setTimeout(() => {
        copy.style = ''
    }, 500)
})

let modeButton = document.getElementById('mode')
let title = document.getElementById('title')
let mode = 0
modeButton.addEventListener("click", () => {
    if(modeButton.innerText == 'Decrypt') {
        modeButton.innerText = 'Encrypt'
        title.innerText = 'Decrypted: '
    } else {
        modeButton.innerText = 'Decrypt'
        title.innerText = 'Encrypted: '
    }
    mode++
    mode %= 2
    textBox.value = ''
    keyBox.value = ''
    outputBox.value = ''
    run()
})

textBox.addEventListener("input", run)

keyBox.addEventListener("input", run)

function run() {
    if(mode == 0) {
        if(keyBox.value != '') outputBox.value = encrypt(textBox.value, keyBox.value)
    } else {
        if(keyBox.value != '') outputBox.value = decrypt(textBox.value, keyBox.value)
    }
    if(outputBox.value.includes(undefined)) outputBox.value = "error"
}

function listify(txt) {
    output = []
    for(i=0; i<txt.length; i++) {
        output.push(txt[i])
    }
    return(output)
}

function splitKey(key) {
    key = listify(key)
    let keys = []
    let temp = ''
    key.forEach((k) => {
        if(k == ' ') {
            keys.push(temp)
            temp = ''
        } else {
            temp += k
        }
    })
    if(temp != '') keys.push(temp)
    return(keys)
}

function keyOrder(key) {
    key = listify(key)
    let cur = 27
    let order = []
    let i = 0
    key.forEach((k) => {
        if(k.charCodeAt(0) >= cur) {
            cur = k.charCodeAt(0)
            order.push(i)
        } else {
            let spot = 0
            for(o=0; o<order.length; o++) {
                if(key[order[o]].charCodeAt(0) < k.charCodeAt(0)) {
                    spot = o+i
                }
            }
            order.splice(spot, 0, i)
        }
        i++
    })
    return(order)
}

function updateTxt(key, step) {
    let order = keyOrder(key)
    let output = ''
    order.forEach((o) => {
        step.forEach((s) => {
            output += s[o]
        })
    })
    return(output)
}

function encrypt(txt, key) {
    key = splitKey(key)
    key.forEach((k) => {
        let step = []
        for(i=0; i<Math.ceil(txt.length/k.length); i++) {
            let line = ''
            for(l=0; l<k.length; l++) {
                if(txt.length > l+i*k.length) {
                    line += txt[l+i*k.length]
                } else {
                    line += 'x'
                }
            }
            step.push(line)
        }
        txt = updateTxt(k, step)
    })
    return(txt)
}

function decrypt(txt, key) {
    key = splitKey(key).reverse()
    let nextKey = 1
    key.forEach((k) => {
        //create grid
        let grid = []
        listify(k).forEach((i) => {
            grid.push('')
        })
        let line = ''
        let x = 0
        let y = 0
        listify(txt).forEach((t) => {
            line += t
            x += 1
            if(x >= txt.length/k.length) {
                grid[keyOrder(k)[y]] = line
                line = ''
                y += 1
                x = 0
            }
        })

        //convert to txt
        let temp = ''
        x = 0
        y = 0
        listify(txt).forEach((t) => {
            temp += listify(grid[y])[x]
            y++
            if(y >= grid.length) {
                y = 0
                x++
            }
        })

        //make even
        temp = listify(temp)
        if(key.length > nextKey) {
            let num = temp.length/key[nextKey].length
            while(Math.round(num) != num) {
                temp.pop()
                num = temp.length/key[nextKey].length
            }
        }

        txt = ''
        temp.forEach((t) => {
            txt += t
        })
        console.log(txt)
        nextKey++
    })
    //remove x
    temp = listify(txt)
    while(temp[temp.length-1] == 'x') temp.pop()
    txt = ''
        temp.forEach((t) => {
            txt += t
        })
    
    return(txt)
}
