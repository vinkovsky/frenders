const getDataReducer = (state, action) => {
    switch (action.type) {
        case 'getData':
        {
            return action.payload;
        }
        default: return state;
    }
}

export default getDataReducer;