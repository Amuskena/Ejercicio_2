let loading = false;
let personajes = [];
let episodios = [];
let controller; // Abort controller

const fetchEpisode = async (characterEpisodeApiUrl) => {
	try {
		const res = await fetch(characterEpisodeApiUrl);
		return await res.json();
	} catch (error) {
		console.log(error);
	}
}

const fetchEpisodes = async (characterEpisodesApiUrls) => {
	const charactersEpisodes = [];

	for (const characterEpisodeApiUrl of characterEpisodesApiUrls) {
		const characterEpisode = await fetchEpisode(characterEpisodeApiUrl);
		charactersEpisodes.push(characterEpisode);
	}

	return charactersEpisodes;
}

const removeEpisodes = () => {
	const episodesNode = document.getElementById("episodes");

	if (episodesNode) {
		episodesNode.remove();
	}
}

const hideLoading = () => {
	loading = false;
	const loadingNode = document.getElementById("loading");
	loadingNode.classList.add("hide");
};

const showLoading = () => {
	loading = true;
	const loadingNode = document.getElementById("loading");
	loadingNode.classList.remove("hide");
};

const renderEpisodes = (episodes) => {
	const appNode = document.getElementById("app");
	const episodesNode = document.createElement("ul");

	episodesNode.id = "episodes";
	appNode.appendChild(episodesNode);

	episodes.forEach(episode => {
		const episodeNode = document.createElement("li");
		episodeNode.id = "episode" + episode.name;
		episodeNode.innerHTML = episode.name;
		episodesNode.appendChild(episodeNode);
	});
}

const fetchCharacters = async () => {
	try {
		controller = new AbortController();
  		const signal = controller.signal;
		const res = await fetch ("https://rickandmortyapi.com/api/character");
		const data = await res.json();		

		// Rellena los arrays de personajes y episodios
		data.results.forEach(item => {
			personajes.push(item.name);
			episodios.push(item.episode);
		});

		return {
			personajes,
			episodios
		}
	} catch (error) {
		console.log(error);
	}
};

function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function saveInput(){
  	//console.log('Guardando');
  	showLoading();
	let nombre = document.querySelector('input[name="busqueda"]').value;
	console.log(nombre);

	let indice = 0;
	let aparece = false;

	const lista = document.getElementById("lista");
	let entrada = document.createElement('li');

	// POR ARREGLAR EL BUCLE DEL CAOS
	for (let i in personajes){
		if(nombre.toLowerCase() === personajes[i].toLowerCase()){
			indice = i;
			aparece = true;
			for (let j in episodios){
				entrada = document.createElement('li');
				entrada.appendChild(document.createTextNode(episodios[j]));
				lista.appendChild(entrada);
				console.log(episodios[j]);
			}
		}
	}

	const characterEpisodesApiUrls = episodios[indice];
	if (aparece){
		console.log(episodios[indice]);
		hideLoading();
	}

	if (controller) controller.abort();


	/*const charactersEpisodes = await fetchEpisodes(characterEpisodesApiUrls);

	renderEpisodes(charactersEpisodes);*/

	return nombre;
}

const processChange = debounce(() => saveInput());

const inputOnKeyUp = (personajes, episodios) => {
	const input = document.querySelector('input[name="busqueda"]');
	//input.value = "hola";
	input.setAttribute("onkeyup","processChange()")
	//input.addEventListener('keyup', processChange());
}

const addOnSelectChangeEvent = (personajes, episodios) => {
	const select = document.querySelector('select');
	
	select.addEventListener('change', async function onChange(event) {
		removeEpisodes();
		//showLoading();

		let nombre = select.options[select.selectedIndex].text;
		let indice = 0;

		for (let i in personajes){
			if(nombre == personajes[i]){
				indice = i;
			}
		}

		const characterEpisodesApiUrls = episodios[indice];
		const charactersEpisodes = await fetchEpisodes(characterEpisodesApiUrls);

		//renderEpisodes(charactersEpisodes);
		//hideLoading();
	});
};

document.addEventListener('DOMContentLoaded', async () => {
	const { personajes, episodios } = await fetchCharacters();
	//addOnSelectChangeEvent(personajes, episodios);
	inputOnKeyUp(personajes, episodios);
});



