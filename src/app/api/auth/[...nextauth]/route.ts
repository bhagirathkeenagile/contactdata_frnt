import NextAuth from "next-auth";
import SalesforceProvider from "next-auth/providers/salesforce";
import CredentialsProvider from "next-auth/providers/credentials";
const handler = NextAuth({
  session: {
    strategy: "jwt",
    // maxAge: 60 * 10, // 10 minutes
  },
  providers: [
    // @bhagirath :: TODO Add salesforce provider and remove credentials provider
    SalesforceProvider({
      clientId: process.env.SALESFORCE_CLIENT_ID || "client_id",
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET || "client_secret",
      wellKnown: process.env.SALESFORCE_URL_LOGIN || "well_known",
      idToken: true,
      userinfo: {
        async request({ provider, tokens, client }) {
          if (typeof provider.userinfo === "string") {
            // Handle the case where provider.userinfo is a string
            return await client.userinfo(tokens as any, {
              // You can choose to include some default parameters or handle it differently
            });
          } else if (
            typeof provider.userinfo === "object" &&
            provider.userinfo !== null
          ) {
            // Handle the case where provider.userinfo is an object (UserinfoEndpointHandler)
            return await client.userinfo(tokens as any, {
              params: provider.userinfo.params,
            });
          } else {
            // Handle other cases or throw an error if necessary
            throw new Error("Invalid provider.userinfo type");
          }
        },
      },

      profile(profile) {
        return { id: profile.email, ...profile };
      },
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch("/your/endpoint", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("Sign in 11");
      console.log("user", user);
      console.log("account", account);
      console.log("profile", profile);
      console.log("email", email);
      console.log("credentials", credentials);
      return true;
      // const isAllowedToSignIn = true;
      // if (isAllowedToSignIn) {
      //   console.log("Sign in 11");
      //   return true;
      // } else {
      //   // Return false to display a default error message
      //   console.log("Sign in 00");
      //   return false;
      //   // Or you can return a URL to redirect to:
      //   // return '/unauthorized'
      // }
    },

    // jwt: async ({ token, user }: any) => {
    //   // hit api and get user info
    //   // get salesforce response
    //   console.log("JWT in 11");
    //   const api = await fetch(`${baseUrl}/auth/login`, {
    //     method: "POST",
    //     body: JSON.stringify({
    //       email: user.email,
    //     }),
    //   });
    //   const data = await api.json();

    //   if (data?.token) {
    //     token.userToken = data.token;
    //   } else {
    //     return null;
    //   }

    //   if (user) {
    //     token.id = user.id;
    //     token.name = user.name;
    //     token.email = user.email;
    //   }
    //   return token;
    // },
    // async session({ token, session }) {
    //   if (token) {
    //     session.user.id = token.id;
    //     session.user.name = token.name;
    //     session.user.email = token.email;
    //     session.user.userToken = token.userToken;
    //   }
    //   console.log("Session in 11");
    //   return session;
    // },
  },
  pages: {
    signIn: "/auth/login",
  },
});

export { handler as GET, handler as POST };
