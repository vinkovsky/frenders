const getColorReducer = (state, action) => {
    switch (action.type) {
        case 'getColor': {
            return action.payload;
        }
        default: return state;
    }
}

export default getColorReducer;