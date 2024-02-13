import './Content.css';
import { useState, useEffect, useRef  } from 'react';

function Content() {
    const [databaseName, setdatabaseName] = useState('');
    const promptShown = useRef(false);

    useEffect(() => {
        if (!promptShown.current) {
            const name = prompt("Enter the name of your database:",);
            if (name) { 
                setdatabaseName(name);
            }
            promptShown.current = true;
        }
    }, []); 

    return (
    <div className='content'>

    </div>
    );
}

export default Content;
