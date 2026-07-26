import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen flex items-center justify-center bg-bg">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-text-primary mb-4">
                  KolaborAksi
                </h1>
                <p className="text-lg text-text-secondary">
                  Platform Volunteering &amp; Organisasi Kemahasiswaan
                </p>
                <div className="mt-8 flex gap-4 justify-center">
                  <button className="bg-primary text-white px-5 py-3 rounded-md font-medium hover:bg-primary-hover transition-colors duration-150 cursor-pointer">
                    Jelajahi Event
                  </button>
                  <button className="border border-border text-text-primary px-5 py-3 rounded-md font-medium bg-transparent hover:bg-bg transition-colors duration-150 cursor-pointer">
                    Masuk
                  </button>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
