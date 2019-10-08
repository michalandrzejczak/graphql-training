function user (parent, args, context) {
    return context.prisma.link({ id: parent.id }).user()
}

function votes (parent, args, context) {
    return context.prisma.link({ id: parent.id }).votes()
}

module.exports = {
    user,
    votes,
};