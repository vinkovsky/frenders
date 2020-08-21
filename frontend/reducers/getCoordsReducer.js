const getCoordsReducer = (state, action) => {
    switch (action.type) {
        case 'getCoords': {
            return action.payload;
        }
        default: return state;
    }
}

export default getCoordsReducer;