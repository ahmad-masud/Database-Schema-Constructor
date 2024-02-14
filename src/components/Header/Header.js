import React from 'react';
import './Header.css';

function Header({ onAddTable, onDeleteDatabase, onEditDatabaseName, onDownloadDatabase, databaseName }) {
    return (
        <div className='header-container'>
            <div className='header'>
                <div className='header-title'>
                    <i className="header-title-logo fa-solid fa-database"></i>
                    <span className='header-title-text'>{databaseName}</span>
                    <button title="Rename Schema" className='header-button' onClick={onEditDatabaseName}><i className="fa-solid fa-pen-to-square"></i></button>
                </div>
                <div className='header-buttons'>
                    <button title="Create Table" className='header-button' onClick={onAddTable}><i className="fa-solid fa-plus"></i></button>
                    <button title="Download Schema" className='header-button' onClick={onDownloadDatabase}><i className="fa-solid fa-download"></i></button>
                    <button title="Delete Schema" className='header-button' onClick={onDeleteDatabase}><i className="fa-solid fa-trash-can"></i></button>
                </div>                
            </div>
        </div>
    );
}

export default Header;
