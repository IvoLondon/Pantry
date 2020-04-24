import _ from 'lodash/fp';

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
