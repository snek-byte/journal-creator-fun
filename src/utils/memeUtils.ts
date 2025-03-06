
import html2canvas from 'html2canvas';

export const downloadMemeAsImage = async (canvasRef: React.RefObject<HTMLDivElement>) => {
  if (!canvasRef.current) {
    console.error("Canvas not ready");
    return;
  }

  try {
    console.log("Starting to generate image");
    const canvas = await html2canvas(canvasRef.current, {
      allowTaint: true,
      useCORS: true,
      logging: true, // Enable logging for debugging
      backgroundColor: null,
      scale: 2, // Higher quality output
    });

    const link = document.createElement('a');
    link.download = 'my-creation.png';
    link.href = canvas.toDataURL('image/png');
    console.log("Image generated successfully, downloading");
    link.click();
  } catch (error) {
    console.error("Error generating image:", error);
  }
};
