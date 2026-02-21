import { useState, useRef } from 'react';
import './CodeRunner.css';

export function CodeRunner({ code }) {
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const iframeRef = useRef(null);

    function runCode() {
        setIsRunning(true);
        setOutput(null);

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.sandbox = 'allow-scripts';

        const html = `
      <html><body><script>
        const logs = [];
        const origLog = console.log;
        console.log = (...args) => logs.push(args.map(a => 
          typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
        ).join(' '));
        console.error = console.log;
        console.warn = console.log;
        try {
          const result = (function() { ${code} })();
          if (result !== undefined) logs.push(String(result));
          parent.postMessage({ type: 'code-result', logs, error: null }, '*');
        } catch(e) {
          parent.postMessage({ type: 'code-result', logs, error: e.message }, '*');
        }
      </script></body></html>
    `;

        function handleMessage(event) {
            if (event.data?.type === 'code-result') {
                const { logs, error } = event.data;
                let result = logs.join('\n');
                if (error) result += (result ? '\n' : '') + '❌ ' + error;
                setOutput(result || '(no output)');
                setIsRunning(false);
                window.removeEventListener('message', handleMessage);
                iframe.remove();
            }
        }

        window.addEventListener('message', handleMessage);
        document.body.appendChild(iframe);
        iframe.srcdoc = html;

        // Timeout fallback
        setTimeout(() => {
            if (isRunning) {
                setOutput('⏱️ Execution timed out');
                setIsRunning(false);
                window.removeEventListener('message', handleMessage);
                iframe.remove();
            }
        }, 5000);
    }

    return (
        <div className="code-runner">
            <button className="code-run-btn" onClick={runCode} disabled={isRunning}>
                {isRunning ? '⏳ Running...' : '▶ Run'}
            </button>
            {output !== null && (
                <pre className="code-output">{output}</pre>
            )}
        </div>
    );
}
