import React from "react";
import {observer} from "mobx-react";
import {action, observable, runInAction} from "mobx";
import {IPostPageProps} from "../Types/PostPageProps";
import ListTable from "../Components/ListTable";

@observer
class PostPage extends React.Component<IPostPageProps> {
    @observable apiUrl: string = 'https://dummyjson.com/posts';
    total: number = 0;

    constructor(props: IPostPageProps) {
        super(props);
    }

    @action
    calculateTotalPages = (itemPerPage: number): number => {
        return Math.ceil(this.total / itemPerPage);
    }


    @action
    fetchData = async (itemsPerPage: number, currentPage: number) => {
        try {
            const response = await fetch(`${this.apiUrl}?limit=${itemsPerPage}&skip=${(currentPage - 1) * itemsPerPage}`);
            const data = await response.json();
            this.total = data.total;
            runInAction(() => {
                const postData = data.posts.map((post: any) => ({
                    id: post.id,
                    title: post.title,
                    body: post.body,
                    tags: post.tags.toString(),
                    likes: post.reactions.likes,
                    dislikes: post.reactions.dislikes,
                    views: post.views,
                }));
                this.props.listTableStore.setData(postData);
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    @action
    fetchSearch = async (search: string, itemsPerPage: number) => {
        try {
            const response = await fetch(`${this.apiUrl}/search?q=${search}&limit=${itemsPerPage}`);
            const data = await response.json();
            runInAction(() => {
                const postData = data.posts.map((post: any) => ({
                    id: post.id,
                    title: post.title,
                    body: post.body,
                    tags: post.tags.toString(),
                    likes: post.reactions.likes,
                    dislikes: post.reactions.dislikes,
                    views: post.views,
                }));
                this.props.listTableStore.setTotal(data.total);
                this.props.listTableStore.setData(postData);
            });
        } catch (error) {
            console.error('Failed to fetch search data:', error);
        }
    }

    render() {
        const {listTableStore} = this.props;

        return (
            <>
                <ListTable listTableStore={listTableStore}
                           fetchData={this.fetchData}
                           fetchSearch={this.fetchSearch}
                           calculateTotalPages={this.calculateTotalPages}
                />
            </>
        );
    }
}

export default PostPage;
