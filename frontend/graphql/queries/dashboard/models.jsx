import gql from "graphql-tag";

const ModelsQuery = gql`
    query {
        models {
            id
            name
            img {
                url
            }
            model {
                url
            }
        }
    }
`;

export default ModelsQuery;