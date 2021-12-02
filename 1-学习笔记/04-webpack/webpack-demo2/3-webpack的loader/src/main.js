
// 1. 使用commonJS的模块化规范
const {add, sub, mul}  = require('./js/mathUtils.js')
// mathUtils.js
add(10,20);

// 2. 使用ES6的模块化规范
import { Person } from './js/info.js'
// info.js
let person = new Person('kk', 18);
person.getInfo();

// 3. 依赖css文件
require('./css/normal.css')
require('./css/special.less')
