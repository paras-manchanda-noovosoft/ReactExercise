import React from "react";
import {observer} from "mobx-react";
import ListTable from "../Components/ListTable";
import ListTableStore from "../Stores/ListTableStore";
import {RootContext} from "../context/RouterContext";

@observer
class PostPage extends React.Component {
    apiUrl: string = 'https://dummyjson.com/posts';
    listTableStore = new ListTableStore(this.apiUrl);
    static contextType = RootContext;
    context!: React.ContextType<typeof RootContext>;
    routerStore: any;

    columns: { key: string, label: string }[] = [
        {key: 'title', label: 'Post Title'},
        {key: 'body', label: 'Post Body'},
        {key: 'tags', label: 'Post Tags'},
        {key: 'likes', label: 'Likes Count'},
        {key: 'dislikes', label: 'Dislikes Count'},
        {key: 'views', label: 'View Count'},
    ];

    componentDidMount() {
        this.routerStore = this.context.routerStore;
    }

    processData = (data: any) => {
        const posts = data.posts;
        const total = data.total;
        const items = posts.map((item: any) => ({
            id: item.id,
            title: item.title,
            body: item.body,
            tags: item.tags?.toString(),
            likes: item.reactions?.likes || 0,
            dislikes: item.reactions?.dislikes || 0,
            views: item.views || 0,
        }));

        return {total, items};
    };

    render() {
        return (
            <>
                <button
                    className="go-back-from-cart margin-screen"
                    onClick={() => this.routerStore.goTo('HomePage')}
                >
                    Go back
                </button>
                <ListTable
                    listTableStore={this.listTableStore}
                    processData={this.processData}
                    columns={this.columns}
                />
            </>
        );
    }
}

export default PostPage;
