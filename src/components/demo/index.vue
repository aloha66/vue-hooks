<template>
  <div class="home">
    use-request
    <div class="card">
      错误重连
      <div>
        <button @click="errorRequest.run">发送请求(永远失败 额外自动请求三次)</button>
      </div>
      <div>
        <button @click="errorRequest2.run">
          发送请求 (请求是成功的 还是会额外请求三次 模拟返回结果不是想要的结果
          从而发起多次请求获取结果)
        </button>
      </div>
      <div>
        <button @click="errorRequest3.run">发送请求 额外请求两次 (第三次符合要求)</button>
      </div>
    </div>
    <div class="card">
      屏幕聚焦(切换不同的tab会重新发起请求)
      <span v-if="screenRequestLoading">loading</span>
      {{ screenRequestScore?.data?.score }}
    </div>
    <div class="card">
      突变
      {{ swrRequestData?.ttt }}
      <button @click="mutessss">突变</button>
    </div>
    <div class="card">
      swr(缓存,多次点击发送按钮不存在突然没了内容) 时间:{{ swrRequestData?.data?.create_at }}
      <button @click="swrRequest.run">发送</button>
    </div>
    <div class="card">
      refreshDeps(改变其中一个下拉框都会重新请求 看network)
      <select v-model="selected">
        <option disabled value="">Please select one</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </select>
      <select v-model="selected2">
        <option disabled value="">Please select one</option>
        <option>J</option>
        <option>K</option>
        <option>L</option>
      </select>
    </div>
    <div class="card">
      ready: 能确定两个接口有先后顺序调用即可(看network,可能存在其他接口一起调用,忽略)
      <p>接口:</p>
      <p>/60017de35d04acb8ec217193</p>
      <p>/5fe2b84498427e7b936a9f8c</p>
      <button @click="handleReady">ready</button>
    </div>
    <div class="card">
      轮询 (单击开始只能开启一个轮询,单例)
      <div v-if="pollreqLoading">loading...</div>
      <div v-else>{{ pollreqComputed?.data?.visit_count }}</div>
      <button @click="pollreq.run">轮询开始</button>
      <button @click="pollreq.cancel">轮询结束</button>
    </div>
    <div class="card">
      <p>
        <button @click="getList">getList(点击请求接口topics?aa=2)</button>
      </p>
      <p>
        <button @click="refresh">refreshGetList(点击重新请求接口topics?aa=2)</button>
      </p>
      <!-- <p>
        <button @click="cancel">cancelGetList(单击取消接口请求 建议限流查看)</button>
      </p> -->

      <div>{{ loading }}</div>
      <div style="margin: 10px" v-for="(item, i) in data?.data" :key="i">
        {{ item.title }}

        <div>
          <button @click="click(item.id)">按钮</button>
          作者:
          {{
            detailFetches?.[item.id]?.loading
              ? 'loading'
              : detailFetches?.[item.id]?.data?.data?.author?.loginname
          }}
          <button
            v-if="detailFetches?.[item.id]?.loading"
            @click="detailFetches?.[item.id]?.cancel()"
          >
            取消当前请求
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, watchEffect } from 'vue';
import { useRequest } from '../../../packages/use-request/src';

