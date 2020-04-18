export const requestGetItems = () => {
    return fetch(`${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_SERVER_PORT}/api/item`)
        .then(response => response.json());
};

export const requestUpdateItem = (id, item) => {
    if (!id) return new Error('Missing ID');
    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    };
    return fetch(`${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_SERVER_PORT}/api/item/${id}`, options);
};

export const requestSingleItem = (id) => {
    return fetch(`${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_SERVER_PORT}/api/item/${id}`, { method: 'GET' })
        .then(response => response.json());
};

export const requestCreateItem = (item) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    };
    return fetch(`${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_SERVER_PORT}/api/item`, options)
        .then(response => response.json());
};
