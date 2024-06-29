import { Button, Input, Row } from 'antd';
import { useFormOne } from './model_and_hook';

const App: React.FC = () => {
  const { Field, controller } = useFormOne();
  const store = controller.useStore()

  return (
    <Row style={{ paddingTop: 100, paddingInline: 20 }}>
      <Field name="name">
        {({ value, fieldHanlder }) => (
          <>
            <label>type</label>
            <Input value={value} onChange={fieldHanlder} />
          </>
        )}
      </Field>
      <Field name="type">
        {({ value, fieldHanlder }) => (
          <>
            <label>amount</label>
            <Input value={value} onChange={fieldHanlder} />
          </>
        )}
      </Field>
      <Input value={store.values['name']} onChange={(e) => controller.setValue('name', e.target.value)} />
      <Button onClick={send}>Send</Button>
      <Button onClick={controller.undo}>undo</Button>
    </Row>
  );

  function send() {
    const result = controller.write();
    console.log(result); // <--- u can use serialized data;
  }
};

export default App;
