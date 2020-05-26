export const requestItems = () => {
    const options = {
        method: 'GET',
        credentials: 'include'
    }
    return fetch(`${process.env.REACT_APP_SERVER}/api/stock`, options)
        .then(response => response.json());
};

export const requestUpdateItem = (id, item) => {
    if (!id) return new Error('Missing ID');
    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(item)
    };
    return fetch(`${process.env.REACT_APP_SERVER}/api/item/${id}`, options);
};

export const requestSingleItem = (id) => {
    const options = {
        method: 'GET',
        credentials: 'include',
    }
    return fetch(`${process.env.REACT_APP_SERVER}/api/item/${id}`, options)
        .then(response => response.json());
};

export const requestCreateItem = (item) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
        credentials: 'include',
    };
    return fetch(`${process.env.REACT_APP_SERVER}/api/item`, options)
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

export const requestCheckAuth = (user) => {
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    };
    return fetch(`${process.env.REACT_APP_SERVER}/auth/checkAuth`, options);
}
