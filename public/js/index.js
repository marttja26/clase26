let socket = io.connect();

const renderProducts = (products) => {
	if (products.length > 0) {
		const productsList = products
			.map(function (product) {
				return `<thead>
		<tr>
			<td class="align-middle" scope="row">${product.id}</td>
			<td class="align-middle">${product.title}</td>
			<td class="align-middle">${product.price}$</td>
			<td class="align-middle">
				<img
					src=${product.thumbnail}
					alt="imagen del producto"
					style="width: 100px"
				/>
			</td>
		</tr>
	</thead>`;
			})
			.join(' ');
		const table = `<table class="table mt-3" id="productList">
		<thead>
			<tr>
				<th class="align-middle" scope="col">#</th>
				<th class="align-middle" scope="col">Nombre</th>
				<th class="align-middle" scope="col">Precio</th>
				<th class="align-middle" scope="col">Imagen</th>
			</tr>
		</thead>
		${productsList}
	</table>`;
		document.getElementById('productList').innerHTML = table;
	} else {
		document.getElementById(
			'productList'
		).innerHTML = `<h2>No se encontraron productos.</h2>`;
	}
};

socket.on('chat', (normalizedData) => {
	const author = new normalizr.schema.Entity(
		'authors',
		{},
		{ idAttribute: 'email' }
	);

	const mensaje = new normalizr.schema.Entity(
		'mensaje',
		{
			author: author,
		},
		{ idAttribute: 'date' }
	);

	const mensajes = new normalizr.schema.Entity(
		'mensajes',
		{
			mensajes: [mensaje],
		},
		{ idAttribute: 'id' }
	);

	const denormalizedData = normalizr.denormalize(
		normalizedData.result,
		mensajes,
		normalizedData.entities
	);

	console.log(
		`longitud data desnormalizada ${JSON.stringify(denormalizedData).length}`
	);
	console.log(
		`longitud data normalizada ${JSON.stringify(normalizedData).length}`
	);

	const porcentajeDeCompresion =
		(JSON.stringify(normalizedData).length * 100) /
		JSON.stringify(denormalizedData).length;

	const chat = denormalizedData.mensajes
		.map(function (elem) {
			return `<div>
            <strong style="color: blue">${elem.author.email} - <span style="color: brown">${elem.date}</span></strong>: 
            <em style="color: green">${elem.text}</em> </div>
    `;
		})
		.join(' ');
	document.getElementById('chatBox').innerHTML = chat;
	document.getElementById(
		'chatHeader'
	).innerHTML = `porcentaje de compresión = ${porcentajeDeCompresion}%`;
});

const addMessage = (e) => {
	e.preventDefault;

	const mensaje = {
		author: {
			firstName: e.firstName.value,
			lastName: e.lastName.value,
			email: e.email.value,
			alias: e.alias.value,
			age: e.age.value,
			avatar: e.avatar.value,
		},
		text: e.message.value,
		date: new Date().toLocaleString('es-AR'),
	};

	socket.emit('new-message', mensaje);

	document.getElementById('email').value = '';
	document.getElementById('message').value = '';
	document.getElementById('message').focus();

	return false;
};

fetch('https://backendprojectcoder.herokuapp.com/api/productos-test', {
	method: 'GET',
})
	.then((res) => res.json())
	.then((res) => renderProducts(res));

fetch('https://backendprojectcoder.herokuapp.com/username', {
	method: 'GET',
})
	.then((res) => res.json())
	.then(
		(res) =>
			(document.getElementById('usuario').innerHTML = `Bienvenido ${res}`)
	);
