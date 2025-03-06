
import html2canvas from 'html2canvas';

export const downloadMemeAsImage = async (canvasRef: React.RefObject<HTMLDivElement>) => {
  if (!canvasRef.current) {
    console.error("Canvas not ready");
    return;
  }

  try {
    console.log("Starting to generate image");
    
    // Force any SVG elements to render completely before capturing
    // This adds a small delay to ensure SVGs are fully loaded
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const canvas = await html2canvas(canvasRef.current, {
      allowTaint: true,
      useCORS: true,
      logging: true, // Enable logging for debugging
      backgroundColor: null,
      scale: 2, // Higher quality output
      onclone: (document, element) => {
        // This runs before the canvas is generated
        console.log("Preparing to capture image with html2canvas");
        
        // Make sure SVG elements are visible in the clone
        const svgElements = element.querySelectorAll('svg');
        svgElements.forEach(svg => {
          svg.setAttribute('width', '100%');
          svg.setAttribute('height', '100%');
        });
      }
    });

    // Create download link
    const link = document.createElement('a');
    link.download = 'my-creation.png';
    link.href = canvas.toDataURL('image/png');
    console.log("Image generated successfully, downloading");
    link.click();
  } catch (error) {
    console.error("Error generating image:", error);
  }
};
