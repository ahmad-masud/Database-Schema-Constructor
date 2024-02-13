import React from 'react';
import './Header.css';

function Header({ onAddTable, onDeleteDatabase, onEditDatabaseName, onDownloadDatabase }) {
    return (
        <div className='header-container'>
            <div className='header'>
                <div className='header-title'>
                    <img src={'icon.webp'} alt='Logo' className='header-title-logo'></img>
                    <span className='header-title-text'>DBS Constructor</span>
                </div>
                <div className='header-buttons'>
                    <button className='header-button' onClick={onAddTable}><i className="fa-solid fa-plus"></i></button>
                    <button className='header-button' onClick={onDownloadDatabase}><i className="fa-solid fa-download"></i></button>
                    <button className='header-button' onClick={onDeleteDatabase}><i className="fa-solid fa-trash-can"></i></button>
                    <button className='header-button' onClick={onEditDatabaseName}><i className="fa-solid fa-pen-to-square"></i></button>
                </div>                
            </div>
        </div>
    );
}

export default Header;
