import * as THREE from 'three';
import GameScene from '../scenes/GameScene';

export default class Sun extends THREE.Object3D {
	private scene: GameScene;
	private sunMesh: THREE.Mesh;
	private sunLight: THREE.PointLight;
	private time: number;

	constructor(scene: GameScene) {
		super();
		this.scene = scene;

		this.time = 0;

		const sunGeometry = new THREE.SphereGeometry(1, 16, 16);
		const sunMaterial = new THREE.MeshPhongMaterial({
			color: 0xffff00,
			emissive: 0xffff00,
			emissiveIntensity: 1,
		});

		this.sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
		this.add(this.sunMesh);

		this.sunLight = new THREE.PointLight(0xffffff, 1);
		this.sunLight.castShadow = true;
		this.sunLight.shadow.bias = -0.01;

		this.sunLight.position.set(0, 0, 0);

		this.add(this.sunLight);

		const helper = new THREE.PointLightHelper(this.sunLight);

		this.add(helper);

		this.scene.add(this);

		this.position.set(-20, 20, 70);
		this.lookAt(0, 0, 0);
	}

	public update(deltaTime: number) {
		// You can add any update logic here, like shimmer or rotation
	}
}
