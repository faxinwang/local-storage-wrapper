// import LocalStorageWrapper from './index';
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
        this.gender = 'male';
    }
    return User;
}());
var user = LocalStorageWrapper(User, { debounceSaveDelay: 100 });
// will fail after the first run.
assert(user.name, 'zhangsan');
assert(user.age, 18);
assert(user.gender, 'male');
user.name = "lisi";
user.age = 20;
user.gender = "female";
assert(user.name, 'lisi');
assert(user.age, 20);
assert(user.gender, 'female');
var MyState = /** @class */ (function () {
    function MyState() {
        this.id = "0123456";
        this.arr = [];
    }
    return MyState;
}());
var mystate = LocalStorageWrapper(MyState);
// using the sessionStorage
// let mystate:MyState = LocalStorageWrapper(MyState,{storage: sessionStorage})
mystate.id = "0123";
mystate.arr.push(2);
mystate.name = { firstName: "bajie", lastName: "zhu" };
assert(mystate.id, '0123');
// will fail after the first run.
assert(mystate.arr.length, 1);
assert(mystate.arr[0], 2);
assert(mystate.name.lastName, 'zhu');
var arr = mystate.arr;
setTimeout(()=>{
    arr.push(3);
},1000)
