const Game = (() => {

    let canvas
    let ctx
    let width = 800
    let height = 600
    let background = "#000"

    let updateCallback = () => {}
    let drawCallback = () => {}

    let lastTime = 0

    let collisionMemory = new Map()

    let touchState = false
    let lastTouchState = false
    
    let touchX = 0
    let touchY = 0
    
    let keyState = {}
    let lastKeyState = {}
    
    let imageMemory = {}

    // =========================
    // Inicialização
    // =========================
    function create(config = {}) {
        width = config.width || 800
        height = config.height || 600
        background = config.background || "#000"

        canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        document.body.appendChild(canvas)

        ctx = canvas.getContext("2d")

        // Touch (mobile)
        canvas.addEventListener("touchstart", (e) => {
    touchState = true
    const rect = canvas.getBoundingClientRect()
    touchX = e.touches[0].clientX - rect.left
    touchY = e.touches[0].clientY - rect.top
})

canvas.addEventListener("touchmove", (e) => {
    const rect = canvas.getBoundingClientRect()
    touchX = e.touches[0].clientX - rect.left
    touchY = e.touches[0].clientY - rect.top
})

canvas.addEventListener("touchend", () => {
    touchState = false
})

canvas.addEventListener("mousedown", (e) => {
    touchState = true
    const rect = canvas.getBoundingClientRect()
    touchX = e.clientX - rect.left
    touchY = e.clientY - rect.top
})

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect()
    touchX = e.clientX - rect.left
    touchY = e.clientY - rect.top
})

canvas.addEventListener("mouseup", () => {
    touchState = false
})

window.addEventListener("keydown", (e) => {
    keyState[e.key.toLowerCase()] = true
})

window.addEventListener("keyup", (e) => {
    keyState[e.key.toLowerCase()] = false
})

        requestAnimationFrame(loop)
    }

    // =========================
    // Loop Principal
    // =========================
    function loop(time) {
        const deltaTime = time - lastTime
        lastTime = time

        updateCallback(deltaTime)
        drawCallback()

        // Atualiza estado anterior do toque
        lastTouchState = touchState
        lastKeyState = { ...keyState }

        requestAnimationFrame(loop)
    }

    function update(callback) {
        updateCallback = callback
    }

    function draw(callback) {
        drawCallback = callback
    }

    // =========================
    // Objetos
    // =========================
    function object(props) {

    if (props.sprite && !imageMemory[props.sprite]) {
        const img = new Image()
        img.src = props.sprite
        imageMemory[props.sprite] = img
    }

    return {
        x: props.x || 0,
        y: props.y || 0,
        width: props.width || 50,
        height: props.height || 50,
        color: props.color || "white",
        radius: props.radius || 25,
        sprite: props.sprite || null
    }
}

    // =========================
    // Renderização
    // =========================
    function clear() {
        ctx.fillStyle = background
        ctx.fillRect(0, 0, width, height)
    }

    function rect(obj) {
        ctx.fillStyle = obj.color
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
    }

    function circle(obj) {
        ctx.fillStyle = obj.color
        ctx.beginPath()
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2)
        ctx.fill()
    }
    
    function sprite(obj) {

    if (!obj.sprite) return

    const img = imageMemory[obj.sprite]

    if (!img) return

    ctx.drawImage(img, obj.x, obj.y, obj.width, obj.height)
}

    // =========================
    // Colisão AABB
    // =========================
    function collide(a, b, type = "stay") {

        const isColliding =
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y

        const key = a + "_" + b
        const wasColliding = collisionMemory.get(key) || false

        collisionMemory.set(key, isColliding)

        if (type === "enter") {
            return isColliding && !wasColliding
        }

        if (type === "exit") {
            return !isColliding && wasColliding
        }

        // default = stay
        return isColliding
    }

    // =========================
    // Touch Input
    // =========================
    function touch(type = "stay", obj = null) {

    let active

    if (type === "start") {
        active = touchState && !lastTouchState
    } else if (type === "end") {
        active = !touchState && lastTouchState
    } else {
        active = touchState
    }

    if (!active) return false

    if (obj) {
        return (
            touchX >= obj.x &&
            touchX <= obj.x + obj.width &&
            touchY >= obj.y &&
            touchY <= obj.y + obj.height
        )
    }

    return true
}

function touchPosition() {
    return { x: touchX, y: touchY }
}

function key(k, type = "stay") {

    k = k.toLowerCase()

    const isPressed = keyState[k] || false
    const wasPressed = lastKeyState[k] || false

    if (type === "start") {
        return isPressed && !wasPressed
    }

    if (type === "end") {
        return !isPressed && wasPressed
    }

    return isPressed
}

    // =========================
    // API Pública
    // =========================
    return {
        create,
        update,
        draw,
        object,
        rect,
        circle,
        clear,
        collide,
        touch,
        touchPosition,
        key,
        sprite
    }

})()