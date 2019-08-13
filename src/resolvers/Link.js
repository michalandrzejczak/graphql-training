function user (parent, args, context) {
    return context.prisma.link({ id: parent.id }).user()
}

module.exports = {
    user,
};