import './Table.css'; // Ensure you have a CSS file for styling
import AttributeForm from '../AttributeForm/AttributeForm.js'; // Adjust the import path as needed
import { useState } from 'react';

function Table({ table, onAddAttribute, onDeleteTable, onUpdateTable }) {
  const [isAttributeFormVisible, setIsAttributeFormVisible] = useState(false);
  const handleAddAttribute = (attributeDetails) => {
    onAddAttribute(table.id, attributeDetails);
  };

  const handleEditTableDetails = () => {
    const newName = prompt('Enter new table name:', table.name);
    if (newName) {
      onUpdateTable(table.id, newName);
    }
  };

  const handleDelete = () => {
    // Confirm before deleting
    if (window.confirm(`Are you sure you want to delete the table "${table.name}"?`)) {
      onDeleteTable(table.id);
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className='table-name'>{table.name}</h2>
        <div className='tabler-header-buttons'>
          <button className='table-header-button' onClick={() => setIsAttributeFormVisible(true)}><i className="fa-solid fa-plus"></i></button>
          <button className='table-header-button' onClick={handleEditTableDetails}><i className="fa-solid fa-pen-to-square"></i></button>
          <button className='table-header-button' onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
      {isAttributeFormVisible && <AttributeForm onSubmit={(attributeDetails) => {
        handleAddAttribute(attributeDetails);
        setIsAttributeFormVisible(false); // Close modal upon form submission
      }} />}
      <ul>
        {table.attributes.map((attribute, index) => (
          <li className='attribute-list' key={index}>
            {`${attribute.name} - ${attribute.type}${attribute.length ? ` (${attribute.length})` : ''}${attribute.defaultValue ? `, Default: ${attribute.defaultValue}` : ''}`}
            {`${attribute.constraints.notNull ? ', Not Null' : ''}`}
            {`${attribute.constraints.unique ? ', Unique' : ''}`}
            {`${attribute.constraints.primaryKey ? ', Primary Key' : ''}`}
            {`${attribute.constraints.autoIncrement ? ', Auto Increment' : ''}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Table;
