import gql from "graphql-tag";

const SavedModelsQuery = gql`
    query($id: ID!){
        user(id: $id) {
            id
            models {
                id
                name
                model {
                    url
                }
                img {
                    url
                }
            }
        }
    }
`;

export default SavedModelsQuery;
