import React, { useEffect, useState } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import './App.css';


function App() {
  const [value, setValue] = useState(new Date());
  const [serverValue, setServerValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);
    const serverInterval = setInterval(() => 
      // Note the below has CORS allow set to global (demo ONLY!) via Istio config
      fetch(process.env["REST_API_URL"] || "https://time.shared.12factor.xyz/time",{
        method: "GET",
        headers: {
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        }
      })
      .then(response => response.json())
      .then(result => {
        setServerValue(new Date(result.time * 1000));
      })
      .catch(e => {
        console.log(e);
      }), 5000
    );

    return () => {
      clearInterval(interval);
      clearInterval(serverInterval);
    };
  }, []);

  return (
    <div className="App">
        <div>
          <p>Current browser time:</p>
          <div><center><Clock value={value} /></center></div>
        </div>
        <div>
          <p>Current server time:</p>
          <div><center><Clock value={serverValue} /></center></div>
        </div>
        <div>
          See 
          <a
            className="App-link"
            href = "https://www.youtube.com/c/adamfowleruk"
            target="_blank"
            rel="noopener noreferrer"
          >
            Adam Fowler's Developer Experience series on YouTube!
          </a> or
          <a
            className="App-link"
            href = "https://github.com/adamfowleruk/demo-reactjs-time-ui"
            target="_blank"
            rel="noopener noreferrer"
          > View the code on GitHub </a>
        </div>
    </div>
  );
}

export default App;
