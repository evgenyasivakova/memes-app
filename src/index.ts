import axios from 'axios';
import qs from 'query-string';

const bodyForMemes: HTMLElement | null = document.querySelector('.memes');
const bodyForGeneretedMemes: HTMLElement = document.querySelector('.generated-meme') || document.createElement('div');
const form: HTMLFormElement | null = document.querySelector('.form') || document.createElement('form');
const formForCreateMeme: HTMLFormElement = document.querySelector('.form-create-meme') || document.createElement('form');

type Meme = {
  url: string,
  id: string
};

const apiUrl = 'https://api.imgflip.com';

form.onsubmit = function (e: Event) {
  e.preventDefault();

  const quantityField = form.querySelector('[name="quantity"]');
  const quantity = (<HTMLInputElement>quantityField).value || '';

  form.reset();
  initApp(Number(quantity));
}

async function initApp(quantity: number) {
  const memes = await getMemes();
  const listMemesForRender = memes.data.memes.slice(0, quantity);
  renderUsers(listMemesForRender);
}

async function getMemes() {
  const { data: memes } = await axios(`${apiUrl}/get_memes`);
  return memes;
}

function renderUsers(listMemesForRender: Meme[]) {
  if (bodyForMemes) {
    bodyForMemes.innerHTML = '';
  }

  listMemesForRender.forEach(meme => {
    const { url, id } = meme;
    const createdMarkup = createMeme(url, id);
    bodyForMemes && bodyForMemes.appendChild(createdMarkup);

    formForCreateMeme.classList.remove('hidden');
  });
}

function createMeme(url: string, id: string) {
  const div = document.createElement('div');
  const img = document.createElement('img');
  img.src = url;
  img.width = 250;
  img.height = 250;
  div.appendChild(img);

  const inputForImg = document.createElement('input');
  inputForImg.type = 'hidden';
  inputForImg.name = 'meme-id';
  div.appendChild(inputForImg);

  img.onclick = function() {
    inputForImg.id = `${id}`;

    formForCreateMeme.onsubmit = function (e: Event) {
      e.preventDefault();

      const descriptionField1 = document.querySelector('[name="description1"]');
      const description1 = (<HTMLInputElement>descriptionField1).value || '';

      const descriptionField2 = document.querySelector('[name="description2"]');
      const description2 = (<HTMLInputElement>descriptionField2).value || '';

      if (id && description1 && description2) {
        makeRequestForNewMeme(id, description1, description2);
      }
    }
  }
  return div;
}

async function makeRequestForNewMeme(memeId: string, description1: string, description2: string) {
  const objForMeme = {
    template_id: memeId,
    username: "g_user_107257642549096835361",
    password: "1234",
    text0: description1,
    text1: description2,
  }

  const requestData = qs.stringify(objForMeme);

  let { data: createdMeme } = await axios.post(`${apiUrl}/caption_image`, requestData);
  createdMeme = createdMeme.data.url;
  renderNewMeme(createdMeme);
}

function renderNewMeme(createdMeme: string) {
  if (bodyForGeneretedMemes) {
    bodyForGeneretedMemes.innerHTML = '';
  }

  const img = document.createElement('img');
  img.src = createdMeme;
  img.width = 300;
  img.height = 300;
  bodyForGeneretedMemes.appendChild(img);
}
