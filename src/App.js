import './styles/App.css';
import Header from './components/Header.js';
import Content from './components/Content.js';
import { useState, useEffect } from 'react';
import GenericForm from './components/GenericForm.js';
import Prompt from './components/Prompt.js';
import generateSqlQuery from './utils/generateSqlQuery.js';
import downloadSqlQuery from './utils/downloadSqlQuery.js';
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"; 
import { auth, db } from './config/firebase-config';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import ModifyDatabasesForm from './components/ModifyDatabasesForm.js';

function App() {
  const [tables, setTables] = useState([]);
  const [databaseName, setDatabaseName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formAction, setFormAction] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [promptAction, setPromptAction] = useState('');
  const [firstLoad, setFirstLoad] = useState(false);
  const [connections, setConnections] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showModifyDatabasesForm, setShowModifyDatabasesForm] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, so you can get the user ID.
        setUserId(user.uid);
        console.log("User ID:", user.uid); // Use user.uid directly here
      } else {
        // User is signed out
        console.log("No user signed in.");
        setUserId(null);
      }
    });
  
    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem('dbSchemaConstructorState');
    if (savedState) {
      const { databaseName: loadedDatabaseName, tables: loadedTables, connections: loadedConnections } = JSON.parse(savedState);
      setDatabaseName(loadedDatabaseName);
      setTables(loadedTables);
      setConnections(loadedConnections);
    }
    setFirstLoad(true);
  }, []);

  useEffect(() => {
    if (firstLoad) {
      if (tables.length > 0 || databaseName !== "" || connections.length > 0) {
        const appState = { databaseName, tables, connections };
        localStorage.setItem('dbSchemaConstructorState', JSON.stringify(appState));
      } else {
        showEditDatabaseNameForm(); 
      }
    }
  }, [databaseName, tables, connections, firstLoad]);
  
  const chooseColor = () => {
    const colors = ["red", "green", "blue", "purple"];
    return colors[tables.length % colors.length];
  };

  const handleFormSubmit = (inputValue) => {
    if (formAction === 'addTable') {
      const nameExists = tables.some(table => table.name.toLowerCase() === inputValue.toLowerCase());
      if (nameExists) {
        setShowForm(false);
        setPromptText("A table with this name already exists.");
        setPromptAction('alert');
        setShowPrompt(true);
      } else {
        const newTable = {
          id: tables.length + 1,
          name: inputValue,
          color: chooseColor(),
          positionX: ((tables.length)*20),
          positionY: ((tables.length)*20 + 50),
          attributes: [{
            "name": "createdAt",
            "type": "TIMESTAMP",
            "length": "",
            "defaultValue": "",
            "values": "",
            "constraints": {
              "notNull": false,
              "unique": false,
              "primaryKey": false,
              "autoIncrement": true,
              "foreignKey": {}
            }
          }],
        };
        setTables([...tables, newTable]);
      }
    } else if (formAction === 'editDatabaseName') {
      setDatabaseName(inputValue);
    }
    setShowForm(false);
  };

  const showAddTableForm = () => {
    setFormAction('addTable');
    setShowForm(true);
  };

  const showEditDatabaseNameForm = () => {
    setFormAction('editDatabaseName');
    setShowForm(true);
  };

  const handleDeleteDatabase = () => {
    setPromptText("Are you sure you want to delete the entire database?");
    setPromptAction('deleteDatabase');
    setShowPrompt(true);
  };

  const handleConfirm = () => {
    if (promptAction === 'deleteDatabase') {
      localStorage.removeItem('dbSchemaConstructorState');
      setDatabaseName('');
      setTables([]);
      setConnections([]);
      setShowPrompt(false);
      showEditDatabaseNameForm();
    } else if (promptAction === 'alert') {
      setShowPrompt(false);
    }
  };
  
  const handleCancel = () => {
    setShowPrompt(false);
  };

  const handleDownloadDatabase = () => {
    const sql = generateSqlQuery(databaseName, tables);
    downloadSqlQuery(sql, databaseName);
  };

  const handleDeleteTable = (tableId) => {
    const updatedTables = tables.filter(table => table.id !== tableId);
    setTables(updatedTables);
  };

  const handleUpdateTable = (tableId, newName, newColor) => {
    setTables(prevTables => prevTables.map(table => 
      table.id === tableId ? { ...table, name: newName } : table
    ));
  };  

  const handleUpdatePosition = (tableId, newPositionX, newPositionY) => {
    setTables(prevTables => prevTables.map(table => 
      table.id === tableId ? { ...table, positionX: newPositionX, positionY: newPositionY } : table
    ));
  };  

  const onAddAttribute = (tableId, attributeDetails) => {
    setTables(currentTables => currentTables.map(table => {
      if (table.id === tableId) {
        const attributeNameExists = table.attributes.some(attribute => 
          attribute.name.toLowerCase() === attributeDetails.name.toLowerCase()
        );
  
        if (attributeNameExists) {
          setPromptText("Attribute name already exists in this table. Please choose a different name.");
          setPromptAction('alert');
          setShowPrompt(true);
          return table;
        }

        if (attributeDetails.constraints.foreignKey) {
          const sourceId = `${table.name}-${attributeDetails.name}`;
          const targetId = `${attributeDetails.constraints.foreignKey.table}-${attributeDetails.constraints.foreignKey.attribute}`;
          const newConnection = { source: sourceId, target: targetId };
          setConnections(connections => [...connections, newConnection]);
        }
  
        return {
          ...table,
          attributes: [...table.attributes, attributeDetails]
        };
      }
      return table;
    }));
  };
  
  const onDeleteAttribute = (tableId, attributeIndex) => {
    setTables(tables => tables.map(table => {
      if (table.id === tableId) {

        if (table.attributes[attributeIndex].constraints.foreignKey) {
          const sourceId = `${table.name}-${table.attributes[attributeIndex].name}`;
          const updatedConnections = connections.filter(connection => 
            connection.source !== sourceId
          );
          setConnections(updatedConnections);
        } else if (table.attributes[attributeIndex].constraints.primaryKey) {
          const targetId = `${table.name}-${table.attributes[attributeIndex].name}`;
          const updatedConnections = connections.filter(connection => 
            connection.target !== targetId
          );
          setConnections(updatedConnections);
        }

        const updatedAttributes = table.attributes.filter((_, index) => index !== attributeIndex);
        return { ...table, attributes: updatedAttributes };
      }
      return table;
    }));
  };  

  function handleSaveDatabase() { // Pass the userId as an argument
    const databaseState = { databaseName, tables, connections };
    const userDocRef = doc(db, `users/${userId}/databases`, databaseName);
    setDoc(userDocRef, databaseState);
  }

  const handleModifyDatabases = async (action, databaseId) => {
    const databaseRef = doc(db, `users/${userId}/databases`, databaseId);

    if (action === 'load') {
      try {
        const docSnap = await getDoc(databaseRef);
        if (docSnap.exists()) {
          const databaseState = docSnap.data();
          if (databaseState.databaseName || databaseState.tables || databaseState.connections) {
            const adjustedTables = databaseState.tables.map(table => {
              let { positionX, positionY } = table;
    
              if (positionX > window.innerWidth - 400) {
                positionX = window.innerWidth - 400;
              }
              if (positionY > window.innerHeight - 400) {
                positionY = window.innerHeight - 400;
              }
              return { ...table, positionX, positionY };
            });
            setDatabaseName(databaseState.databaseName);
            setTables(adjustedTables);
            setConnections(databaseState.connections);
            window.location.reload();
          } else {
            setPromptText("Invalid database format.");
            setPromptAction('alert');
            setShowPrompt(true);
          }
        } else {
          setPromptText("Database does not exist.");
          setPromptAction('alert');
          setShowPrompt(true);
        }
      } catch (error) {
        console.error("Error loading the database from Firestore:", error);
        setPromptText("An error occurred while loading the database.");
        setPromptAction('alert');
        setShowPrompt(true);
      }
    } else if (action === 'delete') {
      try {
        await deleteDoc(databaseRef);
        console.log("Document successfully deleted!");
      } catch (error) {
        console.error("Error removing document: ", error);
      }
    }
  };

  const handleSignInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
  };      

  const handleSignOut = () => {
    signOut(auth);
    setPromptText("You have been signed out.");
    setPromptAction('alert');
    setShowPrompt(true);
  };

  return (
    <div className="App">
      <Header
        onAddTable={showAddTableForm}
        onDeleteDatabase={handleDeleteDatabase}
        onEditDatabaseName={showEditDatabaseNameForm}
        onDownloadDatabase={handleDownloadDatabase}
        databaseName={databaseName}
        onSaveDatabase={handleSaveDatabase}
        onModifyDatabases={() => userId ? setShowModifyDatabasesForm(true) : (() => {
          setPromptText("You must be logged in to modify databases. Please login.");
          setPromptAction('alert');
          setShowPrompt(true);
        })()}
        onSignInWithGoogle={handleSignInWithGoogle}    
        onSignOut={handleSignOut}    
      />
      {showModifyDatabasesForm && (
        <ModifyDatabasesForm
          userId={userId}
          onSubmit={handleModifyDatabases}
          onCancel={() => setShowModifyDatabasesForm(false)}
        />
      )}
      {showPrompt && (
        <Prompt
          question={promptText}
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
        onDeleteTable={handleDeleteTable}
        onUpdateTable={handleUpdateTable}
        onAddAttribute={onAddAttribute}
        onDeleteAttribute={onDeleteAttribute}
        onUpdatePosition={handleUpdatePosition}
        connections={connections}
      />
    </div>
  );
}

export default App;
