import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newComicsLoading, setNewComicsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const { getAllComics, loading, error } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded);
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.lenght < 8) {
            ended = true;
        }
        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setNewComicsLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    const renderComics = (data) => {
        const comicsList = data.map((comic, i) => {
            const { thumbnail, title, price } = comic;
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${comic.id}`}>
                        <img src={thumbnail} alt={title} className="comics__item-img" />
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {comicsList}
            </ul>
        )
    }


    const comicsListRender = renderComics(comicsList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newComicsLoading ? <Spinner /> : null;


    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {comicsListRender}
            <button
                className="button button__main button__long"
                onClick={() => onRequest(offset)}
                disabled={newComicsLoading}
                style={{ 'display': comicsEnded ? "none" : "block" }}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;