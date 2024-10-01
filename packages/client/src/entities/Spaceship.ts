import * as THREE from 'three';
import { PlayerState } from '../../../server/src/rooms/schema/MyRoomState';
import App from '../app';
import StateBuffer from '../managers/StateBuffer';
import GameScene from '../scenes/GameScene';

export default class Spaceship extends THREE.Mesh {
	protected scene: GameScene;
	public direction: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
	protected app: App;
	public serverPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
	public serverQ: THREE.Quaternion = new THREE.Quaternion(0, 0, 1);
	public stateBuffer: StateBuffer;

	constructor(scene: GameScene, player?: PlayerState) {
		const material = Spaceship.getMaterial();
		const geometry = Spaceship.getGeometry();
		super(geometry, material);
		this.stateBuffer = new StateBuffer();
		this.scene = scene;
		this.scene.add(this);

		if (player) {
			const { x, y, z } = player.position;
			this.position.set(x, y, z);
			this.lookAt(0, 0, 0);
		}
	}

	static getMaterial(): THREE.Material {
		return new THREE.MeshStandardMaterial({
			color: 0x00ff00,
			metalness: 0, // Make it interact with light properly
			roughness: 0.1, // Shiny appearance
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

	move(delta: number) {
		const currentTime = Date.now() + 30;

		const interpolatedState =
			this.stateBuffer.getInterpolatedState(currentTime);

		if (interpolatedState) {
			this.position.copy(interpolatedState.position);
			this.quaternion.copy(interpolatedState.rotation);
		} else {
			this.position.lerp(this.serverPosition, 0.1);
			this.quaternion.slerp(this.serverQ, 0.1);
		}
	}
}
