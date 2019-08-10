require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

let links = [{
    id: 'link-0',
    url: 'www.google.com',
    description: 'whateva',
}];

let idCount = links.length;
const resolvers = {
    Query: {
        info: () => 'Api working',
        feed: (root, args, context, info) => {
            return context.prisma.links()
        },
        link: (parent, args) => links.find(link => args.id === link.id),
    },
    Mutation: {
        post: (root, args, context) => {
            return context.prisma.createLink({
                url: args.url,
                description: args.description,
            })
        }
    },
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { prisma },
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
