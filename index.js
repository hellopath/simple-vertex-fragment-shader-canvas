const getContext = require('get-canvas-context')
const triangle = require('a-big-triangle')
const createTexture = require('gl-texture2d')
const createShader = require('gl-shader')
const createApp = require('canvas-loop')
const mapLimit = require('map-limit')
const loadImage = require('img')

const glslify = require('glslify')
const frag = glslify('./shaders/fs.frag')
const vert = glslify('./shaders/vs.vert')

const size = 256
const gl = getContext('webgl')
const canvas = gl.canvas
var time = 0

document.body.appendChild(canvas)

const shader = createShader(gl, vert, frag)

var textures
const presets = [
  ['images/baboon.png']
]

var ptr = 0
load(...presets[ptr++], start)

function start () {
	createApp(canvas, {
		parent: () => [ size, size ],
		scale: 2
	}).on('tick', render).start()
}

function load (texture0, cb) {
	if (textures) {
		textures.forEach(t => t.dispose())
	}
  	mapLimit([ texture0 ], 25, loadImage, (err, results) => {
		if (err) return alert(err.message)

		var texture0 = results[0]

		textures = [ texture0 ].map(img => {
			const texture = createTexture(gl, img)
			texture.minFilter = gl.LINEAR
			texture.magFilter = gl.LINEAR
			texture.wrap = gl.REPEAT
			return texture
		})
		
    	if (typeof cb === 'function') cb()
	})
}


function render () {
	time += 1

	gl.clearColor(0, 0, 0, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
	shader.bind()
	shader.uniforms.u_time = time

	canvas.style.left = Math.round((window.innerWidth - size) / 2) + 'px'
	canvas.style.top = Math.round((window.innerHeight - size) / 2) + 'px'
	textures.forEach((x, i) => x.bind(i))
	triangle(gl)
}