import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.scss';

const container = document.getElementById('root');
const root = createRoot(container!);

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <MantineProvider
        theme={{
          colorScheme: 'dark',
        }}
        withNormalizeCSS
        withGlobalStyles
      >
        <App />
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </BrowserRouter>
  </QueryClientProvider>
);
