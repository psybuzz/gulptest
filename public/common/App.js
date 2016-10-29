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
