import {action, makeAutoObservable, observable} from 'mobx';

class ListTableStore {
    @observable data: object[] = [];
    @observable selectedRows: Set<number> = new Set();
    @observable total: number = 0;

    constructor() {
        makeAutoObservable(this);
    }

    @action setTotal(total: number) {
        this.total = total;
    }

    @action setData(data: any) {
        this.data = [...data];
    }

    selectAll(checked: boolean) {
        this.data.forEach((val: any) => {
            if (checked) {
                this.selectedRows.add(val.id);
            } else {
                this.selectedRows.delete(val.id);
            }
        });
    }

    updateRowCheckbox(rowId: number, isChecked: boolean) {
        if (isChecked) {
            this.selectedRows.add(rowId);
        } else {
            this.selectedRows.delete(rowId);
        }
    }
}

export default ListTableStore;
