import {action, makeAutoObservable, observable, runInAction} from 'mobx';

class ListTableStore<T> {
    @observable data: T[] = [];
    @observable selectedRows: Set<number> = new Set();
    @observable search: string = "";
    @observable currentPage: number = 1;
    @observable totalPages: number = 0;
    @observable itemsPerPage: number = 10;
    apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
        makeAutoObservable(this);
    }

    @action setTotalPages(total: number) {
        this.totalPages = Math.ceil(total / this.itemsPerPage);
    }

    @action setData(data: T[]) {
        this.data = [...data];
    }

    @action setPage(page: number) {
        this.currentPage = page;
    }

    @action setSearchTerm(search: string) {
        this.search = search;
    }

    @action selectAllRows(checked: boolean) {
        this.data.forEach((item: any) => {
            if (checked) {
                this.selectedRows.add(item.id);
            } else {
                this.selectedRows.delete(item.id);
            }
        });
    }

    @action updateRowCheckbox(rowId: number, isChecked: boolean) {
        if (isChecked) {
            this.selectedRows.add(rowId);
        } else {
            this.selectedRows.delete(rowId);
        }
    }

    @action
    async fetchData(processDataCallback: (response: any) => { total: number; items: T[] }) {
        try {
            const response = await fetch(`${this.apiUrl}?limit=${this.itemsPerPage}&skip=${(this.currentPage - 1) * this.itemsPerPage}`);
            const rawData = await response.json();
            const {total, items} = processDataCallback(rawData);
            this.setTotalPages(total);
            this.setData(items);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    @action
    async fetchSearch(processDataCallback: (response: any) => { total: number; items: T[] }) {
        try {
            const response = await fetch(`${this.apiUrl}/search?q=${this.search}&limit=${this.itemsPerPage}`);
            const rawData = await response.json();
            const {total, items} = processDataCallback(rawData);
            this.setTotalPages(total);
            this.setData(items);
        } catch (error) {
            console.error('Failed to fetch search data:', error);
        }
    }
}

export default ListTableStore;
