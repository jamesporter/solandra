import Document, { Html, Head, Main, NextScript } from "next/document"
import { themeScript } from "../src/theme"

class MyDocument extends Document {
  render() {
    return (
      <Html suppressHydrationWarning>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          {/* Applies the remembered theme before the first paint. */}
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
