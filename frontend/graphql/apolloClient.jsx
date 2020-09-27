import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { withData } from "next-apollo";

const LOCAL_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337"
const HEROKU_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://frenders-api.herokuapp.com"

const config = {
    link: new HttpLink({
        uri: `${ HEROKU_API_URL }/graphql`,
        //uri: `http://192.168.0.15:1337/graphql`,
        credentials: 'same-origin'
    }),
    cache: new InMemoryCache({}),
    onError: e => console.log(e)
};

export default withData(config);
