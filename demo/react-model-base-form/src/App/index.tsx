import { Button, Input, Row } from 'antd';
import { useFormOne } from './model_and_hook';

const App: React.FC = () => {
  const { Field, controller } = useFormOne();
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
      <Button onClick={send}>Send</Button>
    </Row>
  );

  function send() {
    const result = controller.write();
    console.log(result); // <--- u can use serialized data;
  }
};

export default App;
