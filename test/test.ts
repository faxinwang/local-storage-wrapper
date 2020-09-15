import LocalStorageWrapper from './index'

function assert(a: any, b: any, msg: string=""){
    if(a === b){
        console.log(`assert equal passed: a=${a}, b=${b} `)
        return;
    }
    throw new Error(`assert equal failed: a=${a}, b=${b}. ${msg}`)
}

class User{
    name:string = "zhangsan"
    age: number = 18
    gender: 'male' | 'female' = 'male'
}

let user: User = LocalStorageWrapper(User, {debounceSaveDelay:100})

// will fail after the first run.
assert(user.name,'zhangsan')
assert(user.age, 18)
assert(user.gender, 'male')

user.name = "lisi"
user.age = 20
user.gender = "female"

assert(user.name,'lisi')
assert(user.age, 20)
assert(user.gender, 'female')

class MyState{
    id: string = "0123456"
    arr: number[] = []
    name: {
        firstName: string,
        lastName: string,
    }
}


let mystate:MyState = LocalStorageWrapper(MyState)

// using the sessionStorage
// let mystate:MyState = LocalStorageWrapper(MyState,{storage: sessionStorage})

mystate.id = "0123"
mystate.arr.push(1)
mystate.name = {firstName: "bajie", lastName:"zhu"}

assert(mystate.id, '0123')
// will fail after the first run.
assert(mystate.arr.length, 1)
assert(mystate.arr[0], 1)
assert(mystate.name.lastName, 'zhu')


