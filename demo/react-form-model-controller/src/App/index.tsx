import { Button, Card, Flex, Input, InputNumber, Select, Space } from 'antd';
import { useFormOne } from './model_and_hook';
import DUMMY_API from './api';
import { validateAge, validateName, validateCities } from './validator';
import { ModalUtils } from './ModalUtils';

const App: React.FC = () => {
  const { Field, controller } = useFormOne();

  return (
    <Flex align="center" justify="center" style={{ width: '100%', height: '100%' }}>
      <Card
        type="inner"
        title="Form Test"
        style={{ width: 700 }}
        actions={[
          <Space>
            <Button style={{ width: 150 }} onClick={read}>
              fetch dummy data
            </Button>
            <Button style={{ width: 150 }} onClick={write}>
              send writted data
            </Button>
            <Button style={{ width: 150 }} onClick={controller.undo}>
              undo
            </Button>
            <Button style={{ width: 150 }} onClick={controller.reset}>
              reset forms
            </Button>
          </Space>,
        ]}
      >
        <Field name="name" validator={validateName}>
          {({ value, error, fieldHandler }) => (
            <Flex vertical style={{ paddingTop: 40, position: 'relative' }}>
              <label>name</label>
              <Input value={value} onChange={fieldHandler} />
              {error && <div style={{ color: 'red', position: 'absolute', top: 95 }}>{error}</div>}
            </Flex>
          )}
        </Field>
        <Field name="age" validator={validateAge}>
          {({ value, error, fieldHandler }) => (
            <Flex vertical style={{ paddingTop: 40, position: 'relative' }}>
              <label>age</label>
              <InputNumber min="0" max="150" value={value} onChange={fieldHandler} />
              {error && <div style={{ color: 'red', position: 'absolute', top: 95 }}>{error}</div>}
            </Flex>
          )}
        </Field>
        <Field name="cities" validator={validateCities}>
          {({ value, error, fieldHandler }) => (
            <Flex vertical style={{ paddingTop: 40, paddingBottom: 40, position: 'relative' }}>
              <label>cities</label>
              <Select
                value={value}
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="select one country"
                onChange={fieldHandler}
                options={['seoul', 'daejeon', 'sejong'].map((nation) => ({
                  label: nation,
                  value: nation,
                }))}
              />
              {error && <div style={{ color: 'red', position: 'absolute', top: 95 }}>{error}</div>}
            </Flex>
          )}
        </Field>
      </Card>
    </Flex>
  );

  async function read() {
    const result = await DUMMY_API.getData();
    controller.read(result);
  }

  async function write() {
    try {
      const hasError = controller.validateAll();
      if (hasError) throw new Error('please check invalid forms.');
      const result = controller.write();
      console.log({ result }); // <--- u can use serialized data;
      await ModalUtils.info('success. plz check console.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      await ModalUtils.error(e.message);
    }
  }
};

export default App;
