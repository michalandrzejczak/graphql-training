async function feed(root, args, context, info) {
    const where = args.filter ? {
        OR: [
            {description_contains: args.filter},
            {url_contains: args.filter},
        ],
    } : {};

    return await context.prisma.links({
        where,
    })
}

module.exports = {
    feed,
};