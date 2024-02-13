import './App.css';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import Content from './components/Content/Content.js'; // Make sure this component can accept and use props
import { useState, useEffect, useRef } from 'react';

function App() {
  const [tables, setTables] = useState([]);
  const [databaseName, setDatabaseName] = useState("MyDatabase");
  const promptShown = useRef(false);

  useEffect(() => {
    if (!promptShown.current) {
      const name = prompt("Enter the name of your database:", "MyDatabase");
      if (name) { 
        setDatabaseName(name);
      }
      promptShown.current = true;
    }
  }, []);

  const handleAddTable = () => {
    const tableName = prompt("Enter table name:");
    if (tableName) {
      const newTable = {
        id: tables.length + 1,
        name: tableName,
        attributes: [],
      };
      setTables([...tables, newTable]);
    }
  };

  const handleDeleteDatabase = () => {
    if (window.confirm("Are you sure you want to delete the entire database?")) {
      setTables([]);
      window.location.reload();
    }
  };

  const handleEditDatabaseName = () => {
    const newName = prompt("Enter new database name:", databaseName);
    if (newName) {
      setDatabaseName(newName);
    }
  };

  const handleDownloadDatabase = () => {
    alert("Download functionality will be implemented here.");
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

  return (
    <div className="App">
      <Header
        onAddTable={handleAddTable}
        onDeleteDatabase={handleDeleteDatabase}
        onEditDatabaseName={handleEditDatabaseName}
        onDownloadDatabase={handleDownloadDatabase}
      />
      <Content
        tables={tables}
        setTables={setTables} // You might not need to pass setTables anymore if not used directly in Content
        onDeleteTable={handleDeleteTable} // Passing the new handler to Content
        onUpdateTable={handleUpdateTable}
      />
      <Footer />
    </div>
  );
}

export default App;
