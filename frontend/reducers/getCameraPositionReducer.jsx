const getCameraPositionReducer = (state, action) => {
    switch (action.type) {
        case 'getCamera': {
            return action.payload;
        }
        default: return state;
    }
}

export default getCameraPositionReducer;