import axios from "axios";

const URL = 'https://pixabay.com/api/';
const KEY = '35918540-cf3c6af1d7435d60d9f48c07a';

export default async function fetch(value, page) {
  const filter = `key=${KEY}&q=${value}&image_type=photo&min_width=800&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios.get(`${URL}?${filter}`).then(res => res.data);
}
