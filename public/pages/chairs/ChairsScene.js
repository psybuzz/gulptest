var ChairsScene = function(){

    // Camera setup.
    var w = window.innerWidth, h = window.innerHeight;
    var camera = this.camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    camera.position.set(0, 2, 50);
    camera.lookAt(new THREE.Vector3());
    var controls = new THREE.OrbitControls(camera);

    // Scene setup.
    var scene = this.scene = new THREE.Group();
    this.THREEScene = new THREE.Scene();
    this.THREEScene.add(scene);
    this.THREEScene.fog = new THREE.FogExp2(0x000000, 0.005);
    this.THREEScene.fog = new THREE.FogExp2(0xffffff, 0.03);

    // Lighting.
    var ambient_light = new THREE.AmbientLight( 0xa26236 );
    scene.add(ambient_light);

    var light = this.light = new THREE.PointLight( 0xa26236, 4, 100 );
    light.position.set(0, 3, 0);
    scene.add(light);

    var light2 = this.light2 = new THREE.PointLight( 0xffffff, 0.8, 100 );
    light2.position.set(1, 1, 10);
    scene.add(light2);


    // Make chair.
    // var areaw = 400, aread = 400;
    var areaw = 100, aread = 100;
    var chairN = 220;
    var chairs = this.chairs = [];
    var areah = this.areah = 450;
    for (var i=0; i<chairN; i++) {
        var chair = new ChairModel();
        var cx = Math.random()*areaw - areaw/2;
        // var cy = Math.random()*10 + 5;
        var cy = Math.random()*areah;
        var cz = Math.random()*aread - aread/2;
        chair.position.set(cx, cy, cz);
        var rx = Math.random()*Math.PI*2;
        var ry = Math.random()*Math.PI*2;
        var rz = Math.random()*Math.PI*2;
        chair.rotation.set(rx, ry, rz);

        chairs.push(chair);
        scene.add(chair);
    }

    this.names = document.getElementById('names');
    this.names.y = 0;
};

ChairsScene.prototype = {
    open: function (){

    },

    update: function (time, dt){
        // Modify time if space is pressed
        if (!Key.anyDown())
            dt *= 0.1;

        this.chairs.forEach((chair) => {
            chair.rotation.x += dt*0.0005;
            chair.rotation.y += dt*0.0005;
            chair.rotation.z += dt*0.0005;
            chair.position.y -= dt*0.08;
            if (chair.position.y < -this.areah/2)
                chair.position.y = this.areah/2;
        });

        this.names.y += dt*0.5;
        if (this.names.y > window.innerHeight) {
            this.names.y = -190;
            this.names.classList.toggle('flipped');
        }
        names.style.transform = 'translateY(' + Math.floor(this.names.y) + 'px)';
    }
};
