import 'bootstrap/dist/css/bootstrap.min.css';

import { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  return (
    // NOTE on rationale for suppressHydrationWarning:
    //   https://colinhacks.com/essays/building-a-spa-with-nextjs
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : <Component {...pageProps} />}
    </div>
  );
}

export default App;
