import gql from "graphql-tag";

const ModelIdQuery = gql`
    query ModelQuery($id: ID!){
        model(id: $id) {
            name
            model {
                url
            }
            img {
                url
            }
        }
    }
`;

export default ModelIdQuery;
