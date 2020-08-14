const getRendererReducer = (state, action) => {
    switch (action.type) {
        case 'getRenderer':
        {
            return action.payload;
        }
        default: return state;
    }
}

export default getRendererReducer;