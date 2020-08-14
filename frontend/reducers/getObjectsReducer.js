const getObjectsReducer = (state, action) => {
    switch (action.type) {
        case 'getObjects': {
            return action.payload;
        }
        default: return state;
    }
}

export default getObjectsReducer;