import './App.css';
import Accordion from 'components/ui/Accordion/Accordion'
import lorem from '_data/lorem.json';

function App() {
  return (
    <div className="App">
      <div className={`container`}>
        <div className={`content`}>
          
          {/* Example composed by JSON */}
          {/* <Accordion title="An accordion" data={lorem} /> */}

          {/* Example composed by children */}
          <Accordion title="An accordion">
            {lorem.map((l,i) => 
              <div key={i} header={l.header}>
                {l.details.map((d, i) => 
                <p key={i}>{d}</p>
                )}
              </div>
            )}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default App;
