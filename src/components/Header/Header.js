import './Header.css'

function Header() {
    return (
        <div className='header-container'>
            <div className='header'>
                <div className='header-title'>
                    <img src={'icon.webp'} alt='Logo' className='header-title-logo'></img>
                    <span className='header-title-text'>DBS Constructor</span>
                </div>
            </div>
        </div>
    )
}

export default Header