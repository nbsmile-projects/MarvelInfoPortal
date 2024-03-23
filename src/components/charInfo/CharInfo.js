import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = ({ charId }) => {
    const [char, setChar] = useState(null);

    const { loading, error, getCharacter, clearError } = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [charId])

    const updateChar = () => {
        if (!charId) {
            return;
        }

        clearError();
        getCharacter(charId)
            .then(onCharLoaded);
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const skeleton = !(char || error || loading) ? <Skeleton /> : null;
    const errorMassege = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(error || loading || !char) ? <View char={char} /> : null;

    return (
        <div className="char__info" >
            {skeleton}
            {errorMassege}
            {spinner}
            {content}
        </div>
    )
}

const View = ({ char }) => {
    const { name, thumbnail, description, wiki, homepage, comics } = char;

    const renderComics = () => {
        if (comics.length === 0) {
            return 'There are no comics with this character...';
        }

        let limitedComics = comics;
        if (comics.length > 10) {
            limitedComics = comics.slice(0, 10);
            limitedComics.push({ name: '...' });
        }

        return limitedComics.map((item, i) => {
            return (
                <li className="char__comics-item" key={i}>
                    {item.name}
                </li>
            )
        })
    }

    const thumbObjectFit = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? { objectFit: 'unset' } : { objectFit: 'cover' };

    return (
        <>
            <div className="char__basics">
                <img style={thumbObjectFit} src={thumbnail} alt={name} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {renderComics()}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;