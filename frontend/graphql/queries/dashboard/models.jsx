import gql from "graphql-tag";

const ModelsQuery = gql`
    query {
        assets {
            id
            name
            img {
                id
                url
            }
            model {
                id
                url
            }
            uv {
                url
            }
        }
    }
`;

export default ModelsQuery;
