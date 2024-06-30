import { type ReadResponse } from './model_and_hook';

const DUMMY_API = {
  async getData(): Promise<ReadResponse> {
    return new Promise((res) =>
      setTimeout(
        () =>
          res({
            name: 'initial name',
            age: 30,
            cities: 'seoul, daejeon, sejong',
          }),
        1000,
      ),
    );
  },
};

export default DUMMY_API;
