# react-meta-form

## Description
TODO

## Getting Start

1. Define model
    ```ts
    class FormOneModel {
      @Serialize<WriteResultOne>((v: string) => ({ type1: `serialized=${v}` }))
      name: string = '';
      @Serialize<WriteResultOne>((v: string) => ({ amount2: Number(v), here: false }))
      type: string[] = [];
    }

    class FormOneController extends BaseFormController<FormOneModel, WriteResultOne> {}

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
    ```