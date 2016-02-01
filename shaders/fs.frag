precision mediump float;

uniform float u_time;
uniform sampler2D texture0;
varying vec2 vUv;

void main() {
	vec2 st = vUv;
	vec3 color = vec3(0.0);
	st *= abs(sin(u_time*0.05)) * 3.0;
	st = fract(st);
	color = vec3(st,0.0);

	vec3 tex0 = texture2D(texture0, vUv).rgb;

	color *= tex0;

	gl_FragColor = vec4(color,1.0);
}