const getCurrentObjectReducer = (state, action) => {
    switch (action.type) {
        case 'getCurrentObject': {
            return action.payload;
        }
        default: return state;
    }
}

export default getCurrentObjectReducer;