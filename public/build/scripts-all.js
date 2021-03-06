/**
 * This file contains logic related to the main application.
 */

function Application(options){
	_.extend(this, options || {});
    this.start();
}

Application.prototype = {
    /**
     * Setup and start the application.
     */
    start: function (){
        // this.setupStats();
        this.canvasView.initialize();
        this.sceneManager.initialize({
            canvasView: this.canvasView,
            // stats: this.stats
        });
    },

    /**
     * Setup Dat.GUI and stats.
     */
    setupStats: function (){
        this.gui = new dat.GUI();
        this.stats = new Stats();
        $('body').append(this.stats.domElement);
    },

    get scene(){
        return this.sceneManager.currScene;
    }
};

/**
 * This file contains audio related logic to control sounds.
 */

/**
 * Audio module.
 */
var Audio = {
	audioTags: [
		document.getElementById('sound1'),
		document.getElementById('sound2'),
		document.getElementById('sound3'),
	],

	dynamicTag: document.getElementById('dynamicSound'),

	/**
	 * Play a sound using a predefined audio tag.
	 * 
	 * @param  {Number} index  	The audio tag index.
	 * @param  {Number} volume 	The volume from 0 to 1.
	 */
	play: function (track, volume){
		if (typeof track === 'undefined'){
			console.error('Bad track: Tried to play a missing sound');
		}

		var tag = this.audioTags[track];
		if (volume) tag.volume = volume;
		tag.play();
	},

	playSrc: function (src, volume){
		this.dynamicTag.src = src;
		if (volume) this.dynamicTag.volume = volume;
		this.dynamicTag.oncanplay = function (){
			this.play();
		};
	}
};

/**
 * This file contains logic related to the canvas.
 */

var CanvasView = {
	w: null, h: null,
	camera: null,
	renderer: null,
	$el: $('#canvasContainer'),

	initialize: function (options){
		options = options || {};
		this.w = window.innerWidth;
		this.h = window.innerHeight;

		// Setup THREE renderer.
		this.setupRenderer();

		// On window resize.
		var onWindowResizeBound = this.onWindowResize.bind(this);
		window.addEventListener('resize', onWindowResizeBound, false);
	},

	render: function (scene, camera){
		this.renderer.render(scene, camera);
	},

	setupRenderer: function (){
		this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
		// this.renderer.setClearColor(0xffffff);

		// Add canvas to page.
		this.$el.append(this.renderer.domElement);
	},

	onWindowResize: function(){
		var w = this.w = window.innerWidth, h = this.h = window.innerHeight;
		this.renderer.setSize(w, h);
		this.$el.css({
			'width': w+'px',
			'height': h+'px'
		});


		if (this.camera){
			console.log('updating camera');
			this.camera.aspect = w/h;
			this.camera.updateProjectionMatrix();
		}
	}
};

function StandardControls() {
    
}

StandardControls.prototype = {
    // event, callback, sensitivity
    // .on('forward', () => { position += 1 }, 0.8);
    on: function(event, cb, sensitivity){
        if (typeof this[event] !== "function")
            return;
        var status = this[event]();
        if (status && (!sensitivity || status >= sensitivity))
            cb(status);
    },

    forward: function(){
        var g = Gamepad.get(0);
        if (g)
            return -g.axes[1];
        return Key.isPressed("S") ? -1 : (Key.isPressed("W") ? 1 : 0);
    },

    strafe: function(){
        var g = Gamepad.get(0);
        if (g)
            return g.axes[0];
        return Key.isPressed("A") ? -1 : (Key.isPressed("D") ? 1 : 0);
    },

    turn: function(){
        var g = Gamepad.get(0);
        if (g)
            return g.axes[2];
        return Key.isPressed("LEFT") ? -1 : (Key.isPressed("RIGHT") ? 1 : 0);
    },

    raise: function(){
        var g = Gamepad.get(0);
        if (g)
            return -g.axes[3];
        return Key.isPressed("DOWN") ? -0.5 : (Key.isPressed("UP") ? 0.5 : 0);
    },

    circle: function(){
        var g = Gamepad.get(0);
        if (g)
            return g.buttons[1].pressed;
        return Key.isPressed("SPACE");
    },

    cross: function(){
        var g = Gamepad.get(0);
        if (g)
            return g.buttons[0].pressed;
        return Key.isPressed("SHIFT");
    },

    triangle: function(){
        var g = Gamepad.get(0);
        if (g)
            return g.buttons[3].pressed;
        return Key.isPressed("SHIFT");
    },

    square: function(){
        var g = Gamepad.get(0);
        if (g)
            return g.buttons[2].pressed;
        return Key.isPressed("SHIFT");
    },

    defaultActions: function(){
        var g = Gamepad.get(0);
        if (g && g.buttons[16].pressed)
            window.location.reload();
    }
}


