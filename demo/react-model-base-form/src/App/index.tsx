import { Button, Card, Checkbox, Input, Row, Switch } from 'antd';
import { useFormOne } from './model_and_hook';
import DUMMY_API from './api';
import { validateName, validateType } from './validator';

const App: React.FC = () => {
  const { Field, controller } = useFormOne();

  return (
    <Card style={{ width: '100vw' }}>
      <Row style={{ paddingTop: 20 }}>
        <Field name="name" validator={validateName} validateOnMount>
          {({ value, error, fieldHandler }) => (
            <>
              <label>name</label>
              <Input value={value} onChange={fieldHandler} />
              {error && <div style={{ color: 'red' }}>{error}</div>}
            </>
          )}
        </Field>
      </Row>
      <div>
        <Field name="type" validator={validateType} refValues={['hasType']}>
          {({ value, error, values, fieldHandler, getFieldHandler }) => (
            <>
              <Row style={{ marginTop: 20 }}>
                <label>selected type</label>
                <Checkbox
                  value="a"
                  checked={value.includes('a')}
                  onChange={(e) => {
                    const nextValue = getNextTypes(value, e.target.value);
                    fieldHandler(nextValue);
                    getFieldHandler('hasType')(Boolean(nextValue.length));
                  }}
                >
                  A
                </Checkbox>
                <Checkbox
                  value="b"
                  checked={value.includes('b')}
                  onChange={(e) => {
                    const nextValue = getNextTypes(value, e.target.value);
                    fieldHandler(nextValue);
                    getFieldHandler('hasType')(Boolean(nextValue.length));
                  }}
                >
                  B
                </Checkbox>
              </Row>
              {error && <div style={{ color: 'red' }}>{error}</div>}
              <Row style={{ marginTop: 20 }}>
                <label>Has Selected Type</label>
                <Switch value={values.hasType} disabled />
              </Row>
            </>
          )}
        </Field>
      </div>
      <Row style={{ paddingTop: 40 }}>
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
    return types.includes(value) ? types.filter((type) => type !== value) : [...types, value];
  }
};

export default App;
