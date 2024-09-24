import React from "react";
import {observer} from "mobx-react";
import {action} from "mobx";

interface ListTableProps {
    listTableStore: any;
    processData: any;
    columns: { key: string; label: string }[];
}

@observer
class ListTable extends React.Component<ListTableProps> {
    searchTimer: any;

    constructor(props: ListTableProps) {
        super(props);
    }

    componentDidMount() {
        this.props.listTableStore.fetchData(this.props.processData).then();
    }

    @action handleRowCheckboxChange = (rowId: number, isChecked: boolean) => {
        this.props.listTableStore.updateRowCheckbox(rowId, isChecked);
    };

    @action handlePageChange = (pageNumber: number) => {
        this.props.listTableStore.setPage(pageNumber);
        this.props.listTableStore.fetchData(this.props.processData).then();
    };

    @action handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
        }
        this.searchTimer = setTimeout(() => {
            this.props.listTableStore.setSearchTerm(e.target.value);
            this.props.listTableStore.fetchSearch(this.props.processData).then();
        }, 1000);
    };

    render() {
        const {data, selectedRows, currentPage, totalPages} = this.props.listTableStore;
        const {columns} = this.props;

        return (
            <>
                <div className="margin-screen">
                    <input
                        className="search"
                        type="text"
                        onChange={this.handleSearch}
                        placeholder="Search the data ..."
                    />
                    <table>
                        <thead>
                        <tr>
                            <td>
                                <input
                                    type="checkbox"
                                    onChange={(e) => this.props.listTableStore.selectAllRows(e.target.checked)}
                                    checked={data.every((row: any) => selectedRows.has(row.id))}
                                />
                            </td>
                            {columns.map((column, index) => (
                                <td key={index}>
                                    {column.label}
                                </td>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row: any) => (
                            <tr key={row.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.has(row.id)}
                                        onChange={(e) =>
                                            this.handleRowCheckboxChange(
                                                row.id,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </td>
                                {columns.map((column, colIndex) => (
                                    <td key={`${row.id}-${colIndex}`}>
                                        {row[column.key]} {/* Access data with the column key */}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="flex-container-wrap">
                        <button
                            onClick={() => this.handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        <button style={{backgroundColor: 'blue', color: 'white'}}>
                            {currentPage}
                        </button>
                        {currentPage < totalPages && (
                            <button onClick={() => this.handlePageChange(currentPage + 1)}>
                                {currentPage + 1}
                            </button>
                        )}
                        <button
                            onClick={() => this.handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

export default ListTable;
