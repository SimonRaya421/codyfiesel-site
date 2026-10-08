import Header from './Header';
import Footer from './Footer';

export default function LayoutFrame({ children }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: 'calc(100vh - 96px)', paddingTop: '96px' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
