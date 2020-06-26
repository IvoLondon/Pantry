export const requestItems = () => {
    const options = {
        method: 'GET',
        credentials: 'include'
    }
    return fetch(`${process.env.REACT_APP_SERVER}/api/stock`, options)
        .then(response => response.json());
};

export const requestUpdateItem = (id, unit) => {
    if (!id) throw new Error('Missing ID');
    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(unit)
    };
    return fetch(`${process.env.REACT_APP_SERVER}/api/store/${id}`, options);
};

export const requestSingleItem = (id) => {
    const options = {
        method: 'GET',
        credentials: 'include',
    }
    return fetch(`${process.env.REACT_APP_SERVER}/api/store/${id}`, options)
        .then(response => response.json());
};

export const requestCreateItem = (item) => {
    const newItem = {
        stock: {
            quantity: item.quantity,
            continuous: item.continuous
        },
        store: {
            ...item.item
        }
    }
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
        credentials: 'include',
    };
    return fetch(`${process.env.REACT_APP_SERVER}/api/store`, options)
        .then(response => response.json());
};

export const requestAuth = (user) => {
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(user)
    };
    return fetch(`${process.env.REACT_APP_SERVER}/auth/signin`, options);
}


/* THIRD PARTY CALLS */
export const worldOpenFoodFactsAPI = async (id) => {
    return await fetch(`https://world.openfoodfacts.org/api/v0/product/${id}.json`).then(response => response.json());
}