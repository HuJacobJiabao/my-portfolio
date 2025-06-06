import mermaid from 'mermaid';

let isInitialized = false;

export const initializeMermaid = (): void => {
  if (isInitialized) return;
  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: '"Source Code Pro", monospace',
      fontSize: 14,
      flowchart: {
        htmlLabels: true,
        curve: 'linear',
      },
    });
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize mermaid:', error);
  }
};

const downloadSvg = (svgContent: string, filename: string): void => {
  try {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading SVG:', error);
  }
};

export const renderMermaidDiagrams = async (): Promise<void> => {
  initializeMermaid();
  const mermaidContainers = document.querySelectorAll('.mermaid-container');

  for (const container of mermaidContainers) {
    const diagramDiv = container.querySelector('.mermaid-diagram') as HTMLElement;
    const loadingDiv = container.querySelector('.mermaid-loading') as HTMLElement;
    const mermaidPre = container.querySelector('pre.mermaid') as HTMLPreElement;



    if (!diagramDiv || !loadingDiv || !mermaidPre) {
      if (loadingDiv) loadingDiv.textContent = 'Error: Invalid container structure.';
      continue;
    }

    const id = diagramDiv.id;
    const code = mermaidPre.textContent?.trim();

    if (!code) {
      loadingDiv.textContent = 'Empty diagram code.';
      continue;
    }

    try {
      const { svg, bindFunctions } = await mermaid.render(id, code);
      
      console.log(`✅ SVG generated for ${id}`);

      // Clear the container
      diagramDiv.innerHTML = '';
      
      // Create a temporary container to parse the SVG string
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = svg;
      const svgElement = tempDiv.querySelector('svg');

      // Create wrapper div with mermaid-diagram class for proper CSS targeting
      const wrapper = document.createElement('div');
      wrapper.className = 'mermaid-diagram';
      
      if (svgElement) {
        // Extract viewBox dimensions and set explicit width/height
        const viewBox = svgElement.getAttribute('viewBox');
        if (viewBox) {
          const [x, y, width, height] = viewBox.split(' ').map(Number);
          console.log(`📐 ViewBox dimensions for ${id}:`, { x, y, width, height });
          
          // Set explicit dimensions based on viewBox
          svgElement.setAttribute('width', width.toString());
          svgElement.setAttribute('height', height.toString());
        } else {
          // Fallback: set default dimensions if no viewBox
          console.log(`⚠️ No viewBox found for ${id}, using default dimensions`);
          svgElement.setAttribute('width', '800');
          svgElement.setAttribute('height', '600');
        }
        
        // Create SVG container div
        const svgContainer = document.createElement('div');
        svgContainer.className = 'mermaid-svg-container';
        svgContainer.style.position = 'relative'; // Make it positioning context for button
        
        // Set container width to match SVG width
        const svgWidth = svgElement.getAttribute('width') || '800';
        const width = svgWidth + 'px';
        svgContainer.style.width = width;
        svgContainer.style.maxWidth = '100%'; // Ensure it doesn't overflow on mobile
        
        // Create download button positioned on top right of SVG
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'mermaid-download-btn';
        downloadBtn.title = 'Download diagram as SVG';
        downloadBtn.setAttribute('aria-label', 'Download SVG');
        
        // Add Bootstrap download SVG icon with simpler HTML (no whitespace issues)
        downloadBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/></svg>';
        
        downloadBtn.addEventListener('click', () => {
          downloadSvg(svg, `${id || 'mermaid-diagram'}.svg`);
        });
        
        // Add SVG to container
        svgContainer.appendChild(svgElement);
        
        // Add button directly to SVG container
        svgContainer.appendChild(downloadBtn);
        
        // Add SVG container to wrapper
        wrapper.appendChild(svgContainer);
        
        // Then append the wrapper to the container
        container.appendChild(wrapper);
        console.log(`✅ SVG wrapper with banner appended to container for ${id}`);

        svgElement.style.display = 'block';
        svgElement.style.visibility = 'visible';
        svgElement.style.opacity = '1';
        svgElement.style.maxWidth = '100%';
        svgElement.style.height = 'auto';
      }

      // Apply bindFunctions to the SVG container since SVG is now there
      if (bindFunctions) {
        const svgContainer = wrapper.querySelector('.mermaid-svg-container');
        if (svgContainer) bindFunctions(svgContainer);
      }
      loadingDiv.style.display = 'none';
    } catch (error: any) {
      console.error(`Error rendering diagram ${id}:`, error);
      loadingDiv.textContent = `Failed to render diagram: ${error.message || 'Unknown error'}`;
      loadingDiv.style.color = 'red';
      diagramDiv.innerHTML = `<pre class="mermaid-error-details">${error.stack || error.message}</pre>`;
    }
  }
};
    