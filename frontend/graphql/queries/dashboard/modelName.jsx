import gql from "graphql-tag";

const ModelNameQuery = gql`
    query($id: ID!){
        model(id: $id) {
            name
        }
    }
`;

export default ModelNameQuery;
