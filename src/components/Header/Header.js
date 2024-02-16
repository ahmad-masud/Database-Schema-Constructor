import { useRef } from 'react';
import { Tooltip } from 'react-tooltip'
import './Header.css';

function Header({ onAddTable, onDeleteDatabase, onEditDatabaseName, onDownloadDatabase, databaseName, onSaveDatabase, onOpenDatabase }) {
    const fileInputRef = useRef();

    return (
        <div className='header-container'>
            <div className='header'>
                <div className='header-title'>
                    <i className="header-title-logo fa-solid fa-database"></i>
                    <span className='header-title-text'>{databaseName}</span>
                    <button aria-label='rename-schema' data-tooltip-id="rename-schema" className='header-button' onClick={onEditDatabaseName}><i className="fa-solid fa-pen-to-square"></i></button>
                </div>
                <div className='header-buttons'>
                    <button aria-label='create-table' data-tooltip-id="create-table" className='header-button' onClick={onAddTable}><i className="fa-solid fa-plus"></i></button>
                    <button aria-label='save-schema' data-tooltip-id="save-schema" className='header-button'  onClick={onSaveDatabase}><i className="fa-solid fa-floppy-disk"></i></button>
                    <input type="file" onChange={onOpenDatabase} style={{ display: 'none' }} ref={fileInputRef} />
                    <button aria-label='open-schema' data-tooltip-id="open-schema" className='header-button'  onClick={() => fileInputRef.current.click()}><i className="fa-solid fa-folder-open"></i></button>
                    <button aria-label='download-schema' data-tooltip-id="download-schema" className='header-button' onClick={onDownloadDatabase}><i className="fa-solid fa-download"></i></button>
                    <button aria-label='delete-schema' data-tooltip-id="delete-schema" className='header-button' onClick={onDeleteDatabase}><i className="fa-solid fa-trash-can"></i></button>
                    <a target="_blank" rel="noreferrer" href='https://github.com/ahmad-masud/Database-Schema-Constructor' aria-label='github' data-tooltip-id="github" className='header-button'><i className="fa-brands fa-github"></i></a>
                </div>                
            </div>
            <Tooltip id="rename-schema" place="bottom" variant="info" content="Rename Schema"/>
            <Tooltip id="create-table" place="bottom" variant="info" content="Create Table"/>
            <Tooltip id="save-schema" place="bottom" variant="info" content="Save Schema"/>
            <Tooltip id="open-schema" place="bottom" variant="info" content="Open Schema"/>
            <Tooltip id="download-schema" place="bottom" variant="info" content="Export as SQL Query"/>
            <Tooltip id="delete-schema" place="bottom" variant="info" content="Delete Schema"/>
            <Tooltip id="github" place="bottom" variant="info" content="Github Repo"/>
        </div>
    );
}

export default Header;
