import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [newCharsLoading, setNewCharsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const { loading, error, getAllCharacters } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewCharsLoading(false) : setNewCharsLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded);
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewCharsLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    const charsRefs = useRef([]);

    const focusOnChar = (id) => {
        charsRefs.current.forEach(charRef => charRef.classList.remove('char__item_selected'));
        charsRefs.current[id].classList.add('char__item_selected');
        charsRefs.current[id].focus();
    }

    const renderChars = (data) => {
        const charList = data.map((item, i) => {
            const [thumbnail, name] = [item.thumbnail, item.name];
            const thumbStyle = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? { objectFit: 'unset' } : { objectFit: 'cover' };

            return (
                <li
                    className="char__item"
                    ref={el => charsRefs.current[i] = el}
                    tabIndex={0}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnChar(i);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(item.id);
                            focusOnChar(i);
                        }
                    }}>
                    <img style={thumbStyle} src={thumbnail} alt={name} />
                    <div className="char__name">{name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {charList}
            </ul>
        )
    }

    const charListRender = renderChars(charList);

    const errorMassege = error ? <ErrorMessage /> : null;
    const spinner = loading && !newCharsLoading ? <Spinner /> : null;

    return (
        <div className="char__list" >
            {errorMassege}
            {spinner}
            {charListRender}
            <button
                className="button button__main button__long"
                disabled={newCharsLoading}
                style={{ display: charEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;