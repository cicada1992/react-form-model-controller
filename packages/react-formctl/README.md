# react-formctl
defined class model base react form system. (using decorator & reflect-matadata)

## Description
class properties is UI data that has metadata decorator. user can annotated your own decorator.
for now, basically mapper decorator(read, write) is provied for data serializaion and deserialization.
thanks to mapper layer, eventhough server data format have been changing frequently, we can foucs on just data for UI.


## Getting Start
1. Define model
    ```ts
      import { BaseFormController, formHookCreator, Mapper } from 'react-formctl';

      interface ReadResponse {
        name: string;
        age: number;
        cities: string;
      }

      interface WriteResult {
        name: string;
        age: number;
        cities: string;
      }

      class FormOneModel {
        @Mapper.Read<ReadResponse, FormOneModel>((data) => ({ name: data.name }))
        @Mapper.Write<FormOneModel['name'], WriteResult>((v) => ({ name: `serialized!=${v}` }))
        name: string = '';

        @Mapper.Read<ReadResponse, FormOneModel>((data) => ({ age: String(data.age) }))
        @Mapper.Write<FormOneModel['age'], WriteResult>((v) => ({ age: Number(v) }))
        age: string = '';

        @Mapper.Read<ReadResponse, FormOneModel>((data) => ({ cities: data.cities.split(',') }))
        @Mapper.Write<FormOneModel['cities'], WriteResult>((v) => ({ cities: v.join(',') }))
        cities: string[] = [];
      }

      class FormOneController extends BaseFormController<FormOneModel, WriteResult> { }

      export const useFormOne = formHookCreator({
        FormModel: FormOneModel,
        FormController: FormOneController,
      });
    ```

2. Use hook in component.
    ```tsx
    const App: React.FC = () => {
    const { Field, controller } = useFormOne();

      return (
        <Flex align="center" justify="center" style={{ width: '100%', height: '100%' }}>
          <Card
            type="inner"
            title="Form Test"
            style={{ width: '50%' }}
            actions={[
              <Space>
                <Button style={{ width: 150 }} onClick={fetch}>
                  fetch dummy data
                </Button>
                <Button style={{ width: 150 }} onClick={send}>
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
                  {error && <div style={{ position: 'absolute', top: 95 }}>{error}</div>}
                </Flex>
              )}
            </Field>
            <Field name="age" validator={validateAge}>
              {({ value, error, fieldHandler }) => (
                <Flex vertical style={{ paddingTop: 40, position: 'relative' }}>
                  <label>age</label>
                  <InputNumber min="0" max="150" value={value} onChange={fieldHandler} />
                  {error && <div style={{ position: 'absolute', top: 95 }}>{error}</div>}
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
                  {error && <div style={{  position: 'absolute', top: 95 }}>{error}</div>}
                </Flex>
              )}
            </Field>
          </Card>
        </Flex>
      );

      async function fetch() {
        const result = await DUMMY_API.getData();
        controller.read(result); // aplied your data according to data mapper in model class.
      }

      async function send() {
        try {
          const hasError = controller.validateAll();
          if (hasError) throw new Error('please check invalid forms.');
          const result = controller.write();
          console.log({ result }); // <--- u can use serialized data;
          await ModalUtils.info('성공');
        } catch (e: any) {
          await ModalUtils.error(e.message);
        }
      }
    };

    export default App;
    ```