import ErrorMessage from '../errorMessage/ErrorMessage';
import { Link } from 'react-router-dom';

const Page404 = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div>
                <ErrorMessage />
            </div>
            <div>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}><span style={{ fontSize: '96px', lineHeight: '24px', color: '#9F0013' }}>404</span><br />Page not found</p>
                <Link style={{ marginTop: '5px', letterSpacing: '0.6px' }} to='/'>Back to main page ←</Link>
            </div>
        </div >
    )
}

export default Page404;