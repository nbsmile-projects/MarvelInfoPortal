import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const { loading, error, request, clearError } = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=cae3fe6887c215fe9e51f3df3801019d';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0])
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description}...` : 'There is no description for this character...',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0])
    }

    const _transformComics = (comic) => {
        return {
            id: comic.id,
            title: comic.title,
            description: comic.description || "There is no description",
            pageCount: comic.pageCount
                ? `${comic.pageCount} pages`
                : "No information about the number of pages",
            language: comic.textObjects[0]?.language || "en-us",
            thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
            price: comic.prices[0].price > 0 ? comic.prices[0].price + '$' : 'NOT AVAILABLE'
        }
    }

    return { loading, error, getCharacter, getAllCharacters, clearError, getAllComics, getComic }
}

export default useMarvelService;