import './Content.css';
import Table from '../Table/Table.js'; // Adjust the import path as necessary

function Content({ tables, onDeleteTable, onUpdateTable, allTableNames, onAddAttribute, onDeleteAttribute }) {
    return (
        <div className="content">
            {tables.map((table) => (
                <Table
                    key={table.id}
                    table={table}
                    onDeleteTable={onDeleteTable} // Pass the function to each Table
                    onUpdateTable={onUpdateTable}
                    allTableNames={allTableNames}
                    onAddAttribute={onAddAttribute}
                    onDeleteAttribute={onDeleteAttribute}
                    color={table.color}
                />
            ))}
        </div>
    );
}

export default Content;