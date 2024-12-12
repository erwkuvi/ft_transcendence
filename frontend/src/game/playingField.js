import * as THREE from 'three';

//Variables to control the Field configuration
export const	FIELD_WIDTH = 30;
export const	FIELD_LENGTH = 42;
export const	OUTER_WALL_HEIGHT = 0.8;


//LINE in THE MIDDLE OF THE FIELD
const cube3Geometry = new THREE.BoxGeometry(FIELD_WIDTH - 0.2, 0.2, 0.3);
const cube3Material = new THREE.MeshBasicMaterial({color: 0x000000});
export const cube3 = new THREE.Mesh(cube3Geometry, cube3Material);
cube3.position.y = 0.1;

//LINE in player1
const line1Geometry = new THREE.BoxGeometry(FIELD_WIDTH - 0.1, 0.2, 0.12);
const line1Material = new THREE.MeshBasicMaterial({color: 0x00000});
export const line1 = new THREE.Mesh(line1Geometry, line1Material);
line1.position.z = FIELD_LENGTH/2 - 2;
line1.position.y = 0.1;

//LINE in player2
const line2Geometry = new THREE.BoxGeometry(FIELD_WIDTH - 0.1, 0.2, 0.12);
const line2Material = new THREE.MeshBasicMaterial({color: 0x00000});
export const line2 = new THREE.Mesh(line2Geometry, line2Material);
line2.position.z = -FIELD_LENGTH/2 + 2;
line2.position.y = 0.1;

//Cilinder 2 THE MIDDLE OF THE FIELD
const cylinder2Geometry = new THREE.CylinderGeometry( 4.5, 4.5, 0.7, 32 ); 
const cylinder2Material = new THREE.MeshStandardMaterial( {color: 0x10112} ); 
export const cylinder2 = new THREE.Mesh( cylinder2Geometry, cylinder2Material );
cylinder2.receiveShadow = true;

//Cilinder 1 THE MIDDLE OF THE FIELD
const cylinder1Geometry = new THREE.CylinderGeometry( 4.9, 4.9, 0.6, 32 ); 
const cylinder1Material = new THREE.MeshBasicMaterial( {color: 0x000000} ); 
export const cylinder1 = new THREE.Mesh( cylinder1Geometry, cylinder1Material );
cylinder1.receiveShadow = true;

//Inside of playing field
const innerPLayingFieldGeometry = new THREE.BoxGeometry(FIELD_WIDTH - 1, 0.3, FIELD_LENGTH - 1);
const innerPLayingFieldMaterial = new THREE.MeshStandardMaterial({color: 0x10112});
export const innerPLayingField = new THREE.Mesh(innerPLayingFieldGeometry, innerPLayingFieldMaterial);
innerPLayingField.receiveShadow = true;

//Outer playing field wall z1
let	outerWallZ1Geometry = new THREE.BoxGeometry(FIELD_WIDTH, OUTER_WALL_HEIGHT, 0.5);
let	outerWallZ1Material = new THREE.MeshStandardMaterial({color: 0x10112});
export let	outerWallZ1 = new THREE.Mesh(outerWallZ1Geometry, outerWallZ1Material);
outerWallZ1.receiveShadow = true;
outerWallZ1.position.z = (-FIELD_LENGTH/2) + (0.5/2);

//Outer playing field wall z2
let	outerWallZ2Geometry = new THREE.BoxGeometry(FIELD_WIDTH, OUTER_WALL_HEIGHT, 0.5);
let	outerWallZ2Material = new THREE.MeshStandardMaterial({color: 0x10112});
export let	outerWallZ2 = new THREE.Mesh(outerWallZ2Geometry, outerWallZ2Material);
outerWallZ2.receiveShadow = true;
outerWallZ2.position.z = (FIELD_LENGTH/2) - (0.5/2);

//Outer playing field wall x1
let	outerWallX1Geometry = new THREE.BoxGeometry(0.5, OUTER_WALL_HEIGHT, FIELD_LENGTH-1);
let	outerWallX1Material = new THREE.MeshStandardMaterial({color: 0x10112});
export let	outerWallX1 = new THREE.Mesh(outerWallX1Geometry, outerWallX1Material);
outerWallX1.position.x = (-FIELD_WIDTH/2) + (0.5/2);


//Outer playing field wall x2
let	outerWallX2Geometry = new THREE.BoxGeometry(0.5, OUTER_WALL_HEIGHT, FIELD_LENGTH-1);
let	outerWallX2Material = new THREE.MeshStandardMaterial({color: 0x10112});
export let	outerWallX2 = new THREE.Mesh(outerWallX2Geometry, outerWallX2Material);
outerWallX2.position.x = (FIELD_WIDTH/2) - (0.5/2);

export function constructPlayingField(scene) {
	scene.add(cube3);
	scene.add(line1);
	scene.add(line2);
	scene.add(cylinder2);
	scene.add(cylinder1);
	scene.add(innerPLayingField);
	scene.add(outerWallZ1);
	scene.add(outerWallZ2);
	scene.add(outerWallX1);
	scene.add(outerWallX2);
}