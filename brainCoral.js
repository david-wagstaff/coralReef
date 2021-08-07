const order = 4 // levels of Hilbertiness 
let path = []
let h = 512 - 1
let w = 512 - 1

const points = [
  new p5.Vector(0, 0),
  new p5.Vector(0, 1),
  new p5.Vector(1, 1),
  new p5.Vector(1, 0)
]
function hilbert(i) {
  let index = i & 3
  let v = points[index].copy()
  
  for (let j=1; j<order; j++) {
    let len = 2**j
    i = i >>> 2
    index = i & 3
    switch(index) {
      case 0:
        [v.y, v.x] = [v.x, v.y] // swap
        break
      case 1:
        v.y += len
        break
      case 2:
        v.x += len
        v.y += len
        break
      case 3:
        let temp = len - 1 - v.x
        v.x = len - 1 - v.y
        v.y = temp
        v.x += len
        break
    }
  }
  return v
}

function sq2cir(x, y) {
  return [
    x * Math.sqrt(1 - y * y / 2), 
    y * Math.sqrt(1 - x * x / 2)
  ]
}
        
function setupBrainCoral() {
  let n = 2**order 
  let len = (w+1) / n
  let total= n * n
    
    for (let i=0; i<total; i++) {
      path[i] = hilbert(i)
      .mult(len)
      .add(len / 2, len / 2)
    }
    
    for (let p of path) {
      let {x, y} = p
    // normalize
    x = map(x, 0, w, -1, 1)
    y = map(y, 0, h, -1, 1)
    // circularize
    ;[x, y] = sq2cir(x, y)
    // denormalize
    x = map(x, -1, 1, 0, w)
    y = map(y, -1, 1, 0, h)
    p.x = x
    y *= .84  // flatten vertically (leaves empty space on bottom)
    y = h - y // flip top to bottom (empty space now on top)
    p.y = y
  }
}

function drawBrainCoral() {
  push()
  strokeWeight(14)
  stroke('red')
  noFill()
  translate(width/2,height - h, 0)
  let total = path.length - 3
  for (let i = 0; i < total; i++) {
    let {x:x1, y:y1} = path[i]
    let {x:x2, y:y2} = path[i+1]
    let {x:x3, y:y3} = path[i+2]
    let {x:x4, y:y4} = path[i+3]
    curve(x1, y1, x2, y2, x3, y3, x4, y4)
    // bezier(x1, y1, x2, y2, x3, y3, x4, y4)
  }
  // strokeWeight(14)
  // stroke('red')  
  pop()
}

// function setup() {
//   // createCanvas(512, 512, WEBGL)
//   // createCanvas(windowWidth-10, windowHeight-20, WEBGL)
//   createCanvas(windowWidth-10, windowHeight-20)
//   background('black')
//   setupBrainCoral()
// }

// function draw() {
//   // translate(-width/2, -height/2, 0)
//   drawBrainCoral()
//   noLoop();
// }



// Brain coral created by
// 0. start with Hilbert Curve
// 1. recolor and thicken the lines
// 2. drawing curves instead of lines
// 3. projecting the square onto a circle
// 4. flattening it into an ellipse


// step 0 is from
// Hilbert Curve
// Coding in the Cabana
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingInTheCabana/003-hilbert-curve.html
// https://youtu.be/dSK-MW-zuAc

// Dan is the master teacher.
// Watch him and learn.