import React, {useCallback, useEffect, useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";


const products = [
    {id: '1', title: 'Джинсы', price: 5000, description: 'Синего цвета, прямые'},
    {id: '1', title: 'Куртка', price: 12000, description: 'Белого цвета, оверсайз'},
    {id: '1', title: 'Джинсы 2', price: 5000, description: 'Черного цвета, клёш'},
    {id: '1', title: 'Куртка 8', price: 15000, description: 'Красного цвета, теплая'},
    {id: '1', title: 'Джинсы 3', price: 6000, description: 'Синего цвета, скинни'},
    {id: '1', title: 'Куртка 7', price: 8000, description: 'Черного цвета, ниже колена'},
    {id: '1', title: 'Джинсы 4', price: 5500, description: 'Синего цвета, mom'},
    {id: '1', title: 'Куртка 6', price: 7000, description: 'Хаки, короткая'}
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc,item) => {
        return acc += item.price
    }, 0)
}

    const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);

    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://localhost:8000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])



const onAdd = (product) => {
    const alreadyAdded = addedItems.find(item => item.id === product.id);
    let newItems = [];

    if(alreadyAdded) {
        newItems = addedItems.filter(item => item.id !== product.id);
    } else {
        newItems = [...addedItems, product];
    }

    setAddedItems(newItems)

    if(newItems.length === 0) {
        tg.MainButton.hide();
    } else {
        tg.MainButton.show();
        tg.MainButton.setParams({
            text: `Купить ${getTotalPrice(newItems)}`
        })
    }
}

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                product={item}
                onAdd={onAdd}
                classname={'item'}
                />
            ))
            }

        </div>
    );
};

export default ProductList;