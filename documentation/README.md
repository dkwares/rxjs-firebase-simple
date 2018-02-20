


#  rxjs-firebase-simple

## Index

### Functions

* [get$](#get_)
* [getByQuery$](#getbyquery_)
* [getChildrenByPath$](#getchildrenbypath_)
* [listen$](#listen_)
* [set$](#set_)



---
# Functions
<a id="get_"></a>

###  get$

► **get$**T(path: *`string`*, defaultValue?: *[T]()*): `Observable`.<`T`⎮`null`>






Gets data at the provided lcoation


**Type parameters:**

#### T 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| path | `string`   |  The location of the data |
| defaultValue | [T]()   |  The default value to use if none can be found |





**Returns:** `Observable`.<`T`⎮`null`>
The Observable with the data at the provided path






___

<a id="getbyquery_"></a>

###  getByQuery$

► **getByQuery$**T(path: *`string`*, query: *`function`*, defaultValue?: *`undefined`⎮`object`*): `Observable`.<`object`⎮`null`>






Gets data by a complex query object


**Type parameters:**

#### T 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| path | `string`   |  The location of the parent data |
| query | `function`   |  The function that receives a firebase reference as and returns a firebase query |
| defaultValue | `undefined`⎮`object`   |  The default value to use if none can be found |





**Returns:** `Observable`.<`object`⎮`null`>
The Observable with the data at the provided path






___

<a id="getchildrenbypath_"></a>

###  getChildrenByPath$

► **getChildrenByPath$**T(path: *`string`*, childPath: *`string`*, value: *`any`*, defaultValue?: *`T`[]*): `Observable`.<`T`[]⎮`null`>






Gets a map of children by one of its child properties or path


**Type parameters:**

#### T 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| path | `string`   |  The location of the parent data |
| childPath | `string`   |  - |
| value | `any`   |  The value at that child property to match |
| defaultValue | `T`[]   |  The default value to use if none can be found |





**Returns:** `Observable`.<`T`[]⎮`null`>
The Observable with the data at the provided path






___

<a id="listen_"></a>

###  listen$

► **listen$**T(path: *`string`*): `Observable`.<`T`⎮`null`>






Gets data in a continuous stream of data. On unsubscription of this stream, the 'off' function is called to stop retrieving data from the provided path's reference. Also, the stream is completed, effectively closing the stream


**Type parameters:**

#### T 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| path | `string`   |  The location of the data |





**Returns:** `Observable`.<`T`⎮`null`>
The continuous Observable with the data at the provided path






___

<a id="set_"></a>

###  set$

► **set$**T(path: *`string`*, data: *`T`*): `Observable`.<`T`>






Sets the data at a provided location


**Type parameters:**

#### T 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| path | `string`   |  The location to update with the provided data |
| data | `T`   |  The data to store at the provided location |





**Returns:** `Observable`.<`T`>
The return of the promise






___


