import React from 'react';
import {observer} from "mobx-react";

const CategoryDropDown = observer(({categoryData, onSelect, value}: {
    categoryData: string [],
    onSelect: (e: string) => void,
    value?: string
},) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSelect(event.target.value);
    };
    return (
        <>
            <select className="dropdown-bar fuller-width" onChange={handleChange} value={value} required>
                <option value="" hidden>Select a category</option>
                {categoryData && categoryData.map((data, index) => (
                    <option key={index} value={data}>
                        {data}
                    </option>
                ))}
            </select>
        </>
    );
});

export default CategoryDropDown;
