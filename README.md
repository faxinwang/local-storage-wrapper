# local-storage-wrapper

[![NPM Version](https://img.shields.io/npm/v/@faxinw/local-storage-wrapper.svg?style=flat)](https://www.npmjs.com/package/@faxinw/local-storage-wrapper)
[![](https://img.shields.io/npm/dt/@faxinw/local-storage-wrapper.svg)](https://www.npmjs.com/package/@faxinw/local-storage-wrapper)

Saving objects to localStorage or sessionStorage automatically as it changes. 


Supports:

1. [x] Typescript
1. [x] Default value
1. [x] localStorage
1. [x] sessionStorage
1. [x] any other storage that implements getItem() and setItem()
1. [x] debounce save to improve performance, default to dealy 100ms

## install

yarn
> yarn add @faxinw/local-storage-wrapper

npm
> npm install @faxinw/local-storage-wrapper -S

## usage

```typescript
import LocalStorageWrapper from '@faxinw/local-storage-wrapper'

function assert(a: any, b: any, msg: string=""){
    if(a === b){
        console.log(`assert equal passed: a=${a}, b=${b} `)
        return;
    }
    throw new Error(`assert equal failed: a=${a}, b=${b}. ${msg}`)
}

// the class name will be the key to get/set value from/to stroages.
class User{
    name:string = "zhangsan"
    age: number = 18
    gender: '男' | '女' = '男'
}

// the type `User` here is to tell `LocalStorageWrapper` that the return type is `User`
let user: User = LocalStorageWrapper(User, {debounceSaveDelay:1000})

// will fail after the first run if value has changed.
assert(user.name,'zhangsan')
assert(user.age, 18)
assert(user.gender, '男')

user.name = "lisi"
user.age = 20
user.gender = "女"

assert(user.name,'lisi')
assert(user.age, 20)
assert(user.gender, '女')

class MyState{
    id: string = "0123456"
    arr: number[] = []
    name: {
        firstName: string,
        lastName: string,
    }
}

let mystate:MyState = LocalStorageWrapper(MyState)

mystate.id = "0123"
mystate.arr.push(1)
mystate.name = {firstName: "bajie", lastName:"zhu"}

assert(mystate.id, '0123')
// will fail after the first run if value has changed.
assert(mystate.arr.length, 1)
assert(mystate.arr[0], 1)
assert(mystate.name.lastName, 'zhu')

// in this way, the proxy can not detect the state change, 
// so the state change may not be presisted once the debounce time has passed.
let arr = mystate.arr
setTimeout(()=>{
    arr.push(3)
})

```