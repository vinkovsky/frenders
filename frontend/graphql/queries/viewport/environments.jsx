import gql from "graphql-tag";

const EnvironmentsQuery = gql`
    query {
        environments {
            name
            file {
                url
            }
        }
    }
`;

export default EnvironmentsQuery;