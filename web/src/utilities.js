import _ from 'lodash/fp';
import React, { useState } from 'react';

export const whatUpdated = (prevProps, prevState, props, state) => {
    Object.entries(props).forEach(([key, val]) =>
        prevProps[key] !== val && console.log(`Prop '${key}' changed`)
    );
    if (state) {
        Object.entries(state).forEach(([key, val]) =>
            prevState[key] !== val && console.log(`State '${key}' changed`)
        );
    }
};

export const updateWithoutMutation = (obj, path, val) => {
    return _.setWith(_.clone(obj), path, val, _.clone);
};

// https://davidwalsh.name/javascript-debounce-function
export const debounce = (func, wait, immediate) => {
    var timeout;
    return function () {
        var context = this;
        var args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// https://usehooks.com/useLocalStorage/
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (e) {
            console.log(e);
            return initialValue;
        }
    });

    const setValue = value => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (e) {
            console.log(e);
        }
    }
    return [storedValue, setValue];
}

export const storeCodes = [
    {
        code: 'ean_8',
        label: 'Sainsburys'
    },
    {
        code: 'ean',
        label: 'Aldi'
    }
    // <select onChange={this.changeState} name="decoder_readers">
    //     <option value="code_128">Code 128</option>
    //     <option value="code_39">Code 39</option>
    //     <option value="code_39_vin">Code 39 VIN</option>
    //     <option value="ean">EAN</option>
    //     <option value="ean_extended">EAN-extended</option>
    //     <option value="ean_8">EAN-8</option>
    //     <option value="upc">UPC</option>
    //     <option value="upc_e">UPC-E</option>
    //     <option value="codabar">Codabar</option>
    //     <option value="i2of5">Interleaved 2 of 5</option>
    //     <option value="2of5">Standard 2 of 5</option>
    //     <option value="code_93">Code 93</option>
    // </select>
];
