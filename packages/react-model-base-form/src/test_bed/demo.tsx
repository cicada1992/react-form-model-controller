import { useFormOne } from './model_and_hook';
import DUMMY_API from './api';
import { validateName } from './validator';

const App: React.FC = () => {
  const { Field, controller } = useFormOne();

  return (
    <section style={{ width: '100vw' }}>
      <div style={{ paddingTop: 20 }}>
        <Field name="name" validator={validateName} validateOnMount>
          {({ value, error, fieldHandler }) => (
            <>
              <label>name</label>
              <input value={value} onChange={fieldHandler} />
              {error && <div style={{ color: 'red' }}>{error}</div>}
            </>
          )}
        </Field>
      </div>
      <div style={{ paddingTop: 20 }}>
        <Field name="hobby">
          {({ value, error, fieldHandler }) => (
            <>
              <label>hobby</label>
              <input value={value} onChange={fieldHandler} />
              {error && <div style={{ color: 'red' }}>{error}</div>}
            </>
          )}
        </Field>
      </div>

      <div style={{ paddingTop: 40 }}>
        <button onClick={read}>Get Data</button>
        <button onClick={write}>Send Data</button>
        <button onClick={controller.undo}>undo</button>
      </div>
    </section>
  );

  async function read() {
    const result = await DUMMY_API.getData();
    controller.read(result);
  }

  function write() {
    const result = controller.write();
    console.log(result); // <--- u can use serialized data;
  }
};

export default App;
