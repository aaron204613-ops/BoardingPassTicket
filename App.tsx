import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { BoardingPassData, INITIAL_DATA } from './types';
import { ControlPanel } from './components/ControlPanel';
import { BoardingPass } from './components/BoardingPass';
import { Printer } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<BoardingPassData>(INITIAL_DATA);
  const [isDownloading, setIsDownloading] = useState(false);
  // Ref for the visible preview (scaled)
  const previewRef = useRef<HTMLDivElement>(null);
  // Ref for the off-screen export version (unscaled)
  const exportRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (key: keyof BoardingPassData, value: string) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDownload = async () => {
    // Capture the exportRef which is not scaled via CSS transform
    if (!exportRef.current) return;

    setIsDownloading(true);
    try {
      // Small delay to ensure render updates if any
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(exportRef.current, {
        scale: 2, // High resolution
        backgroundColor: null, 
        logging: false,
        useCORS: true,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `BoardingPass-${data.name.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to generate boarding pass image.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-slate-800">
      
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 rounded-md p-1.5">
               <Printer className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">RedSky <span className="text-red-600">Pass</span></h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Create. Preview. Fly.
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Panel: Inputs */}
          <div className="w-full lg:w-1/3 flex-shrink-0">
             <ControlPanel 
                data={data} 
                onChange={handleInputChange} 
                onDownload={handleDownload}
                isDownloading={isDownloading}
             />
          </div>

          {/* Right Panel: Preview */}
          <div className="w-full lg:w-2/3 flex flex-col items-center">
            
            <div className="bg-gray-200/50 rounded-2xl p-4 sm:p-8 w-full border border-gray-300/50 flex flex-col items-center justify-center overflow-x-auto min-h-[500px]">
               <div className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live Preview
               </div>
               
               {/* The Visible Preview Component (Scaled via CSS) */}
               <div className="transform scale-[0.6] sm:scale-[0.75] md:scale-[0.85] lg:scale-100 transition-transform duration-300 origin-center">
                  <BoardingPass ref={previewRef} data={data} />
               </div>

               <p className="mt-8 text-xs text-gray-400 text-center max-w-md">
                 Preview scale may vary based on screen size. The downloaded file will be high resolution (1800x760px).
               </p>
            </div>

          </div>
        </div>
      </main>

      {/* Hidden Export Component - Rendered at 1:1 scale off-screen for perfect html2canvas capture */}
      <div className="fixed top-0 left-0 pointer-events-none opacity-0 overflow-hidden" style={{ zIndex: -1 }}>
         <div className="p-10"> {/* Extra padding to ensure no cropping during rasterization */}
            <BoardingPass ref={exportRef} data={data} />
         </div>
      </div>

       <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} RedSky Boarding Pass Generator. Designed for aesthetics.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default App;