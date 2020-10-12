import { decryptPostFor } from '../controller/decrypt';

jest.setTimeout(60000)

// test private key = 5Jvuh6HyDnA41a6dvHk22uau8B8rVjTNse9vomdWkCMp8Tho23n

test('basic', async () => {
  expect.assertions(1);
  const payload = {vaccount: "hello3", postId: 9, signature: "SIG_K1_KjnV4dCRAUMAQA85gumRsFw7nrmpPeSC8TGh2JvsAQspLXks9MfwWFjS7THCLtwd7M3N1GCndCtbMqfNn2shdcSEWnL1Pc"}
  const postKey = await decryptPostFor(payload)
  expect(postKey.toString(`hex`)).toEqual('e06fd2c2f82f268d72617eb9752e6b6a21afb94ba0e402cb591b199342ceaac956240e82467f3e590093488a4a8ef5a3');
});
