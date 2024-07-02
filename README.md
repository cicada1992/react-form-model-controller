# @hyj/react-formctl
defined class model base react form system. (using decorator & reflect-matadata)

## Description
class properties is UI data that has metadata decorator. user can annotated your own decorator.
for now, basically mapper decorator(read, write) is provied for data serializaion and deserialization.
thanks to mapper layer, eventhough server data format have been changing frequently, we can foucs on just data for UI.

## Why use @hyj/react-formctl?

#### Fully Supported TypeScript
- Our form system is built with full TypeScript support, ensuring that you can take full advantage of IDE assistance. This means better code completion, error detection, and overall productivity enhancements as you build your forms.

#### Seamless Server Communication
- Say goodbye to the headaches of data serialization and deserialization. With our Mapper decorators, you can separate concerns between UI and server data handling. This allows you to focus solely on the UI, making your code more maintainable and adaptable to server changes without any hassle
- Has mapper layer for data serialization/deserialization. just annotated @Mapper.Read / @Mapper.Write.

#### Built-in Validation
- Form validation is a critical aspect of any form management system. Our library comes with built-in validation support, ensuring your forms handle user input correctly and efficiently. You can define your validation logic and put it in to Field componet validator prop.

#### Customizable UI with Render Props
- Flexibility is at the core of our system. Using the render props pattern, you can tailor the UI to meet your specific needs. Whether you need a simple form or a complex, highly customized interface, our system provides the tools to make it happen.


## Getting Started
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
        <Flex align="center" justify="center">
          <Card
            actions={[
              <Space>
                <Button onClick={fetch}>
                  fetch dummy data
                </Button>
                <Button onClick={send}>
                  send writted data
                </Button>
                <Button onClick={controller.undo}>
                  undo
                </Button>
                <Button onClick={controller.reset}>
                  reset forms
                </Button>
              </Space>,
            ]}
          >
            <Field name="name" validator={validateName}>
              {({ value, error, fieldHandler }) => (
                <Flex>
                  <label>name</label>
                  <Input value={value} onChange={fieldHandler} />
                  {error && <div>{error}</div>}
                </Flex>
              )}
            </Field>
            <Field name="age" validator={validateAge}>
              {({ value, error, fieldHandler }) => (
                <Flex>
                  <label>age</label>
                  <InputNumber min="0" max="150" value={value} onChange={fieldHandler} />
                  {error && <div>{error}</div>}
                </Flex>
              )}
            </Field>
            <Field name="cities" validator={validateCities}>
              {({ value, error, fieldHandler }) => (
                <Flex>
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
                  {error && <div>{error}</div>}
                </Flex>
              )}
            </Field>
          </Card>
        </Flex>
      );

      async function fetch() {
        const data = await DUMMY_API.getData();
        const transformed = controller.read(data);
        console.log(transformed); //  // transformed to model class by @Mapper.Reader
      }

      async function send() {
        try {
          const hasError = controller.validateAll();
          if (hasError) throw new Error('please check invalid forms.');
          const result = controller.write();
          console.log(result); // <--- u can use serialized data;
          await ModalUtils.info('성공');
        } catch (e: any) {
          await ModalUtils.error(e.message);
        }
      }

      function validateName = (value: string) => {
            if (!value) return 'Please enter your name.';
            if (value.includes('e')) return "The letter 'e' cannot be included";
      };

      function validateAge = (value: string) => {
            if (!value) return 'Please enter your age.';
            if (Number(value) < 20) return 'Teenager is prohibited.';
      };
       
      function validateCities = (value: string[]) => {
            if (!value.length) return 'Please select at least one city.';
      };  
   };

    export default App;
    ```