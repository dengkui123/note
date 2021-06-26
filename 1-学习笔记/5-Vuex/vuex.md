<font face="微软雅黑" size="2">

## Vuex

### 1. Vuex概述
#### 1.1 组件之间共享数据的方式
1. 父向子传值：`v-bind` 属性绑定
2. 子向父传值：`v-on` 事件绑定
3. 兄弟组件之间共享数据：`EvenBus`
   - `$on` 接收数据的那个组件
   - `$emit` 发送数据的那个组件

#### 1.2 Vuex是什么
**Vuex** 是实现组件全局状态（数据）管理的一种机制，可以方便的实现组件之间数据的共享。

#### 1.3 Vuex的作用
1. 能够在 `vuex` 中集中管理共享的数据，易于开发和后期维护
2. 能够高效地实现组件之间的数据共享，提高开发效率
3. 存储在 `vuex` 中地数据都是响应式的，能够实时保持数据和页面的同步

### 2. Vuex的基本使用
1. 安装 vuex 依赖包
   `npm install vuex --save`
2. 导入 vuex 包
   ```js
   //store.js
   import Vue from 'vue'
   import Vuex from 'vuex'

   Vue.use(Vuex)
   ```
3. 创建 store 对象
   ```js
   //store.js
   const store = new Vuex.Store({
     //Store 中存放的就是全局共享的数据
     state: { 
       count: 0
     },
     mutations: {

     },
     actions: {

     },
   })
   ```    
4. 将 store 对象挂载到 vue 实例中
   ```js
   //main.js
   new Vue({
     el: 'app',
     render: h => h(app),
     router,
     //将创建的共享数据对象，挂载到 Vue 实例中
     //所有的组件，就可以直接从 store 中获取全局的数据了
     store,
   }).$mount('#app')
   ```

### 3. Vuex 的核心概念
#### 3.1 核心概念概述
- State
- Mutation
- Action
- Getter

#### 3.2 State
**State** 提供唯一的公共数据源，所有共享的数据都要统一放到 Store 的 State 中进行存储。
```js
//创建store数据源，提供唯一公共数据
const store = new Vue.Store({
  state: {count: 0 }
})
```

1. 组件访问 **State** 中数据的**第一种方式**：
`this.$store.state.全局数据名称`

2. 组件访问 **State** 中数据的**第二种方式**：
```js
//1. 从 vuex 中按需导入 mapState 函数
import { mapState } from 'vuex'
```
通过刚才导入的 `mapStore` 函数，将当前组件需要的全局数据，映射为当前组件的 `computed` 计算属性：
```js
//2. 将全局数据，映射为当前组件的计算属性
computed: {
  ...mapState(['count'])
}
```

#### 3.3 Mutation
##### 3.3.1 Mutation 用于变更 Store 中的数据

1. **只能**通过 `mutation` 变更 `Store` 数据，不可以直接操作 Store 中的数据。
2. 通过这种方式虽然操作起来稍微繁琐一些，但是可以集中监控所有数据的变化。
- 定义Mutation
```js
//定义 Mutation
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add(state) {
      //变更状态
      state.count++;
    }
  }
})
```
- 触发mutation
```js 
//触发mutation
methods: {
  handle1() {
    // 触发 mutations 的第一种方式
    this.$store.commit('add');
  }
}
```

**可以在触发 mutations 时传递参数(step):**
```js
//定义 Mutation
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    addN(state, step) {
      //变更状态
      state.count += step;
    }
  }
})
```
```js
//触发 mutation
methods: {
  handle2() {
    // 再调用 commit 函数，触发 mutations 时携带参数
    this.$store.commit('addN', 3)
  }
}
```
##### 3.3.2 `this.$store.commit()`是触发 mutations 的第一种方式，触发 mutations 的**第二种方式**：
```js
//1.从 vuex 中按需导入mapMutations 函数
import {mapMutations} from 'vuex'
```
通过刚才导入的 mapMutations 函数，将需要的 mutations 函数，映射为当前组件的 methods 方法：
```js
//2.将指定的 mutations 函数，映射为当前组件的 methods 函数
methods: {
  ...mapMutations: (['add','addN'])
}
```
> tips: 不要在 **mutations** 函数中执行异步操作

#### 3.4 Action
##### 3.4.1 **Action** 用于处理异步任务。
如果通过异步操作变更数据，必须通过Action，而不能使用 Mutation ，但是在 Action 中还是要通过触发 Mutation 的方式间接变更数据。 
```js
//定义 Action
const store = new Vuex.Store({
  //...省略其他代码
  mutations: {
    add(state) {
      state.count++
    }
  },
  action: {
    addAsync(context) {
      setTimeout(() => {
        //在 actions 中，不能直接修改 state 中的数据
        //必须通过 context.commit() 触发某个 mutation 才行
        context.commit('add')
      }, 1000)
    }
  }
})
```

```js
//触发 Action
methods: {
  handle() {
    //触发 acions 的第一种方式
    this.$store.dispatch('addAsync')
  }
}
```

**触发 actions 异步任务时携带参数：**
```js
//定义 Action
const store = new Vuex.Store({
  //...省略其他代码
  mutations: {
    addN(state, step) {
      state.count += step;
    }
  },
  action: {
    addNAsync(context, step) {
      setTimeout(() => {
        //在 actions 中，不能直接修改 state 中的数据
        //必须通过 context.commit() 触发某个 mutation 才行
        context.commit('add', step)
      }, 1000)
    }
  }
})
```
```js
//触发 Action
methods: {
  handle() {
    //触发 acions 的第一种方式
    this.$store.dispatch('addNAsync', 5)
  }
}
```

##### 3.4.3 触发 actions 的第二种方式：
```js
//1. 从 vuex 中按需导入 mapActions 函数
import { mapActions} from 'vuex'
```
通过刚才导入的 mapActions 函数，将需要的 actions 函数映射为当前组件的 methods 方法：
```js
//2. 将指定的 actions 函数映射为当前组件的 methods 函数
methods: {
  ...mapActions(['addAsync','addNAsync'])
}
```

#### 3.5 Getter
**Getter** 用于对 Store 中的数据进行加工处理形成新的数据
1. **Getter** 可以对 **Store** 中已有的数据加工处理后形成新的数据，类似Vue的计算属性。
2. **Store** 中数据发生变化， Getter的数据也会跟着变化。
```js
//定义 Getter
const store = new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    showNum(state) {
      return '当前最新的数量是【'+ state.count +'】'
    }
  }
})
```
**使用 getters 的第一种方式：**
```js
this.$store.getters.名称
```
**使用 getters 的第二种方式：**
```js
import [ mapGetters ] from 'vuex'

computed: {
  ...mapGetters(['showNum'])
}
```