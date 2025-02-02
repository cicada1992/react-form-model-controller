import { Button, Card, Flex, Image, Input, Select, Table, TableProps } from 'antd';
import { useFormOne } from './model_and_hook';
import DUMMY_API from './api';
import { validateAge, validateName, validateCities } from './validator';
import { ModalUtils } from './ModalUtils';
import NameFixer from './NameFixer';

interface DemoAction {
  name: string;
  desc: string;
  action(...args: unknown[]): void;
}


const App: React.FC = () => {
  const { Field, controller } = useFormOne();

  const columns: TableProps<DemoAction>['columns'] = [
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button size="middle" onClick={record.action}>
          {record.name}
        </Button>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      key: 'desc',
    },

  ];

  const data: DemoAction[] = [
    {
      name: 'Read data',
      desc: 'The data received from the server is internally converted to form model data through "controller.read" interface. During this process, the conversion logic uses @Mapper.read.',
      action: read,
    },
    {
      name: 'Write data',
      desc: 'Form model data is internally converted to server data through "controller.write" interface. During this process, the conversion logic uses @Mapper.write.',
      action: write,
    },
    {
      name: 'Undo',
      desc: 'Operates through the "controller.undo" interface, reverting changes manually entered by the user. (This excludes setValues updates. e.g. performed through the "controller.read")',
      action: controller.undo,
    },
    {
      name: 'Reset',
      desc: 'Reset your form data including errors.',
      action: controller.reset,
    },
  ];

  return (
    <>
      <NameFixer />
      <Flex align="center" justify="center" style={{ width: '100%', minWidth: 1300, height: '100%' }} gap={16}>
        <Flex vertical align="center" justify="center" gap={8} style={{ minWidth: 600, width: 600, marginTop: 38, }}>
          <Card type="inner" title="Forms" style={{ width: '100%' }}>
            <Flex vertical gap={30}>
              <Field name="name" validator={validateName}>
                {({ value, error, fieldHandler }) => (
                  <Flex vertical style={{ position: 'relative' }}>
                    <label>name</label>
                    <Input value={value} onChange={fieldHandler} />
                    {error && <div style={{ color: 'red', position: 'absolute', top: 55 }}>{error}</div>}
                  </Flex>
                )}
              </Field>
              <Field name="age" validator={validateAge}>
                {({ value, error, fieldHandler }) => (
                  <Flex vertical style={{ position: 'relative' }}>
                    <label>age</label>
                    <Input value={value} onChange={fieldHandler} />
                    {error && <div style={{ color: 'red', position: 'absolute', top: 55 }}>{error}</div>}
                  </Flex>
                )}
              </Field>
              <Field name="cities" validator={validateCities}>
                {({ value, error, fieldHandler }) => (
                  <Flex vertical style={{ position: 'relative', paddingBottom: 20 }}>
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
                    {error && <div style={{ color: 'red', position: 'absolute', top: 55 }}>{error}</div>}
                  </Flex>
                )}
              </Field>
            </Flex>
          </Card>
          <Table columns={columns} dataSource={data} pagination={false} rowKey={(a) => a.name} />;
        </Flex>
        <Image
          src="https://github.com/cicada1992/react-form-model-controller/raw/main/assets/model-basic.png"
          style={{ minWidth: 650 }}
          height={750}
        />
      </Flex>
    </>
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
