var ChairsScene = function(){

    // Camera setup.
    var w = window.innerWidth, h = window.innerHeight;
    var camera = this.camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    camera.position.set(0, 2, 12);
    camera.lookAt(new THREE.Vector3());
    
    // Scene setup.
    var scene = this.scene = new THREE.Group();
    this.THREEScene = new THREE.Scene();
    this.THREEScene.add(scene);
    this.THREEScene.fog = new THREE.FogExp2(0x65A8B0, 0.012);

    // Lighting.
    var ambient_light = new THREE.AmbientLight( 0x404040 );
    scene.add(ambient_light);

    var chair = new ChairModel();
    scene.add(chair);
};

ChairsScene.prototype = {
    open: function (){

    },

    update: function (time, dt){

    }
};
