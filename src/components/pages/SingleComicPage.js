import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './singleComicPage.scss';

const SingleComicPage = () => {
    const { comicId } = useParams();
    const [comic, setComic] = useState(null);
    const { loading, error, getComic, clearError } = useMarvelService();

    useEffect(() => {
        updateComic();
    }, [comicId])

    const updateComic = () => {
        clearError();
        getComic(comicId)
            .then(onComicLoaded);
    }

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const error404 = (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div>
                <ErrorMessage />
            </div>
            <div>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}><span style={{ fontSize: '96px', lineHeight: '24px', color: '#9F0013' }}>404</span><br />Comic not found</p>
                <Link style={{ marginTop: '5px', letterSpacing: '0.6px' }} to='/comics'>Back to comics page← </Link>
            </div>
        </div >
    );

    const errorMassege = error ? error404 : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(error || loading || !comic) ? <View comic={comic} /> : null;

    return (
        <>
            {errorMassege}
            {spinner}
            {content}
        </>
    )
}

const View = ({ comic }) => {
    const { title, thumbnail, price, description, pageCount, language } = comic;

    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img" />
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Lenguage: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;