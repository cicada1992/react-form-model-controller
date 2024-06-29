import { Button, Card, Checkbox, Input, Row, Switch } from 'antd';
import { useFormOne } from './model_and_hook';
import DUMMY_API from './api';

const App: React.FC = () => {
  const { Field, controller } = useFormOne();
  const store = controller.useStore();

  return (
    <Card style={{ width: '100vw' }}>
      <Row style={{ paddingTop: 20 }}>
        <Field name="name">
          {({ value, fieldHanlder }) => (
            <>
              <label>name</label>
              <Input value={value} onChange={fieldHanlder} />
            </>
          )}
        </Field>
      </Row>
      <Row style={{ paddingTop: 20 }}>
        <Field name="type">
          {({ value, fieldHanlder }) => (
            <>
              <label>selected type</label>
              <Checkbox
                value="a"
                checked={value.includes('a')}
                onChange={(e) => fieldHanlder(getNextTypes(value, e.target.value))}
              >
                A
              </Checkbox>
              <Checkbox
                value="b"
                checked={value.includes('b')}
                onChange={(e) => fieldHanlder(getNextTypes(value, e.target.value))}
              >
                B
              </Checkbox>
              <Checkbox
                value="c"
                checked={value.includes('c')}
                onChange={(e) => fieldHanlder(getNextTypes(value, e.target.value))}
              >
                C
              </Checkbox>
            </>
          )}
        </Field>
      </Row>
      <Row style={{ paddingTop: 20 }}>
        <label>Has Selected Type</label>
        <Switch
          value={store.values['hasType']}
          disabled
          onChange={(checked) => controller.setValue('hasType', checked)}
        />
      </Row>
      <Row style={{ paddingTop: 20 }}>
        <Button onClick={read}>Get Data</Button>
        <Button onClick={write}>Send Data</Button>
        <Button onClick={controller.undo}>undo</Button>
      </Row>
    </Card>
  );

  async function read() {
    const result = await DUMMY_API.getData();
    controller.read(result);
  }

  function write() {
    const result = controller.write();
    console.log(result); // <--- u can use serialized data;
  }

  function getNextTypes(types: string[], value: string) {
    return types.includes(value) ? types.filter((v) => v !== value) : [...types, value];
  }
};

export default App;
