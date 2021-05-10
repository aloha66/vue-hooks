<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue-demi';
import useRequest from '../index';

const formPayload = (data) => ({
  url: 'https://cnodejs.org/api/v1/topic/5fdb44d70f99cb37f45e3410',
  method: 'post',
  data,
});

const form = reactive(useRequest(formPayload, { manual: true }));

const strings = reactive(
  useRequest('https://cnodejs.org/api/v1/topic/5fdb44d70f99cb37f45e3410', {
    manual: true,
    // queryKeyHashFn: () => 'sss',
  }),
);

const objects = reactive(
  useRequest(
    {
      url: 'https://cnodejs.org/api/v1/topic/60238b2203d797d8f366fa67',
      method: 'get',
      params: { aa: 2 },
    },
    { manual: true },
  ),
);

let fnNum = 0;
function randomPayload(fnNum: number, data: any) {
  return {
    url: `https://cnodejs.org/api/v1/topics?fnNum=${fnNum}`,
    method: 'get',
    params: data,
  };
}

const randomRequest = reactive(useRequest(randomPayload, { manual: true }));
const random = () => {
  fnNum++;
  const data = { ss: '33', fnNum };
  randomRequest.run(fnNum, data);
};
function fnPayload() {
  return {
    url: `/api/manager/v1/categories/`,
    method: 'delete',
  };
}
const file = ref(null);
onMounted(() => {
  console.log('file', file.value);
});

const fnRequest = reactive(useRequest(fnPayload, { manual: true }));

const handleFormData = () => {
  const formData = new FormData();
  formData.append('s', '1ddddddeeeeeeeeeeeeeeeeeeeeeedd');
  formData.append('s', '1ddddddd2');
  formData.append('s', '1dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd3');
  formData.append('a', '3ssssssssssssssssssssssssssssssssssssssssssssssssssssss');
  formData.append('adfd', '300eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0');
  // @ts-ignore
  formData.append('s', file.value?.files[0]);

  form.run(formData);
};
</script>

<template>
  <DemoContainer>
    <button @click="strings.run">strings</button>
    <button @click="objects.run">objects</button>
    <button @click="random">随机函数</button>
    <button @click="fnRequest.run">函数</button>
    <button @click="handleFormData">formData</button>
    <input type="file" ref="file" />
  </DemoContainer>
</template>
