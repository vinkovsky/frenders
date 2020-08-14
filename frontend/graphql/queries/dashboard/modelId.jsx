import gql from "graphql-tag";

const ModelIdQuery = gql`
    query ModelQuery($id: ID!){
        model(id: $id) {
            model {
                url
            }
        }
    }
`;

export default ModelIdQuery;