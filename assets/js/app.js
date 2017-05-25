function Card(type) {
	this.type = type;
	this.content = document.createElement('DIV');
	this.content.classList.add('card-panel', 'hoverable');
	this.content.draggable = true;

	this.addTitle = () => {
		let title = document.getElementById('modal-' + this.type + '-title').value;
		let titleLabel = document.createElement('H3');
		titleLabel.appendChild(document.createTextNode(title));
		this.content.appendChild(titleLabel);
		this.title = title;
	};

	this.addDate = () => {
		let date = document.getElementById('modal-' + this.type + '-date').value;
		let dateLabel = document.createElement('P');
		dateLabel.appendChild(document.createTextNode(date));
		this.content.appendChild(dateLabel);
	};

	/**
	 * 
	 * @field : info to be deploy. Required
	 * @element : html element, by defaul p
	 * @clases: classes to be added, by defaul none
	 */
	this.addField = (...args) => {
		if (args.length < 1) return null;

		let text = (document.getElementById('modal-' + this.type + '-' + args[0]) && document.getElementById('modal-' + this.type + '-' + args[0]).value) || args[0];

		let element = document.createElement(args[1] || 'P');
		element.appendChild(document.createTextNode(text));
		if (args.length >= 2) {
			for (let i = 2; i < args.length; i++) {
				typeof args[i] === 'string' && element.classList.add(args[i]);
			}
		}
		this.content.appendChild(element);
	};
}

function cleanModal(id) {
	let inputs = document.querySelectorAll('#' + id + ' input');
	for (let input of inputs) {
		input.value = '';
	}
	inputs = document.querySelectorAll('#' + id + ' textarea');
	for (let input of inputs) {
		input.value = '';
	}
	$('#' + id).modal('close');
}

function createMap(id) {
	navigator.geolocation.getCurrentPosition(initMap);

	function initMap(position) {
		var currentlocation = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
		var map = new google.maps.Map(document.getElementById('map-' + id), {
			zoom: 16,
			center: currentlocation
		});
		var marker = new google.maps.Marker({
			position: currentlocation,
			map: map
		});
	}
}

function publishText(container) {
	if (container === undefined || container === null) {
		return false;
	}
	let card = new Card('chat');
	card.addTitle();
	card.addField('message', 'P', 'flow-text')
	container.appendChild(card.content);
	cleanModal('modalChat');
	return true;
}


function publishImage(container) {
	if (container !== undefined && container !== null) {
		let card = new Card('image');
		card.addTitle();
		let inputFile = document.getElementById('image-file')
		loadFiles(inputFile, card.content);
		container.appendChild(card.content);
		cleanModal('modalImages');
		return true;
	}
	return false;
}

function publishMedia(container) {
	if (container !== undefined && container !== null) {
		return false;
	}
	let card = new Card('media');
	card.addTitle();
	let inputFile = document.getElementById('media-file')
	loadFiles(inputFile, card.content);
	container.appendChild(card.content);
	cleanModal('modalVideo');
	return true;
}

function publishEvent(container) {
	if (container !== undefined && container !== null) {
		return false;
	}
	// let date = document.getElementById('modal-event-date').value;
	let card = new Card('event');
	card.addTitle();
	let id = card.title.trim().split(' ')[0];
	card.addField('date', 'P', 'flow-text');

	let mapContainer = document.createElement('DIV');
	mapContainer.classList.add('s12', 'map-container');
	mapContainer.id = 'map-' + id;

	card.content.appendChild(mapContainer);
	container.appendChild(card.content);
	createMap(id);
	cleanModal('modalEvent');
	return true;

}

function loadFiles(inputFile, container) {
	if (inputFile.files.length > 0) {
		var archivo = inputFile.files[0];
		var lector = new FileReader();
		switch (archivo.type) {
		case 'image/png':
		case 'image/jpeg':
		case 'image/gif':
			lector.readAsDataURL(archivo);
			lector.onload = readImage;
			break;
		case 'text/plain':
			lector.readAsText(archivo, 'UTF-8');
			lector.onload = readText;
			break;
		case 'audio/*':
			lector.readAsArrayBuffer(archivo);
			lector.onload = readAudio;
			break;
		case 'video/mpeg':
		case 'video/mp4':
		case 'video/quicktime':
			lector.readAsArrayBuffer(archivo);
			lector.onload = readVideo;
			break;
		default:
			break;
		}
	}

	function readImage(evento) {
		var image = new Image();
		image.src = evento.target.result;
		image.classList.add('image-responsive', 'col', 's12');
		container.appendChild(image);

	}

	function readAudio(encodedfile) {

		var audio = new Audio();
		audio.setAttribute('src', URL.createObjectURL(archivo));
		audio.controls = true;
		container.appendChild(audio);
	}

	function readVideo(encodedfile) {
		var video = document.createElement('video');
		video.setAttribute('src', URL.createObjectURL(archivo));
		video.controls = true;
		container.appendChild(video);
	}

	function readText(evento) {
		var contenido = evento.target.result;
		document.write(contenido);
	}
};

function publish(container, type) {
	switch (type) {
	case 'text':
		{
			publishText(container);
			break;
		}
	case 'image':
		{
			publishImage(container);
			break;
		}
	case 'event':
		{
			publishEvent(container);
			break;
		}
	case 'media':
		{
			publishMedia(container);
			break;
		}
	default:
		break;
	}
}

$(document).ready(function () {
	$('.modal').modal();

	$('.datepicker').pickadate({
		selectMonths: true, // Creates a dropdown to control month
		selectYears: 15, // Creates a dropdown of 15 years to control year
		onStart: () => {
			$('.picker').appendTo('body');
		}
	});

	$('[data-publication]').on('click', function (event) {
		let container = document.getElementById('main');
		let type = $(event.currentTarget).data('publication');
		publish(container, type);
	});
});