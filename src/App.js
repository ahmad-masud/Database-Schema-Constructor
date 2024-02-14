import './App.css';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import Content from './components/Content/Content.js'; // Make sure this component can accept and use props
import { useState, useEffect } from 'react';
import GenericForm from './components/GenericForm/GenericForm.js';
import Prompt from './components/Prompt/Prompt.js';

function App() {
  const [tables, setTables] = useState([]);
  const [databaseName, setDatabaseName] = useState();
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [formAction, setFormAction] = useState(''); // State to determine form action (addTable or editDatabaseName)
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptQuestion, setPromptQuestion] = useState('');

  function generateSqlQuery(databaseName, tables) {
    let sql = `CREATE DATABASE IF NOT EXISTS ${databaseName};\nUSE ${databaseName};\n\n`;
    tables.forEach(table => {
      sql += `CREATE TABLE ${table.name} (\n`;
      table.attributes.forEach((attr, index) => {
        // Construct the SQL line for each attribute
        let attrSql = `  ${attr.name} ${attr.type}`;
        if (attr.length) {
          attrSql += `(${attr.length})`;
        }
        if (attr.constraints.notNull) {
          attrSql += ` NOT NULL`;
        }
        if (attr.constraints.unique) {
          attrSql += ` UNIQUE`;
        }
        if (attr.constraints.primaryKey) {
          attrSql += ` PRIMARY KEY`;
        }
        if (attr.constraints.autoIncrement) {
          attrSql += ` AUTO_INCREMENT`;
        }
        if (attr.defaultValue) {
          attrSql += ` DEFAULT '${attr.defaultValue}'`;
        }
        sql += attrSql + (index < table.attributes.length - 1 ? ',' : '') + '\n';
      });
      sql += `);\n\n`;
    });
    return sql;
  }  
  
  function downloadSqlQuery(sql) {
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${databaseName}.sql`; // Use the database name in the filename
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  

  const randomColor = () => {
    const colors = ["DarkRed", "DarkGreen", "DarkBlue"];
    return colors[tables.length % colors.length];
  };

  useEffect(() => {
      showEditDatabaseNameForm();
  }, []);

  const handleFormSubmit = (inputValue) => {
    if (formAction === 'addTable') {
      // Check if the table name already exists
      const nameExists = tables.some(table => table.name === inputValue);
      if (nameExists) {
        alert('A table with this name already exists.'); // Notify the user
      } else {
        // Proceed to add the new table if the name doesn't exist
        const newTable = {
          id: tables.length + 1,
          name: inputValue,
          color: randomColor(),
          attributes: [],
        };
        setTables([...tables, newTable]);
      }
    } else if (formAction === 'editDatabaseName') {
      setDatabaseName(inputValue);
    }
    setShowForm(false); // Close the form after submission or if the table name exists
  };

  // Function to show the form for adding a table
  const showAddTableForm = () => {
    setFormAction('addTable');
    setShowForm(true);
  };

  // Function to show the form for editing the database name
  const showEditDatabaseNameForm = () => {
    setFormAction('editDatabaseName');
    setShowForm(true);
  };

  const handleDeleteDatabase = () => {
    setPromptQuestion("Are you sure you want to delete the entire database?");
    setShowPrompt(true);
  };

  const handleConfirm = () => {
    setDatabaseName('');
    setTables([]);
    setShowPrompt(false);
    showEditDatabaseNameForm();
  };
  
  const handleCancel = () => {
    setShowPrompt(false);
  };

  const handleDownloadDatabase = () => {
    const sql = generateSqlQuery(databaseName, tables);
    downloadSqlQuery(sql);
  };

  const handleDeleteTable = (tableId) => {
    const updatedTables = tables.filter(table => table.id !== tableId);
    setTables(updatedTables);
  };

  const handleUpdateTable = (tableId, newName, newColor) => {
    setTables(prevTables => prevTables.map(table => 
      table.id === tableId ? { ...table, name: newName, color: newColor } : table
    ));
  };  

  const onAddAttribute = (tableId, attributeDetails) => {
    setTables(currentTables => currentTables.map(table => {
      if (table.id === tableId) {
        // Check if the attribute name already exists in this table
        const attributeNameExists = table.attributes.some(attribute => 
          attribute.name.toLowerCase() === attributeDetails.name.toLowerCase()
        );
  
        if (attributeNameExists) {
          // Optionally alert the user or handle this case as needed
          alert("Attribute name already exists in this table. Please choose a different name.");
          return table; // Return the table unchanged if the attribute name exists
        }
  
        // If the attribute name does not exist, add the new attribute
        return {
          ...table,
          attributes: [...table.attributes, attributeDetails]
        };
      }
      return table; // Return all other tables unchanged
    }));
  };
  
  const onDeleteAttribute = (tableId, newAttributes) => {
    setTables(tables => tables.map(table => {
      if (table.id === tableId) {
        return { ...table, attributes: newAttributes };
      }
      return table;
    }));
  };  

  return (
    <div className="App">
      <Header
        onAddTable={showAddTableForm} // Updated to show form
        onDeleteDatabase={handleDeleteDatabase}
        onEditDatabaseName={showEditDatabaseNameForm} // Updated to show form
        onDownloadDatabase={handleDownloadDatabase}
        databaseName={databaseName}
      />
      {showPrompt && (
        <Prompt
          question={promptQuestion}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {showForm && (
        <GenericForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          placeholder={formAction === 'addTable' ? "Enter table name:" : "Enter new database name:"}
          initialValue={formAction === 'editDatabaseName' ? databaseName : ""}
        />
      )}
      <Content
        tables={tables}
        allTableNames={tables.map(t => t.name)}
        onDeleteTable={handleDeleteTable} // Passing the new handler to Content
        onUpdateTable={handleUpdateTable}
        onAddAttribute={onAddAttribute}
        onDeleteAttribute={onDeleteAttribute}
      />
      <Footer />
    </div>
  );
}

export default App;
