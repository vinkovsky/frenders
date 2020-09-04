// 'use strict';
//
// /**
//  * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
//  * to customize this controller
//  */
//
// module.exports = {};

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
    // async create(ctx) {
    //     let entity;
    //
    //     if (ctx.is('multipart')) {
    //         const { data, files } = parseMultipartData(ctx);
    //         data.user = ctx.state.user.id;
    //         entity = await strapi.services.model.create(data, { files });
    //     } else {
    //         ctx.request.body.user = ctx.state.user.id;
    //         entity = await strapi.services.model.create(ctx.request.body);
    //     }
    //     return sanitizeEntity(entity, { model: strapi.models.model });
    // },



    // async findOne(ctx) {
    //     const { id } = ctx.params;
    //
    //     const entity = await strapi.services.model.findOne({ id, 'user.id': ctx.state.user.id });
    //
    //     if (!entity) {
    //         return ctx.unauthorized(`Вы не зарегистрированы`);
    //     }
    //
    //     return sanitizeEntity(entity, { model: strapi.models.model });
    // },

    // async create(ctx) {
    //     let entity;
    //
    //     if (ctx.is('multipart')) {
    //         const { data, files } = parseMultipartData(ctx);
    //         data.user = ctx.state.user.id;
    //         entity = await strapi.services.model.create(data, { files });
    //     } else {
    //         ctx.request.body.user = ctx.state.user.id;
    //         entity = await strapi.services.model.create(ctx.request.body);
    //     }
    //     return sanitizeEntity(entity, { model: strapi.models.model });
    // },
    // async update(ctx) {
    //     const { id } = ctx.params;
    //
    //     let entity;
    //
    //     const [model] = await strapi.services.model.find({
    //         id: ctx.params.id,
    //         'user.id': ctx.state.user.id,
    //     });
    //
    //     if (!model) {
    //         return ctx.unauthorized(`You can't update this entry`);
    //     }
    //
    //     if (ctx.is('multipart')) {
    //         const { data, files } = parseMultipartData(ctx);
    //         entity = await strapi.services.model.update({ id }, data, {
    //             files,
    //         });
    //     } else {
    //         entity = await strapi.services.model.update({ id }, ctx.request.body);
    //     }
    //
    //     return sanitizeEntity(entity, { model: strapi.models.model });
    // },
    // async find(ctx) {
    //     let entities;
    //
    //     if (ctx.query._q) {
    //         entities = await strapi.services.model.search({
    //             ...ctx.query,
    //             'user.id': ctx.state.user.id
    //         });
    //     } else {
    //         entities = await strapi.services.model.find({
    //             ...ctx.query,
    //             'user.id': ctx.state.user.id
    //         });
    //     }
    //
    //     return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.model }));
    //
    // },
    // count(ctx) {
    //     if (ctx.query._q) {
    //         return strapi.services.model.countSearch({
    //             ...ctx.query,
    //             "user.id": ctx.state.user.id,
    //         });
    //     }
    //     return strapi.services.model.count({
    //         ...ctx.query,
    //         "user.id": ctx.state.user.id,
    //     });
    // },
    // async delete(ctx) {
    //     const [model] = await strapi.services.model.find({
    //         id: ctx.params.id,
    //         "user.id": ctx.state.user.id,
    //     });
    //
    //     if (!model) {
    //         return ctx.unauthorized(`You can't delete this entry`);
    //     }
    //
    //     let entity = await strapi.services.model.delete({ id: ctx.params.id });
    //     return sanitizeEntity(entity, { model: strapi.models.model });
    // }
};