var Gamepad = {
    get: function (i) {
        var gamepads = navigator.getGamepads();
        return gamepads[i];
    }
};

window.addEventListener("gamepadconnected", function(e) {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons, e.gamepad.axes);
});




/**
 * This file contains logic for input control.  For example, a Keyboard module
 * controls behavior related to keypresses.
 *
 * A super-basic lightweight subscription model allows other objects to listen 
 * for keypress events.
 *
 * Sources
 * Keyboard Input helper
 * - http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/
 * 
 * Usage: Key.isPressed("UP")
 */

/**
 * Keyboard module.
 */
var Key = {
	pressed: {},

	keycodeMap: {
		"LEFT": 37,
		"UP": 38,
		"RIGHT": 39,
		"DOWN": 40,
		"W": 87,
		"A": 65,
		"S": 83,
		"D": 68,
		"Q": 81,
		"E": 69,
		"ENTER": 13,
		"SPACE": 32,
		"SHIFT": 16,
		"CTRL": 17,
		"ESC": 27
	},

	eventCallbacks: {
		keydown: [],
		keyup: []
	},

	isDown: function(keyCode){
		return this.pressed[keyCode];
	},

	anyDown: function(){
		var p = this.pressed;
		var map = this.keycodeMap;
		var keys = Object.keys(map);
		for (var i=0; i<keys.length; i++){
			if (p[map[keys[i]]] === true){
				return true;
			}
		}

		return false;
	},

	onKeyDown: function(e){
		this.pressed[e.keyCode] = true;
	},

	onKeyUp: function(e){
		this.pressed[e.keyCode] = undefined;
	},

	matches: function (keyCode, keys){
		for (var i=0; i<keys.length; i++){
			var key = keys[i];

			// Check if the key matches.
			if (keyCode === this.keycodeMap[key]){
				return true;
			}
		}

		// Return false if there is no match.
		return false;
	},

	isPressed: function (keys){
		if (!Array.isArray(keys)) {
			keys = [keys];
		}

		for (var i=0; i<keys.length; i++){
			var key = keys[i];

			// Check if the key is valid.
			if (!this.keycodeMap[key]){
				console.error('Key not found');
				return;
			}

			// Return true if the key is pressed.
			if (this.pressed[this.keycodeMap[key]] === true){
				return true;
			}
		}

		// Return false by default if none of the keys were pressed.
		return false;
	},

	listenTo: function (evt, callback){
		var evtArray = this.eventCallbacks[evt];
		if (!evtArray) console.error('Tried to subscribe to an unknown keyboard event.');
		
		evtArray.push(callback);
	},

	stopListeningTo: function () {
		// TODO: Use a backbone-like method of listening.
	}
};


// Bind keypress events.
document.body.onkeydown = function (e){
	Key.onKeyDown(e);
	Key.eventCallbacks.keydown.map(function (cb){
		cb(e);
	});
};

document.body.onkeyup = function(e){
	Key.onKeyUp(e);
	Key.eventCallbacks.keyup.map(function (cb){
		cb(e);
	});
};

