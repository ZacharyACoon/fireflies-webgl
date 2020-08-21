import ResourceTracker from "./resource_tracker";
import * as THREE from "three";


export default class WebGlWrapper {
    static default_options = {
        fog_density: 0.0002,
        size: 3,
        inactive_color: "#1a1a1a",
        active_color: "#88ff00",
    };

    static getDefaultOptions() {
        return {...this.default_options};
    }

    dispose() {
        if(this.renderer) this.container.removeChild(this.renderer.domElement);
        if(this.tracker) this.tracker.dispose();
        if(this.firefly_tracker) this.firefly_tracker.dispose();
    }

    newContext() {
        this.dispose()
        // track buffers
        this.tracker = new ResourceTracker();
        let track = (item) => this.tracker.track(item);
        this.renderer = track(new THREE.WebGLRenderer());
        this.container.appendChild(this.renderer.domElement);
        this.camera = track(new THREE.PerspectiveCamera());
        this.fog = track(new THREE.FogExp2("#000000", this.options.fog_density));
        this.body_geometry = track(new THREE.SphereBufferGeometry(this.options.size, 9, 9));
        this.inactive_color = track(new THREE.Color(this.options.inactive_color));
        this.active_color = track(new THREE.Color(this.options.active_color));
        this.buffer_color = track(new THREE.Color());
        // track particle buffers
        this.firefly_tracker = new ResourceTracker();
    }

    constructor(container, options) {
        this.container = container;
        this.canvas = undefined;
        this.newFireflyResource.bind(this);
        this.setOptions(options);
    }

    setOptions(options) {
        this.options = options;
        this.newContext();
        this.updateDimensions()
    }

    updateDimensions() {
        if( this.container ) {
            let {offsetWidth: width, offsetHeight: height} = this.container;
            this.frame = new THREE.Group();
            this.frame.add(new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0, height, 0),
                    new THREE.Vector3(width, height, 0),
                    new THREE.Vector3(width, 0, 0),
                    new THREE.Vector3(0, 0, 0),
                ]),
                new THREE.LineDashedMaterial({color: "#222222"})
            ));

            // let {offsetWidth: width, offsetHeight: height} = this.container;
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.position.x = width / 2;
            this.camera.position.y = height / 2;
            this.camera.position.z = -500;
            this.camera.fov = 90;
            this.camera.lookAt(this.camera.position.x, this.camera.position.y, 0);
            this.camera.updateProjectionMatrix();
        }
    }

    newFireflyResource() {
        let group = new THREE.Group();
        let body = new THREE.PointLight();
        group.add(body);
        body.add(new THREE.Mesh(
            this.body_geometry,
            new THREE.MeshBasicMaterial(),
        ));
        return group;
    }

    render(simulation) {
        console.log(this);
        let scene = new THREE.Scene();
        scene.add(this.frame);
        scene.fog = this.fog;

        let firefly_resources = this.firefly_tracker.yieldResources(() => this.newFireflyResource());
        simulation.list.forEach(f => {
            let group = firefly_resources.next().value;
            let body = group.children[0];
            body.position.x = f.x;
            body.position.y = f.y;
            body.position.z = f.z;

            let color = body.children[0].material.color;
            color.set(this.inactive_color);
            if( f.active ) color.lerp(this.active_color, f.charge);
            scene.add(group);
        });

        this.renderer.render(scene, this.camera);
    }
}
