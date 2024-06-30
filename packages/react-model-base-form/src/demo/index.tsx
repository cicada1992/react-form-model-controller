import { useFormOne } from './model_and_hook';
import { validateName } from './validator';

const App: React.FC = () => {
  const { Field, controller } = useFormOne();
  const store = controller.useStore();

  return (
    <div style={{ paddingTop: 100, paddingInline: 20 }}>
      <Field name="name" validator={validateName}>
        {({ value, fieldHandler }) => (
          <>
            <label>type</label>
            <input value={value} onChange={fieldHandler} />
          </>
        )}
      </Field>
      <Field name="type">
        {({ value, fieldHandler }) => (
          <>
            <label>amount</label>
            <input value={value} onChange={fieldHandler} />
            <input value={store.values['name']} onChange={(e) => controller.setValue('name', e.target.value)} />
          </>
        )}
      </Field>
      <button onClick={send}>Send</button>
    </div>
  );

  function send() {
    const result = controller.write();
    console.log(result);
  }
};

export default App;