/**
 * This file defines several general-use, miscellaneous utility functions which
 * can be used in other script files.
 */

var Utils = {
    clamp: function(val, max, min){
        return Math.min(Math.max(min, val), max);
    },

    randFrom: function(lo, hi){
        return Math.random()*(hi-lo) + lo;
    },

	now: function (){
		return (performance && performance.now) ? performance.now() : Date.now();
	},

	randomRGB: function (){
		return {
			r: Math.floor(Math.random()*255),
			g: Math.floor(Math.random()*255),
			b: Math.floor(Math.random()*255)
		};
	},

	randomColor: function (){
		var r = Math.floor(Math.random()*255);
		var g = Math.floor(Math.random()*255);
		var b = Math.floor(Math.random()*255);

		return 'rgb('+r+','+g+','+b+')';
	},

	randomHex: function (){
		var color = this.randomRGB();

		return this.rgbToHex(color.r, color.g, color.b);
	},

	/**
	 * Converts RGB integers into Hex format.
	 */
	rgbToHex: function (r, g, b){
		var red = r.toString(16);
		var green = g.toString(16);
		var blue = b.toString(16);
		red = red == "0" ? "00" : red;
		green = green == "0" ? "00" : green;
		blue = blue == "0" ? "00" : blue;

		return parseInt(red+green+blue, 16);
	},

	randomName: function (){
		return Names.random();
	},

	/**
	 * Returns the object and index from the input array that is the closest to 
	 * the target value.  This will attempt binary search if the input array is
	 * sorted.
	 * 
	 * @param  {Array.Number} arr    	The input array.
	 * @param  {Number} target 			The target value to match.
	 * @param  {boolean} isSorted 		Whether the input array is sorted.
	 * 
	 * @return {Object}        			A result object containing the closest 
	 *                              	match and its index.
	 */
	getClosestMatch: function (arr, target, isSorted){
		isSorted = !!isSorted;
		var bestDiff = Infinity;
		var bestMatch = null;
		var candidate, diff, absDiff;

		if (arr.length === 0){
			return console.error('Tried to find a closest match using an empty input array.');
		} else if (arr.length === 1){
			return arr[0];
		}

		// Check whether or not we can try binary search.
		if (isSorted){
			var start = 0, end = arr.length-1;
			while (start <= end){
				var center = Math.floor((start+end)/2);
				candidate = arr[center];
				diff = candidate - target;
				absDiff = Math.abs(diff);

				// Try to update the best match.
				if (absDiff < bestDiff){
					bestDiff = absDiff;
					bestMatch = candidate;
				}

				// Update start/end bounds.
				if (diff > 0){
					end = center-1;
				} else if (diff < 0){
					start = center+1;
				} else {
					// We've found an exact match.
					bestDiff = diff;
					bestMatch = candidate;
					break;
				}
			}
		} else {
			for (var i=0; i<arr.length; i++){
				candidate = arr[i];
				diff = candidate - target;
				absDiff = Math.abs(diff);
				if (absDiff < bestDiff){
					bestDiff = absDiff;
					bestMatch = candidate;
				}
			}
		}

		return bestMatch;
	}
};

function get (url){
    return new Promise(function (resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function (e){
            if (xhr.readyState !== 4)
                return;
            if ([0, 200, 304].indexOf(xhr.status) === -1)
                reject();
            else
                resolve(e.target.response);
        };
        xhr.send(null);
    });
}

/**
 * This file contains a Scene interface.
 */

function Scene(){
	/**
	 * The THREE scene to be rendered.
	 * @type {THREE.Scene}
	 */
	this.THREEScene = null;

	/**
	 * The THREE camera to use.
	 * @type {THREE.Camera}
	 */
	this.camera = null;
}

/**
 * The callback to be run when the scene is loaded.
 */
Scene.prototype.open = function(){};

/**
 * The update function to be called each animation cycle.
 */
Scene.prototype.update = function(){};

/**
 * The callback to be run when the scene is closed.
 * Optional
 */
