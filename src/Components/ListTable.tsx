import React from "react";
import {observer} from "mobx-react";
import {IPostTypes} from "../Types/PostTypes";
import {action, observable} from "mobx";

@observer
class ListTable extends React.Component<any> {
    searchTimer: any;
    @observable search: string = "";
    @observable currentPage: number = 1;
    @observable totalPages: number = 0;
    @observable itemsPerPage: number = 10;

    constructor(props: any) {
        super(props);
        this.props.fetchData(this.itemsPerPage, this.currentPage).then();
    }

    @action selectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        this.props.listTableStore.selectAll(isChecked);
    };

    @action handleRowCheckboxChange = (rowId: number, isChecked: boolean) => {
        this.props.listTableStore.updateRowCheckbox(rowId, isChecked);
    };

    @action handlePageChange = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > this.totalPages)
            return;
        this.currentPage = pageNumber;
        this.props.fetchData(this.itemsPerPage, this.currentPage).then();
    };

    @action setSearchTerm = (str: string) => {
        this.search = str;
        this.props.fetchSearch(this.search, this.itemsPerPage).then();
    }

    @action handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
        }

        this.searchTimer = setTimeout(() => {
            this.setSearchTerm(e.target.value);
        }, 1000);
    };

    render() {

        const { listTableStore } = this.props;
        const data = listTableStore.data;
        const columns = data?.length > 0 ? Object.keys(data[0]).filter(key => key !== 'id') : [];
        this.totalPages = data?.length > 0 ? Math.ceil(data[0].total / this.itemsPerPage) : 0;

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
                                    onChange={this.selectAll}
                                    checked={listTableStore.data.every((row: any) => listTableStore.selectedRows.has(row.id))}
                                />
                            </td>
                            {columns.map((column, index) => (
                                <td key={index}>{column}</td>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row: any) => (
                            <tr key={row.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={listTableStore.selectedRows.has(row.id)}
                                        onChange={(e) =>
                                            this.handleRowCheckboxChange(
                                                row.id,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </td>
                                {columns.map((column: string, colIndex) => (
                                    <td key={`${row.id}-${colIndex}`}>
                                        {row[column as keyof IPostTypes]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="flex-container-wrap">
                        <button
                            onClick={() => this.handlePageChange(this.currentPage - 1)}
                            disabled={this.currentPage === 1}
                        >
                            &lt;
                        </button>
                        <button
                            style={{backgroundColor: 'blue', color: 'white'}}
                        >
                            {this.currentPage}
                        </button>
                        <button
                            onClick={() => this.handlePageChange(this.currentPage + 1)}
                            disabled={this.currentPage === this.totalPages}
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
