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
