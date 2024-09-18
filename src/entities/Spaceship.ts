import { CONFIG } from '../config/config';
import GameScene from '../scenes/GameScene';
import * as THREE from 'three';

export default class Spaceship extends THREE.Mesh {
	private scene: GameScene;
	private _velocityX: number = 0;
	private _velocityY: number = 0;

	constructor(scene: GameScene) {
		const material = Spaceship.getMaterial();
		const geometry = Spaceship.getGeometry();
		super(geometry, material);

		this.scene = scene;
		this.scene.add(this);
	}

	get velocityX() {
		return this._velocityX;
	}
	get velocityY() {
		return this._velocityY;
	}

	set velocityX(x: number) {
		this._velocityX = THREE.MathUtils.clamp(x, -Math.PI / 4, Math.PI / 4);
	}

	set velocityY(y: number) {
		this._velocityY = THREE.MathUtils.clamp(y, -Math.PI / 4, Math.PI / 4);
	}

	static getMaterial(): THREE.Material {
		return new THREE.MeshStandardMaterial({
			color: 0x00ff00,
			metalness: 0.3, // Make it interact with light properly
			roughness: 0.03, // Shiny appearance
			// side: THREE.DoubleSide, // Render both sides of the faces
		});
	}

	static getGeometry(): THREE.BufferGeometry {
		const geometry = new THREE.BufferGeometry();
		const vertices = new Float32Array([
			0,
			0,
			2, // 1 front
			1,
			0,
			0, // 1 left
			0,
			0.5,
			0, // 1 top

			-1,
			0,
			0, // 2 right
			0,
			0,
			2, // 2 front
			0,
			0.5,
			0, // 2 top
			0,
			0,
			-1, // 3 back
			0,
			0.5,
			0, // 3 top
			1,
			0,
			0, // 3 left
			0,
			0,
			-1, // 4 back
			-1,
			0,
			0, // 4 right
			0,
			0.5,
			0, // 4 top
			0,
			0,
			2, // 5 front
			0,
			-0.5,
			0, // 5 bottom
			1,
			0,
			0, // 5 left
			0,
			0,
			2, // 6 front
			-1,
			0,
			0, // 6 right
			0,
			-0.5,
			0, // 6 bottom
			0,
			0,
			-1, // 7 back
			1,
			0,
			0, // 7 left
			0,
			-0.5,
			0, // 7 bottom
			0,
			0,
			-1, // 8 back
			0,
			-0.5,
			0, // 8 bottom

			-1,
			0,
			0, // 8 right
		]);

		geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
		geometry.computeVertexNormals();
		return geometry;
	}

	public move(delta: number) {
		this.rotation.x = (this.velocityX * Math.PI) / 4;
		this.rotation.y = (this.velocityY * Math.PI) / 4;

		if (this.scene.app.keysPressed['w']) {
			this.velocityX += CONFIG.CONTROLS.ROTATION_SPEED;
		}
		if (this.scene.app.keysPressed['s']) {
			this.velocityX -= CONFIG.CONTROLS.ROTATION_SPEED;
		}

		if (!this.scene.app.keysPressed['w'] && !this.scene.app.keysPressed['s']) {
			this.velocityX = THREE.MathUtils.lerp(
				this.velocityX,
				0,
				CONFIG.CONTROLS.ROTATION_RETURN_SPEED
			);
		}

		if (this.scene.app.keysPressed['a']) {
			this.velocityY += CONFIG.CONTROLS.ROTATION_SPEED;
		}
		if (this.scene.app.keysPressed['d']) {
			this.velocityY -= CONFIG.CONTROLS.ROTATION_SPEED;
		}

		if (!this.scene.app.keysPressed['a'] && !this.scene.app.keysPressed['d']) {
			this.velocityY = THREE.MathUtils.lerp(
				this.velocityY,
				0,
				CONFIG.CONTROLS.ROTATION_RETURN_SPEED
			);
		}
		// this.rotation.x = Math.max(
		// 	this.rotation.x - CONFIG.CONTROLS.ROTATION_SPEED * delta,
		// 	-CONFIG.CONTROLS.MAX_ROTATION
		// );
		// } else if (this.scene.app.keysPressed['s']) {
		// 	this.rotation.x = Math.min(
		// 		this.rotation.x + CONFIG.CONTROLS.ROTATION_SPEED * delta,
		// 		CONFIG.CONTROLS.MAX_ROTATION
		// 	);
		// } else {
		// 	this.rotation.x = THREE.MathUtils.lerp(
		// 		this.rotation.x,
		// 		0,
		// 		CONFIG.CONTROLS.ROTATION_RETURN_SPEED
		// 	);
		// }

		// if (this.scene.app.keysPressed['a']) {
		// 	this.rotation.y = THREE.MathUtils.clamp(
		// 		this.rotation.y + CONFIG.CONTROLS.ROTATION_SPEED * delta,
		// 		-CONFIG.CONTROLS.MAX_ROTATION,
		// 		CONFIG.CONTROLS.MAX_ROTATION
		// 	);
		// } else if (this.scene.app.keysPressed['d']) {
		// 	this.rotation.y = THREE.MathUtils.clamp(
		// 		this.rotation.y - CONFIG.CONTROLS.ROTATION_SPEED * delta,
		// 		-CONFIG.CONTROLS.MAX_ROTATION,
		// 		CONFIG.CONTROLS.MAX_ROTATION
		// 	);
		// } else {
		// 	this.rotation.y = THREE.MathUtils.lerp(
		// 		this.rotation.y,
		// 		0,
		// 		CONFIG.CONTROLS.ROTATION_RETURN_SPEED
		// 	);
		// }
	}
}
