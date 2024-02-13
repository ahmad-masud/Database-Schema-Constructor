import './Content.css';
import Table from '../Table/Table.js'; // Adjust the import path as necessary

function Content({ tables, onDeleteTable, onUpdateTable }) {
    return (
        <div className="content">
            {tables.map((table) => (
                <Table
                    key={table.id}
                    table={table}
                    onDeleteTable={onDeleteTable} // Pass the function to each Table
                    onUpdateTable={onUpdateTable}
                />
            ))}
        </div>
    );
}
  

export default Content;