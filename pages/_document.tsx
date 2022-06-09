import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }
    render() {
        return (
            <Html>
                <Head>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                    <script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id==UA-183649821-6`}
                    />

                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'UA-183649821-6', {
                            page_path: window.location.pathname,
                            });
                        `,
                        }}
                    />
                    <meta property="og:image" content="/images/mgh_logo.png" />
                    <meta property="og:image:type" content="image/png" />
                    <meta property="og:image:width" content="2664" />
                    <meta property="og:image:height" content="2664" />
                    <meta name="robots" content="noodp,noydir" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument