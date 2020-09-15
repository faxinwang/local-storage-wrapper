import LocalStorageWrapper from './index.js';
function assert(a, b, msg) {
    if (msg === void 0) { msg = ""; }
    if (a === b) {
        console.log("assert equal passed: a=" + a + ", b=" + b + " ");
        return;
    }
    throw new Error("assert equal failed: a=" + a + ", b=" + b + ". " + msg);
}
var User = /** @class */ (function () {
    function User() {
        this.name = "zhangsan";
        this.age = 18;
        this.sex = '男';
    }
    return User;
}());
var user = LocalStorageWrapper(User, { debounceSaveDelay: 1000 });
// will fail after the first run.
assert(user.name, 'zhangsan');
assert(user.age, 18);
assert(user.sex, '男');
user.name = "lisi";
user.age = 20;
user.sex = "女";
assert(user.name, 'lisi');
assert(user.age, 20);
assert(user.sex, '女');
var MyState = /** @class */ (function () {
    function MyState() {
        this.id = "0123456";
        this.arr = [];
    }
    return MyState;
}());
var mystate = LocalStorageWrapper(MyState);
mystate.id = "0123";
mystate.arr.push(1);
mystate.name = { firstName: "bajie", lastName: "zhu" };
assert(mystate.id, '0123');
// will fail after the first run.
assert(mystate.arr.length, 1);
assert(mystate.arr[0], 1);
assert(mystate.name.lastName, 'zhu');