Scene.prototype.onClose = function(){};


/**
 * This file contains a module for managing scenes.
 */

var SceneManager = {
	currScene: null,
	isPlaying: false,
	lastTime: Date.now(),

	initialize: function (options){
		options = options || {};
		this.canvasView = options.canvasView;
		this.stats = options.stats;

		// Define a set of scenes.
		this.scenes = {};

		// Bind functions.
		this.animateBound = this.animate.bind(this);
	},

    registerScene: function (name, scene){
        if (name && scene)
            this.scenes[name] = scene;
    },

	play: function (){
		if (this.isPlaying) return;

		this.isPlaying = true;
		this.animateBound();
	},

	pause: function (){
		if (!this.isPlaying) return;	

		this.isPlaying = false;
	},

	animate: function (){
		if (this.stats) this.stats.begin();
        var time = Date.now();
		var delta = time - this.lastTime;
		this.lastTime = time;

		// Update the current scene.
		if (this.currScene){
			this.currScene.update(time, delta);
		}
		TWEEN.update(time);

		// Render.
		this.canvasView.render(this.currScene.THREEScene, this.currScene.camera);

		if (this.stats) this.stats.end();
		if (this.isPlaying) {
            if (this.isSlow)
		        setTimeout(this.animateBound, this.isSlow || 50);
            else
                requestAnimationFrame(this.animateBound);
        }
	},

	loadScene: function (sceneName){
		var scene = this.scenes[sceneName];
		
		// Check that the requested scene is valid and different.
		if (!scene) return console.error('Tried to load an unknown scene.');
		if (scene === this.currScene) return;

		// Notify the current scene to transition out.
		if (this.currScene && this.currScene.onClose){
			this.currScene.onClose();
		}

		// Set and open the current scene.
		this.currScene = scene;
		this.canvasView.camera = scene.camera;
		this.canvasView.onWindowResize();
		scene.open();

		return this;
	}
};

/**
 * This file defines a chair model.
 */

