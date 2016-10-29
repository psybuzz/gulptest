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