export default defineComponent({
  name: 'Home',
  setup() {
    const selected = ref('');
    const selected2 = ref('');
    const { loading, run, data, params, fetches, cancel, refresh } = useRequest(
      {
        url: 'https://cnodejs.org/api/v1/topics',
        methods: 'get',
        params: { aa: 2 },
      },
      { loadingDelay: 100 },
    );

    function getUserId(id: string) {
      return {
        url: 'https://cnodejs.org/api/v1/topic/' + id,
        methods: 'get',
        params: {
          test: 333,
        },
      };
    }

    // const { loading, run, data, fetches, params } = useRequest(
    const detail = useRequest((id) => getUserId(id), {
      loadingDelay: 100,
      manual: true,
      fetchKey: (id) => id,
    });

    const pollreq = useRequest(
      {
        url: 'https://cnodejs.org/api/v1/topic/5ff48c825393a53d15546b7d',
        methods: 'get',
        params: { aa: 2 },
      },
      {
        loadingDelay: 100,
        manual: true,
        pollingInterval: 4000,
        pollingWhenHidden: false,
      },
    );

    const getList = () => {
      run();
    };

    const click = (id: string) => {
      detail.run(id);
    };

    const cancelCur = () => {
      detail.cancel();
    };

    function firstParam(id: string) {
      return 'https://cnodejs.org/api/v1/topic/' + id;
    }

    // 依赖请求开始(和react的渲染不一样,vue的setup只会执行一次,不需要ready属性)
    const { data: firstRequestData, params: firstPa, ...firstRequest } = useRequest(
      (id) => firstParam(id),
      {
        manual: true,
      },
    );

    function secondParam(params: string) {
      return {
        url: 'https://cnodejs.org/api/v1/topic/5fe2b84498427e7b936a9f8c',
        methods: 'get',
        params,
      };
    }

    const secondRequest = useRequest((params) => secondParam(params), { manual: true });
    // 这样写才能做到依赖请求
    // 改成watchEffect好像有点问题 第二个接口会请求多一次
    watch(firstRequestData, () => {
      secondRequest.run(firstPa.value[0]);
    });

    const handleReady = () => {
      firstRequest.run('60017de35d04acb8ec217193');
    };

    // 依赖请求结束

    // refreshDeps 开始
    // 可能就是这样实现
    // 我看效果就是某个state变化了,然后再触发某个请求
    const reRequest = useRequest('https://cnodejs.org/api/v1/user/alsotang', {
      refreshDeps: [selected, selected2],
    });

    // refreshDeps 结束

    // swr开始

    function swrFunc() {
      const obj = {
        0: '5ff48c825393a53d15546b7d',
        1: '575c0f3a2ad3c06f1aa3d5ed',
        2: '545249abd0c2f0fe2f533ad6',
        3: '590d3b633504ce1c2ac45904',
        4: '5ff2df1e5393a512755468b4',
        5: '5ff17dff5393a578ff5465a7',
      };
      const inx = Math.floor(Math.random() * 6);
      // @ts-ignore
      return 'https://cnodejs.org/api/v1/topic/' + obj[inx];
    }

    const swrRequest = useRequest(() => swrFunc(), {
      // cacheKey: 'swr',
    });

    // swr结束

    // 突变
    const mutessss = () => {
      swrRequest.mutate({ ttt: 2222222222222 });
    };

    // 屏幕聚焦

    const screenRequest = useRequest('https://cnodejs.org/api/v1/user/alsotang', {
      // refreshOnWindowFocus: true,
    });

    const errorRequest = useRequest('http://202.135.136.187:7000/test', {
      manual: true,
      tryReRequestCount: 3,
    });
    const errorRequest2 = useRequest('http://202.135.136.187:7000/test2', {
      manual: true,
      tryReRequestCount: 3,
      isErr: (data: any) => {
        console.log('data', data);
        if (data.message === 'fail') {
          return true;
        }
      },
    });

    const errorRequest3 = useRequest('http://202.135.136.187:7000/test3', {
      manual: true,
      tryReRequestCount: 3,
      isErr: (data: any) => {
        console.log('data', data);
        if (data.message === 'fail') {
          return true;
        }
      },
    });

    return {
      data,
      run,
      loading,
      fetches,
      refresh,
      detailFetches: detail.fetches,
      params,
      // detail,
      detailData: detail.data,
      click,
      cancel,
      getList,
      cancelCur,
      handleReady,
      firstRequestData,
      secondRequest,
      pollreq,
      selected,
      selected2,
      swrRequestFetch: swrRequest.fetches,
      swrRequest,
      mutessss,
      screenRequestScore: screenRequest.data,
      screenRequestLoading: screenRequest.loading,
      swrRequestData: swrRequest.data,
      pollreqLoading: pollreq.loading,
      pollreqComputed: pollreq.data, //如果再用?.获取data后面的值会没有数据 估计也是跟响应式结构有关(待考究)
      errorRequest,
      errorRequest2,
      errorRequest3,
    };
  },
  components: {},
});
</script>

<style scoped>
.card {
  border: 1px solid;
  padding: 20px;
  margin: 20px;
  border-color: rgb(235, 237, 241);
  border-radius: 1px;
}
</style>