function ChairModel (options){
    var defaults = {
        width: 4,
        depth: 4,
        height: 8,
        legRadius: 0.12,
        feetHeightRatio: 0.1,
        archRadius: 0.5
    };
    Object.assign(this, defaults || {}, options || {});

	var feet_mat = new THREE.MeshBasicMaterial({color: 'gray'});
	var backrest_mat = new THREE.MeshLambertMaterial({color: 'white'});
	var seatrest_mat = new THREE.MeshLambertMaterial({color: 'white'});
    var leg_mat = new THREE.MeshBasicMaterial({color: 'white'});
	var result = new THREE.Group();

    var h = this.height;
    var w = this.width;
    var d = this.depth;
    var legr = this.legRadius;
    var halfw = this.width / 2;
    var halfd = this.depth / 2;
    var halfh = this.height / 2;
    var feeth = (halfh) * this.feetHeightRatio;
    var ar = this.archRadius;

    // Make back leg arch (legs, back).
    // Make front leg arch (legs, seat, back - offset).
    var BackArchCurve = THREE.Curve.create(
        function (){},
        function (t){
            var firstT = h / (h * 2 + w);
            var secondT = 1 - firstT;
            var firstH = h / firstT;
            var tx, ty, tz;
            if (t < firstT) {
                tx = -halfw;
                ty = t * firstH;
                tz = 0;
            } else if (t < secondT) {
                tx = -halfw + t* 5,
                ty = h,
                tz = 0;
            } else {
                tx = halfw,
                ty = h - (t-secondT) * firstH,
                tz = 0;
            }
            return new THREE.Vector3(tx, ty, tz);
        }
    );
    var back_arch_geo = new THREE.TubeGeometry(
        new BackArchCurve(),  //path
        20,    //segments
        legr,   //radius
        8,     //radiusSegments
        false  //closed
    );
    var backArchMesh = new THREE.Mesh(back_arch_geo, leg_mat);
    backArchMesh.position.z = -halfd;

    var FrontArchCurve = THREE.Curve.create(
        function (){},
        function (t){
            var firstT = h / (h * 2 + w);
            var secondT = 1 - firstT;
            var firstH = halfh / firstT;
            var tx, ty, tz;
            if (t < firstT) {
                tx = -halfw;
                ty = t * firstH;
                tz = 0;
            } else if (t < secondT) {
                tx = -halfw + t* 5,
                ty = halfh,
                tz = 0;
            } else {
                tx = halfw,
                ty = halfh - (t-secondT) * firstH,
                tz = 0;
            }
            return new THREE.Vector3(tx, ty, tz);
        }
    );
    var front_arch_geo = new THREE.TubeGeometry(
        new FrontArchCurve(),  //path
        20,    //segments
        legr,   //radius
        8,     //radiusSegments
        false  //closed
    );
    var frontArchMesh = new THREE.Mesh(front_arch_geo, leg_mat);
    frontArchMesh.position.z = halfd;
    result.add(backArchMesh, frontArchMesh);

    // Make backrest, seatrest.
    var backrest_geo = new THREE.BoxGeometry(w, h/4, legr*2);
    var seatrest_geo = new THREE.BoxGeometry(w, legr*2, d);
    var backrestMesh = new THREE.Mesh(backrest_geo, backrest_mat);
    var seatrestMesh = new THREE.Mesh(seatrest_geo, seatrest_mat);
    backrestMesh.position.set(0, h*(0.5+0.25+0.125), -halfd);
    seatrestMesh.position.set(0, h/2, 0);
    result.add(backrestMesh, seatrestMesh);

    // Add feet.
    var feet_geo = new THREE.CylinderGeometry(legr+0.01, legr+0.01, feeth);
	var f1 = new THREE.Mesh(feet_geo, feet_mat);
	var f2 = new THREE.Mesh(feet_geo, feet_mat);
	var f3 = new THREE.Mesh(feet_geo, feet_mat);
	var f4 = new THREE.Mesh(feet_geo, feet_mat);
	f1.position.set(halfw, 0, halfd);
	f2.position.set(halfw, 0, -halfd);
    f3.position.set(-halfw, 0, halfd);
	f4.position.set(-halfw, 0, -halfd);
	result.add(f1, f2, f3, f4);

	return result;
}

/**
 * This file uses code from NeoComputer's website to create a toon-like effect 
 * using a fragment shader.
 * http://www.neocomputer.org/projects/donut/
 */

var toon = false;
if (toon){
	THREE.ShaderLib.lambert.fragmentShader = THREE.ShaderLib.lambert.fragmentShader.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	THREE.ShaderLib.lambert.fragmentShader = "uniform vec3 diffuse;\n" + THREE.ShaderLib.lambert.fragmentShader.substr(0, THREE.ShaderLib.lambert.fragmentShader.length-1);
	THREE.ShaderLib.lambert.fragmentShader += [
		"#ifdef USE_MAP",
		"	gl_FragColor = texture2D( map, vUv );",
		"#else",
		"	gl_FragColor = vec4(diffuse, 1.0);",
		"#endif",
		"	vec3 basecolor = vec3(gl_FragColor[0], gl_FragColor[1], gl_FragColor[2]);",
		"	float alpha = gl_FragColor[3];",
		"	float vlf = vLightFront[0];",
		// Clean and simple //
		"	if (vlf< 0.50) { gl_FragColor = vec4(mix( basecolor, vec3(0.0), 0.5), alpha); }",
		"	if (vlf>=0.50) { gl_FragColor = vec4(mix( basecolor, vec3(0.0), 0.3), alpha); }",
		"	if (vlf>=0.75) { gl_FragColor = vec4(mix( basecolor, vec3(1.0), 0.0), alpha); }",
		//"	if (vlf>=0.95) { gl_FragColor = vec4(mix( basecolor, vec3(1.0), 0.3), alpha); }",
		//"	gl_FragColor.xyz *= vLightFront;",
		"}"
		].join("\n");
}
