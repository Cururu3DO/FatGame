# FatGame.js
A Javascript-based programming language to facilitate game programming.

FatGame.js — Documentação V1

Linguagem 2D simples para jogos em JavaScript.

Inicialização(Canva)

Game.create(config)

Inicia o jogo.

Game.create({
  width: 800,
  height: 600,
  background: "#000"
})

Loop(loop do jogo)

Game.update(callback)

Executa lógica a cada frame.

Game.update(() => {
  // lógica
})

desenha tudo na tela

Game.draw(callback)

Executa renderização a cada frame.

Game.draw(() => {
  // desenho
})

Criar Objetos

Game.object(props)

Cria um objeto.

let obj = Game.object({
  x: 0,
  y: 0,
  width: 50,
  height: 50,
  color: "red",
  sprite: "img.png"
})

limpa tudo

Game.clear()

Limpa a tela.

renderiza a todos os objetos muito importante 

Game.rect(obj)

insere uma sprite no seu jogo desenhando-a

Game.sprite(obj)

Desenha imagem do objeto.

Colisões

Game.collide(a, b, type)

Verifica colisão entre dois objetos.

Tipos:
"stay" (tocando)
"enter" (encostou)
"exit" (saiu)

Game.collide(player, enemy, "enter")

Toque / Mouse

Game.touch(type, obj)

Detecta toque ou clique.

Tipos:
"stay"
"start"
"end"

exemplos

Game.touch("start")
Game.touch("start", player)
Game.touchPosition()

Retorna posição atual do toque.

let pos = Game.touchPosition()

Teclado

Game.key(tecla, type)

Detecta teclas.

Tipos:
"stay"
"start"
"end"

exemplos

Game.key("a")
Game.key(" ", "start")

exemplo de jogo:

Game.create({
    width: 380,
    height: 700,
    background: "#000"
})

let pl = Game.object({
    x: 150,
    y: 0,
    width: 50,
    height: 50,
    sprite: "sl.png"
})

let ch = Game.object({
    x: 0,
    y: 300,
    width: 500,
    height: 50,
    color: "white"
})

let bt = Game.object({
    x: 250,
    y: 400,
    width: 100,
    height: 100,
    color: "blue"
})

let bt2 = Game.object({
    x: 20,
    y: 400,
    width: 100,
    height: 100,
    color: "blue"
})

Game.update(() => {
    pl.y += 10
    
    if (Game.collide(pl, ch)) {
    pl.y -= 10
}

    if (Game.touch("stay", bt)) {
    pl.x += 3
}

if (Game.touch("stay", bt2)) {
    pl.x -= 3
}

    if (Game.key("a")) pl.x -= 3
    if (Game.key("d")) pl.x += 3
    

})

Game.draw(() => {
    Game.clear()
    Game.rect(pl)
    Game.rect(ch)
    Game.rect(bt)
    Game.rect(bt2)
    Game.sprite(pl)
})
