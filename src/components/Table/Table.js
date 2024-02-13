import './Table.css'; // Ensure you have a CSS file for styling
import AttributeForm from '../AttributeForm/AttributeForm.js'; // Adjust the import path as needed
import { useState } from 'react';
import GenericForm from '../GenericForm/GenericForm.js'; // Adjust the path as needed

function Table({ table, onAddAttribute, onDeleteTable, onUpdateTable, allTableNames, onDeleteAttribute, color }) {
  const [isAttributeFormVisible, setIsAttributeFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);

  const handleEditTableDetails = () => {
    setIsEditFormVisible(true); // Show the form instead of using prompt
  };  

  const handleDelete = () => {
    onDeleteTable(table.id);
  };

  const handleUpdateName = (newName) => {
    const isDuplicate = allTableNames.some(name => name.toLowerCase() === newName.toLowerCase() && name !== table.name);
    if (!isDuplicate) {
      onUpdateTable(table.id, newName);
      setIsEditFormVisible(false); // Hide form after successful update
    } else {
      alert("Table name already exists. Please choose a different name.");
    }
  };

  const handleDeleteAttribute = (attributeIndex) => {
    // Create a new array without the attribute to be deleted
    const updatedAttributes = table.attributes.filter((_, index) => index !== attributeIndex);
    // Update the table's attributes list with this new array
    onDeleteAttribute(table.id, updatedAttributes);
  };
  

  return (
    <div className="table-container">
      {isEditFormVisible && (
        <GenericForm
          placeholder="Enter new table name"
          initialValue={table.name}
          onSubmit={handleUpdateName}
          onCancel={() => setIsEditFormVisible(false)}
        />
      )}
      <div className="table-header" style={{background: color}}>
        <h2 className='table-name'>{table.name}</h2>
        <div className='tabler-header-buttons'>
          <button className='table-header-button' onClick={() => setIsAttributeFormVisible(true)}><i className="fa-solid fa-plus"></i></button>
          <button className='table-header-button' onClick={handleEditTableDetails}><i className="fa-solid fa-pen-to-square"></i></button>
          <button className='table-header-button' onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
      {isAttributeFormVisible && <AttributeForm 
          onCancel={() => setIsAttributeFormVisible(false)}
          onSubmit={(attributeDetails) => {
              // Correctly pass table.id and attributeDetails to the onAddAttribute prop
              onAddAttribute(table.id, attributeDetails);
              setIsAttributeFormVisible(false); // Close modal upon form submission
          }} 
      />}
      <ul>
        {table.attributes.map((attribute, index) => (
          <ul className='attribute-list'>
            <li className='attribute' key={index}>
              {`${attribute.name} (${attribute.type})`}
                <button onClick={() => handleDeleteAttribute(index)} className="attribute-action-button"><i className="fa-solid fa-trash-can"></i></button>
            </li>
          </ul>
        ))}
      </ul>
    </div>
  );
}

export default Table;
