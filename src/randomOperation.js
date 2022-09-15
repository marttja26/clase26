const randomOperation = (cant) => {
	let randomNumbers = {};
	for (let i = 0; i < cant; i++) {
		let randomNumber = Math.floor(Math.random() * 1001 + 1);
		if (!randomNumbers.hasOwnProperty(randomNumber)) {
			randomNumbers = {
				...randomNumbers,
				...{
					[randomNumber]: 1,
				},
			};
		} else {
			randomNumbers[randomNumber]++;
		}
	}
	return randomNumbers;
};

process.on('message', (msg) => {
	process.send(randomOperation(msg));
	process.exit();
});

process.send('OK');
