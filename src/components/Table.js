import '../styles/Table.css';
import AttributeForm from './AttributeForm.js';
import { useState, useEffect, useCallback , useRef } from 'react';
import GenericForm from './GenericForm.js';
import Prompt from './Prompt.js';

function Table({ tables, table, onAddAttribute, onDeleteTable, onUpdateTable, allTableNames, onDeleteAttribute, color, positionX, positionY, onUpdatePosition, snapToGrid }) {
  const [isAttributeFormVisible, setIsAttributeFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: positionX , y: positionY });
  const [relPosition, setRelPosition] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [promptAction, setPromptAction] = useState('');
  const tableRef = useRef(null);
  const colors = {
    "red": "#BD362F",
    "orange": "#F9A732",
    "green": "#56AD56", 
    "blue": "SteelBlue", 
    "purple": "#9A66CD",
    "brown": "#AC725E",
  };
  
  const handleUpdatePosition = useCallback((newX, newY) => {
    onUpdatePosition(table.id, newX, newY);
  }, [table.id, onUpdatePosition]);

  const onMouseDown = (e) => {
    if (snapToGrid) {
      return;
    }
    setIsDragging(true);
    setRelPosition({
      x: e.pageX - position.x,
      y: e.pageY - position.y,
    });
    e.preventDefault();
  };

  const onMouseUp = useCallback(() => {
    if (snapToGrid) {
      return;
    }
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging, snapToGrid]);  

  const getTableDimensions = () => {
    if (tableRef.current) {
      const dimensions = tableRef.current.getBoundingClientRect();
      return { width: dimensions.width, height: dimensions.height };
    }
    return { width: 0, height: 0 };
  };

  const onMouseMove = useCallback((e) => {
    if (!isDragging || snapToGrid) {
      return;
    }
    const { width: tableWidth, height: tableHeight } = getTableDimensions();

    const newX = e.pageX - relPosition.x;
    const newY = e.pageY - relPosition.y;

    const constrainedX = Math.min(Math.max(newX, 0), window.innerWidth - tableWidth);
    const constrainedY = Math.min(Math.max(newY, 50), window.innerHeight - tableHeight);

    setPosition({
      x: constrainedX,
      y: constrainedY,
    });

    handleUpdatePosition(position.x, position.y);
  }, [isDragging, relPosition, position, handleUpdatePosition, snapToGrid]); 

  useEffect(() => {
    if (snapToGrid) {
      return;
    }
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp, snapToGrid]);

  const handleEditTableDetails = () => {
    setIsEditFormVisible(true);
  };  

  const handleDelete = () => {
    onDeleteTable(table.id);
  };

  const handleUpdateName = (newName) => {
    const isDuplicate = allTableNames.some(name => name.toLowerCase() === newName.toLowerCase() && name !== table.name);
    if (!isDuplicate) {
      onUpdateTable(table.id, newName);
      setIsEditFormVisible(false);
    } else {
      setPromptText("Table name already exists. Please choose a different name.");
      setPromptAction('alert');
      setShowPrompt(true);
    }
  };

  const handleDeleteAttribute = (attributeIndex) => {
    onDeleteAttribute(table.id, attributeIndex);
  };

  const handleConfirm = () => {
    if (promptAction === 'alert') {
      setShowPrompt(false);
    }
  };
  
  const handleCancel = () => {
    setShowPrompt(false);
  };
  
  return (
    <div>
      {showPrompt && (
        <Prompt
          question={promptText}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {isEditFormVisible && (
        <GenericForm
          placeholder="Enter new table name"
          initialValue={table.name}
          onSubmit={handleUpdateName}
          onCancel={() => setIsEditFormVisible(false)}
        />
      )}
      {isAttributeFormVisible && (
        <AttributeForm
          tables={tables}
          thisTable={table}
          onCancel={() => setIsAttributeFormVisible(false)}
          onSubmit={(attributeDetails) => {
            onAddAttribute(table.id, attributeDetails);
            setIsAttributeFormVisible(false);
          }}
        />
      )}
      <div 
        style= {!snapToGrid ? { left: `${position.x}px`, top: `${position.y}px`, position: 'absolute' } : {}}
        onMouseDown={onMouseDown}
        className={snapToGrid ? 'table-container' : 'table-container draggable'}
        ref={tableRef}
      >
        <div className="table-header" style={{background: colors[color]}}>
          <p className='table-name'>{table.name}</p>
          <div className='tabler-header-buttons'>
            <button aria-label='edit table' className='table-header-button' onClick={handleEditTableDetails}><i className="bi bi-pencil-fill"></i></button>
            <button aria-label='delete table' className='table-header-button' onClick={handleDelete}><i className="fa-solid fa-xmark"></i></button>
          </div>
        </div>
        <ul className='attribute-list'>
          {table.attributes.map((attribute, index) => {
            return (
              <li id={`${table.name}-${attribute.name}`}className='attribute' key={index}>    
                <div>
                  <span className='attribute-name'>{attribute.name} </span>
                  {attribute.constraints.foreignKey.attribute && <sup> FK</sup>}
                  {attribute.constraints.primaryKey && <sup> PK</sup>}
                  <sub className="italic">{` ${attribute.type.toLowerCase()}`}</sub></div>
                <div className='attribute-left'>
                  <button aria-label='delete attribute' onClick={() => handleDeleteAttribute(index)} className="attribute-action-button"><i className="fa-solid fa-xmark"></i></button>
                </div>
              </li>
            );
          })}
          <li className='attribute'>
            Add new attribute
            <button aria-label='add attribute' className='add-attribute-button' onClick={() => setIsAttributeFormVisible(true)}><i className="fa-solid fa-plus"></i></button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Table;
