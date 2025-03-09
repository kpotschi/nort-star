// cheating player tries to move 2 units per tick

const buffer = [
	{ timestamp: 0, x: 0 },
	{ timestamp: 1000, x: 1 },
	{ timestamp: 2000, x: 2 },
	{ timestamp: 3000, x: 4 },
	{ timestamp: 4000, x: 5 },
	{ timestamp: 5000, x: 6 },
	{ timestamp: 6000, x: 7 },
	{ timestamp: 7000, x: 8 },
	{ timestamp: 8000, x: 9 },
	{ timestamp: 9000, x: 10 },
	{ timestamp: 10000, x: 11 },
];
console.log('local buffer', buffer);

// server expects player to move 1 unit per tick
const serverState = {
	timestamp: 3000,
	x: 3,
};

// Find the index where we need to start reconciliation
let index = buffer.findIndex(
	(bufferState) => bufferState.timestamp > serverState.timestamp
);

// Safety check - if no state is found or it's the first state
if (index <= 0) {
	console.log('Cannot reconcile - server state is outside buffer range');
}
console.log('index', index);

// Calculate the error between client prediction and server state
const clientStateAtServerTime = buffer[index - 1];
const errorX = serverState.x - clientStateAtServerTime.x;
console.log('Error delta:', errorX);

// Apply the server state at the matching position
buffer[index - 1] = {
	...clientStateAtServerTime, // Keep any additional client data
	x: serverState.x, // Update position from server
	timestamp: serverState.timestamp,
};

console.log('buffer with inserted server state', buffer);
const lerp = (a, b, t) => (1 - t) * a + t * b;

for (let i = index; i < buffer.length; i++) {
	buffer[i].x = buffer[i - 1].x + 1;
}

console.log('buffer after reconciliation', buffer);

// delete old states from buffer
buffer.splice(0, index - 1);
console.log('buffer after splice', buffer);
