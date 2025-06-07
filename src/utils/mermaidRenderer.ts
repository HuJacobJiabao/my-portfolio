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
  
  // Clean up any orphaned divs from previous failed renders
  cleanupOrphanedMermaidDivs();
  
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

    // Clean up any existing orphaned div from previous failed renders
    document.getElementById(`d${id}`)?.remove();

    if (!code) {
      loadingDiv.textContent = 'Empty diagram code.';
      continue;
    }

    try {
      const { svg, bindFunctions } = await mermaid.render(id, code);
      
      // Remove Mermaid's automatically inserted div to prevent "Syntax error in text" artifacts
      document.getElementById(`d${id}`)?.remove();
      
      console.log(`✅ SVG generated for ${id}`);

      // Clear the diagram container and hide the original code
      diagramDiv.innerHTML = '';
      mermaidPre.style.display = 'none'; // Hide the original code block
      
      // Create a temporary container to parse the SVG string
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = svg;
      const svgElement = tempDiv.querySelector('svg');
      
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
        
        // Add SVG container to diagram div
        diagramDiv.appendChild(svgContainer);
        
        console.log(`✅ SVG container appended to diagram div for ${id}`);

        svgElement.style.display = 'block';
        svgElement.style.visibility = 'visible';
        svgElement.style.opacity = '1';
        svgElement.style.maxWidth = '100%';
        svgElement.style.height = 'auto';
      }

      // Apply bindFunctions to the SVG container since SVG is now there
      if (bindFunctions) {
        const svgContainer = diagramDiv.querySelector('.mermaid-svg-container');
        if (svgContainer) bindFunctions(svgContainer);
      }
      loadingDiv.style.display = 'none';
    } catch (error: any) {
      // CRITICAL: Remove Mermaid's automatically inserted div even on error
      document.getElementById(`d${id}`)?.remove();
      
      console.error(`❌ Error rendering diagram ${id}:`, error);
      console.error(`📝 Diagram code that failed:`, code);
      
      // Provide better error messages based on error type
      let errorMessage = 'Failed to render diagram';
      if (error.message) {
        if (error.message.includes('Parse error') || error.message.includes('Syntax error')) {
          errorMessage = 'Syntax error in diagram';
        } else if (error.message.includes('Lexical error')) {
          errorMessage = 'Invalid diagram syntax';
        } else {
          errorMessage = `Render error: ${error.message}`;
        }
      }
      
      // Clear the diagram div completely first
      diagramDiv.innerHTML = '';
      
      // Update loading message
      loadingDiv.textContent = errorMessage;
      loadingDiv.style.color = 'red';
      loadingDiv.style.display = 'block';
      
      // Create error details safely using DOM methods instead of innerHTML
      const errorContainer = document.createElement('div');
      errorContainer.className = 'mermaid-error-details';
      errorContainer.style.cssText = `
        background: #fff5f5;
        border: 1px solid #fed7d7;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
        color: #c53030;
      `;
      
      const errorTitle = document.createElement('p');
      errorTitle.innerHTML = `<strong>Error:</strong> ${errorMessage}`;
      errorContainer.appendChild(errorTitle);
      
      const detailsElement = document.createElement('details');
      const summaryElement = document.createElement('summary');
      summaryElement.textContent = 'Show diagram code';
      summaryElement.style.cursor = 'pointer';
      
      const codeElement = document.createElement('pre');
      codeElement.textContent = code; // Use textContent to prevent any script injection
      codeElement.style.cssText = `
        background: #f5f5f5;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
        margin-top: 0.5rem;
        font-family: monospace;
        white-space: pre-wrap;
      `;
      
      detailsElement.appendChild(summaryElement);
      detailsElement.appendChild(codeElement);
      errorContainer.appendChild(detailsElement);
      
      // Safely append to diagram div
      diagramDiv.appendChild(errorContainer);
    }
  }
};

// Clean up any orphaned Mermaid divs that may have been left behind
export const cleanupOrphanedMermaidDivs = (): void => {
  // Find all elements with IDs starting with 'd' that might be orphaned Mermaid divs
  const allElements = document.querySelectorAll('[id^="d"]');
  
  allElements.forEach((element) => {
    const id = element.id;
    // Check if this looks like a Mermaid-generated div (starts with 'd' followed by our diagram IDs)
    if (id.match(/^d(flowchart|sequence|class|state|er|journey|error|syntax|extreme|complex)-/)) {
      console.log(`🧹 Cleaning up orphaned Mermaid div: ${id}`);
      element.remove();
    }
  });
};
