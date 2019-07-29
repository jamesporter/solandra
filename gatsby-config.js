module.exports = {
  siteMetadata: {
    title: `Solandra. A framework for algorithmic art.`,
    description: `A framework for algorithmic art. TypeScript first. Make drawing concepts part of framework. Make APIs for humans.`,
    author: `@complexview`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [require("tailwindcss")],
      },
    },
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Solandra. A Framework for Algorithmic Art.`,
        short_name: `Solandra`,
        start_url: `/`,
        background_color: `#e2e8f0`,
        theme_color: `#3182ce`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-offline`,
  ],
}
