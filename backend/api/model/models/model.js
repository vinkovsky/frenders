'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    lifecycles: {
        async beforeCreate(data) {
            data.map = [];
            data.roughnessMap = [];
            data.metalnessMap = [];
            data.normalMap = [];
        },
        async beforeUpdate(params, data) {
            if (data.map == null) data.map = [];
            if (data.roughnessMap == null) data.roughnessMap = [];
            if (data.metalnessMap == null) data.metalnessMap = [];
            if (data.normalMap == null) data.normalMap = [];
        },
    },
};
