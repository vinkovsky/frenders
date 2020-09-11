const getActiveCanvasObjectsReducer = (state, action) => {
    switch (action.type) {
        case 'getActiveCanvasObjects': {
            return action.payload;
        }
        default: return state;
    }
}

export default getActiveCanvasObjectsReducer;
