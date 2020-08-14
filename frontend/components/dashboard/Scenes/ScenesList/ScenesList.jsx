import React from 'react'

import CardScene from "../ScenesItem/ScenesItem";

const ScenesList = ({ items }) => {
    return (
        <>
            {
                items.map((item, key) => {
                    return <CardScene items={ item } key={ key } />
                })
            }
        </>
    )
}

export default React.memo(ScenesList)
