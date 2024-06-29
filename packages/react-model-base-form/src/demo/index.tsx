import { useFormOne } from './model_and_hook';

const App: React.FC = () => {
  const { Field, controller } = useFormOne();
  const store = controller.useStore();

  return (
    <div style={{ paddingTop: 100, paddingInline: 20 }}>
      <Field name="name">
        {({ value, fieldHanlder }) => (
          <>
            <label>type</label>
            <input value={value} onChange={fieldHanlder} />
          </>
        )}
      </Field>
      <Field name="type">
        {({ value, fieldHanlder }) => (
          <>
            <label>amount</label>
            <input value={value} onChange={fieldHanlder} />
          </>
        )}
      </Field>
      <input value={store.values['name']} onChange={(e) => controller.setValue('name', e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );

  function send() {
    const result = controller.write();
    console.log(result);
  }
};

export default App;
