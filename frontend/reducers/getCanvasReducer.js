const getCanvasReducer = (state, action) => {
    switch (action.type) {
        case 'getCanvas':
        {
            return action.payload;
        }
        default: return state;
    }
}

export default getCanvasReducer;